import { useState } from 'react';
import { X, Play, BookOpen, Bell, Clock, Calendar } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExpertCorner, 
  ExpertEpisode,
  getLatestEpisode, 
  filterEpisodesByDateRange,
  formatEpisodeDate 
} from '@/lib/expertCorners';
import { cn } from '@/lib/utils';

interface ExpertCornerShowPageProps {
  corner: ExpertCorner | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEpisodeClick: (episode: ExpertEpisode, allEpisodes: ExpertEpisode[]) => void;
}

// Generate initials from a name
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ExpertCornerShowPage({ 
  corner, 
  open, 
  onOpenChange,
  onEpisodeClick 
}: ExpertCornerShowPageProps) {
  const [filter, setFilter] = useState<'last-4-weeks' | 'all'>('last-4-weeks');

  if (!corner) return null;

  const latestEpisode = getLatestEpisode(corner);
  const filteredEpisodes = filterEpisodesByDateRange(corner.episodes, filter);

  const handleOpenLatest = () => {
    if (latestEpisode) {
      const allEpisodes = filterEpisodesByDateRange(corner.episodes, 'all');
      onEpisodeClick(latestEpisode, allEpisodes);
    }
  };

  const handleEpisodeClick = (episode: ExpertEpisode) => {
    const allEpisodes = filterEpisodesByDateRange(corner.episodes, 'all');
    onEpisodeClick(episode, allEpisodes);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className={cn(
          "h-[90vh] rounded-t-3xl p-0 flex flex-col",
          "sm:max-w-2xl sm:mx-auto"
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{corner.title}</SheetTitle>
        </SheetHeader>

        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="px-5 pb-5 border-b border-border">
          <div className="flex gap-4">
            {/* Cover image */}
            <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-700">
              {corner.coverUrl ? (
                <img
                  src={corner.coverUrl}
                  alt={corner.title}
                  className="w-full h-full object-cover object-top"
                />
              ) : corner.hostName ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {getInitials(corner.hostName)}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold leading-tight">{corner.title}</h2>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {corner.description}
              </p>
              {corner.cadenceLabel && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{corner.cadenceLabel}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-2 mt-4">
            <Button 
              className="flex-1" 
              onClick={handleOpenLatest}
              disabled={!latestEpisode}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Open latest
            </Button>
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Bell className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Episode list */}
        <div className="flex-1 overflow-y-auto">
          {/* Filter tabs */}
          <div className="sticky top-0 bg-background z-10 px-5 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">All episodes</h3>
              <div className="flex gap-1 p-0.5 bg-muted rounded-lg">
                <button
                  onClick={() => setFilter('last-4-weeks')}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
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
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
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
          <div className="px-5 py-3 space-y-2">
            {filteredEpisodes.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  No drops in the last 4 weeks.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setFilter('all')}
                >
                  View all episodes
                </Button>
              </div>
            ) : (
              filteredEpisodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => handleEpisodeClick(episode)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl text-left",
                    "bg-card border border-border",
                    "hover:bg-secondary/50 transition-colors"
                  )}
                >
                  {/* Episode thumbnail */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted">
                    {episode.coverUrl ? (
                      <img
                        src={episode.coverUrl}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-indigo-700">
                        <Play className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {/* Video indicator */}
                    {episode.mediaType === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Episode info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight line-clamp-2">
                      {episode.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatEpisodeDate(episode.publishedAt)}
                      </span>
                      <span>·</span>
                      <span>{episode.durationLabel}</span>
                    </div>
                    <Badge variant="secondary" className="mt-1.5 text-[10px] px-1.5 py-0">
                      {episode.tagLabel}
                    </Badge>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
