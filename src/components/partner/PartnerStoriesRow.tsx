// Partner Stories Row - Partner-only stories section
// Capped at 8, with expiry, "View all" for browse

import { useState, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnerStoryTile } from './PartnerStoryTile';
import { PartnerStoryViewer } from './PartnerStoryViewer';
import { PartnerStory, getHomepagePartnerStories, getActivePartnerStories, partnerStories } from '@/data/partnerStories';
import { useStoryState } from '@/hooks/useStoryState';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface PartnerStoriesRowProps {
  className?: string;
  hasCustomerBrief?: boolean;
  onCreateBrief?: () => void;
  onOpenTrendingPack?: (packId: string) => void;
}

export function PartnerStoriesRow({
  className,
  hasCustomerBrief = false,
  onCreateBrief,
  onOpenTrendingPack,
}: PartnerStoriesRowProps) {
  const homepageStories = getHomepagePartnerStories(8);
  const allActiveStories = getActivePartnerStories(partnerStories);
  const hasMore = allActiveStories.length > 8;

  const [selectedStory, setSelectedStory] = useState<PartnerStory | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<PartnerStory[]>([]);

  const { getState, markSeen, markListened } = useStoryState();

  const handleStoryClick = (story: PartnerStory, playlist: PartnerStory[]) => {
    setCurrentPlaylist(playlist);
    const index = playlist.findIndex(s => s.id === story.id);
    setSelectedIndex(index);
    setSelectedStory(story);
    setViewerOpen(true);
    markSeen(story.id);
  };

  const handleClose = () => {
    setViewerOpen(false);
    setSelectedStory(null);
    setSelectedIndex(-1);
  };

  const handleNext = useCallback(() => {
    if (selectedIndex < currentPlaylist.length - 1) {
      const nextIndex = selectedIndex + 1;
      setSelectedIndex(nextIndex);
      setSelectedStory(currentPlaylist[nextIndex]);
      markSeen(currentPlaylist[nextIndex].id);
    } else {
      handleClose();
    }
  }, [selectedIndex, currentPlaylist, markSeen]);

  const handlePrev = useCallback(() => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1;
      setSelectedIndex(prevIndex);
      setSelectedStory(currentPlaylist[prevIndex]);
    }
  }, [selectedIndex, currentPlaylist]);

  const handleAddToBrief = (story: PartnerStory) => {
    // In a real app, this would add to the user's Customer Brief
    console.log('Adding to brief:', story.headline);
    // For MVP, just mark as listened
    markListened(story.id);
  };

  if (homepageStories.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-3", className)}>
      <SectionHeader
        title="Stories"
        subtitle="Partner signals you can use today."
        action={hasMore ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setBrowseOpen(true)}
          >
            View all
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        ) : undefined}
      />

      {/* Horizontal scrollable row */}
      <div className="relative -mx-5 lg:-mx-0">
        <div className="flex gap-4 overflow-x-auto px-5 lg:px-0 pb-2 scrollbar-hide">
          {homepageStories.map((story) => (
            <PartnerStoryTile
              key={story.id}
              story={story}
              listenedState={getState(story.id)}
              onClick={() => handleStoryClick(story, homepageStories)}
            />
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      <PartnerStoryViewer
        story={selectedStory}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onClose={handleClose}
        onMarkListened={markListened}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={selectedIndex < currentPlaylist.length - 1}
        hasPrev={selectedIndex > 0}
        currentIndex={selectedIndex}
        totalCount={currentPlaylist.length}
        hasCustomerBrief={hasCustomerBrief}
        onAddToBrief={handleAddToBrief}
        onOpenTrendingPack={onOpenTrendingPack}
        onCreateBrief={onCreateBrief}
      />

      {/* Browse All Sheet */}
      <Sheet open={browseOpen} onOpenChange={setBrowseOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>All Partner Stories</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {allActiveStories.length} active signals
            </p>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-4">
            {allActiveStories.map((story) => (
              <PartnerStoryTile
                key={story.id}
                story={story}
                listenedState={getState(story.id)}
                onClick={() => {
                  setBrowseOpen(false);
                  handleStoryClick(story, allActiveStories);
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
