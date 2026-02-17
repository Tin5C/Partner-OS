// Account Intelligence View — scannable dashboard with progressive disclosure
// Collapsible sections, search/filter, consistent card layout, reference badges

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
  ArrowUpRight,
  Search,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ReadinessPanel } from '@/components/partner/accountIntelligence/ReadinessPanel';
import { resolveAccountIntelligence } from '@/services/accountIntelligence';
import type { AccountIntelligenceVM } from '@/services/accountIntelligence';
import type { PartnerInvolvement } from '@/data/partner/partnerInvolvementStore';
import type { IndustryAuthorityTrendsPack } from '@/data/partner/industryAuthorityTrendsStore';
import type { IndustryNewsPack } from '@/data/partner/industryNewsStore';
import {
  addItem,
  makeInboxItemId,
  deriveImpactArea,
} from '@/data/partner/dealPlanningInboxStore';

interface AccountIntelligenceViewProps {
  focusId: string | null;
}

/* ─── Confidence badge ─── */
function ConfidenceBadge({ level }: { level: string }) {
  return (
    <span className={cn(
      "px-1.5 py-0.5 rounded-full text-[9px] font-medium border flex-shrink-0",
      level === 'High' || level === 'high' ? 'bg-primary/10 text-primary border-primary/20' :
      level === 'Medium' || level === 'medium' ? 'bg-muted/40 text-muted-foreground border-border/40' :
      'bg-muted/30 text-muted-foreground/50 border-border/30'
    )}>
      {level}
    </span>
  );
}

/* ─── Origin module badge ─── */
function OriginBadge({ label }: { label: string }) {
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/30 text-muted-foreground/70 border border-border/30 flex-shrink-0">
      {label}
    </span>
  );
}

/* ─── Category badge ─── */
function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    regulation: 'bg-primary/10 text-primary border-primary/20',
    regulatory: 'bg-primary/10 text-primary border-primary/20',
    cybersecurity: 'bg-destructive/10 text-destructive border-destructive/20',
    market: 'bg-accent/60 text-accent-foreground border-accent/40',
    technology: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    vendor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    operations: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    internalActivity: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };
  return (
    <span className={cn(
      "px-1.5 py-0.5 rounded text-[9px] font-medium border flex-shrink-0",
      colors[category] ?? 'bg-muted/40 text-muted-foreground border-border/40'
    )}>
      {category}
    </span>
  );
}

/* ─── Tags row (max 3 + overflow) ─── */
function TagsRow({ tags }: { tags: string[] }) {
  if (!tags || tags.length === 0) return null;
  const visible = tags.slice(0, 3);
  const overflow = tags.length - 3;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {visible.map((t) => (
        <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/40 text-muted-foreground border border-border/40">
          {t.replace(/_/g, ' ')}
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-[9px] text-muted-foreground/50">+{overflow}</span>
      )}
    </div>
  );
}

/* ─── Collapsible Section ─── */
function CollapsibleSectionCard({
  title, icon, count, defaultOpen = false, sublabel, children, className,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  defaultOpen?: boolean;
  sublabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-1.5 p-4 text-left"
      >
        {icon}
        <div className="flex-1 min-w-0">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            {title}
            {count != null && (
              <span className="text-[10px] font-bold text-muted-foreground/50">({count})</span>
            )}
          </h3>
          {sublabel && (
            <p className="text-[10px] text-muted-foreground/50 mt-0.5">{sublabel}</p>
          )}
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Static Section (always open) ─── */
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

/* ─── "Use in Deal Plan" button helper ─── */
function UseDealPlanButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/40 hover:border-primary/20 transition-colors flex-shrink-0"
    >
      <ArrowUpRight className="w-3 h-3" />
      Deal Plan
    </button>
  );
}

/* ─── "View all / Show less" toggle ─── */
function ViewAllToggle({ expanded, total, limit, onToggle }: {
  expanded: boolean;
  total: number;
  limit: number;
  onToggle: () => void;
}) {
  if (total <= limit) return null;
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 pt-1"
    >
      {expanded ? 'Show less' : `View all (${total})`}
      <ChevronDown className={cn("w-3 h-3 transition-transform", expanded && "rotate-180")} />
    </button>
  );
}

/* ─── De-duplication hint ─── */
function dedupeHint(title: string, trendTitles: string[]): string | null {
  const keywords = ['AI Act', 'digital twin', 'data residency', 'machinery regulation', 'cyber', 'OT/IIoT', 'FinOps', 'governance'];
  const lower = title.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      const match = trendTitles.find((t) => t.toLowerCase().includes(kw.toLowerCase()));
      if (match) return 'Related authority trend available above';
    }
  }
  return null;
}

/* ─── Filter types ─── */
type CategoryFilter = 'all' | 'regulatory' | 'vendor' | 'account' | 'internalActivity' | 'market' | 'technology' | 'cybersecurity';
type TimeFilter = 'all' | 'this-week' | '12-24mo' | '5yr';

const CATEGORY_CHIPS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'regulatory', label: 'Regulatory' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'internalActivity', label: 'Internal' },
  { value: 'market', label: 'Market' },
  { value: 'technology', label: 'Technology' },
  { value: 'cybersecurity', label: 'Cyber' },
];

const TIME_CHIPS: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'this-week', label: 'This week' },
  { value: '12-24mo', label: '12–24 mo' },
  { value: '5yr', label: 'Last 5 years' },
];

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

/* ─── Main View ─── */

export function AccountIntelligenceView({ focusId }: AccountIntelligenceViewProps) {
  const vm = useMemo<AccountIntelligenceVM | null>(() => {
    if (!focusId) return null;
    return resolveAccountIntelligence({ focusId, weekOf: '2026-02-10' });
  }, [focusId]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  // Section-level "view all" toggles
  const [expandedLists, setExpandedLists] = useState<Record<string, boolean>>({});
  const toggleList = (key: string) => setExpandedLists((prev) => ({ ...prev, [key]: !prev[key] }));

  // Destructure VM (safe — may be null)
  const snapshot = vm?.snapshot ?? null;
  const commercial = vm?.commercial ?? null;
  const technical = vm?.technical ?? null;
  const partnerInvolvement = vm?.partnerInvolvement ?? null;
  const strategyPillars = vm?.strategyPillars ?? null;
  const publicInitiatives = vm?.publicInitiatives ?? null;
  const proofArtifacts = vm?.proofArtifacts ?? null;
  const industryAuthorityTrends = vm?.industryAuthorityTrends ?? null;
  const industryNews = vm?.industryNews ?? null;
  const signalHistory = vm?.signalHistory ?? [];
  const inbox = vm?.inbox ?? [];
  const requests = vm?.requests ?? [];
  const readiness = vm?.readiness ?? { score: 0, pillars: {} as any };

  // Search helper
  const q = searchQuery.toLowerCase().trim();
  const matchesSearch = (text: string) => !q || text.toLowerCase().includes(q);
  const matchesCategory = (cat: string) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'account') return cat === 'internalActivity' || cat === 'account';
    return cat.toLowerCase() === categoryFilter.toLowerCase();
  };

  // Trend titles for de-duplication hints
  const trendTitles = useMemo(
    () => industryAuthorityTrends?.trends.map((t) => t.trend_title) ?? [],
    [industryAuthorityTrends],
  );

  // --- Filtered data ---
  const filteredStrategy = useMemo(() => {
    if (!strategyPillars) return [];
    return strategyPillars.strategy_pillars.filter((sp) =>
      matchesSearch(sp.title + ' ' + sp.summary)
    );
  }, [strategyPillars, q]);

  const filteredInitiatives = useMemo(() => {
    if (!publicInitiatives) return [];
    return publicInitiatives.public_it_initiatives.filter((init) =>
      matchesSearch(init.title + ' ' + init.summary) &&
      (timeFilter === 'all' || timeFilter === '5yr')
    );
  }, [publicInitiatives, q, timeFilter]);

  const filteredProof = useMemo(() => {
    if (!proofArtifacts) return [];
    return proofArtifacts.proof_artifacts.filter((pa) =>
      matchesSearch(pa.title + ' ' + pa.summary)
    );
  }, [proofArtifacts, q]);

  const filteredTrends = useMemo(() => {
    if (!industryAuthorityTrends) return [];
    return industryAuthorityTrends.trends.filter((t) =>
      matchesSearch(t.trend_title + ' ' + t.thesis_summary) &&
      (timeFilter === 'all' || timeFilter === '12-24mo')
    );
  }, [industryAuthorityTrends, q, timeFilter]);

  const filteredPulseSignals = useMemo(() => {
    if (!industryNews) return [];
    return industryNews.signals.filter((s) =>
      matchesSearch(s.title + ' ' + s.summary) &&
      matchesCategory(s.category) &&
      (timeFilter === 'all' || timeFilter === 'this-week')
    );
  }, [industryNews, q, categoryFilter, timeFilter]);

  const filteredSignalHistory = useMemo(() => {
    return signalHistory.filter((sig) =>
      matchesSearch(sig.description + ' ' + (sig.implication ?? '')) &&
      matchesCategory(sig.category) &&
      (timeFilter === 'all' || timeFilter === 'this-week')
    );
  }, [signalHistory, q, categoryFilter, timeFilter]);

  // Early returns AFTER all hooks
  if (!focusId) {
    return (
      <div className="py-8 text-center">
        <Building2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Select an account to view intelligence.</p>
      </div>
    );
  }

  if (!vm) return null;

  // View limits
  const LIMITS = { strategy: 3, initiatives: 3, proof: 2, trends: 3, pulse: 3, signals: 3 };

  const sliced = (items: any[], key: string, limit: number) =>
    expandedLists[key] ? items : items.slice(0, limit);

  return (
    <div className="space-y-4">
      {/* Readiness Panel — top */}
      <ReadinessPanel readinessPercent={readiness.score} pillars={readiness.pillars} />

      {/* ─── Global Filters ─── */}
      <div className="rounded-xl border border-border/60 bg-card p-3 space-y-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-muted-foreground/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles & summaries…"
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs bg-background border border-border/60 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        {/* Category chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-wider mr-1">Category</span>
          {CATEGORY_CHIPS.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={cn(
                'px-2 py-1 rounded-full text-[10px] font-medium border transition-colors',
                categoryFilter === c.value
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-muted/20 text-muted-foreground border-border/40 hover:border-primary/20'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        {/* Time horizon chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-semibold text-muted-foreground/50 uppercase tracking-wider mr-1">Time</span>
          {TIME_CHIPS.map((c) => (
            <button
              key={c.value}
              onClick={() => setTimeFilter(c.value)}
              className={cn(
                'px-2 py-1 rounded-full text-[10px] font-medium border transition-colors',
                timeFilter === c.value
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-muted/20 text-muted-foreground border-border/40 hover:border-primary/20'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── This Week summary (collapsed, points to Quick Brief) ─── */}
      {signalHistory.length > 0 && (
        <CollapsibleSectionCard
          title="This Week"
          icon={<Zap className="w-3.5 h-3.5 text-primary" />}
          defaultOpen
          sublabel="Account-specific signals this week"
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            {signalHistory.length} signal{signalHistory.length !== 1 ? 's' : ''} detected this week across regulatory, vendor, and operational domains.
          </p>
          <ul className="space-y-0.5">
            {signalHistory.slice(0, 3).map((sig) => (
              <li key={sig.id} className="text-[11px] text-foreground flex items-start gap-1.5">
                <span className="text-primary/50 mt-0.5 flex-shrink-0">•</span>
                <span className="line-clamp-1">{sig.description}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground/60 italic">
            For full narrative and talk tracks → use Quick Brief above.
          </p>
        </CollapsibleSectionCard>
      )}

      {/* ─── Account Snapshot (always open) ─── */}
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

      {/* ─── Strategy (always open, capped at 3) ─── */}
      <SectionCard title={`Strategy (${filteredStrategy.length})`} icon={<Target className="w-3.5 h-3.5" />}>
        {filteredStrategy.length > 0 ? (
          <>
            <div className="space-y-2.5">
              {sliced(filteredStrategy, 'strategy', LIMITS.strategy).map((sp) => (
                <div key={sp.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium text-foreground flex-1">{sp.title}</p>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary border border-primary/10 flex-shrink-0">
                      {sp.time_horizon}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{sp.summary}</p>
                  <div className="flex items-center gap-2 pt-0.5">
                    <OriginBadge label="Strategy" />
                    <span className="text-[10px] text-muted-foreground/60">{sp.source_type.replace(/_/g, ' ')}</span>
                    <ConfidenceBadge level={sp.confidence_level} />
                    {sp.source_url && (
                      <a href={sp.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 ml-auto">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <ViewAllToggle
              expanded={!!expandedLists['strategy']}
              total={filteredStrategy.length}
              limit={LIMITS.strategy}
              onToggle={() => toggleList('strategy')}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground/60">No strategy data.</p>
        )}
      </SectionCard>

      {/* ─── Public IT Initiatives (collapsed) ─── */}
      {filteredInitiatives.length > 0 && (
        <CollapsibleSectionCard
          title="Public IT Initiatives"
          icon={<Lightbulb className="w-3.5 h-3.5 text-muted-foreground" />}
          count={filteredInitiatives.length}
          sublabel="Digitalization, security, and platform projects (5-year history)"
        >
          <div className="space-y-2.5">
            {sliced(filteredInitiatives, 'initiatives', LIMITS.initiatives).map((init) => (
              <div key={init.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-start gap-2">
                  {init.source_url ? (
                    <a href={init.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary flex-1 underline-offset-2 hover:underline">
                      {init.title}
                    </a>
                  ) : (
                    <p className="text-xs font-medium text-foreground flex-1">{init.title}</p>
                  )}
                  <UseDealPlanButton onClick={() => {
                    if (!focusId) return;
                    addItem(focusId, {
                      id: makeInboxItemId(focusId, 'initiative', init.id),
                      focusId,
                      source_type: 'initiative',
                      source_id: init.id,
                      title: init.title,
                      why_now: init.summary.slice(0, 160),
                      impact_area: deriveImpactArea(init.initiative_type),
                      tags: init.technology_domain.filter((d) => d !== 'other'),
                      created_at: new Date().toISOString(),
                    });
                    toast.success('Added to Deal Planning Inbox');
                  }} />
                </div>
                <p className="text-[11px] text-muted-foreground/70">
                  {init.announcement_date ?? init.source_published_at ?? 'Unknown'} · {init.initiative_type.replace(/_/g, ' ')}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{init.summary}</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <OriginBadge label="Public initiative" />
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary border border-primary/10">
                    {init.estimated_magnitude}
                  </span>
                  <TagsRow tags={init.technology_domain.filter((d) => d !== 'other')} />
                </div>
              </div>
            ))}
          </div>
          <ViewAllToggle
            expanded={!!expandedLists['initiatives']}
            total={filteredInitiatives.length}
            limit={LIMITS.initiatives}
            onToggle={() => toggleList('initiatives')}
          />
        </CollapsibleSectionCard>
      )}

      {/* ─── Proof / Success Stories (collapsed) ─── */}
      {filteredProof.length > 0 && (
        <CollapsibleSectionCard
          title="Proof / Success Stories"
          icon={<Award className="w-3.5 h-3.5 text-muted-foreground" />}
          count={filteredProof.length}
        >
          <div className="space-y-2.5">
            {sliced(filteredProof, 'proof', LIMITS.proof).map((pa) => (
              <div key={pa.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-start gap-2">
                  {pa.source_url ? (
                    <a href={pa.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary flex-1 underline-offset-2 hover:underline">
                      {pa.title}
                    </a>
                  ) : (
                    <p className="text-xs font-medium text-foreground flex-1">{pa.title}</p>
                  )}
                  {pa.source_url && (
                    <a href={pa.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 flex-shrink-0">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground/70">
                  {pa.year ?? ''} · {pa.artifact_type.replace(/_/g, ' ')}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{pa.summary}</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <OriginBadge label="Proof" />
                  <ConfidenceBadge level={pa.confidence_level} />
                  <TagsRow tags={pa.capability_proven.filter((c) => c !== 'other')} />
                </div>
              </div>
            ))}
          </div>
          <ViewAllToggle
            expanded={!!expandedLists['proof']}
            total={filteredProof.length}
            limit={LIMITS.proof}
            onToggle={() => toggleList('proof')}
          />
        </CollapsibleSectionCard>
      )}

      {/* ─── Industry Authority Trends (collapsed) ─── */}
      {filteredTrends.length > 0 && (
        <CollapsibleSectionCard
          title="Industry Authority Trends"
          icon={<TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />}
          count={filteredTrends.length}
          sublabel="Analyst and regulatory trends (12–24 month horizon)"
        >
          <div className="space-y-2.5">
            {sliced(filteredTrends, 'trends', LIMITS.trends).map((t) => (
              <div key={t.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-start gap-2">
                  {t.source_url ? (
                    <a href={t.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary flex-1 underline-offset-2 hover:underline">
                      {t.trend_title}
                    </a>
                  ) : (
                    <p className="text-xs font-medium text-foreground flex-1">{t.trend_title}</p>
                  )}
                  <UseDealPlanButton onClick={() => {
                    if (!focusId) return;
                    addItem(focusId, {
                      id: makeInboxItemId(focusId, 'trend', t.id),
                      focusId,
                      source_type: 'trend',
                      source_id: t.id,
                      title: t.trend_title,
                      why_now: t.thesis_summary.slice(0, 160),
                      impact_area: deriveImpactArea(t.applied_to_focus?.why_it_matters ?? 'other'),
                      tags: [t.confidence],
                      created_at: new Date().toISOString(),
                    });
                    toast.success('Added to Deal Planning Inbox');
                  }} />
                </div>
                <p className="text-[11px] text-muted-foreground/70">
                  {t.source_org}{t.source_published_at ? ` · ${t.source_published_at}` : ''}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{t.thesis_summary}</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <OriginBadge label="Authority trend" />
                  <ConfidenceBadge level={t.confidence} />
                </div>
                {t.applied_to_focus?.why_it_matters && (
                  <p className="text-[11px] text-muted-foreground/60 italic line-clamp-1">{t.applied_to_focus.why_it_matters}</p>
                )}
              </div>
            ))}
          </div>
          <ViewAllToggle
            expanded={!!expandedLists['trends']}
            total={filteredTrends.length}
            limit={LIMITS.trends}
            onToggle={() => toggleList('trends')}
          />
        </CollapsibleSectionCard>
      )}

      {/* ─── Industry Pulse (collapsed) ─── */}
      {filteredPulseSignals.length > 0 && industryNews && (
        <CollapsibleSectionCard
          title={`Industry Pulse — ${industryNews.weekKey}`}
          icon={<Newspaper className="w-3.5 h-3.5 text-muted-foreground" />}
          count={filteredPulseSignals.length}
          sublabel="Sector-level pulse. Not account-specific triggers."
        >
          <div className="space-y-2.5">
            {sliced(filteredPulseSignals, 'pulse', LIMITS.pulse).map((s) => (
              <div key={s.id} className="p-2.5 rounded-lg border border-border/40 bg-muted/10 space-y-1">
                <div className="flex items-start gap-2">
                  {s.source_url ? (
                    <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary flex-1 underline-offset-2 hover:underline">
                      {s.title}
                    </a>
                  ) : (
                    <p className="text-xs font-medium text-foreground flex-1">{s.title}</p>
                  )}
                  {s.source_url && (
                    <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 flex-shrink-0">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground/70">
                  {s.source_org}{s.source_published_at ? ` · ${s.source_published_at}` : ''}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{s.summary}</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <OriginBadge label="Weekly signal" />
                  <CategoryBadge category={s.category} />
                  <ConfidenceBadge level={s.confidence} />
                </div>
                <p className="text-[11px] text-muted-foreground/60 italic line-clamp-1">
                  Applied to account: {s.applied_to_focus.why_it_matters}
                </p>
              </div>
            ))}
          </div>
          <ViewAllToggle
            expanded={!!expandedLists['pulse']}
            total={filteredPulseSignals.length}
            limit={LIMITS.pulse}
            onToggle={() => toggleList('pulse')}
          />

          {/* Big Paper of the Week */}
          {industryNews.big_paper_of_week && (
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">Big Paper of the Week</p>
              </div>
              <div className="flex items-center gap-2">
                {industryNews.big_paper_of_week.source_url ? (
                  <a href={industryNews.big_paper_of_week.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary underline-offset-2 hover:underline flex-1">
                    {industryNews.big_paper_of_week.title}
                  </a>
                ) : (
                  <p className="text-xs font-medium text-foreground flex-1">{industryNews.big_paper_of_week.title}</p>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground/70">
                {industryNews.big_paper_of_week.source_org}{industryNews.big_paper_of_week.source_published_at ? ` · ${industryNews.big_paper_of_week.source_published_at}` : ''}
              </p>
              <ul className="space-y-0.5">
                {industryNews.big_paper_of_week.core_theses.slice(0, 3).map((t, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                    <span className="text-muted-foreground/40 mt-0.5 flex-shrink-0">•</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CollapsibleSectionCard>
      )}

      {/* ─── Signal History (collapsed) ─── */}
      <CollapsibleSectionCard
        title="Signal History"
        icon={<Signal className="w-3.5 h-3.5 text-muted-foreground" />}
        count={filteredSignalHistory.length}
        sublabel="Weekly account-specific signals"
      >
        {filteredSignalHistory.length > 0 ? (
          <>
            <div className="space-y-2">
              {sliced(filteredSignalHistory, 'signals', LIMITS.signals).map((sig) => {
                const hint = dedupeHint(sig.description, trendTitles);
                return (
                  <div key={sig.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border/40 bg-muted/10">
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-medium text-foreground">{sig.description}</p>
                      {sig.implication && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{sig.implication}</p>
                      )}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <OriginBadge label="Weekly signal" />
                        <CategoryBadge category={sig.category} />
                        <span className="text-[10px] text-muted-foreground/50">{sig.weekKey}</span>
                        {sig.impact_level && (
                          <span className="text-[10px] text-muted-foreground/60">{sig.impact_level}</span>
                        )}
                      </div>
                      {hint && (
                        <p className="text-[10px] text-primary/60 italic flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5" />
                          {hint}
                        </p>
                      )}
                    </div>
                    <UseDealPlanButton onClick={() => {
                      if (!focusId) return;
                      addItem(focusId, {
                        id: makeInboxItemId(focusId, 'signal', sig.id),
                        focusId,
                        source_type: 'signal',
                        source_id: sig.id,
                        title: sig.description,
                        why_now: (sig.implication ?? sig.description).slice(0, 160),
                        impact_area: deriveImpactArea(sig.category),
                        tags: [sig.category],
                        created_at: new Date().toISOString(),
                      });
                      toast.success('Added to Deal Planning Inbox');
                    }} />
                  </div>
                );
              })}
            </div>
            <ViewAllToggle
              expanded={!!expandedLists['signals']}
              total={filteredSignalHistory.length}
              limit={LIMITS.signals}
              onToggle={() => toggleList('signals')}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground/60">No signals match current filters.</p>
        )}
      </CollapsibleSectionCard>

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
