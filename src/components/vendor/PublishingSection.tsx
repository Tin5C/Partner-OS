// Publishing Section — Vendor Space
// Tabbed view for managing enablement atoms: Draft → Approved → Deprecated

import { useState } from 'react';
import { FileText, CheckCircle2, Archive, Send, Eye, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useVendorData } from '@/contexts/VendorDataContext';
import { ATOM_TYPE_LABELS, type GovernanceStatus } from '@/data/vendor/contracts';

const TABS: { status: GovernanceStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'draft', label: 'Draft', icon: <FileText className="w-3.5 h-3.5" /> },
  { status: 'approved', label: 'Approved', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  { status: 'deprecated', label: 'Deprecated', icon: <Archive className="w-3.5 h-3.5" /> },
];

export function PublishingSection() {
  const { provider } = useVendorData();
  const [activeTab, setActiveTab] = useState<GovernanceStatus>('approved');

  const atoms = provider.listAtoms({ status: activeTab });
  const targets = provider.listPublishingTargets();

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Publishing"
        subtitle="Manage enablement content — draft, approve, and publish to partners."
      />

      {/* Tabs */}
      <div className="flex gap-1 p-0.5 bg-muted/50 rounded-lg border border-border/60 w-fit">
        {TABS.map((tab) => {
          const count = provider.listAtoms({ status: tab.status }).length;
          return (
            <button
              key={tab.status}
              onClick={() => setActiveTab(tab.status)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                activeTab === tab.status
                  ? "bg-card text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.icon}
              {tab.label}
              <span className="ml-1 text-[10px] bg-muted rounded-full px-1.5 py-0.5">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Atom Cards */}
      <div className="space-y-3">
        {atoms.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No {activeTab} content.
          </div>
        ) : (
          atoms.map((atom) => {
            const atomTargets = targets.filter(t => t.atomId === atom.id);
            return (
              <div
                key={atom.id}
                className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                        {ATOM_TYPE_LABELS[atom.atomType]}
                      </span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-md font-medium",
                        atom.governance.status === 'approved'
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : atom.governance.status === 'draft'
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {atom.governance.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{atom.title}</p>
                  </div>
                </div>

                {/* Governance metadata */}
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Reviewed: {new Date(atom.governance.lastReviewedAt).toLocaleDateString()}
                  </span>
                  <span>by {atom.governance.reviewedBy}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {atom.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground border border-border/40">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Publishing targets */}
                {atomTargets.length > 0 && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <Send className="w-3 h-3 text-emerald-600" />
                    <span className="text-muted-foreground">Published to:</span>
                    {atomTargets.map(t => (
                      <span key={t.id} className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-[10px] font-medium">
                        {t.targetSegment}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-muted/50 transition-colors">
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                  {atom.governance.status === 'approved' && (
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                      <Send className="w-3 h-3" />
                      Publish
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
