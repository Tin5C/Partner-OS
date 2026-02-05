// Context Request Card (Partner-only)
// Lightweight "Missing context?" prompt that replaces the heavy Request Info Panel
// Two actions: "Ask colleague" (opens modal) + "Copy contribution link"

import { useState } from 'react';
import { Users, Link2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ContextRequestModal } from './ContextRequestModal';

interface ContextRequestCardProps {
  customerName: string;
  meetingContext?: string;
  colleagueNotes: string;
  onColleagueNotes: (notes: string) => void;
  /** Show "New context added" badge when colleague notes have been pasted */
  hasNewContext?: boolean;
}

export function ContextRequestCard({
  customerName,
  meetingContext,
  colleagueNotes,
  onColleagueNotes,
  hasNewContext,
}: ContextRequestCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    // MVP: generate a placeholder contribution link
    const link = `${window.location.origin}/partner/contribute?brief=${encodeURIComponent(customerName || 'new')}`;
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success('Contribution link copied');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <>
      <div className={cn(
        "rounded-xl border border-border bg-muted/10 p-4",
        "flex items-start gap-3"
      )}>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-foreground">Missing context?</h4>
            {hasNewContext && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                New context added
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Ask someone to drop quick notes or screenshots — takes ~2 minutes.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              Ask colleague
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
            linkCopied
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card text-foreground border-border hover:bg-secondary"
              )}
            >
              {linkCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5" />
                  Copy contribution link
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ContextRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customerName={customerName}
        meetingContext={meetingContext}
        colleagueNotes={colleagueNotes}
        onColleagueNotes={onColleagueNotes}
      />
    </>
  );
}
