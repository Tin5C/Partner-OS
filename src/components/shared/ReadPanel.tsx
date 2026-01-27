import { X, Copy, Check, Headphones } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PackContent } from '@/config/contentModel';

interface ReadPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: PackContent | null;
  onListenClick?: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-secondary transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-muted-foreground" />
      )}
    </button>
  );
}

export function ReadPanel({
  open,
  onOpenChange,
  title,
  content,
  onListenClick,
}: ReadPanelProps) {
  if (!content) return null;

  const { execSummary } = content;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold pr-8">{title}</DialogTitle>
            {onListenClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onListenClick}
                className="gap-2"
              >
                <Headphones className="w-4 h-4" />
                Listen
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8">
          {/* TL;DR */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              TL;DR
            </h3>
            <p className="text-lg text-foreground leading-relaxed">
              {execSummary.tldr}
            </p>
          </section>

          {/* What Changed */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              What Changed
            </h3>
            <ul className="space-y-2">
              {execSummary.whatChanged.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-foreground">
                  <span className="text-primary font-medium">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Why It Matters */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Why It Matters
            </h3>
            <ul className="space-y-2">
              {execSummary.whyItMatters.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-foreground">
                  <span className="text-primary font-medium">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Risks (optional) */}
          {execSummary.risks && execSummary.risks.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Risks
              </h3>
              <ul className="space-y-2">
                {execSummary.risks.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-foreground">
                    <span className="text-destructive font-medium">⚠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Next Best Actions */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Next Best Actions
              </h3>
              <CopyButton text={execSummary.nextBestActions.join('\n')} />
            </div>
            <ul className="space-y-2 bg-secondary/30 rounded-xl p-4">
              {execSummary.nextBestActions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-foreground">
                  <span className="text-primary font-semibold">{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Questions to Ask */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Questions to Ask
              </h3>
              <CopyButton text={execSummary.questionsToAsk.join('\n')} />
            </div>
            <ul className="space-y-2 bg-secondary/30 rounded-xl p-4">
              {execSummary.questionsToAsk.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-foreground">
                  <span className="text-primary font-semibold">Q{idx + 1}.</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Sources (optional) */}
          {execSummary.sources && execSummary.sources.length > 0 && (
            <section className="pt-4 border-t border-border">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Sources
              </h3>
              <div className="flex flex-wrap gap-2">
                {execSummary.sources.map((source, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-secondary rounded-full text-xs text-muted-foreground"
                  >
                    {source.title}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
