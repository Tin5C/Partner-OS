import { useState, useCallback } from 'react';
import { StoryTile } from './StoryTile';
import { StoryViewer } from './StoryViewer';
import { stories, StoryItem } from '@/lib/stories';
import { useStoryState } from '@/hooks/useStoryState';

export function StoriesRail() {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(-1);
  const [viewerOpen, setViewerOpen] = useState(false);
  const { getState, markSeen, markListened, isSaved, toggleSave } = useStoryState();

  const selectedStory = selectedStoryIndex >= 0 ? stories[selectedStoryIndex] : null;

  const handleStoryClick = (story: StoryItem) => {
    const index = stories.findIndex(s => s.id === story.id);
    setSelectedStoryIndex(index);
    setViewerOpen(true);
    markSeen(story.id);
  };

  const handleClose = () => {
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
      // No more stories, close the viewer
      handleClose();
    }
  }, [selectedStoryIndex, markSeen]);

  const handlePrevStory = useCallback(() => {
    if (selectedStoryIndex > 0) {
      const prevIndex = selectedStoryIndex - 1;
      setSelectedStoryIndex(prevIndex);
    }
  }, [selectedStoryIndex]);

  // Don't render if no stories
  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-section text-foreground">Today's Highlights</h2>
        <p className="text-caption text-muted-foreground">
          Quick signals you can use in customer conversations.
        </p>
      </div>

      {/* Horizontal scroll rail */}
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

      {/* Story Viewer Modal */}
      <StoryViewer
        story={selectedStory}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onClose={handleClose}
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
    </section>
  );
}
