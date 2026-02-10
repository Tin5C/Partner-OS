// Partner Briefing Presets Section — Vendor Space
// Preview what partners will see from published content

import { Headphones, BookOpen, Eye, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useVendorData } from '@/contexts/VendorDataContext';
import { ATOM_TYPE_LABELS } from '@/data/vendor/contracts';

export function PartnerBriefingPresetsSection() {
  const { provider } = useVendorData();
  const targets = provider.listPublishingTargets();
  const publishedTargets = targets.filter(t => t.publishedAt);

  // Get atom details for each published target
  const presets = publishedTargets.map(target => {
    const atom = provider.getAtom(target.atomId);
    return { target, atom };
  }).filter(p => p.atom);

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Partner Briefing Presets"
        subtitle="Preview what partners will see from your published content."
      />

      {presets.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No published briefings yet. Approve and publish content first.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presets.map(({ target, atom }) => (
            <div
              key={target.id}
              className={cn(
                "rounded-xl border bg-card p-4 space-y-3",
                "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
                "border-border hover:border-primary/30 transition-colors"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-primary">
                    {ATOM_TYPE_LABELS[atom!.atomType]}
                  </span>
                  <p className="text-sm font-semibold text-foreground line-clamp-2">{atom!.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{target.targetSegment}</span>
                <span>·</span>
                <span>Published {new Date(target.publishedAt!).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <button className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                  "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                )}>
                  <Headphones className="w-3 h-3" />
                  Preview Audio
                </button>
                <button className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                  "border border-border text-foreground hover:bg-muted/50 transition-colors"
                )}>
                  <BookOpen className="w-3 h-3" />
                  Preview Read
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
