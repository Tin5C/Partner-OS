import * as React from 'react';
import { useState, useMemo } from 'react';
import { Play, ChevronRight, Calendar, Clock } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Voice, VoiceEpisode, filterVoiceEpisodesByDateRange, formatVoiceEpisodeDate, getLatestVoiceEpisode } from '@/lib/voices';
import { cn } from '@/lib/utils';

interface VoiceShowPageProps {
  voice: Voice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEpisodeClick: (episode: VoiceEpisode, allEpisodes: VoiceEpisode[]) => void;
}

type FilterOption = 'last-4-weeks' | 'all';

// Generate initials from a name
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function VoiceShowPage({ voice, open, onOpenChange, onEpisodeClick }: VoiceShowPageProps) {
  const [filter, setFilter] = useState<FilterOption>('last-4-weeks');

  const filteredEpisodes = useMemo(() => {
    if (!voice) return [];
    return filterVoiceEpisodesByDateRange(voice.episodes, filter);
  }, [voice, filter]);

  const latestEpisode = voice ? getLatestVoiceEpisode(voice) : null;

  const handleOpenLatest = () => {
    if (latestEpisode && voice) {
      onEpisodeClick(latestEpisode, voice.episodes);
    }
  };

  if (!voice) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="h-[85vh] rounded-t-3xl p-0 flex flex-col"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{voice.voiceName}'s Voice</SheetTitle>
        </SheetHeader>

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted" />
        </div>

        {/* Header */}
        <div className="px-5 pb-5 border-b border-border/50">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="w-20 h-20 border-2 border-white dark:border-slate-800 shadow-lg">
              {voice.voiceAvatarUrl ? (
                <AvatarImage src={voice.voiceAvatarUrl} alt={voice.voiceName} />
              ) : null}
              <AvatarFallback className="bg-violet-500 text-white text-xl font-semibold">
                {getInitials(voice.voiceName)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-foreground">{voice.voiceName}</h2>
              <p className="text-sm text-muted-foreground">{voice.voiceRole}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{voice.promise}</p>
              
              {voice.cadenceLabel && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{voice.cadenceLabel}</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA */}
          <div className="flex gap-3 mt-5">
            <Button 
              className="flex-1 gap-2" 
              onClick={handleOpenLatest}
              disabled={!latestEpisode}
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Open latest
            </Button>
          </div>
        </div>

        {/* Episode List */}
        <div className="flex-1 overflow-y-auto">
          {/* Section header with filter */}
          <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-5 py-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">All episodes</h3>
              
              {/* Filter toggle */}
              <div className="flex gap-1 p-0.5 bg-muted rounded-lg">
                <button
                  onClick={() => setFilter('last-4-weeks')}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                    filter === 'last-4-weeks'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Last 4 weeks
                </button>
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                    filter === 'all'
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          {/* Episodes */}
          <div className="divide-y divide-border/30">
            {filteredEpisodes.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No drops in the last 4 weeks.
                </p>
              </div>
            ) : (
              filteredEpisodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => onEpisodeClick(episode, voice.episodes)}
                  className="w-full px-5 py-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                >
                  {/* Episode cover thumbnail */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    {episode.coverUrl ? (
                      <img 
                        src={episode.coverUrl} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-violet-100 dark:bg-violet-900">
                        <Play className="w-5 h-5 text-violet-500" />
                      </div>
                    )}
                  </div>

                  {/* Episode info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {episode.hookTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatVoiceEpisodeDate(episode.publishedAt)}
                      </span>
                      {episode.durationLabel && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {episode.durationLabel}
                          </span>
                        </>
                      )}
                      {episode.tagLabel && (
                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-muted text-muted-foreground">
                          {episode.tagLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
