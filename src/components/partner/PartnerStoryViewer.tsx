// Partner Story Viewer - 1-tap execution viewer
// Shows headline, "so what", and primary action button + Listen CTA for microcasts

import { X, ChevronLeft, ChevronRight, ExternalLink, Plus, FileText, TrendingUp, Zap, Headphones } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartnerStory, signalTypeColors } from '@/data/partnerStories';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
  hasCustomerBrief = false,
  onAddToBrief,
  onOpenTrendingPack,
  onCreateBrief,
  onCreateQuickBrief,
  onListenMicrocast,
}: PartnerStoryViewerProps) {
  if (!story) return null;

  const handlePrimaryAction = () => {
    const { actionType, trendingPackId } = story.primaryAction;

    switch (actionType) {
      case 'AddToBrief':
      case 'ApplyToProject':
        if (hasCustomerBrief && onAddToBrief) {
          onAddToBrief(story);
          toast.success('Added to your AI Deal Brief', {
            description: 'Signal saved under "Signals to use"',
          });
          onMarkListened(story.id);
        } else if (onCreateBrief) {
          toast.info('Create an AI Deal Brief first', {
            description: 'Start a brief to save signals for your deal.',
            action: {
              label: 'Create Brief',
              onClick: onCreateBrief,
            },
          });
        }
        break;

      case 'OpenTrendingPack':
        if (trendingPackId && onOpenTrendingPack) {
          onOpenTrendingPack(trendingPackId);
          onClose();
        }
        break;

      case 'CreateBrief':
        if (onCreateBrief) {
          onCreateBrief();
          onClose();
        }
        break;

      case 'CreateQuickBrief':
      case 'AddToQuickBrief':
        if (onCreateQuickBrief) {
          onCreateQuickBrief();
          toast.success('Opening Quick Brief');
          onClose();
        }
        break;
    }
  };

  const getActionIcon = () => {
    switch (story.primaryAction.actionType) {
      case 'AddToBrief':
      case 'ApplyToProject':
        return <Plus className="h-4 w-4 mr-2" />;
      case 'OpenTrendingPack':
        return <TrendingUp className="h-4 w-4 mr-2" />;
      case 'CreateBrief':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'CreateQuickBrief':
      case 'AddToQuickBrief':
        return <Zap className="h-4 w-4 mr-2" />;
    }
  };

  const needsBrief = 
    (story.primaryAction.actionType === 'AddToBrief' || 
     story.primaryAction.actionType === 'ApplyToProject') && 
    !hasCustomerBrief;

  // Get CTAs from the adapted story (stored in _ctas field)
  const ctas: StoryCardCTA[] = (story as any)._ctas ?? [];

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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <h2 className="text-xl font-semibold leading-tight">{story.headline}</h2>

          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-primary">So what: </span>
              {story.soWhat}
            </p>
          </div>

          {/* Listen CTAs */}
          {ctas.length > 0 && onListenMicrocast && (
            <div className="flex flex-wrap gap-2">
              {ctas.map((cta, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onListenMicrocast(cta.microcastType);
                    onClose();
                  }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium",
                    "bg-primary/10 text-primary border border-primary/20",
                    "hover:bg-primary/15 transition-colors"
                  )}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  {cta.label}
                </button>
              ))}
            </div>
          )}

          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
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

          {story.sourceName && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Source:</span>
              {story.sourceUrl ? (
                <a
                  href={story.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {story.sourceName}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-foreground">{story.sourceName}</span>
              )}
            </div>
          )}
        </div>

        {/* Footer with primary action */}
        <div className="p-4 border-t border-border/50 space-y-3">
          {needsBrief ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Create an AI Deal Brief to save this signal
              </p>
              <Button className="w-full" onClick={onCreateBrief}>
                <FileText className="h-4 w-4 mr-2" />
                Create AI Deal Brief
              </Button>
            </div>
          ) : (
            <Button className="w-full" size="lg" onClick={handlePrimaryAction}>
              {getActionIcon()}
              {story.primaryAction.actionLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
