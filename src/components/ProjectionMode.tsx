import { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Pause, RotateCcw, RotateCw, 
  ChevronLeft, ChevronRight, Copy, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/contexts/PlayerContext';
import { FocusCard, focusEpisodes } from '@/lib/focusCards';
import { formatDuration } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProjectionModeProps {
  card: FocusCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectionMode({ card, open, onOpenChange }: ProjectionModeProps) {
  const [activeTab, setActiveTab] = useState<'listen' | 'exec'>('listen');
  const [copiedActions, setCopiedActions] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const highlightsRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentEpisode, 
    isPlaying, 
    progress,
    playbackSpeed,
    play, 
    togglePlay, 
    skip,
    seek,
    setSpeed,
  } = usePlayer();

  if (!card) return null;

  const episode = focusEpisodes[card.id];
  const isCurrentCard = currentEpisode?.id === episode?.id;
  const isCardPlaying = isCurrentCard && isPlaying;
  const execSummary = card.execSummary;
  const highlights = card.listeningHighlights || [];

  const currentTime = isCurrentCard && episode 
    ? Math.floor((progress / 100) * episode.duration) 
    : 0;
  const totalDuration = episode?.duration || 360;
  const remainingTime = totalDuration - currentTime;

  const currentHighlightIndex = highlights.findIndex(
    h => currentTime >= h.startTime && currentTime <= h.endTime
  );

  const handlePlay = () => {
    if (episode) {
      if (isCurrentCard) {
        togglePlay();
      } else {
        play(episode);
      }
    }
  };

  const cycleSpeed = () => {
    const speeds: Array<1 | 1.25 | 1.5> = [1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newProgress = (clickPosition / rect.width) * 100;
    seek(newProgress);
  };

  const handleCopyActions = () => {
    if (execSummary?.nextBestActions) {
      const text = execSummary.nextBestActions.map((a, i) => `${i + 1}. ${a}`).join('\n');
      navigator.clipboard.writeText(text);
      setCopiedActions(true);
      setTimeout(() => setCopiedActions(false), 2000);
    }
  };

  const handleCopyQuestions = () => {
    if (execSummary?.questionsToAsk) {
      const text = execSummary.questionsToAsk.map((q, i) => `${i + 1}. ${q}`).join('\n');
      navigator.clipboard.writeText(text);
      setCopiedQuestions(true);
      setTimeout(() => setCopiedQuestions(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden bg-gradient-header border-border shadow-card-hover">
        <DialogHeader className="sr-only">
          <DialogTitle>{card.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-card/95 backdrop-blur-sm shadow-soft">
            <div>
              <p className="text-caption text-primary font-semibold uppercase tracking-wider">Projection Mode</p>
              <h1 className="text-title text-foreground">{card.title}</h1>
              <p className="text-caption text-muted-foreground">{card.subtitle}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'listen' | 'exec')}>
                <TabsList className="h-11 rounded-xl bg-secondary border border-border">
                  <TabsTrigger value="listen" className="px-6 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft">Listen</TabsTrigger>
                  <TabsTrigger value="exec" className="px-6 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-soft">Exec Summary</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-11 w-11 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden bg-background">
            {activeTab === 'listen' ? (
              <div className="h-full flex flex-col items-center justify-center p-8">
                {/* Large Play Button */}
                <button
                  onClick={handlePlay}
                  className="w-36 h-36 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-card-hover hover:scale-105 active:scale-95 transition-all duration-200 mb-10"
                >
                  {isCardPlaying ? (
                    <Pause className="w-16 h-16" />
                  ) : (
                    <Play className="w-16 h-16 ml-2" />
                  )}
                </button>

                {/* Progress */}
                <div className="w-full max-w-2xl mb-10">
                  <div 
                    className="h-3 bg-secondary rounded-full cursor-pointer overflow-hidden shadow-soft"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-150"
                      style={{ width: `${isCurrentCard ? progress : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-caption text-muted-foreground mt-3">
                    <span>{formatDuration(currentTime)}</span>
                    <span>-{formatDuration(remainingTime)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 mb-12">
                  <button
                    onClick={cycleSpeed}
                    className="px-5 py-2.5 rounded-xl bg-card border border-border text-body font-semibold hover:bg-secondary transition-all duration-200 shadow-chip"
                  >
                    {playbackSpeed}x
                  </button>
                  
                  <button
                    onClick={() => skip(-15)}
                    className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-all duration-200 relative shadow-chip"
                  >
                    <RotateCcw className="w-6 h-6" />
                    <span className="absolute text-xs font-semibold">15</span>
                  </button>
                  
                  <button
                    onClick={() => skip(15)}
                    className="w-14 h-14 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-secondary transition-all duration-200 relative shadow-chip"
                  >
                    <RotateCw className="w-6 h-6" />
                    <span className="absolute text-xs font-semibold">15</span>
                  </button>
                </div>

                {/* Current Highlight (Large Display) */}
                <div className="w-full max-w-4xl">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-5 text-center">
                    Follow Along
                  </p>
                  
                  {currentHighlightIndex >= 0 && highlights[currentHighlightIndex] ? (
                    <div className="bg-primary/5 border-2 border-primary/30 rounded-3xl p-10 text-center shadow-card">
                      <p className="text-title font-medium leading-relaxed">
                        {highlights[currentHighlightIndex].text}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-3xl p-10 text-center shadow-card">
                      <p className="text-section text-muted-foreground">
                        Press play to begin
                      </p>
                    </div>
                  )}
                </div>

                {/* Key Takeaways */}
                <div className="w-full max-w-3xl mt-10">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Key Takeaways
                  </p>
                  <div className="grid grid-cols-3 gap-5">
                    {card.previewBullets.slice(0, 3).map((bullet, idx) => (
                      <div key={idx} className="bg-card border border-border rounded-2xl p-5 shadow-card">
                        <p className="text-caption">{bullet}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-12 bg-gradient-header">
                <div className="max-w-4xl mx-auto space-y-8">
                  {/* TL;DR */}
                  {execSummary?.tldr && (
                    <section className="bg-primary/5 border border-primary/20 rounded-3xl p-8 shadow-soft">
                      <p className="text-caption font-semibold text-primary uppercase tracking-wider mb-5">
                        TL;DR
                      </p>
                      <p className="text-title font-medium leading-relaxed">
                        {execSummary.tldr}
                      </p>
                    </section>
                  )}

                  <div className="grid grid-cols-2 gap-6">
                    {/* What Changed */}
                    {execSummary?.whatChanged && (
                      <section className="bg-card border border-border rounded-3xl p-6 shadow-card">
                        <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                          What Changed
                        </p>
                        <ul className="space-y-4">
                          {execSummary.whatChanged.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-4">
                              <span className="w-2.5 h-2.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                              <span className="text-section leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {/* Why It Matters */}
                    {execSummary?.whyItMatters && (
                      <section className="bg-card border border-border rounded-3xl p-6 shadow-card">
                        <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-5">
                          Why It Matters
                        </p>
                        <ul className="space-y-4">
                          {execSummary.whyItMatters.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-4">
                              <span className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-section leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  {/* Next Best Actions */}
                  {execSummary?.nextBestActions && (
                    <section className="bg-card border border-border rounded-3xl p-8 shadow-card">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">
                          Next Best Actions
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyActions}
                          className="rounded-xl"
                        >
                          {copiedActions ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy All
                            </>
                          )}
                        </Button>
                      </div>
                      <ul className="space-y-5">
                        {execSummary.nextBestActions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary text-lg font-semibold flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </div>
                            <span className="text-section leading-relaxed pt-0.5">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {/* Questions to Ask */}
                  {execSummary?.questionsToAsk && (
                    <section className="bg-secondary/50 border border-secondary rounded-3xl p-8 shadow-soft">
                      <div className="flex items-center justify-between mb-6">
                        <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">
                          Questions to Ask
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyQuestions}
                          className="rounded-xl"
                        >
                          {copiedQuestions ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy All
                            </>
                          )}
                        </Button>
                      </div>
                      <ul className="space-y-5">
                        {execSummary.questionsToAsk.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-4">
                            <span className="text-primary font-semibold text-section flex-shrink-0">Q{idx + 1}:</span>
                            <span className="text-section italic leading-relaxed">"{item}"</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
