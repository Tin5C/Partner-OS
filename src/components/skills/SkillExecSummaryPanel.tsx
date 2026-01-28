// Skill of the Week Exec Summary Panel
import { useState } from 'react';
import { Copy, Check, BookOpen, Lightbulb, MessageSquare, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SkillContent } from '@/lib/skillOfWeekLogic';

interface SkillExecSummaryPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content?: SkillContent | null;
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

export function SkillExecSummaryPanel({
  open,
  onOpenChange,
  content: propContent,
  onListenClick,
}: SkillExecSummaryPanelProps) {
  // Use provided content or default mock content
  const content = propContent || {
    skillTitle: 'Active Listening',
    whyMattersThisWeek: [
      'Buyers are 60% through their journey before engaging sales — strong discovery closes that gap',
      'Your pipeline review highlighted qualification gaps in recent opportunities',
    ],
    tacticsToTry: [
      'Use the "3 Whys" technique — dig three levels deep on every pain point',
      'Ask about the cost of inaction: "What happens if you do nothing for 12 months?"',
      'Map the buying committee early: "Who else needs to be convinced?"',
    ],
    exampleScript: '"Help me understand — what prompted you to take this meeting now? What changed in the last 90 days that made this a priority?"',
    exercise: 'In your next discovery call, pause after each answer and ask "Tell me more about that" before moving to the next question.',
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Skill of the Week
              </p>
              <DialogTitle className="text-xl font-semibold pr-8">
                {content.skillTitle}
              </DialogTitle>
            </div>
            {onListenClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onListenClick}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Listen
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8">
          {/* Why This Matters This Week */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Why This Matters This Week
              </h3>
            </div>
            <ul className="space-y-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
              {content.whyMattersThisWeek.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-foreground">
                  <span className="text-amber-600 dark:text-amber-400 font-medium">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3 Tactics to Try */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  3 Tactics to Try
                </h3>
              </div>
              <CopyButton text={content.tacticsToTry.join('\n')} />
            </div>
            <ul className="space-y-3 bg-secondary/30 rounded-xl p-4">
              {content.tacticsToTry.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-foreground">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Example Script */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Example Script
              </h3>
              <CopyButton text={content.exampleScript} />
            </div>
            <div className="bg-secondary/30 rounded-xl p-4 border-l-4 border-primary">
              <p className="text-foreground italic">"{content.exampleScript}"</p>
            </div>
          </section>

          {/* Exercise */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Dumbbell className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                This Week's Exercise
              </h3>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
              <p className="text-foreground">{content.exercise}</p>
            </div>
          </section>

          {/* Footer note */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center italic">
              Derived from book summaries in our library
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
