import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Headphones, Bookmark, Share2, Copy, Check, ChevronLeft, 
  ChevronDown, ChevronUp, Maximize2, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/contexts/PlayerContext';
import { FocusCard, focusEpisodes } from '@/lib/focusCards';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ExecSummaryViewProps {
  card: FocusCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenListenBriefing?: () => void;
  onOpenProjection?: () => void;
}

// Store scroll positions per card ID
const scrollPositions = new Map<string, number>();

export function ExecSummaryView({ 
  card, 
  open, 
  onOpenChange,
  onOpenListenBriefing,
  onOpenProjection
}: ExecSummaryViewProps) {
  const isMobile = useIsMobile();
  const { play } = usePlayer();
  const [copiedActions, setCopiedActions] = useState(false);
  const [copiedQuestions, setCopiedQuestions] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Restore scroll position when opening
  useEffect(() => {
    if (open && card && contentRef.current) {
      const savedPosition = scrollPositions.get(card.id);
      if (savedPosition !== undefined) {
        setTimeout(() => {
          contentRef.current?.scrollTo(0, savedPosition);
        }, 50);
      }
    }
  }, [open, card]);

  // Save scroll position when closing
  const handleClose = useCallback(() => {
    if (card && contentRef.current) {
      scrollPositions.set(card.id, contentRef.current.scrollTop);
    }
    onOpenChange(false);
  }, [card, onOpenChange]);

  // ESC key handler
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, handleClose]);

  if (!card) return null;

  const episode = focusEpisodes[card.id];
  const execSummary = card.execSummary;

  const handleListen = () => {
    if (episode) {
      play(episode);
    }
    onOpenListenBriefing?.();
  };

  const handleCopyActions = () => {
    if (execSummary?.nextBestActions) {
      const text = execSummary.nextBestActions.map((a, i) => `${i + 1}. ${a}`).join('\n');
      navigator.clipboard.writeText(text);
      setCopiedActions(true);
      setTimeout(() => setCopiedActions(false), 2000);
    }
  };

  const handleCopyQuestions = () => {
    if (execSummary?.questionsToAsk) {
      const text = execSummary.questionsToAsk.map((q, i) => `${i + 1}. ${q}`).join('\n');
      navigator.clipboard.writeText(text);
      setCopiedQuestions(true);
      setTimeout(() => setCopiedQuestions(false), 2000);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = async () => {
    const shareData = {
      title: card.title,
      text: execSummary?.tldr || card.subtitle,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Extract meta info
  const typeTag = card.tags.find(t => t.label === 'Type')?.value || 'Briefing';
  const focusTag = card.tags.find(t => t.label === 'Focus')?.value;
  const industryTag = card.tags.find(t => t.label === 'Industry')?.value;
  const metaLine = [card.timeEstimate, typeTag, focusTag || industryTag].filter(Boolean).join(' • ');

  const stickyHeader = (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className={cn(
        "flex items-center justify-between gap-4",
        isMobile ? "px-4 py-3" : "px-8 py-4"
      )}>
        {/* Left: Title + Meta */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {isMobile && (
            <button
              onClick={handleClose}
              className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="min-w-0">
            <p className="text-xs text-primary font-medium uppercase tracking-wider">Exec Summary</p>
            <h1 className={cn(
              "font-semibold truncate",
              isMobile ? "text-base" : "text-lg"
            )}>
              {card.title}
            </h1>
            <p className="text-xs text-muted-foreground truncate">{metaLine}</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleListen}
            className="h-8 px-3"
          >
            <Headphones className="w-4 h-4 mr-1.5" />
            Listen Briefing
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className={cn("h-9 w-9", saved && "text-primary")}
            aria-label={saved ? "Remove from saved" : "Save for later"}
          >
            <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="h-9 w-9"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          {onOpenProjection && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenProjection}
              className="h-9 w-9"
              aria-label="Project"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-9 w-9"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const execContent = (
    <div 
      ref={contentRef}
      className={cn(
        "flex-1 overflow-y-auto",
        isMobile ? "px-5 py-6" : "px-8 py-8"
      )}
    >
      {/* Constrained content column for readability */}
      <div className="max-w-[680px] mx-auto space-y-8">
        
        {/* TL;DR */}
        {execSummary?.tldr && (
          <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              TL;DR
            </p>
            <p className={cn(
              "text-foreground font-medium leading-relaxed",
              isMobile ? "text-lg" : "text-xl"
            )} style={{ lineHeight: '1.6' }}>
              {execSummary.tldr}
            </p>
          </section>
        )}

        {/* What Changed */}
        {execSummary?.whatChanged && execSummary.whatChanged.length > 0 && (
          <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              What Changed
            </p>
            <ul className="space-y-3">
              {execSummary.whatChanged.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-2.5 flex-shrink-0" />
                  <span 
                    className={cn(
                      "text-foreground",
                      isMobile ? "text-base" : "text-[17px]"
                    )}
                    style={{ lineHeight: '1.65' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Why It Matters */}
        {execSummary?.whyItMatters && execSummary.whyItMatters.length > 0 && (
          <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Why It Matters
            </p>
            <ul className="space-y-3">
              {execSummary.whyItMatters.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                  <span 
                    className={cn(
                      "text-foreground",
                      isMobile ? "text-base" : "text-[17px]"
                    )}
                    style={{ lineHeight: '1.65' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Risks (optional) */}
        {execSummary?.risks && execSummary.risks.length > 0 && (
          <section className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <p className="text-xs font-semibold text-destructive uppercase tracking-wider">
                Risks
              </p>
            </div>
            <ul className="space-y-3">
              {execSummary.risks.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-destructive mt-2.5 flex-shrink-0" />
                  <span 
                    className={cn(
                      "text-foreground",
                      isMobile ? "text-base" : "text-[17px]"
                    )}
                    style={{ lineHeight: '1.65' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Next Best Actions */}
        {execSummary?.nextBestActions && execSummary.nextBestActions.length > 0 && (
          <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Next Best Actions
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyActions}
                className="h-8 px-3"
              >
                {copiedActions ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <ul className="space-y-4">
              {execSummary.nextBestActions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span 
                    className={cn(
                      "text-foreground",
                      isMobile ? "text-base" : "text-[17px]"
                    )}
                    style={{ lineHeight: '1.65' }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Questions to Ask */}
        {execSummary?.questionsToAsk && execSummary.questionsToAsk.length > 0 && (
          <section className="bg-secondary/30 border border-secondary rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Questions to Ask
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyQuestions}
                className="h-8 px-3"
              >
                {copiedQuestions ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <ul className="space-y-4">
              {execSummary.questionsToAsk.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-primary font-medium flex-shrink-0">Q{idx + 1}:</span>
                  <span 
                    className={cn(
                      "text-foreground italic",
                      isMobile ? "text-base" : "text-[17px]"
                    )}
                    style={{ lineHeight: '1.65' }}
                  >
                    "{item}"
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Sources (Collapsible) */}
        {execSummary?.sources && execSummary.sources.length > 0 && (
          <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors">
                <span className="text-sm font-medium text-muted-foreground">
                  Sources ({execSummary.sources.length})
                </span>
                {sourcesOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="mt-3 space-y-2 pl-4">
                {execSummary.sources.map((source, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    • {source.title}
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Metadata */}
        <section className="pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-2">
            {card.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-muted text-xs text-muted-foreground"
              >
                {tag.label}: {tag.value}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {card.lastUpdated}
          </p>
        </section>
      </div>
    </div>
  );

  // Mobile: Full screen view
  if (isMobile) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
      >
        {stickyHeader}
        {execContent}
      </div>
    );
  }

  // Desktop: Right side sheet
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className={cn(
          "p-0 overflow-hidden flex flex-col",
          "w-[50vw] min-w-[560px] max-w-[800px]"
        )}
        hideCloseButton
        onInteractOutside={() => handleClose()}
        onEscapeKeyDown={() => handleClose()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{card.title}</SheetTitle>
        </SheetHeader>
        {stickyHeader}
        {execContent}
      </SheetContent>
    </Sheet>
  );
}
