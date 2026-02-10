// Partner Stories Row - Partner-only stories section
// Wired to PartnerDataProvider artifacts

import { useState, useCallback, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnerStoryTile } from './PartnerStoryTile';
import { PartnerStoryViewer } from './PartnerStoryViewer';
import { PartnerStory, PartnerSignalType, signalTypeColors, signalTypeGradients } from '@/data/partnerStories';
import { useStoryState } from '@/hooks/useStoryState';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { usePartnerData } from '@/contexts/FocusDataContext';
import type { StoryCardsV1, StoryCardV1 } from '@/data/partner/contracts';

// Adapter: convert StoryCardV1 → PartnerStory for existing tile/viewer components
function adaptCardToStory(card: StoryCardV1): PartnerStory {
  // Derive signalType from tags
  const signalType: PartnerSignalType = 
    card.tags.includes('Regulatory') ? 'Regulatory' :
    card.tags.includes('LocalMarket') ? 'LocalMarket' : 'Vendor';

  return {
    id: card.cardId,
    signalType,
    headline: card.title,
    soWhat: card.whyItMatters,
    primaryAction: {
      actionType: 'AddToQuickBrief',
      actionLabel: card.suggestedAction,
    },
    publishedAt: new Date().toISOString(),
    expiresAt: card.expiresAt,
    tags: card.tags,
  };
}

interface PartnerStoriesRowProps {
  className?: string;
  hasCustomerBrief?: boolean;
  onCreateBrief?: () => void;
  onOpenTrendingPack?: (packId: string) => void;
  onCreateQuickBrief?: () => void;
}

export function PartnerStoriesRow({
  className,
  hasCustomerBrief = false,
  onCreateBrief,
  onOpenTrendingPack,
  onCreateQuickBrief,
}: PartnerStoriesRowProps) {
  const { provider } = usePartnerData();
  const ctx = provider.getActiveContext();

  // Get stories from provider artifact
  const homepageStories = useMemo<PartnerStory[]>(() => {
    if (!ctx) return [];
    const artifact = provider.getArtifact({ runId: ctx.runId, artifactType: 'storyCards' });
    if (!artifact) return [];
    const content = artifact.content as StoryCardsV1;
    return content.cards.slice(0, 6).map(adaptCardToStory);
  }, [provider, ctx]);

  const hasMore = homepageStories.length > 6;

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
    markListened(story.id);
  };

  if (homepageStories.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-3", className)}>
      <SectionHeader
        title="AI Selling Signals"
        subtitle="What changed, why it matters, what to do."
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
        onCreateQuickBrief={onCreateQuickBrief}
      />

      {/* Browse All Sheet */}
      <Sheet open={browseOpen} onOpenChange={setBrowseOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>All AI Selling Signals</SheetTitle>
            <p className="text-sm text-muted-foreground">
              {homepageStories.length} active signals
            </p>
          </SheetHeader>

          <div className="grid grid-cols-2 gap-4">
            {homepageStories.map((story) => (
              <PartnerStoryTile
                key={story.id}
                story={story}
                listenedState={getState(story.id)}
                onClick={() => {
                  setBrowseOpen(false);
                  handleStoryClick(story, homepageStories);
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
