import { useState } from 'react';
import { StoryTile } from './StoryTile';
import { StoryViewer } from './StoryViewer';
import { stories, StoryItem } from '@/lib/stories';
import { useStoryState } from '@/hooks/useStoryState';

export function StoriesRail() {
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const { getState, markSeen, markListened, isSaved, toggleSave } = useStoryState();

  const handleStoryClick = (story: StoryItem) => {
    setSelectedStory(story);
    setViewerOpen(true);
    markSeen(story.id);
  };

  const handleClose = () => {
    setViewerOpen(false);
    setSelectedStory(null);
  };

  const handleMarkListened = (storyId: string) => {
    markListened(storyId);
  };

  const handleToggleSave = (storyId: string) => {
    toggleSave(storyId);
  };

  // Don't render if no stories
  if (stories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-lg">Today's Highlights</h2>
        <p className="text-sm text-muted-foreground">
          Quick signals you can use in customer conversations.
        </p>
      </div>

      {/* Horizontal scroll rail */}
      <div className="relative -mx-4">
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
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
      />
    </section>
  );
}
