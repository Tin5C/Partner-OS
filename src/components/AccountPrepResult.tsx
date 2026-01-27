import { useState } from 'react';
import { Headphones, FileText, Loader2, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AccountPrepData } from './AccountPrepWizard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AccountPrepResultProps {
  data: AccountPrepData;
  onClose: () => void;
  onNewPrep: () => void;
}

export function AccountPrepResult({
  data,
  onClose,
  onNewPrep,
}: AccountPrepResultProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [execSummaryOpen, setExecSummaryOpen] = useState(false);

  // Simulate generation completing after delay
  useState(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Account Prep — {data.account}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your meeting prep pack is being generated
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Selected chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
          {data.intent}
        </span>
        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
          {data.goal}
        </span>
        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
          {data.outcome}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <Button
          disabled={isGenerating}
          className={cn(
            'flex-1 gap-2',
            isGenerating && 'opacity-70'
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating… (~3–5 min)</span>
            </>
          ) : (
            <>
              <Headphones className="w-4 h-4" />
              <span>Listen Briefing</span>
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={() => setExecSummaryOpen(true)}
        >
          <FileText className="w-4 h-4" />
          <span>Exec Summary</span>
        </Button>
      </div>

      {/* New prep button */}
      <div className="mt-4 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onNewPrep}
          className="gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Create new prep
        </Button>
      </div>

      {/* Exec Summary Modal */}
      <Dialog open={execSummaryOpen} onOpenChange={setExecSummaryOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exec Summary — {data.account}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* TL;DR */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                TL;DR
              </h4>
              <p className="text-foreground">
                Prep pack for {data.intent.toLowerCase()} focused on {data.goal.toLowerCase()}. 
                Primary outcome: {data.outcome.toLowerCase()}.
              </p>
            </div>

            {/* Context */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Meeting Context
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Intent: {data.intent}
                </span>
                <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  Goal: {data.goal}
                </span>
                <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                  Outcome: {data.outcome}
                </span>
              </div>
            </div>

            {/* Placeholder sections */}
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Key Talking Points
              </h4>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Opening: Frame the conversation around their priorities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Discovery questions tailored to {data.goal.toLowerCase()}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Value proposition aligned with {data.outcome.toLowerCase()}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Questions to Ask
              </h4>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  What's your current approach to [relevant topic]?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  How do you measure success for [goal area]?
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  What would need to be true to move forward?
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Potential Objections
              </h4>
              <ul className="space-y-2 text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  "We're already working with [competitor]" — Acknowledge and explore gaps
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  "Not the right time" — Uncover the real blocker
                </li>
              </ul>
            </div>

            {data.context?.worry && (
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Your Concern
                </h4>
                <p className="text-foreground bg-secondary/50 p-3 rounded-lg">
                  {data.context.worry}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
