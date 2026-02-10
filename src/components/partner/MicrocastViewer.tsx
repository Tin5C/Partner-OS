// Microcast Viewer — script-based "Now Playing" + read mode panel
// Opens from story card "Listen" CTA or Microcasts section tiles

import { useState } from 'react';
import { X, Headphones, BookOpen, CheckCircle2, FileText, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { MicrocastV1 } from '@/data/partner/contracts';

type ViewMode = 'play' | 'read';

interface MicrocastViewerProps {
  microcast: MicrocastV1 | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MicrocastViewer({ microcast, open, onOpenChange }: MicrocastViewerProps) {
  const [mode, setMode] = useState<ViewMode>('play');

  if (!microcast) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
        "sm:max-w-lg sm:max-h-[85vh] sm:rounded-2xl"
      )}>
        <DialogTitle className="sr-only">{microcast.title}</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Microcast</p>
              <p className="text-[11px] text-muted-foreground">{microcast.estMinutes} min · {microcast.microcastType === 'account' ? 'Account' : 'Industry'}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Mode toggle */}
        <div className="px-4 pt-3">
          <div className="inline-flex rounded-lg bg-muted/50 p-0.5 border border-border/60">
            <button
              onClick={() => setMode('play')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                mode === 'play'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Headphones className="w-3 h-3" />
              Play
            </button>
            <button
              onClick={() => setMode('read')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                mode === 'read'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen className="w-3 h-3" />
              Read
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Title */}
          <h2 className="text-lg font-semibold leading-tight text-foreground">{microcast.title}</h2>

          {microcast.isSimulated && (
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3" /> Demo artifact — simulated content
            </p>
          )}

          {/* Script or Read */}
          {mode === 'play' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5" /> Now Playing — Script
                </p>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {microcast.scriptText}
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {microcast.readText}
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Actions</p>
            <div className="space-y-2">
              {microcast.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-foreground">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Proof Artifacts */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Evidence
            </p>
            <div className="space-y-1.5">
              {microcast.proofArtifacts.map((proof, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-3 h-3 text-primary/60 mt-1 flex-shrink-0" />
                  <p className="text-foreground">{proof}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          {microcast.sources.length > 0 && (
            <div className="pt-2 border-t border-border/60">
              <p className="text-[11px] text-muted-foreground mb-1.5">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {microcast.sources.map((src, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground border border-border/40">
                    {src.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
