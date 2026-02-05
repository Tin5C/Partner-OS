// Brief Bucket Input (Partner-only)
// Reusable input tile for template-driven checklist buckets
// Each bucket supports: notes, evidence, "Ask colleague" shortcut

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Upload,
  Link2,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BriefTemplateBucket } from '@/data/briefTemplates';

interface BriefBucketInputProps {
  bucket: BriefTemplateBucket;
  notes: string;
  onNotesChange: (notes: string) => void;
  hasEvidence?: boolean;
  onAskColleague?: (tag: string) => void;
  /** Compact collapsed state */
  defaultOpen?: boolean;
}

export function BriefBucketInput({
  bucket,
  notes,
  onNotesChange,
  hasEvidence = false,
  onAskColleague,
  defaultOpen = false,
}: BriefBucketInputProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasFill = notes.trim().length > 0 || hasEvidence;

  return (
    <div
      className={cn(
        'rounded-lg border transition-all',
        hasFill
          ? 'border-primary/30 bg-primary/5'
          : 'border-border bg-card'
      )}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        {/* Status indicator */}
        {hasFill ? (
          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
        ) : (
          <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{bucket.label}</p>
          {!isOpen && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {hasFill
                ? notes.slice(0, 60) + (notes.length > 60 ? '…' : '')
                : bucket.description}
            </p>
          )}
        </div>

        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expanded content */}
      {isOpen && (
        <div className="px-3 pb-3 space-y-2">
          <p className="text-xs text-muted-foreground">{bucket.description}</p>

          {/* Notes input */}
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder={bucket.placeholder}
            rows={2}
            className={cn(
              'w-full rounded-md text-sm resize-none',
              'bg-background border border-border px-3 py-2',
              'placeholder:text-muted-foreground/50',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30'
            )}
          />

          {/* Actions row */}
          <div className="flex items-center gap-2">
            {onAskColleague && (
              <button
                type="button"
                onClick={() => onAskColleague(bucket.askColleagueTag)}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs',
                  'text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors'
                )}
              >
                <Users className="w-3 h-3" />
                Ask colleague
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
