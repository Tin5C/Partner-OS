import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Bookmark, Play, User, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoryViewer } from '@/components/StoryViewer';
import { VoiceEpisodeViewer } from '@/components/VoiceEpisodeViewer';
import { VoiceShowPage } from '@/components/VoiceShowPage';
import { StoryReactions } from '@/components/StoryReactions';
import { getUnifiedStories, getSignalPlaylist, UnifiedStoryItem } from '@/lib/unifiedStories';
import { Voice, VoiceEpisode } from '@/lib/voices';
import { useStoryState } from '@/hooks/useStoryState';
import { useStoryReactions } from '@/hooks/useStoryReactions';
import { ListenedState, storyTypeLabels } from '@/lib/stories';


// Calculate relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

interface StoryCardProps {
  item: UnifiedStoryItem;
  listenedState: ListenedState;
  onClick: () => void;
  reactions: ReturnType<typeof useStoryReactions>;
}

function StoryCard({ item, listenedState, onClick, reactions }: StoryCardProps) {
  const [showReactions, setShowReactions] = useState(false);
  const isVoice = item.itemType === 'voice';
  const isExternal = !isVoice;
  const publishedAt = item.publishedAt || new Date().toISOString();
  const activeReactions = reactions.getReactions(item.id);
  const hasActiveReactions = activeReactions.length > 0;
  
  // Get topic tag
  const topicTag = isVoice 
    ? 'Voice'
    : item.signalData?.type 
      ? storyTypeLabels[item.signalData.type]
      : 'Signal';

  return (
    <div
      className="relative flex-shrink-0 w-[200px]"
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <button
        onClick={onClick}
        className={cn(
          "group relative w-full rounded-2xl overflow-hidden",
          "bg-card border border-border",
          "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]",
          "hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
          "hover:border-border/80",
          "transition-all duration-200 text-left"
        )}
      >
        {/* Cover Area */}
        <div className="relative aspect-[16/10] bg-muted overflow-hidden">
          {/* Cover Image */}
          {item.coverUrl && (
            <img
              src={item.coverUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Voice Avatar Overlay */}
          {isVoice && item.voiceData && (
            <div className="absolute bottom-2 left-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-white/80 overflow-hidden bg-muted">
                {item.voiceData.voiceAvatarUrl ? (
                  <img 
                    src={item.voiceData.voiceAvatarUrl} 
                    alt={item.voiceData.voiceName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 backdrop-blur-sm">
                <Mic className="w-3 h-3 text-white/80" />
              </div>
            </div>
          )}

          {/* Play Overlay for Videos */}
          {item.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Bookmark Button */}
          <button 
            className={cn(
              "absolute top-2 right-2 p-1.5 rounded-full",
              "bg-black/30 backdrop-blur-sm text-white/80",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "hover:bg-black/50"
            )}
            onClick={(e) => {
              e.stopPropagation();
              // Handle save
            }}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          {/* Tags Row */}
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded text-[10px] font-medium",
              isVoice
                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                : "bg-muted text-muted-foreground"
            )}>
              {isExternal ? 'External' : 'Internal'}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {topicTag}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
            {item.title}
          </h3>

          {/* Voice Info */}
          {isVoice && item.voiceData && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {item.voiceData.voiceName} · {item.voiceData.voiceRole}
            </p>
          )}

          {/* Freshness */}
          <p className="text-xs text-muted-foreground">
            {getRelativeTime(publishedAt)}
          </p>

          {/* Active Reactions Indicator (always visible if has reactions) */}
          {hasActiveReactions && !showReactions && (
            <div className="flex items-center gap-1 pt-1">
              <div className="flex -space-x-1">
                {activeReactions.slice(0, 3).map((type) => (
                  <div 
                    key={type}
                    className="w-4 h-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                ))}
              </div>
              <span className="text-[9px] text-muted-foreground">
                {activeReactions.length} reaction{activeReactions.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Listened Indicator */}
        {listenedState === 'listened' && (
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-primary" />
        )}
      </button>

      {/* Reactions Panel - appears on hover */}
      <div 
        className={cn(
          "absolute left-0 right-0 -bottom-1 z-10 p-2 pt-3",
          "bg-card/95 backdrop-blur-sm border border-border rounded-b-2xl",
          "shadow-lg transition-all duration-200",
          showReactions 
            ? "opacity-100 translate-y-full" 
            : "opacity-0 translate-y-full pointer-events-none"
        )}
      >
        <StoryReactions
          storyId={item.id}
          activeReactions={activeReactions}
          onToggle={reactions.toggleReaction}
          compact
        />
      </div>
    </div>
  );
}

export function StoriesSection() {
  const unifiedStories = getUnifiedStories();
  const { getState, markSeen, markListened, isSaved, toggleSave } = useStoryState();
  const storyReactions = useStoryReactions();
  // Signal viewer state
  const [signalPlaylist, setSignalPlaylist] = useState<UnifiedStoryItem[]>([]);
  const [selectedSignalIndex, setSelectedSignalIndex] = useState<number>(-1);
  const [signalViewerOpen, setSignalViewerOpen] = useState(false);
  
  // Voice viewer state
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [selectedVoiceEpisode, setSelectedVoiceEpisode] = useState<VoiceEpisode | null>(null);
  const [voiceEpisodes, setVoiceEpisodes] = useState<VoiceEpisode[]>([]);
  const [voiceViewerOpen, setVoiceViewerOpen] = useState(false);
  const [voiceShowPageOpen, setVoiceShowPageOpen] = useState(false);

  const handleSignalClick = (item: UnifiedStoryItem) => {
    const playlist = getSignalPlaylist();
    setSignalPlaylist(playlist);
    const index = playlist.findIndex(s => s.id === item.id);
    setSelectedSignalIndex(index);
    setSignalViewerOpen(true);
    markSeen(item.id);
  };

  const handleVoiceClick = (item: UnifiedStoryItem) => {
    if (!item.voiceId || !item.voiceData || !item.voiceEpisode) return;
    
    const voice = item.voiceData;
    setSelectedVoice(voice);
    setSelectedVoiceEpisode(item.voiceEpisode);
    setVoiceEpisodes(voice.episodes);
    setVoiceViewerOpen(true);
    markSeen(item.id);
  };

  const handleCloseSignalViewer = () => {
    setSignalViewerOpen(false);
    setSelectedSignalIndex(-1);
    setSignalPlaylist([]);
  };

  const handleNextSignal = useCallback(() => {
    if (selectedSignalIndex < signalPlaylist.length - 1) {
      const nextIndex = selectedSignalIndex + 1;
      setSelectedSignalIndex(nextIndex);
      markSeen(signalPlaylist[nextIndex].id);
    } else {
      handleCloseSignalViewer();
    }
  }, [selectedSignalIndex, signalPlaylist, markSeen]);

  const handlePrevSignal = useCallback(() => {
    if (selectedSignalIndex > 0) {
      const prevIndex = selectedSignalIndex - 1;
      setSelectedSignalIndex(prevIndex);
    }
  }, [selectedSignalIndex]);

  const handleCloseVoiceViewer = () => {
    setVoiceViewerOpen(false);
    setSelectedVoiceEpisode(null);
  };

  const handleSeeAllVoice = () => {
    setVoiceViewerOpen(false);
    setVoiceShowPageOpen(true);
  };

  const handleVoiceEpisodeClick = (episode: VoiceEpisode, allEpisodes: VoiceEpisode[]) => {
    setSelectedVoiceEpisode(episode);
    setVoiceEpisodes(allEpisodes);
    setVoiceShowPageOpen(false);
    setVoiceViewerOpen(true);
    markSeen(episode.id);
  };

  // Listen for voice episode navigation events
  useEffect(() => {
    const handleNavigate = (e: CustomEvent<{ episode: VoiceEpisode; episodes: VoiceEpisode[]; voice: Voice }>) => {
      setSelectedVoiceEpisode(e.detail.episode);
      setVoiceEpisodes(e.detail.episodes);
      setSelectedVoice(e.detail.voice);
      markSeen(e.detail.episode.id);
    };

    window.addEventListener('voice-episode-navigate', handleNavigate as EventListener);
    return () => {
      window.removeEventListener('voice-episode-navigate', handleNavigate as EventListener);
    };
  }, [markSeen]);

  const selectedSignalItem = selectedSignalIndex >= 0 ? signalPlaylist[selectedSignalIndex] : null;

  if (unifiedStories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Stories</h2>
        <p className="text-sm text-muted-foreground">
          Fast signals from your market and internal thought leaders.
        </p>
      </div>

      {/* Stories Carousel */}
      <div className="relative -mx-5 lg:-mx-0 pb-16">
        <div className="flex gap-4 overflow-x-auto px-5 lg:px-0 pb-2 scrollbar-hide">
          {unifiedStories.map((item) => (
            <StoryCard
              key={item.id}
              item={item}
              listenedState={getState(item.id)}
              reactions={storyReactions}
              onClick={() => 
                item.itemType === 'voice' 
                  ? handleVoiceClick(item) 
                  : handleSignalClick(item)
              }
            />
          ))}
        </div>
      </div>

      {/* Signal Story Viewer */}
      {selectedSignalItem?.signalData && (
        <StoryViewer
          story={selectedSignalItem.signalData}
          open={signalViewerOpen}
          onOpenChange={setSignalViewerOpen}
          onClose={handleCloseSignalViewer}
          onMarkListened={markListened}
          isSaved={isSaved(selectedSignalItem.id)}
          onToggleSave={toggleSave}
          onNext={handleNextSignal}
          onPrev={handlePrevSignal}
          hasNext={selectedSignalIndex < signalPlaylist.length - 1}
          hasPrev={selectedSignalIndex > 0}
          currentIndex={selectedSignalIndex}
          totalCount={signalPlaylist.length}
        />
      )}

      {/* Voice Episode Viewer */}
      <VoiceEpisodeViewer
        episode={selectedVoiceEpisode}
        voice={selectedVoice}
        episodes={voiceEpisodes}
        open={voiceViewerOpen}
        onOpenChange={setVoiceViewerOpen}
        onClose={handleCloseVoiceViewer}
        onSeeAllClick={handleSeeAllVoice}
      />

      {/* Voice Show Page */}
      <VoiceShowPage
        voice={selectedVoice}
        open={voiceShowPageOpen}
        onOpenChange={setVoiceShowPageOpen}
        onEpisodeClick={handleVoiceEpisodeClick}
      />
    </section>
  );
}
