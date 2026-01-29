// Shared Stories Row Component
// Renders a horizontal scrollable row of story tiles with viewers

import { useState, useCallback, useEffect } from 'react';
import { StoryTile } from '@/components/StoryTile';
import { VoiceTile } from '@/components/VoiceTile';
import { WinwireTile } from '@/components/WinwireTile';
import { StoryViewer } from '@/components/StoryViewer';
import { VoiceEpisodeViewer } from '@/components/VoiceEpisodeViewer';
import { VoiceShowPage } from '@/components/VoiceShowPage';
import { WinwireStoryViewer } from '@/components/WinwireStoryViewer';
import { SectionHeader } from './SectionHeader';
import { getUnifiedStories, getSignalPlaylist, getWinwirePlaylist, UnifiedStoryItem } from '@/lib/unifiedStories';
import { Voice, VoiceEpisode } from '@/lib/voices';
import { useStoryState } from '@/hooks/useStoryState';
import { cn } from '@/lib/utils';
import { useSpace } from '@/contexts/SpaceContext';

interface StoriesRowProps {
  title?: string;
  subtitle?: string;
  allowedTypes?: string[];
  className?: string;
}

export function StoriesRow({ 
  title = 'Stories',
  subtitle = 'Quick signals and insights you can use in customer conversations.',
  allowedTypes,
  className 
}: StoriesRowProps) {
  const { spaceConfig } = useSpace();
  const currentSpace = spaceConfig.spaceType;
  
  // Get and filter stories
  const allStories = getUnifiedStories(currentSpace);
  const stories = allowedTypes 
    ? allStories.filter(s => {
        if (s.itemType === 'voice') return allowedTypes.includes('voice');
        if (s.itemType === 'winwire') return allowedTypes.includes('winwire');
        return allowedTypes.includes(s.signalData?.type || 'signal');
      })
    : allStories;

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
  
  // Winwire viewer state
  const [winwirePlaylist, setWinwirePlaylist] = useState<UnifiedStoryItem[]>([]);
  const [selectedWinwireIndex, setSelectedWinwireIndex] = useState<number>(-1);
  const [winwireViewerOpen, setWinwireViewerOpen] = useState(false);
  
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

  // Handle Voice tile click
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

  // Handle Winwire story click
  const handleWinwireClick = (item: UnifiedStoryItem) => {
    const playlist = getWinwirePlaylist(currentSpace);
    setWinwirePlaylist(playlist);
    const index = playlist.findIndex(s => s.id === item.id);
    setSelectedWinwireIndex(index);
    setWinwireViewerOpen(true);
    markSeen(item.id);
  };

  const handleCloseWinwireViewer = () => {
    setWinwireViewerOpen(false);
    setSelectedWinwireIndex(-1);
    setWinwirePlaylist([]);
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
      setSelectedSignalIndex(selectedSignalIndex - 1);
    }
  }, [selectedSignalIndex]);

  const handleNextWinwire = useCallback(() => {
    if (selectedWinwireIndex < winwirePlaylist.length - 1) {
      const nextIndex = selectedWinwireIndex + 1;
      setSelectedWinwireIndex(nextIndex);
      markSeen(winwirePlaylist[nextIndex].id);
    } else {
      handleCloseWinwireViewer();
    }
  }, [selectedWinwireIndex, winwirePlaylist, markSeen]);

  const handlePrevWinwire = useCallback(() => {
    if (selectedWinwireIndex > 0) {
      setSelectedWinwireIndex(selectedWinwireIndex - 1);
    }
  }, [selectedWinwireIndex]);

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
  const selectedWinwireItem = selectedWinwireIndex >= 0 ? winwirePlaylist[selectedWinwireIndex] : null;

  if (stories.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-3", className)}>
      <SectionHeader title={title} subtitle={subtitle} />

      {/* Single unified row */}
      <div className="relative -mx-5 lg:-mx-0">
        <div className="flex gap-4 overflow-x-auto px-5 lg:px-0 pb-2 scrollbar-hide">
          {stories.map((item) => {
            // Voice stories
            if (item.itemType === 'voice') {
              return (
                <VoiceTile
                  key={item.id}
                  item={item}
                  listenedState={getState(item.id)}
                  onClick={() => handleVoiceClick(item)}
                />
              );
            }
            
            // Winwire stories
            if (item.itemType === 'winwire') {
              if (!item.winwireData) return null;
              return (
                <WinwireTile
                  key={item.id}
                  story={item.winwireData}
                  listenedState={getState(item.id)}
                  onClick={() => handleWinwireClick(item)}
                />
              );
            }
            
            // Signal stories (itemType === 'signal')
            if (item.itemType === 'signal') {
              if (!item.signalData) return null;
              return (
                <StoryTile
                  key={item.id}
                  story={item.signalData}
                  listenedState={getState(item.id)}
                  onClick={() => handleSignalClick(item)}
                />
              );
            }
            
            return null;
          })}
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

      {/* Winwire Story Viewer */}
      {selectedWinwireItem?.winwireData && (
        <WinwireStoryViewer
          story={selectedWinwireItem.winwireData}
          open={winwireViewerOpen}
          onOpenChange={setWinwireViewerOpen}
          onClose={handleCloseWinwireViewer}
          onMarkListened={markListened}
          isSaved={isSaved(selectedWinwireItem.id)}
          onToggleSave={toggleSave}
          onNext={handleNextWinwire}
          onPrev={handlePrevWinwire}
          hasNext={selectedWinwireIndex < winwirePlaylist.length - 1}
          hasPrev={selectedWinwireIndex > 0}
          currentIndex={selectedWinwireIndex}
          totalCount={winwirePlaylist.length}
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
