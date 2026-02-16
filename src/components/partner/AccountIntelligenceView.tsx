// Account Intelligence View — read-only tab in Partner execution section
// Renders structured sections from AccountIntelligenceVM

import { useMemo, useState } from 'react';
import {
  Building2,
  DollarSign,
  Server,
  Signal,
  Inbox,
  MessageSquare,
  FileText,
  Users,
  Target,
  Lightbulb,
  Award,
  ExternalLink,
  TrendingUp,
  ChevronDown,
  Newspaper,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReadinessPanel } from '@/components/partner/accountIntelligence/ReadinessPanel';
import { resolveAccountIntelligence } from '@/services/accountIntelligence';
import type { AccountIntelligenceVM } from '@/services/accountIntelligence';
import type { PartnerInvolvement } from '@/data/partner/partnerInvolvementStore';
import type { IndustryAuthorityTrendsPack } from '@/data/partner/industryAuthorityTrendsStore';
import type { IndustryNewsPack } from '@/data/partner/industryNewsStore';

interface AccountIntelligenceViewProps {
  focusId: string | null;
}

/* ─── Shared primitives ─── */

function SectionCard({ title, icon, children, className }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-4 space-y-3", className)}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function KVRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground min-w-[140px] flex-shrink-0">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function BulletList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <p className="text-sm text-muted-foreground/60">No data yet.</p>;
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-foreground flex items-start gap-2">
          <span className="text-muted-foreground/40 mt-1.5 flex-shrink-0">•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function PillarBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-medium border",
      active
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-muted/30 text-muted-foreground/50 border-border/40"
    )}>
      {label}
    </span>
  );
}

/* ─── Partner Involvement Card ─── */

function PartnerInvolvementCard({ data }: { data: PartnerInvolvement }) {
  return (
    <SectionCard title="Partner Involvement" icon={<Users className="w-3.5 h-3.5" />}>
      <div className="space-y-1.5">
        <KVRow label="MS Account Team" value={data.microsoft_account_team_known} />
        {data.active_partners && data.active_partners.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground min-w-[140px] flex-shrink-0">Active Partners</span>
            <div className="flex flex-wrap gap-1.5">
              {data.active_partners.map((p) => (
                <span key={p} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/5 text-primary border border-primary/10">{p}</span>
              ))}
            </div>
          </div>
        )}
        {data.competitor_partners && data.competitor_partners.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground min-w-[140px] flex-shrink-0">Competitor Partners</span>
            <div className="flex flex-wrap gap-1.5">
              {data.competitor_partners.map((p) => (
                <span key={p} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/40">{p}</span>
              ))}
            </div>
          </div>
        )}
        <KVRow label="Public Case Studies" value={data.public_case_studies} />
        {data.recent_partner_activity_count != null && (
          <KVRow label="Recent Activity" value={`${data.recent_partner_activity_count} engagements (12 mo)`} />
        )}
        {data.notes && <KVRow label="Notes" value={data.notes} />}
      </div>
    </SectionCard>
  );
}

/* ─── Industry Authority Trends Card ─── */

function IndustryAuthorityTrendsSection({ pack }: { pack: IndustryAuthorityTrendsPack }) {
  const [expanded, setExpanded] = useState(false);
  const COLLAPSED_LIMIT = 5;
  const hasMore = pack.trends.length > COLLAPSED_LIMIT;
  const visible = expanded ? pack.trends : pack.trends.slice(0, COLLAPSED_LIMIT);

  return (
    <SectionCard
      title={`Industry Authority Trends (${pack.trends.length})`}
      icon={<TrendingUp className="w-3.5 h-3.5" />}
    >
      <div className="space-y-2.5">
        {visible.map((t) => (
          <div key={t.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
            <div className="flex items-center gap-2">
              {t.source_url ? (
                <a href={t.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary flex-1 underline-offset-2 hover:underline">
                  {t.trend_title}
                </a>
              ) : (
                <p className="text-xs font-medium text-foreground flex-1">{t.trend_title}</p>
              )}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-medium border flex-shrink-0",
                t.confidence === 'High' ? 'bg-primary/10 text-primary border-primary/20' :
                t.confidence === 'Medium' ? 'bg-accent/60 text-accent-foreground border-accent/40' :
                'bg-muted/40 text-muted-foreground border-border/40'
              )}>
                {t.confidence}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/70">
              {t.source_org}{t.source_published_at ? ` · ${t.source_published_at}` : ''}
            </p>
            <p className="text-[11px] text-muted-foreground line-clamp-2">{t.thesis_summary}</p>
            <p className="text-[11px] text-muted-foreground/60 italic line-clamp-1">{t.applied_to_focus.why_it_matters}</p>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 pt-1"
        >
          {expanded ? 'Show less' : `View all (${pack.trends.length})`}
          <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </SectionCard>
  );
}

/* ─── Industry Pulse (Weekly News) Card ─── */

function IndustryPulseSection({ pack }: { pack: IndustryNewsPack }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border/60 bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 p-4 pb-2 text-left"
      >
        <Newspaper className="w-3.5 h-3.5 text-muted-foreground" />
        <div className="flex-1">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Industry Pulse — {pack.weekKey} ({pack.signals.length})
          </h3>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            Sector-level pulse. Not account-specific triggers.
          </p>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Signals */}
          <div className="space-y-2.5">
            {pack.signals.slice(0, 5).map((s) => (
              <div key={s.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-center gap-2">
                  {s.source_url ? (
                    <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary flex-1 underline-offset-2 hover:underline">
                      {s.title}
                    </a>
                  ) : (
                    <p className="text-xs font-medium text-foreground flex-1">{s.title}</p>
                  )}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-medium border flex-shrink-0",
                    s.category === 'regulation' ? 'bg-primary/10 text-primary border-primary/20' :
                    s.category === 'cybersecurity' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                    s.category === 'market' ? 'bg-accent/60 text-accent-foreground border-accent/40' :
                    'bg-muted/40 text-muted-foreground border-border/40'
                  )}>
                    {s.category}
                  </span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[9px] font-medium border flex-shrink-0",
                    s.confidence === 'High' ? 'bg-primary/10 text-primary border-primary/20' :
                    s.confidence === 'Medium' ? 'bg-muted/40 text-muted-foreground border-border/40' :
                    'bg-muted/30 text-muted-foreground/50 border-border/30'
                  )}>
                    {s.confidence}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground/70">
                  {s.source_org}{s.source_published_at ? ` · ${s.source_published_at}` : ''}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{s.summary}</p>
                <p className="text-[11px] text-muted-foreground/60 italic line-clamp-1">
                  Applied to account: {s.applied_to_focus.why_it_matters}
                </p>
              </div>
            ))}
          </div>

          {/* Big Paper of the Week */}
          {pack.big_paper_of_week && (
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Big Paper of the Week</p>
              </div>
              <div className="flex items-center gap-2">
                {pack.big_paper_of_week.source_url ? (
                  <a href={pack.big_paper_of_week.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary underline-offset-2 hover:underline flex-1">
                    {pack.big_paper_of_week.title}
                  </a>
                ) : (
                  <p className="text-xs font-medium text-foreground flex-1">{pack.big_paper_of_week.title}</p>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground/70">
                {pack.big_paper_of_week.source_org}{pack.big_paper_of_week.source_published_at ? ` · ${pack.big_paper_of_week.source_published_at}` : ''}
              </p>
              <ul className="space-y-0.5">
                {pack.big_paper_of_week.core_theses.slice(0, 3).map((t, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <span className="text-muted-foreground/40 mt-0.5 flex-shrink-0">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main View ─── */

export function AccountIntelligenceView({ focusId }: AccountIntelligenceViewProps) {
  const vm = useMemo<AccountIntelligenceVM | null>(() => {
    if (!focusId) return null;
    return resolveAccountIntelligence({ focusId, weekOf: '2026-02-10' });
  }, [focusId]);

  if (!focusId) {
    return (
      <div className="py-8 text-center">
        <Building2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Select an account to view intelligence.</p>
      </div>
    );
  }

  if (!vm) return null;

  const { snapshot, commercial, technical, partnerInvolvement, strategyPillars, publicInitiatives, proofArtifacts, industryAuthorityTrends, industryNews, signalHistory, inbox, requests, readiness } = vm;

  return (
    <div className="space-y-4">
      {/* Readiness Panel — top */}
      <ReadinessPanel readinessPercent={readiness.score} pillars={readiness.pillars} />

      {/* Snapshot */}
      <SectionCard title="Account Snapshot" icon={<Building2 className="w-3.5 h-3.5" />}>
        {snapshot ? (
          <div className="space-y-1.5">
            <KVRow label="Industry" value={snapshot.industry} />
            <KVRow label="Region" value={snapshot.region} />
            <KVRow label="Revenue" value={snapshot.revenue_band} />
            <KVRow label="Employees" value={snapshot.employee_band} />
            <KVRow label="Transformation" value={snapshot.transformation_stage} />
            <KVRow label="AI Maturity" value={snapshot.maturity_level} />
            <KVRow label="Primary Vendor" value={snapshot.primary_vendor_relationship} />
            <KVRow label="Competitive Pressure" value={snapshot.competitive_pressure_level} />
            {snapshot.strategic_priority_tags && snapshot.strategic_priority_tags.length > 0 && (
              <div className="flex items-start gap-2 text-sm pt-1">
                <span className="text-muted-foreground min-w-[140px] flex-shrink-0">Priorities</span>
                <div className="flex flex-wrap gap-1.5">
                  {snapshot.strategic_priority_tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/5 text-primary border border-primary/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/60">No snapshot data.</p>
        )}
      </SectionCard>

      {/* Two-column: Commercial + Technical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Commercial Footprint" icon={<DollarSign className="w-3.5 h-3.5" />}>
          {commercial ? (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Licenses</p>
                <BulletList items={commercial.existing_licenses} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Contract Dates</p>
                <BulletList items={commercial.contract_end_dates} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Renewal Windows</p>
                <BulletList items={commercial.renewal_windows} />
              </div>
              {commercial.estimated_spend_band && (
                <KVRow label="Est. Spend" value={commercial.estimated_spend_band} />
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">No commercial data.</p>
          )}
        </SectionCard>

        <SectionCard title="Technical Landscape" icon={<Server className="w-3.5 h-3.5" />}>
          {technical ? (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Vendors</p>
                <BulletList items={technical.known_vendors} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Applications</p>
                <BulletList items={technical.known_applications} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Architecture</p>
                <BulletList items={technical.architecture_patterns} />
              </div>
              {technical.cloud_strategy && (
                <KVRow label="Cloud Strategy" value={technical.cloud_strategy} />
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">No technical data.</p>
          )}
        </SectionCard>
      </div>

      {/* Partner Involvement */}
      {partnerInvolvement && <PartnerInvolvementCard data={partnerInvolvement} />}

      {/* Strategy Pillars */}
      <SectionCard title={`Strategy (${strategyPillars?.strategy_pillars.length ?? 0})`} icon={<Target className="w-3.5 h-3.5" />}>
        {strategyPillars && strategyPillars.strategy_pillars.length > 0 ? (
          <div className="space-y-2.5">
            {strategyPillars.strategy_pillars.map((sp) => (
              <div key={sp.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-foreground flex-1">{sp.title}</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary border border-primary/10 flex-shrink-0">
                    {sp.time_horizon}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{sp.summary}</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] text-muted-foreground/60">{sp.source_type.replace(/_/g, ' ')}</span>
                  <span className={cn("text-[10px]", sp.confidence_level === 'high' ? 'text-primary' : 'text-muted-foreground/60')}>
                    {sp.confidence_level}
                  </span>
                  {sp.source_url && (
                    <a href={sp.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-auto">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/60">No strategy data.</p>
        )}
      </SectionCard>

      {/* Public IT Initiatives */}
      <SectionCard title={`Public IT Initiatives (${publicInitiatives?.public_it_initiatives.length ?? 0})`} icon={<Lightbulb className="w-3.5 h-3.5" />}>
        {publicInitiatives && publicInitiatives.public_it_initiatives.length > 0 ? (
          <div className="space-y-2.5">
            {publicInitiatives.public_it_initiatives.map((init) => (
              <div key={init.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-start gap-2">
                  <p className="text-xs font-medium text-foreground flex-1">{init.title}</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary border border-primary/10 flex-shrink-0">
                    {init.estimated_magnitude}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{init.summary}</p>
                {init.business_objective && (
                  <p className="text-[11px] text-muted-foreground/70 italic line-clamp-1">{init.business_objective}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  <span className="text-[10px] text-muted-foreground/60">
                    Date: {init.announcement_date ?? init.source_published_at ?? 'Unknown'}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">{init.initiative_type.replace(/_/g, ' ')}</span>
                  {init.technology_domain.filter((d) => d !== 'other').map((d) => (
                    <span key={d} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/40 text-muted-foreground border border-border/40">
                      {d}
                    </span>
                  ))}
                  {init.geographic_scope !== 'unknown' && (
                    <span className="text-[10px] text-muted-foreground/60">{init.geographic_scope}</span>
                  )}
                  {init.source_url && (
                    <a href={init.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-auto">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/60">No public initiatives.</p>
        )}
      </SectionCard>

      {/* Proof / Success Artifacts */}
      <SectionCard title={`Proof / Success Stories (${proofArtifacts?.proof_artifacts.length ?? 0})`} icon={<Award className="w-3.5 h-3.5" />}>
        {proofArtifacts && proofArtifacts.proof_artifacts.length > 0 ? (
          <div className="space-y-2.5">
            {proofArtifacts.proof_artifacts.map((pa) => (
              <div key={pa.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-foreground flex-1">{pa.title}</p>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary border border-primary/10 flex-shrink-0">
                    {pa.artifact_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{pa.summary}</p>
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  {pa.capability_proven.filter((c) => c !== 'other').map((c) => (
                    <span key={c} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/40 text-muted-foreground border border-border/40">
                      {c.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {pa.year && <span className="text-[10px] text-muted-foreground/60">{pa.year}</span>}
                  <span className={cn("text-[10px]", pa.confidence_level === 'high' ? 'text-primary' : 'text-muted-foreground/60')}>
                    {pa.confidence_level}
                  </span>
                  {pa.source_url && (
                    <a href={pa.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-auto">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/60">No proof artifacts.</p>
        )}
      </SectionCard>

      {/* Industry Authority Trends */}
      {industryAuthorityTrends && industryAuthorityTrends.trends.length > 0 && (
        <IndustryAuthorityTrendsSection pack={industryAuthorityTrends} />
      )}

      {/* Industry Pulse (Weekly) — collapsed by default */}
      {industryNews && industryNews.signals.length > 0 && (
        <IndustryPulseSection pack={industryNews} />
      )}

      {/* Signal History */}
      <SectionCard title={`Signal History (${signalHistory.length})`} icon={<Signal className="w-3.5 h-3.5" />}>
        {signalHistory.length > 0 ? (
          <div className="space-y-2">
            {signalHistory.map((sig) => (
              <div key={sig.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border/40 bg-muted/10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary border border-primary/10">
                      {sig.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{sig.weekKey}</span>
                    {sig.impact_level && (
                      <span className="text-[10px] text-muted-foreground/60">{sig.impact_level}</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground">{sig.description}</p>
                  {sig.implication && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{sig.implication}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/60">No signals recorded.</p>
        )}
      </SectionCard>

      {/* Inbox + Requests side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title={`Account Inbox (${inbox.length})`} icon={<Inbox className="w-3.5 h-3.5" />}>
          {inbox.length > 0 ? (
            <div className="space-y-1.5">
              {inbox.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <FileText className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                  <span className="text-foreground truncate">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">{item.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">No items in inbox.</p>
          )}
        </SectionCard>

        <SectionCard title={`Content Requests (${requests.length})`} icon={<MessageSquare className="w-3.5 h-3.5" />}>
          {requests.length > 0 ? (
            <div className="space-y-1.5">
              {requests.map((req) => (
                <div key={req.request_id} className="flex items-center gap-2 text-sm">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-medium",
                    req.status === 'pending' ? "bg-yellow-500/10 text-yellow-600" :
                    req.status === 'answered' ? "bg-primary/10 text-primary" :
                    "bg-muted/30 text-muted-foreground"
                  )}>
                    {req.status}
                  </span>
                  <span className="text-foreground truncate">{req.question_text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">No requests.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
