import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ListenPlayerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  audioUrl?: string;
  highlights?: { id: string; text: string; startTime: number; endTime: number }[];
  onReadClick?: () => void;
}

export function ListenPlayer({
  open,
  onOpenChange,
  title,
  subtitle,
  audioUrl,
  highlights = [],
  onReadClick,
}: ListenPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(360); // 6 min default

  // Mock progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          setProgress((newTime / duration) * 100);
          if (newTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Find current highlight based on time
  const currentHighlight = highlights.find(
    (h) => currentTime >= h.startTime && currentTime <= h.endTime
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="bg-primary/5 px-6 py-4 border-b border-border">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Current Highlight Display */}
          <div className="min-h-[100px] flex items-center justify-center p-4 bg-secondary/30 rounded-xl">
            {currentHighlight ? (
              <p className="text-center text-foreground leading-relaxed">
                {currentHighlight.text}
              </p>
            ) : (
              <p className="text-center text-muted-foreground">
                {audioUrl ? 'Press play to start listening' : 'Audio not available - showing placeholder'}
              </p>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[progress]}
              max={100}
              step={1}
              onValueChange={(value) => {
                setProgress(value[0]);
                setCurrentTime((value[0] / 100) * duration);
              }}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCurrentTime(Math.max(0, currentTime - 15));
                setProgress((Math.max(0, currentTime - 15) / duration) * 100);
              }}
            >
              <SkipBack className="w-5 h-5" />
            </Button>

            <Button
              size="lg"
              className="w-14 h-14 rounded-full"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setCurrentTime(Math.min(duration, currentTime + 15));
                setProgress((Math.min(duration, currentTime + 15) / duration) * 100);
              }}
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>

          {/* Upcoming Highlights */}
          {highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Coming up
              </h4>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {highlights
                  .filter((h) => h.startTime > currentTime)
                  .slice(0, 3)
                  .map((highlight) => (
                    <button
                      key={highlight.id}
                      onClick={() => {
                        setCurrentTime(highlight.startTime);
                        setProgress((highlight.startTime / duration) * 100);
                      }}
                      className={cn(
                        'w-full text-left p-3 rounded-lg text-sm transition-colors',
                        'bg-secondary/30 hover:bg-secondary'
                      )}
                    >
                      <span className="text-xs text-muted-foreground">
                        {formatTime(highlight.startTime)}
                      </span>
                      <p className="text-foreground line-clamp-2 mt-1">
                        {highlight.text}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Read Button */}
          {onReadClick && (
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full"
                onClick={onReadClick}
              >
                Switch to Exec Summary
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
