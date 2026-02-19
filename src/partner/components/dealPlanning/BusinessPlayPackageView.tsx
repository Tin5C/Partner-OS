// BusinessPlayPackageView — renders materialized Business Composer output
// Partner-only. Read-only display. No mutations.

import type { BusinessPlayPackage, BusinessVariant } from '@/data/partner/businessPlayPackageStore';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';
import {
  Target,
  Route,
  Lightbulb,
  MessageSquare,
  DollarSign,
  Package,
  GraduationCap,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  pkg: BusinessPlayPackage;
  availableVariants: BusinessVariant[];
  activeVariant: BusinessVariant;
  onVariantChange: (v: BusinessVariant) => void;
}

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

export function BusinessPlayPackageView({ pkg, availableVariants, activeVariant, onVariantChange }: Props) {
  const b = pkg.business;

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

      {/* Deal Strategy */}
      <CollapsibleSection title="Deal Strategy" subtitle="What, How, Why" defaultOpen>
        <div className="space-y-2.5">
          <SectionCard>
            <Label>What</Label>
            <Body>{b.deal_strategy.what}</Body>
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
            <Body>{b.deal_strategy.why}</Body>
          </SectionCard>
        </div>
      </CollapsibleSection>

      {/* Positioning */}
      <CollapsibleSection title="Positioning" subtitle="Executive POV and stakeholder talk tracks" defaultOpen>
        <div className="space-y-2.5">
          <SectionCard>
            <Label>Executive Point of View</Label>
            <Body>{b.positioning.executive_pov}</Body>
          </SectionCard>
          <div className="space-y-1.5">
            <Label>Talk Tracks</Label>
            {b.positioning.talk_tracks.map((tt, i) => (
              <SectionCard key={i}>
                <p className="text-[10px] font-semibold text-foreground">{tt.persona}</p>
                <Body>{tt.message}</Body>
              </SectionCard>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* Commercial Assets */}
      <CollapsibleSection title="Commercial Assets" subtitle="ROI prompts, value hypotheses, KPIs, sizing inputs" defaultOpen={false}>
        <div className="space-y-3">
          {/* ROI Prompts */}
          <div className="space-y-1.5">
            <Label>ROI Prompts</Label>
            {b.commercial_assets.roi_prompts.map((r, i) => (
              <SectionCard key={i}>
                <p className="text-[10px] font-semibold text-foreground">{r.label}</p>
                <Body>{r.question}</Body>
              </SectionCard>
            ))}
          </div>
          {/* Value Hypotheses */}
          <div className="space-y-1.5">
            <Label>Value Hypotheses</Label>
            {b.commercial_assets.value_hypotheses.map((v, i) => (
              <SectionCard key={i}>
                <p className="text-[10px] font-semibold text-foreground">{v.label}</p>
                <Body>{v.description}</Body>
              </SectionCard>
            ))}
          </div>
          {/* KPIs */}
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
          {/* Sizing Inputs */}
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

      {/* Delivery Assets */}
      <CollapsibleSection title="Delivery Assets" subtitle="Discovery agenda, workshop plan, pilot scope" defaultOpen={false}>
        <div className="space-y-3">
          {/* Discovery Agenda */}
          <div className="space-y-1.5">
            <Label>Discovery Agenda</Label>
            {b.delivery_assets.discovery_agenda.map((d, i) => (
              <SectionCard key={i} className="p-2.5">
                <p className="text-[10px] font-semibold text-foreground">{d.theme}</p>
                <Body>{d.question}</Body>
              </SectionCard>
            ))}
          </div>
          {/* Workshop Plan */}
          <div className="space-y-1.5">
            <Label>Workshop Plan</Label>
            {b.delivery_assets.workshop_plan.map((w, i) => (
              <SectionCard key={i} className="p-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-bold text-primary/60 mt-0.5 flex-shrink-0">{i + 1}.</span>
                  <div>
                    <p className="text-[10px] font-semibold text-foreground">{w.step}</p>
                    <Body>{w.description}</Body>
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>
          {/* Pilot Scope */}
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

      {/* Enablement */}
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

      {/* Open Questions */}
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
    </div>
  );
}
