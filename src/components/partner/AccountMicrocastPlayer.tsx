// Inline audio player for Account Microcast — auto-plays on mount

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, X } from 'lucide-react';

interface AccountMicrocastPlayerProps {
  src: string;
  accountLabel: string;
  onClose: () => void;
}

export function AccountMicrocastPlayer({ src, accountLabel, onClose }: AccountMicrocastPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-foreground truncate">
              {accountLabel} Microcast
            </span>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div
            className="h-1.5 bg-muted rounded-full cursor-pointer overflow-hidden"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          {duration > 0 && (
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{formatTime((progress / 100) * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
