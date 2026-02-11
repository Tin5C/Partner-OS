// Partner Stories Row - Partner-only stories section
// Stories are the primary entry point → Story detail → Account Brief

import { useState, useCallback, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { PartnerStoryTile } from './PartnerStoryTile';
import { SignalIntelligencePanel } from './SignalIntelligencePanel';
import { PartnerStory, PartnerSignalType, signalTypeColors } from '@/data/partnerStories';
import { useStoryState } from '@/hooks/useStoryState';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { usePartnerData } from '@/contexts/FocusDataContext';
import type { StoryCardsV1, StoryCardV1 } from '@/data/partner/contracts';
import { hasWeeklySignals } from '@/data/partner/weeklySignalStore';
import { toast } from 'sonner';

// Adapter: convert StoryCardV1 → PartnerStory for existing tile/viewer components
function adaptCardToStory(card: StoryCardV1): PartnerStory {
  const signalType: PartnerSignalType = 
    card.tags.includes('Regulatory') ? 'Regulatory' :
    card.tags.includes('LocalMarket') ? 'LocalMarket' : 'Vendor';

  const adapted: PartnerStory = {
    id: card.cardId,
    signalType,
    headline: card.title,
    soWhat: card.whyItMatters,
    whatChanged: card.whatChanged,
    whatChangedBullets: card.whatChangedBullets,
    whoCares: card.whoCares,
    nextMove: card.nextMove,
    primaryAction: {
      actionType: 'AddToQuickBrief',
      actionLabel: card.suggestedAction,
    },
    publishedAt: new Date().toISOString(),
    expiresAt: card.expiresAt,
    tags: card.tags,
  };

  if (card.ctas && card.ctas.length > 0) {
    (adapted as any)._ctas = card.ctas;
  }

  return adapted;
}

interface PartnerStoriesRowProps {
  className?: string;
}

export function PartnerStoriesRow({
  className,
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

  const handleOpenSignal = (story: PartnerStory, playlist: PartnerStory[]) => {
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

  const handleBuildAccountBrief = useCallback((anchorStory: PartnerStory, selectedSignals: PartnerStory[]) => {
    // Scroll to customer brief section if it exists
    const el = document.getElementById('section-customer-brief');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast.success('Account Brief initiated', {
      description: `Based on "${anchorStory.headline}" + ${selectedSignals.length} related signals.`,
    });
  }, []);

  // Show empty state if no WeeklySignals for this customer + week
  const TIME_KEY = '2026-W07';
  const CUSTOMER = 'schindler';
  const weeklyAvailable = hasWeeklySignals(CUSTOMER, TIME_KEY);

  if (homepageStories.length === 0 && !weeklyAvailable) {
    return (
      <section className={cn("space-y-3", className)}>
        <SectionHeader
          title="AI Selling Signals"
          subtitle="What changed, why it matters, what to do."
        />
        <div className="rounded-2xl border border-border/60 bg-muted/20 p-8 text-center">
          <p className="text-sm text-muted-foreground">No curated signals for this week yet.</p>
        </div>
      </section>
    );
  }

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
              onClick={() => handleOpenSignal(story, homepageStories)}
            />
          ))}
        </div>
      </div>

      {/* Signal Intelligence Panel */}
      <SignalIntelligencePanel
        story={selectedStory}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onClose={handleClose}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={selectedIndex < currentPlaylist.length - 1}
        hasPrev={selectedIndex > 0}
        currentIndex={selectedIndex}
        totalCount={currentPlaylist.length}
        allStories={homepageStories}
        onBuildAccountBrief={handleBuildAccountBrief}
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
                  handleOpenSignal(story, homepageStories);
                }}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
