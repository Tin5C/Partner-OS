// Trending Pack Viewer
// Exec-summary style panel for viewing trending pack content

import { X, TrendingUp, AlertCircle, Target, Lightbulb, ArrowRight, Tag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { TrendingPack } from '@/data/partnerTrendingPacks';
import { cn } from '@/lib/utils';

interface TrendingPackViewerProps {
  pack: TrendingPack | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlay?: () => void;
}

function SectionBlock({ 
  icon: Icon, 
  title, 
  children,
  variant = 'default'
}: { 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'muted';
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={cn(
          "w-4 h-4",
          variant === 'accent' ? 'text-primary' : 'text-muted-foreground'
        )} />
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export function TrendingPackViewer({ pack, open, onOpenChange, onPlay }: TrendingPackViewerProps) {
  if (!pack) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg p-0 flex flex-col"
      >
        <SheetHeader className="px-5 py-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <SheetTitle className="text-lg font-semibold text-left">
                  {pack.title}
                </SheetTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {pack.estimatedTime} read
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {pack.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Why this is trending */}
          <SectionBlock icon={TrendingUp} title="Why this is trending" variant="accent">
            <ul className="space-y-2">
              {pack.content.whyTrending.map((item, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </SectionBlock>

          {/* What buyers are worried about */}
          <SectionBlock icon={AlertCircle} title="What buyers are worried about">
            <div className="space-y-2">
              {pack.content.buyerWorries.map((item, idx) => (
                <div 
                  key={idx} 
                  className="text-sm italic bg-muted/50 p-3 rounded-lg border-l-2 border-muted-foreground/30"
                >
                  {item}
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* How partners should position */}
          <SectionBlock icon={Target} title="How partners should position" variant="accent">
            <ul className="space-y-2">
              {pack.content.partnerPositioning.map((item, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-primary flex-shrink-0">→</span>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </SectionBlock>

          {/* Relevant Microsoft services */}
          <SectionBlock icon={Tag} title="Relevant Microsoft services">
            <div className="flex flex-wrap gap-2">
              {pack.content.relevantServices.map((service) => (
                <span
                  key={service}
                  className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium"
                >
                  {service}
                </span>
              ))}
            </div>
          </SectionBlock>

          {/* Next best actions */}
          <SectionBlock icon={Lightbulb} title="Next best actions" variant="accent">
            <ul className="space-y-2">
              {pack.content.nextBestActions.map((item, idx) => (
                <li 
                  key={idx} 
                  className="flex items-start gap-2 text-sm p-3 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </SectionBlock>
        </div>

        {/* Footer actions */}
        {pack.hasAudio && onPlay && (
          <div className="px-5 py-4 border-t border-border">
            <Button 
              className="w-full"
              onClick={onPlay}
            >
              Listen to this briefing
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
