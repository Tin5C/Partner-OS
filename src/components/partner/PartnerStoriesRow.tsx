// Partner Stories Row - Compact intelligence strip
// Contextual signals supporting Deal Planning workspace

import { useState, useCallback, useMemo } from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SignalIntelligencePanel } from './SignalIntelligencePanel';
import { PartnerStory, PartnerSignalType, signalTypeColors } from '@/data/partnerStories';
import { useStoryState } from '@/hooks/useStoryState';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PartnerStoryTile } from './PartnerStoryTile';
import { usePartnerData } from '@/contexts/FocusDataContext';
import type { StoryCardsV1, StoryCardV1 } from '@/data/partner/contracts';
import { hasWeeklySignals } from '@/data/partner/weeklySignalStore';
import { toast } from 'sonner';
import { getRotatedCategoryImage, getTimeAgo } from '@/data/partner/signalImageTaxonomy';
import type { SignalCategory } from '@/data/partner/signalImageTaxonomy';

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

// ============= Compact Signal Strip Item =============

function CompactSignalItem({ story, onClick }: { story: PartnerStory; onClick: () => void }) {
  const category = story.signalType as SignalCategory;
  const coverImg = story.coverUrl || getRotatedCategoryImage(category, story.id);
  const impact = ((story.relevance_score ?? 70) / 10).toFixed(1);
  const timeAgo = getTimeAgo(story.publishedAt);

  const TAG_STYLES: Record<string, string> = {
    Vendor: 'bg-muted text-muted-foreground border-border/60',
    Regulatory: 'bg-muted text-muted-foreground border-border/60',
    LocalMarket: 'bg-muted text-muted-foreground border-border/60',
    Competitive: 'bg-muted text-muted-foreground border-border/60',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-shrink-0 w-[280px] flex items-start gap-3 p-2.5 rounded-md text-left",
        "border border-border/50 bg-muted/20",
        "hover:bg-muted/40 hover:border-border/80 transition-colors"
      )}
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded flex-shrink-0 overflow-hidden bg-muted">
        <img
          src={coverImg}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <h4 className="text-[12px] font-medium text-foreground leading-snug line-clamp-1">
          {story.headline}
        </h4>
        <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1">
          {story.soWhat}
        </p>
        {/* Meta row */}
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[9px] font-medium px-1.5 py-0.5 rounded border",
            TAG_STYLES[story.signalType] ?? TAG_STYLES.Vendor
          )}>
            {story.signalType}
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground tabular-nums">
            {impact}<span className="font-normal">/10</span>
          </span>
          <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo}
          </span>
        </div>
      </div>
    </button>
  );
}

// ============= Main Component =============

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
    const el = document.getElementById('section-customer-brief');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast.success('Deal Planning initiated', {
      description: `Based on "${anchorStory.headline}" + ${selectedSignals.length} related signals.`,
    });
  }, []);

  // Show empty state if no WeeklySignals for this customer + week
  const TIME_KEY = '2026-W07';
  const CUSTOMER = 'schindler';
  const weeklyAvailable = hasWeeklySignals(CUSTOMER, TIME_KEY);

  if (homepageStories.length === 0 && !weeklyAvailable) {
    return (
      <section className={cn("space-y-1.5", className)}>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Contextual signals impacting this account.
        </p>
        <p className="text-sm font-medium text-muted-foreground">Account Intelligence Feed</p>
        <div className="rounded border border-border/50 bg-muted/20 p-6 text-center">
          <p className="text-xs text-muted-foreground">No curated signals for this week yet.</p>
        </div>
      </section>
    );
  }

  if (homepageStories.length === 0) {
    return null;
  }

  return (
    <section className={cn("space-y-1.5", className)}>
      {/* Section Header — demoted */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Contextual signals impacting this account.
          </p>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">Account Intelligence Feed</p>
        </div>
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setBrowseOpen(true)}
          >
            View all
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        )}
      </div>

      {/* Compact horizontal strip — max ~160px height */}
      <div className="relative -mx-5 lg:-mx-0">
        <div className="flex gap-2.5 overflow-x-auto px-5 lg:px-0 pb-1 scrollbar-hide">
          {homepageStories.map((story) => (
            <CompactSignalItem
              key={story.id}
              story={story}
              onClick={() => handleOpenSignal(story, homepageStories)}
            />
          ))}
        </div>
      </div>

      {/* Signal Intelligence Panel — unchanged */}
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

      {/* Browse All Sheet — uses original tiles for full view */}
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
