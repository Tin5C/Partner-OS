// BusinessPlayPackageView — renders materialized Business Composer output
// Partner-only. Read-only display. No mutations.
// Progressive disclosure: compact summary, one primary section expanded, sources modal.

import { useState } from 'react';
import type { BusinessPlayPackage, BusinessVariant } from '@/data/partner/businessPlayPackageStore';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  pkg: BusinessPlayPackage;
  availableVariants: BusinessVariant[];
  activeVariant: BusinessVariant;
  onVariantChange: (v: BusinessVariant) => void;
}

/* ── Shared micro-components (local to this file) ── */

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-3 rounded-lg bg-muted/20 border border-border/40 space-y-2', className)}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{children}</p>;
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>;
}

/** Truncate text to ~charLimit and add ellipsis */
function truncate(text: string, charLimit = 120): string {
  if (text.length <= charLimit) return text;
  return text.slice(0, charLimit).trimEnd() + '…';
}

/** Show more / Show less toggle for long content blocks */
function ExpandableBody({ text, charLimit = 140 }: { text: string; charLimit?: number }) {
  const [showAll, setShowAll] = useState(false);
  const needsTruncation = text.length > charLimit;

  return (
    <div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {showAll || !needsTruncation ? text : truncate(text, charLimit)}
      </p>
      {needsTruncation && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-1 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-0.5"
        >
          {showAll ? (
            <>Show less <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Show more <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}
    </div>
  );
}

/** Preview snippet shown beneath collapsed section headers */
function SectionPreview({ text }: { text: string }) {
  return (
    <p className="text-[11px] text-muted-foreground/70 leading-snug mt-1 line-clamp-2 italic">
      {truncate(text, 160)}
    </p>
  );
}

/** Sources modal overlay — compact citation list */
function SourcesModal({ ids, onClose }: { ids: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-background border border-border rounded-xl shadow-lg w-full max-w-sm mx-4 p-4 space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Signal Sources</h3>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-1.5 max-h-48 overflow-y-auto">
          {ids.map((id) => (
            <li
              key={id}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/30 border border-border/40"
            >
              <FileText className="w-3 h-3 text-primary/50 flex-shrink-0" />
              <span className="text-[11px] font-mono text-muted-foreground">{id}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Main View ── */

export function BusinessPlayPackageView({ pkg, availableVariants, activeVariant, onVariantChange }: Props) {
  const b = pkg.business;
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const citationCount = b.signal_citation_ids?.length ?? 0;

  return (
    <div className="space-y-3">
      {/* Variant toggle */}
      {availableVariants.length > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">View</span>
          <div className="inline-flex rounded-md bg-muted/50 p-0.5 border border-border/60">
            {availableVariants.map((v) => (
              <button
                key={v}
                onClick={() => onVariantChange(v)}
                className={cn(
                  'px-3 py-1 rounded text-[11px] font-medium transition-all capitalize',
                  activeVariant === v
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Compact Summary Block ── */}
      <div className="p-3 rounded-xl bg-primary/[0.03] border border-primary/10 space-y-1.5">
        <p className="text-xs font-semibold text-foreground leading-tight">
          {truncate(b.deal_strategy.what, 180)}
        </p>
        <p className="text-[11px] text-muted-foreground leading-snug">
          {truncate(b.deal_strategy.why, 140)}
        </p>
        {citationCount > 0 && (
          <button
            type="button"
            onClick={() => setSourcesOpen(true)}
            className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-muted/40 border border-border/50 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="w-3 h-3" />
            Sources ({citationCount})
          </button>
        )}
      </div>

      {/* Deal Strategy — expanded by default */}
      <CollapsibleSection title="Deal Strategy" subtitle="What, How, Why" defaultOpen>
        <div className="space-y-2.5">
          <SectionCard>
            <Label>What</Label>
            <ExpandableBody text={b.deal_strategy.what} />
          </SectionCard>
          <SectionCard>
            <Label>How</Label>
            <ol className="space-y-1.5 pl-0.5">
              {b.deal_strategy.how.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="text-[10px] font-bold text-primary/60 mt-0.5 flex-shrink-0">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </SectionCard>
          <SectionCard>
            <Label>Why</Label>
            <ExpandableBody text={b.deal_strategy.why} />
          </SectionCard>
        </div>
      </CollapsibleSection>

      {/* Positioning — collapsed by default with preview */}
      <CollapsibleSection title="Positioning" subtitle="Executive POV and stakeholder talk tracks" defaultOpen={false}>
        <div className="space-y-2.5">
          <SectionCard>
            <Label>Executive Point of View</Label>
            <ExpandableBody text={b.positioning.executive_pov} />
          </SectionCard>
          <div className="space-y-1.5">
            <Label>Talk Tracks</Label>
            {b.positioning.talk_tracks.map((tt, i) => (
              <SectionCard key={i}>
                <p className="text-[10px] font-semibold text-foreground">{tt.persona}</p>
                <ExpandableBody text={tt.message} />
              </SectionCard>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Commercial Assets — collapsed */}
      <CollapsibleSection title="Commercial Assets" subtitle="ROI prompts, value hypotheses, KPIs, sizing inputs" defaultOpen={false}>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>ROI Prompts</Label>
            {b.commercial_assets.roi_prompts.map((r, i) => (
              <SectionCard key={i}>
                <p className="text-[10px] font-semibold text-foreground">{r.label}</p>
                <ExpandableBody text={r.question} />
              </SectionCard>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label>Value Hypotheses</Label>
            {b.commercial_assets.value_hypotheses.map((v, i) => (
              <SectionCard key={i}>
                <p className="text-[10px] font-semibold text-foreground">{v.label}</p>
                <ExpandableBody text={v.description} />
              </SectionCard>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label>KPIs</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {b.commercial_assets.kpis.map((k, i) => (
                <SectionCard key={i} className="p-2.5">
                  <p className="text-[10px] font-semibold text-foreground">{k.label}</p>
                  <p className="text-[11px] text-primary font-medium">{k.target}</p>
                </SectionCard>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Sizing Inputs</Label>
            {b.commercial_assets.sizing_inputs.map((s, i) => (
              <SectionCard key={i} className="p-2.5">
                <p className="text-[10px] font-semibold text-foreground">{s.label}</p>
                <Body>{s.value}</Body>
              </SectionCard>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Delivery Assets — collapsed */}
      <CollapsibleSection title="Delivery Assets" subtitle="Discovery agenda, workshop plan, pilot scope" defaultOpen={false}>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Discovery Agenda</Label>
            {b.delivery_assets.discovery_agenda.map((d, i) => (
              <SectionCard key={i} className="p-2.5">
                <p className="text-[10px] font-semibold text-foreground">{d.theme}</p>
                <ExpandableBody text={d.question} />
              </SectionCard>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label>Workshop Plan</Label>
            {b.delivery_assets.workshop_plan.map((w, i) => (
              <SectionCard key={i} className="p-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-bold text-primary/60 mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <div>
                    <p className="text-[10px] font-semibold text-foreground">{w.step}</p>
                    <ExpandableBody text={w.description} />
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Pilot Scope</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <SectionCard>
                <p className="text-[10px] font-semibold text-foreground">In Scope</p>
                <ul className="space-y-1">
                  {b.delivery_assets.pilot_scope.in_scope.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </SectionCard>
              <SectionCard>
                <p className="text-[10px] font-semibold text-foreground">Out of Scope</p>
                <ul className="space-y-1">
                  {b.delivery_assets.pilot_scope.out_of_scope.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-destructive/40 mt-0.5 flex-shrink-0 text-[10px]">-</span> {s}
                    </li>
                  ))}
                </ul>
              </SectionCard>
              <SectionCard>
                <p className="text-[10px] font-semibold text-foreground">Deliverables</p>
                <ul className="space-y-1">
                  {b.delivery_assets.pilot_scope.deliverables.map((d, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {d}
                    </li>
                  ))}
                </ul>
              </SectionCard>
              <SectionCard>
                <p className="text-[10px] font-semibold text-foreground">Stakeholders</p>
                <ul className="space-y-1">
                  {b.delivery_assets.pilot_scope.stakeholders.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Enablement — collapsed */}
      <CollapsibleSection title="Enablement" subtitle="Seller and engineer preparation" defaultOpen={false}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <SectionCard>
            <Label>Seller</Label>
            <ul className="space-y-1.5">
              {b.enablement.seller.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                  <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard>
            <Label>Engineer</Label>
            <ul className="space-y-1.5">
              {b.enablement.engineer.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-1.5">
                  <ChevronRight className="w-3 h-3 text-primary/40 mt-0.5 flex-shrink-0" /> {s}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </CollapsibleSection>

      {/* Open Questions — collapsed */}
      <CollapsibleSection title="Open Questions" subtitle="Items to validate before advancing" defaultOpen={false}>
        <ul className="space-y-1.5">
          {b.open_questions.map((q, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
              <HelpCircle className="w-3 h-3 text-muted-foreground/50 mt-0.5 flex-shrink-0" />
              {q}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Sources modal */}
      {sourcesOpen && b.signal_citation_ids && b.signal_citation_ids.length > 0 && (
        <SourcesModal ids={b.signal_citation_ids} onClose={() => setSourcesOpen(false)} />
      )}
    </div>
  );
}
