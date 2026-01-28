import { useState, useCallback, useEffect } from 'react';
import { StoryTile } from './StoryTile';
import { StoryViewer } from './StoryViewer';
import { ExpertCornerTile } from './ExpertCornerTile';
import { ExpertCornerShowPage } from './ExpertCornerShowPage';
import { ExpertEpisodeViewer } from './ExpertEpisodeViewer';
import { stories, StoryItem } from '@/lib/stories';
import { expertCorners, ExpertCorner, ExpertEpisode } from '@/lib/expertCorners';
import { useStoryState } from '@/hooks/useStoryState';

export function StoriesRail() {
  // For You stories state
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(-1);
  const [viewerOpen, setViewerOpen] = useState(false);
  const { getState, markSeen, markListened, isSaved, toggleSave } = useStoryState();

  // Expert Corners state
  const [selectedCorner, setSelectedCorner] = useState<ExpertCorner | null>(null);
  const [showPageOpen, setShowPageOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<ExpertEpisode | null>(null);
  const [episodeContext, setEpisodeContext] = useState<ExpertEpisode[]>([]);
  const [episodeViewerOpen, setEpisodeViewerOpen] = useState(false);

  const selectedStory = selectedStoryIndex >= 0 ? stories[selectedStoryIndex] : null;

  // Handle "For You" story click
  const handleStoryClick = (story: StoryItem) => {
    const index = stories.findIndex(s => s.id === story.id);
    setSelectedStoryIndex(index);
    setViewerOpen(true);
    markSeen(story.id);
  };

  const handleCloseStoryViewer = () => {
    setViewerOpen(false);
    setSelectedStoryIndex(-1);
  };

  const handleMarkListened = (storyId: string) => {
    markListened(storyId);
  };

  const handleToggleSave = (storyId: string) => {
    toggleSave(storyId);
  };

  const handleNextStory = useCallback(() => {
    if (selectedStoryIndex < stories.length - 1) {
      const nextIndex = selectedStoryIndex + 1;
      setSelectedStoryIndex(nextIndex);
      markSeen(stories[nextIndex].id);
    } else {
      handleCloseStoryViewer();
    }
  }, [selectedStoryIndex, markSeen]);

  const handlePrevStory = useCallback(() => {
    if (selectedStoryIndex > 0) {
      const prevIndex = selectedStoryIndex - 1;
      setSelectedStoryIndex(prevIndex);
    }
  }, [selectedStoryIndex]);

  // Handle Expert Corner click
  const handleCornerClick = (corner: ExpertCorner) => {
    setSelectedCorner(corner);
    setShowPageOpen(true);
  };

  // Handle episode click from show page
  const handleEpisodeClick = (episode: ExpertEpisode, allEpisodes: ExpertEpisode[]) => {
    setSelectedEpisode(episode);
    setEpisodeContext(allEpisodes);
    setShowPageOpen(false);
    setEpisodeViewerOpen(true);
  };

  const handleCloseEpisodeViewer = () => {
    setEpisodeViewerOpen(false);
    setSelectedEpisode(null);
    // Re-open show page if we came from there
    if (selectedCorner) {
      setShowPageOpen(true);
    }
  };

  // Listen for episode navigation events from viewer
  useEffect(() => {
    const handleNavigate = (e: CustomEvent<{ episode: ExpertEpisode; episodes: ExpertEpisode[] }>) => {
      setSelectedEpisode(e.detail.episode);
      setEpisodeContext(e.detail.episodes);
    };

    window.addEventListener('expert-episode-navigate', handleNavigate as EventListener);
    return () => {
      window.removeEventListener('expert-episode-navigate', handleNavigate as EventListener);
    };
  }, []);

  // Don't render if no stories and no expert corners
  if (stories.length === 0 && expertCorners.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      {/* Lane 1: For You */}
      {stories.length > 0 && (
        <div className="space-y-3">
          <div>
            <h2 className="text-section text-foreground">For You</h2>
            <p className="text-caption text-muted-foreground">
              Quick signals you can use in customer conversations.
            </p>
          </div>

          <div className="relative -mx-5">
            <div className="flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide">
              {stories.map((story) => (
                <StoryTile
                  key={story.id}
                  story={story}
                  listenedState={getState(story.id)}
                  onClick={() => handleStoryClick(story)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lane 2: Expert Corners */}
      {expertCorners.length > 0 && (
        <div className="space-y-3">
          <div>
            <h2 className="text-section text-foreground">Expert Corners</h2>
            <p className="text-caption text-muted-foreground">
              Deep dives from specialists you trust.
            </p>
          </div>

          <div className="relative -mx-5">
            <div className="flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide">
              {expertCorners.map((corner) => (
                <ExpertCornerTile
                  key={corner.id}
                  corner={corner}
                  onClick={() => handleCornerClick(corner)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer Modal (For You lane) */}
      <StoryViewer
        story={selectedStory}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onClose={handleCloseStoryViewer}
        onMarkListened={handleMarkListened}
        isSaved={selectedStory ? isSaved(selectedStory.id) : false}
        onToggleSave={handleToggleSave}
        onNext={handleNextStory}
        onPrev={handlePrevStory}
        hasNext={selectedStoryIndex < stories.length - 1}
        hasPrev={selectedStoryIndex > 0}
        currentIndex={selectedStoryIndex}
        totalCount={stories.length}
      />

      {/* Expert Corner Show Page (bottom sheet) */}
      <ExpertCornerShowPage
        corner={selectedCorner}
        open={showPageOpen}
        onOpenChange={setShowPageOpen}
        onEpisodeClick={handleEpisodeClick}
      />

      {/* Expert Episode Viewer */}
      <ExpertEpisodeViewer
        episode={selectedEpisode}
        episodes={episodeContext}
        open={episodeViewerOpen}
        onOpenChange={setEpisodeViewerOpen}
        onClose={handleCloseEpisodeViewer}
      />
    </section>
  );
}
