import { useState, useCallback, useEffect } from 'react';
import { StoryTile } from './StoryTile';
import { VoiceTile } from './VoiceTile';
import { StoryViewer } from './StoryViewer';
import { VoiceEpisodeViewer } from './VoiceEpisodeViewer';
import { VoiceShowPage } from './VoiceShowPage';
import { getUnifiedStories, getSignalPlaylist, getVoicePlaylist, UnifiedStoryItem } from '@/lib/unifiedStories';
import { getVoice, VoiceEpisode, Voice } from '@/lib/voices';
import { useStoryState } from '@/hooks/useStoryState';

type PlaylistContext = 'signal' | 'voice';

export function StoriesRail() {
  // Unified stories
  const unifiedStories = getUnifiedStories();
  
  // Story viewer state (for signals)
  const [signalPlaylist, setSignalPlaylist] = useState<UnifiedStoryItem[]>([]);
  const [selectedSignalIndex, setSelectedSignalIndex] = useState<number>(-1);
  const [signalViewerOpen, setSignalViewerOpen] = useState(false);
  
  // Voice viewer state
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [selectedVoiceEpisode, setSelectedVoiceEpisode] = useState<VoiceEpisode | null>(null);
  const [voiceEpisodes, setVoiceEpisodes] = useState<VoiceEpisode[]>([]);
  const [voiceViewerOpen, setVoiceViewerOpen] = useState(false);
  const [voiceShowPageOpen, setVoiceShowPageOpen] = useState(false);
  
  const { getState, markSeen, markListened, isSaved, toggleSave } = useStoryState();

  // Handle Signal story click
  const handleSignalClick = (item: UnifiedStoryItem) => {
    const playlist = getSignalPlaylist();
    setSignalPlaylist(playlist);
    const index = playlist.findIndex(s => s.id === item.id);
    setSelectedSignalIndex(index);
    setSignalViewerOpen(true);
    markSeen(item.id);
  };

  // Handle Voice tile click - opens viewer with that leader's playlist
  const handleVoiceClick = (item: UnifiedStoryItem) => {
    if (!item.voiceId || !item.voiceData || !item.voiceEpisode) return;
    
    const voice = item.voiceData;
    setSelectedVoice(voice);
    setSelectedVoiceEpisode(item.voiceEpisode);
    setVoiceEpisodes(voice.episodes);
    setVoiceViewerOpen(true);
    markSeen(item.id);
  };

  // Handle closing signal viewer
  const handleCloseSignalViewer = () => {
    setSignalViewerOpen(false);
    setSelectedSignalIndex(-1);
    setSignalPlaylist([]);
  };

  const handleMarkListened = (storyId: string) => {
    markListened(storyId);
  };

  const handleToggleSave = (storyId: string) => {
    toggleSave(storyId);
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

  // Handle closing voice viewer
  const handleCloseVoiceViewer = () => {
    setVoiceViewerOpen(false);
    setSelectedVoiceEpisode(null);
  };

  // Handle "See all from this Voice" click
  const handleSeeAllVoice = () => {
    setVoiceViewerOpen(false);
    setVoiceShowPageOpen(true);
  };

  // Handle episode click from Voice show page
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

  // Get selected signal story data
  const selectedSignalItem = selectedSignalIndex >= 0 ? signalPlaylist[selectedSignalIndex] : null;

  // Don't render if no stories
  if (unifiedStories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-section text-foreground">Stories</h2>
        <p className="text-caption text-muted-foreground">
          Quick signals and insights you can use in customer conversations.
        </p>
      </div>

      {/* Single unified row */}
      <div className="relative -mx-5">
        <div className="flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide">
          {unifiedStories.map((item) => (
            item.itemType === 'voice' ? (
              <VoiceTile
                key={item.id}
                item={item}
                listenedState={getState(item.id)}
                onClick={() => handleVoiceClick(item)}
              />
            ) : (
              <StoryTile
                key={item.id}
                story={item.signalData!}
                listenedState={getState(item.id)}
                onClick={() => handleSignalClick(item)}
              />
            )
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
          onMarkListened={handleMarkListened}
          isSaved={isSaved(selectedSignalItem.id)}
          onToggleSave={handleToggleSave}
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
