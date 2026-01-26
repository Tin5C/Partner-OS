import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Headphones, Bookmark, Share2, Copy, Check, ChevronLeft } from 'lucide-react';
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

interface ReadDrawerProps {
  card: FocusCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Store scroll positions per card ID
const scrollPositions = new Map<string, number>();

export function ReadDrawer({ card, open, onOpenChange }: ReadDrawerProps) {
  const isMobile = useIsMobile();
  const { play } = usePlayer();
  const [mode, setMode] = useState<'read' | 'listen'>('read');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
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

  const handleListen = () => {
    if (episode) {
      play(episode);
    }
    setMode('listen');
  };

  const handleCopySuggestedMove = () => {
    if (card.suggestedMove) {
      navigator.clipboard.writeText(card.suggestedMove);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    // In a real app, this would save to user's collection
  };

  const handleShare = async () => {
    const shareData = {
      title: card.title,
      text: card.insightLine || card.subtitle,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Extract type from tags
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
          {/* Read/Listen Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setMode('read')}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                mode === 'read' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Read
            </button>
            <button
              onClick={handleListen}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                mode === 'listen' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Listen
            </button>
          </div>

          {/* Action buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleListen}
            className="h-9 w-9"
            aria-label="Listen to audio"
          >
            <Headphones className="w-4 h-4" />
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

  const readContent = (
    <div 
      ref={contentRef}
      className={cn(
        "flex-1 overflow-y-auto",
        isMobile ? "px-5 py-6" : "px-8 py-8"
      )}
    >
      {/* Constrained content column for readability */}
      <div className="max-w-[680px] mx-auto space-y-8">
        {/* TL;DR - Why it matters */}
        {card.insightLine && (
          <section>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              TL;DR
            </p>
            <p className={cn(
              "text-foreground leading-relaxed",
              isMobile ? "text-base" : "text-lg"
            )} style={{ lineHeight: '1.7' }}>
              {card.insightLine}
            </p>
          </section>
        )}

        {/* Key Signals */}
        <section>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Key Signals
          </p>
          <ul className="space-y-3">
            {card.previewBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span 
                  className={cn(
                    "text-foreground",
                    isMobile ? "text-base" : "text-[17px]"
                  )}
                  style={{ lineHeight: '1.65' }}
                >
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Suggested Move */}
        {card.suggestedMove && (
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Suggested Move
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-5 h-5 rounded border-2 border-primary/40 flex-shrink-0 mt-0.5" />
                  <p 
                    className={cn(
                      "text-foreground",
                      isMobile ? "text-base" : "text-[17px]"
                    )}
                    style={{ lineHeight: '1.65' }}
                  >
                    {card.suggestedMove}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySuggestedMove}
                  className="h-8 px-3 flex-shrink-0"
                >
                  {copied ? (
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
            </div>
          </section>
        )}

        {/* Themes (was "Listen for") */}
        {card.listenFor && card.listenFor.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Themes
            </p>
            <div className="flex flex-wrap gap-2">
              {card.listenFor.map((term, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-tag text-tag-foreground text-sm font-medium"
                >
                  {term}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Additional Context */}
        <section className="pt-4 border-t border-border/50">
          <p 
            className="text-muted-foreground italic"
            style={{ fontSize: isMobile ? '14px' : '15px', lineHeight: '1.6' }}
          >
            {card.footer}
          </p>
          
          {/* Metadata Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
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
        aria-labelledby="read-drawer-title"
      >
        <span id="read-drawer-title" className="sr-only">{card.title}</span>
        {stickyHeader}
        {readContent}
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
          "w-[45vw] min-w-[520px] max-w-[720px]"
        )}
        hideCloseButton
        onInteractOutside={() => handleClose()}
        onEscapeKeyDown={() => handleClose()}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{card.title}</SheetTitle>
        </SheetHeader>
        {stickyHeader}
        {readContent}
      </SheetContent>
    </Sheet>
  );
}
