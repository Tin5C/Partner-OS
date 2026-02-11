// Partner Story Viewer - Actionable story detail modal
// Shows headline, "so what", what changed, who cares, next move + CTAs
// Action bar: Build Account Brief + See Related Signals

import { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, FileText, Users, Zap, Link2, ChevronDown, Square, CheckSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartnerStory, signalTypeColors } from '@/data/partnerStories';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { setQuickBriefTrigger } from '@/data/partner/quickBriefTrigger';

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
  allStories?: PartnerStory[];
  onBuildAccountBrief?: (anchorStory: PartnerStory, selectedSignals: PartnerStory[]) => void;
}

// Generate a 1-line implication that doesn't repeat the anchor story text
function getUniqueImplication(signal: PartnerStory, anchor: PartnerStory): string {
  if (signal.whatChanged && signal.whatChanged !== anchor.soWhat) {
    return signal.whatChanged;
  }
  if (signal.soWhat !== anchor.soWhat) {
    return signal.soWhat;
  }
  return `${signal.signalType} signal with relevance to same stakeholders.`;
}

function rankRelatedSignals(anchor: PartnerStory, candidates: PartnerStory[]): PartnerStory[] {
  return candidates
    .filter(s => s.id !== anchor.id)
    .map(s => {
      let score = 0;
      if (s.signalType === anchor.signalType) score += 3;
      const anchorRoles = new Set(anchor.whoCares ?? []);
      (s.whoCares ?? []).forEach(r => { if (anchorRoles.has(r)) score += 2; });
      const anchorTags = new Set((anchor.tags ?? []).map(t => t.toLowerCase()));
      (s.tags ?? []).forEach(t => { if (anchorTags.has(t.toLowerCase())) score += 1; });
      score += ((s.relevance_score ?? 50) / 100);
      return { story: s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => r.story);
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
  allStories = [],
  onBuildAccountBrief,
}: PartnerStoryViewerProps) {
  const [showRelated, setShowRelated] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const relatedSignals = useMemo(() => {
    if (!story) return [];
    return rankRelatedSignals(story, allStories);
  }, [allStories, story]);

  // Reset state on story change
  const storyId = story?.id;
  const [prevStoryId, setPrevStoryId] = useState(storyId);
  if (storyId !== prevStoryId) {
    setPrevStoryId(storyId);
    setShowRelated(false);
    setSelectedIds(new Set());
  }

  if (!story) return null;

  const whatChangedBullets = story.whatChangedBullets ?? 
    (story.whatChanged ? [story.whatChanged] : []);
  const whoCares = story.whoCares;
  const nextMove = story.nextMove;

  const toggleSignalSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const triggerQuickBrief = () => {
    setQuickBriefTrigger({
      storyTitle: story.headline,
      customer: 'Schindler',
      category: story.signalType,
      tags: story.tags,
    });
    onMarkListened(story.id);
    onClose();
    setTimeout(() => {
      const el = document.getElementById('section-quick-brief');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden flex flex-col",
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
        "sm:max-w-md sm:max-h-[90vh] sm:rounded-2xl"
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

        {/* Action bar */}
        <div className="px-4 py-2.5 border-b border-border/40 flex items-center gap-2">
          <Button size="sm" className="flex-1" onClick={triggerQuickBrief}>
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Open Quick Brief
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setShowRelated(!showRelated)}
          >
            <Link2 className="h-3.5 w-3.5 mr-1.5" />
            {showRelated ? 'Hide Related' : `See Related (${relatedSignals.length})`}
            <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", showRelated && "rotate-180")} />
          </Button>
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">

          {/* Inline Related Signals */}
          {showRelated && relatedSignals.length > 0 && (
            <div className="rounded-xl border border-primary/15 bg-primary/[0.02] p-3.5 space-y-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                Related Signals
              </p>
              <div className="space-y-1.5">
                {relatedSignals.map((s) => {
                  const isSelected = selectedIds.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSignalSelection(s.id)}
                      className={cn(
                        "w-full flex items-start gap-2 p-2 rounded-lg border text-left transition-all",
                        isSelected
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/40 bg-card hover:border-border"
                      )}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isSelected ? (
                          <CheckSquare className="w-3.5 h-3.5 text-primary" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-1">{s.headline}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {getUniqueImplication(s, story)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedIds.size > 0 && (
                <Button size="sm" className="w-full" onClick={triggerQuickBrief}>
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Add Selected to Quick Brief ({selectedIds.size})
                </Button>
              )}
            </div>
          )}

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
      </DialogContent>
    </Dialog>
  );
}
