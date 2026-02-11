// Partner Story Viewer - Actionable story detail modal
// Shows headline, "so what", what changed, who cares, next move + CTAs

import { X, ChevronLeft, ChevronRight, Zap, FileText, Headphones, Users, Radio } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartnerStory, signalTypeColors } from '@/data/partnerStories';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { saveBriefingSelection } from '@/data/partner/briefingSelectionStore';
import type { StoryCardCTA, MicrocastType } from '@/data/partner/contracts';

interface PartnerStoryViewerProps {
  story: PartnerStory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onMarkListened: (storyId: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  currentIndex?: number;
  totalCount?: number;
  hasCustomerBrief?: boolean;
  onAddToBrief?: (story: PartnerStory) => void;
  onOpenTrendingPack?: (packId: string) => void;
  onCreateBrief?: () => void;
  onCreateQuickBrief?: () => void;
  onListenMicrocast?: (microcastType: MicrocastType) => void;
  onPromoteToDealPlanning?: (story: PartnerStory) => void;
}

export function PartnerStoryViewer({
  story,
  open,
  onOpenChange,
  onClose,
  onMarkListened,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  currentIndex = 0,
  totalCount = 1,
  onCreateQuickBrief,
  onListenMicrocast,
  onPromoteToDealPlanning,
}: PartnerStoryViewerProps) {
  if (!story) return null;

  const ctas: StoryCardCTA[] = (story as any)._ctas ?? [];

  const handleAddToQuickBrief = () => {
    if (onCreateQuickBrief) {
      onCreateQuickBrief();
      toast.success('Added to Quick Brief', {
        description: 'Signal context transferred.',
      });
      onMarkListened(story.id);
      onClose();
    }
  };

  const handlePromoteToDealPlanning = () => {
    if (onPromoteToDealPlanning) {
      onPromoteToDealPlanning(story);
      toast.success('Promoted to Deal Planning', {
        description: 'Signal evidence added to planning workspace.',
      });
      onMarkListened(story.id);
      onClose();
    } else if (onCreateQuickBrief) {
      // Fallback: open quick brief if no deal planning handler
      onCreateQuickBrief();
      onClose();
    }
  };

  const whatChangedBullets = story.whatChangedBullets ?? 
    (story.whatChanged ? [story.whatChanged] : []);
  const whoCares = story.whoCares;
  const nextMove = story.nextMove;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
        "sm:max-w-md sm:rounded-2xl"
      )}>
        <DialogTitle className="sr-only">{story.headline}</DialogTitle>

        {/* Header with navigation */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2.5 py-1 text-xs font-medium rounded-full border",
              signalTypeColors[story.signalType]
            )}>
              {story.signalType}
            </span>
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {totalCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {hasPrev && (
              <Button variant="ghost" size="icon" onClick={onPrev} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {hasNext && (
              <Button variant="ghost" size="icon" onClick={onNext} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Headline */}
          <h2 className="text-xl font-semibold leading-tight">{story.headline}</h2>

          {/* So what callout */}
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-primary">So what: </span>
              {story.soWhat}
            </p>
          </div>

          {/* What changed */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What changed</h3>
            {whatChangedBullets.length > 0 ? (
              <ul className="space-y-1">
                {whatChangedBullets.slice(0, 2).map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span className="text-foreground/90">{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">DATA NEEDED</p>
            )}
          </div>

          {/* Who cares */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              Who cares
            </h3>
            {whoCares && whoCares.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {whoCares.slice(0, 4).map((role, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border/50"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">DATA NEEDED</p>
            )}
          </div>

          {/* Next move */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next move</h3>
            {nextMove ? (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border/40">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">Talk track: </span>
                    <span className="italic text-foreground/80">"{nextMove.talkTrack}"</span>
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border/40">
                  <p className="text-sm">
                    <span className="font-medium text-foreground">Proof to ask for: </span>
                    <span className="text-foreground/80">{nextMove.proofToAsk}</span>
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">DATA NEEDED</p>
            )}
          </div>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {story.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 border-t border-border/50 space-y-2.5">
          {/* Primary: Add to Quick Brief */}
          <Button className="w-full" size="lg" onClick={handleAddToQuickBrief}>
            <Zap className="h-4 w-4 mr-2" />
            Add to Quick Brief
          </Button>

          {/* Secondary row: Promote + Listen + Generate Microcast */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-sm"
              onClick={handlePromoteToDealPlanning}
            >
              <FileText className="h-4 w-4 mr-2" />
              Promote to Deal Planning
            </Button>

            {ctas.length > 0 && onListenMicrocast && (
              <Button
                variant="ghost"
                className="text-sm text-primary"
                onClick={() => {
                  onListenMicrocast(ctas[0].microcastType);
                  onClose();
                }}
              >
                <Headphones className="h-4 w-4 mr-1.5" />
                Listen
              </Button>
            )}
          </div>

          {/* Generate Microcast — pre-fills context from story */}
          <Button
            variant="secondary"
            className="w-full text-sm gap-1.5"
            onClick={() => {
              // Auto-prefill vendor/account/industry from story tags
              const tags = story.tags ?? [];
              const vendorMap: Record<string, string> = { microsoft: 'microsoft', google: 'google', databricks: 'databricks' };
              const accountMap: Record<string, string> = { schindler: 'schindler', ubs: 'ubs', fifa: 'fifa', pflanzer: 'pflanzer' };
              const industryMap: Record<string, string> = { manufacturing: 'manufacturing', banking: 'banking', entertainment: 'entertainment' };

              const lower = tags.map((t) => t.toLowerCase());
              const vendor = Object.keys(vendorMap).find((k) => lower.some((t) => t.includes(k)));
              const account = Object.keys(accountMap).find((k) => lower.some((t) => t.includes(k)));
              const industry = Object.keys(industryMap).find((k) => lower.some((t) => t.includes(k)));

              if (vendor) saveBriefingSelection('vendor_updates', { vendor });
              if (account) saveBriefingSelection('account_microcast', { account });
              if (industry) saveBriefingSelection('industry_microcast', { industry });

              toast.success('Microcast context pre-filled', {
                description: 'Selections saved to On-Demand Briefings. Generation coming soon.',
              });
              onClose();
            }}
          >
            <Radio className="h-4 w-4" />
            Generate Microcast
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
