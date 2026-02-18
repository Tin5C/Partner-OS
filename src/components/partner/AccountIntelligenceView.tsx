// Account Intelligence View — Notion-style research document layout
// Collapsible accordion sections (one open at a time), sticky header, mini-nav, auto-scroll filtering
// AI Lens toggle filters display only; no store mutations.

import { useMemo, useState, useCallback, useRef } from 'react';
import {
  Building2,
  DollarSign,
  Server,
  FileText,
  Users,
  Target,
  TrendingUp,
  ChevronDown,
  ArrowUpRight,
  Zap,
  Brain,
  Shield,
  Layers,
  ShoppingCart,
  MessageSquare,
  ChevronRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { resolveAccountIntelligence } from '@/services/accountIntelligence';
import type { AccountIntelligenceVM } from '@/services/accountIntelligence';
import {
  addItem,
  makeInboxItemId,
  deriveImpactArea,
} from '@/data/partner/dealPlanningInboxStore';

interface AccountIntelligenceViewProps {
  focusId: string | null;
  onGoToDealPlanning?: () => void;
}

/* ─── Shared small helpers ─── */

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

function OriginBadge({ label }: { label: string }) {
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/30 text-muted-foreground/70 border border-border/30 flex-shrink-0">
      {label}
    </span>
  );
}

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

function TagsRow({ tags, max = 2 }: { tags: string[]; max?: number }) {
  if (!tags || tags.length === 0) return null;
  const visible = tags.slice(0, max);
  const overflow = tags.length - max;
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

function KVRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground min-w-[130px] flex-shrink-0 text-xs">{label}</span>
      <span className="text-foreground text-xs">{value}</span>
    </div>
  );
}

function UseDealPlanButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-border/40 hover:border-primary/20 transition-colors flex-shrink-0"
    >
      <ArrowUpRight className="w-3 h-3" />
      Deal Plan
    </button>
  );
}

/* ─── Readiness compact bar ─── */

function getStateLabel(pct: number): string {
  if (pct >= 80) return 'Deal-ready';
  if (pct >= 60) return 'Strong';
  if (pct >= 40) return 'Developing';
  if (pct >= 20) return 'Early';
  return 'Not ready';
}

function ReadinessCompact({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full bg-muted/40 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground tabular-nums">{score}%</span>
      <span className="text-[10px] text-muted-foreground/60">{getStateLabel(score)}</span>
    </div>
  );
}

/* ─── Section IDs for navigation ─── */

const SECTIONS = [
  { id: 'ai-exec-summary', label: 'Executive' },
  { id: 'ai-signals', label: 'This Week' },
  { id: 'ai-initiatives', label: 'Initiatives' },
  { id: 'ai-trends', label: 'Trends' },
  { id: 'ai-commercial', label: 'Commercial' },
  { id: 'ai-technical', label: 'Technical' },
  { id: 'ai-evidence', label: 'Evidence' },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

/* ─── Accordion Section (one-open-at-a-time) ─── */

function DocSection({
  id,
  title,
  icon,
  count,
  badge,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  count?: number;
  badge?: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section id={id}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 py-3 px-1 text-left border-b border-border/40 hover:bg-muted/20 transition-colors group"
      >
        <span className="text-muted-foreground/60">{icon}</span>
        <h2 className="flex-1 text-sm font-semibold text-foreground tracking-tight">
          {title}
          {count != null && (
            <span className="ml-1.5 text-xs font-normal text-muted-foreground/50">({count})</span>
          )}
        </h2>
        {badge}
        <ChevronDown className={cn(
          "w-4 h-4 text-muted-foreground/50 transition-transform duration-200 flex-shrink-0",
          isOpen && "rotate-180"
        )} />
      </button>
      <div className={cn(
        "grid transition-all duration-200 ease-in-out",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      )}>
        <div className="overflow-hidden">
          <div className="py-4 space-y-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

/* ─── Signal quick filter tabs ─── */

type SignalQuickFilter = 'all' | 'ai' | 'regulatory' | 'commercial' | 'technical';

const SIGNAL_FILTERS: { value: SignalQuickFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ai', label: 'AI' },
  { value: 'regulatory', label: 'Regulatory' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'technical', label: 'Technical' },
];

/* ─── Commercial sub-tabs ─── */

type CommercialTab = 'licenses' | 'contracts' | 'renewals' | 'spend';

/* ─── Technical sub-tabs ─── */

type TechTab = 'vendors' | 'applications' | 'architecture';

/* ─── Evidence categories ─── */

type EvidenceCategory = 'security' | 'technical' | 'business' | 'procurement';

const EVIDENCE_CATEGORIES: { value: EvidenceCategory; label: string; icon: React.ReactNode }[] = [
  { value: 'security', label: 'Security & Compliance', icon: <Shield className="w-3 h-3" /> },
  { value: 'technical', label: 'Technical Readiness', icon: <Server className="w-3 h-3" /> },
  { value: 'business', label: 'Business Value', icon: <DollarSign className="w-3 h-3" /> },
  { value: 'procurement', label: 'Procurement', icon: <ShoppingCart className="w-3 h-3" /> },
];

/* ─── AI Lens keyword matching ─── */

const AI_KEYWORDS = ['ai', 'copilot', 'machine learning', 'ml', 'llm', 'generative', 'gpt', 'openai', 'azure ai', 'cognitive', 'neural', 'deep learning', 'rag', 'agent'];

function matchesAILens(text: string): boolean {
  const lower = text.toLowerCase();
  return AI_KEYWORDS.some((kw) => lower.includes(kw));
}

/* ─── De-duplication hint ─── */

function dedupeHint(title: string, trendTitles: string[]): string | null {
  const keywords = ['AI Act', 'digital twin', 'data residency', 'machinery regulation', 'cyber', 'OT/IIoT', 'FinOps', 'governance'];
  const lower = title.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw.toLowerCase())) {
      const match = trendTitles.find((t) => t.toLowerCase().includes(kw.toLowerCase()));
      if (match) return 'Related authority trend available in Trends';
    }
  }
  return null;
}

/* ─── Expandable Row (for Initiatives + Trends) ─── */

function ExpandableRow({
  title,
  preview,
  tags,
  isExpanded,
  onToggle,
  children,
  dealPlanAction,
}: {
  title: string;
  preview?: string;
  tags: string[];
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  dealPlanAction?: React.ReactNode;
}) {
  return (
    <div className={cn(
      "rounded-md border border-border/30 transition-colors",
      isExpanded ? "bg-muted/10" : "hover:bg-muted/5"
    )}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
      >
        <ChevronRight className={cn(
          "w-3 h-3 text-muted-foreground/40 transition-transform duration-150 flex-shrink-0",
          isExpanded && "rotate-90"
        )} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">{title}</p>
          {!isExpanded && preview && (
            <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5">{preview}</p>
          )}
        </div>
        {!isExpanded && <TagsRow tags={tags} max={2} />}
        {isExpanded && dealPlanAction}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 space-y-2 border-t border-border/20 mx-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Main View ─── */

export function AccountIntelligenceView({ focusId, onGoToDealPlanning }: AccountIntelligenceViewProps) {
  const vm = useMemo<AccountIntelligenceVM | null>(() => {
    if (!focusId) return null;
    return resolveAccountIntelligence({ focusId, weekOf: '2026-02-10' });
  }, [focusId]);

  const [openSection, setOpenSection] = useState<SectionId | ''>('ai-exec-summary');
  const [signalFilter, setSignalFilter] = useState<SignalQuickFilter>('all');
  const [commercialTab, setCommercialTab] = useState<CommercialTab>('licenses');
  const [techTab, setTechTab] = useState<TechTab>('vendors');
  const [expandedEvidence, setExpandedEvidence] = useState<EvidenceCategory | null>(null);
  const [aiLens, setAiLens] = useState(false);
  const [expandedInitiative, setExpandedInitiative] = useState<string | null>(null);
  const [expandedTrend, setExpandedTrend] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSection = useCallback((id: SectionId) => {
    setOpenSection((prev) => {
      const next = prev === id ? '' : id;
      if (next) {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
      return next;
    });
  }, []);

  // Destructure VM
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

  const trendTitles = useMemo(
    () => industryAuthorityTrends?.trends.map((t) => t.trend_title) ?? [],
    [industryAuthorityTrends],
  );

  // Filter signals by quick filter
  const filteredSignals = useMemo(() => {
    let list = signalHistory;
    if (signalFilter !== 'all') {
      list = list.filter((s) => {
        const cat = (s.category ?? '').toLowerCase();
        if (signalFilter === 'ai') return cat.includes('technology') || cat.includes('vendor') || cat.includes('ai');
        if (signalFilter === 'regulatory') return cat.includes('regulat') || cat.includes('cyber');
        if (signalFilter === 'commercial') return cat.includes('market') || cat.includes('commercial');
        if (signalFilter === 'technical') return cat.includes('technology') || cat.includes('operations');
        return true;
      });
    }
    if (aiLens) {
      list = list.filter((s) => matchesAILens(s.description) || matchesAILens(s.implication ?? '') || matchesAILens(s.category ?? ''));
    }
    return list;
  }, [signalHistory, signalFilter, aiLens]);

  // AI Lens filtered initiatives
  const filteredInitiatives = useMemo(() => {
    const all = publicInitiatives?.public_it_initiatives ?? [];
    if (!aiLens) return all;
    return all.filter((i) => matchesAILens(i.title) || matchesAILens(i.summary) || i.technology_domain.some((d) => matchesAILens(d)));
  }, [publicInitiatives, aiLens]);

  // AI Lens filtered trends
  const filteredTrends = useMemo(() => {
    const all = industryAuthorityTrends?.trends ?? [];
    if (!aiLens) return all;
    return all.filter((t) => matchesAILens(t.trend_title) || matchesAILens(t.thesis_summary) || matchesAILens(t.applied_to_focus?.why_it_matters ?? ''));
  }, [industryAuthorityTrends, aiLens]);

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

  const accountName = focusId.charAt(0).toUpperCase() + focusId.slice(1);
  const evidenceCount = inbox.length + requests.length;

  return (
    <div ref={containerRef} className="space-y-0">
      {/* ─── STICKY HEADER ─── */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border/40 -mx-1 px-1 pb-3 pt-1 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <h1 className="text-base font-bold text-foreground truncate">{accountName}</h1>
            <ReadinessCompact score={readiness.score} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* AI Lens toggle */}
            <button
              onClick={() => setAiLens((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-colors",
                aiLens
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "text-muted-foreground/60 border-border/40 hover:border-border/60 hover:text-muted-foreground"
              )}
            >
              <Sparkles className="w-3 h-3" />
              AI Lens
            </button>
            {onGoToDealPlanning && (
              <button
                onClick={onGoToDealPlanning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 bg-background hover:border-primary/30 hover:text-primary transition-colors"
              >
                <Brain className="w-3 h-3" />
                Open Deal Planning
              </button>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSection(s.id)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors whitespace-nowrap",
                openSection === s.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/30"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── SECTIONS ─── */}
      <div className="divide-y divide-border/30">

        {/* SECTION 1: Executive Summary */}
        <DocSection
          id="ai-exec-summary"
          title="Executive Summary"
          icon={<Target className="w-3.5 h-3.5" />}
          isOpen={openSection === 'ai-exec-summary'}
          onToggle={() => toggleSection('ai-exec-summary')}
        >
          {snapshot ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <KVRow label="Industry" value={snapshot.industry} />
                <KVRow label="AI Maturity" value={snapshot.maturity_level} />
                <KVRow label="Primary Vendor" value={snapshot.primary_vendor_relationship} />
                <KVRow label="Competitive Pressure" value={snapshot.competitive_pressure_level} />
                <KVRow label="Est. Spend" value={commercial?.estimated_spend_band} />
                <KVRow label="Transformation" value={snapshot.transformation_stage} />
              </div>

              {/* Top 3 priorities */}
              {snapshot.strategic_priority_tags && snapshot.strategic_priority_tags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Top Priorities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {snapshot.strategic_priority_tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-primary/5 text-primary border border-primary/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Renewal window */}
              {commercial?.renewal_windows && commercial.renewal_windows.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Renewal Windows</p>
                  <div className="flex flex-wrap gap-1.5">
                    {commercial.renewal_windows.map((w, i) => (
                      <span key={i} className="text-xs text-muted-foreground">{w}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Why this account matters */}
              <div className="rounded-lg bg-muted/20 border border-border/30 p-3 space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Why This Account Matters</p>
                <p className="text-xs text-foreground leading-relaxed">
                  {snapshot.primary_vendor_relationship ? `Strong ${snapshot.primary_vendor_relationship} relationship` : 'Active vendor engagement'} combined with {snapshot.maturity_level?.toLowerCase() ?? 'emerging'} AI maturity creates a natural engagement window. {snapshot.competitive_pressure_level === 'High' ? 'High competitive pressure means timing is critical.' : 'Stable competitive landscape allows for deliberate positioning.'}{' '}
                  {strategyPillars && strategyPillars.strategy_pillars.length > 0 ? `Strategic focus on ${strategyPillars.strategy_pillars[0].title.toLowerCase()} aligns with partner capabilities.` : ''}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/60">No account snapshot data.</p>
          )}
        </DocSection>

        {/* SECTION 2: This Week Signals */}
        <DocSection
          id="ai-signals"
          title="This Week Signals"
          icon={<Zap className="w-3.5 h-3.5" />}
          count={signalHistory.length}
          isOpen={openSection === 'ai-signals'}
          onToggle={() => toggleSection('ai-signals')}
        >
          {/* Quick filter tabs */}
          <div className="flex items-center gap-1 mb-3">
            {SIGNAL_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setSignalFilter(f.value)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors",
                  signalFilter === f.value
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground/60 hover:text-muted-foreground border border-transparent hover:border-border/40"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredSignals.length > 0 ? (
            <div className="space-y-2">
              {filteredSignals.map((sig) => {
                const hint = dedupeHint(sig.description, trendTitles);
                return (
                  <div key={sig.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/10 border border-border/30">
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-medium text-foreground">{sig.description}</p>
                      {sig.implication && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{sig.implication}</p>
                      )}
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <OriginBadge label="Weekly signal" />
                        <CategoryBadge category={sig.category} />
                        {sig.impact_level && <ConfidenceBadge level={sig.impact_level} />}
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
          ) : (
            <p className="text-xs text-muted-foreground/60">
              {aiLens ? 'No AI-related signals this week.' : 'No signals match current filter.'}
            </p>
          )}

          {/* Industry News compact */}
          {industryNews && industryNews.signals.length > 0 && !aiLens && (
            <div className="mt-4 pt-3 border-t border-border/30 space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Industry News ({industryNews.signals.length})
              </p>
              <p className="text-[10px] text-muted-foreground/50">Sector-level news. Not account-specific triggers.</p>
              {industryNews.signals.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-start gap-2 p-2 rounded-lg bg-muted/10 border border-border/30">
                  <div className="flex-1 min-w-0">
                    {s.source_url ? (
                      <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary underline-offset-2 hover:underline">
                        {s.title}
                      </a>
                    ) : (
                      <p className="text-xs font-medium text-foreground">{s.title}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{s.summary}</p>
                  </div>
                  <CategoryBadge category={s.category} />
                </div>
              ))}
            </div>
          )}
        </DocSection>

        {/* SECTION 3: Initiatives (compact expandable rows) */}
        <DocSection
          id="ai-initiatives"
          title="Public IT Initiatives"
          icon={<BookOpen className="w-3.5 h-3.5" />}
          count={filteredInitiatives.length}
          isOpen={openSection === 'ai-initiatives'}
          onToggle={() => toggleSection('ai-initiatives')}
        >
          {/* Strategy pillars summary */}
          {strategyPillars && strategyPillars.strategy_pillars.length > 0 && (
            <div className="space-y-1.5 mb-3 pb-3 border-b border-border/30">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Strategic Themes</p>
              <div className="flex flex-wrap gap-1.5">
                {strategyPillars.strategy_pillars.map((sp) => (
                  <span key={sp.id} className="px-2 py-1 rounded-md text-[10px] font-medium bg-muted/20 text-foreground border border-border/30">
                    {sp.title}
                    <span className="ml-1 text-muted-foreground/50">· {sp.time_horizon}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {filteredInitiatives.length > 0 ? (
            <div className="space-y-1">
              {filteredInitiatives.map((init) => (
                <ExpandableRow
                  key={init.id}
                  title={init.title}
                  preview={init.summary.slice(0, 100)}
                  tags={init.technology_domain.filter((d) => d !== 'other')}
                  isExpanded={expandedInitiative === init.id}
                  onToggle={() => setExpandedInitiative((prev) => prev === init.id ? null : init.id)}
                  dealPlanAction={
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
                  }
                >
                  <div className="pt-2 space-y-2">
                    <p className="text-[10px] text-muted-foreground/70">
                      {init.announcement_date ?? init.source_published_at ?? 'Unknown'} · {init.initiative_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-[11px] text-foreground leading-relaxed">{init.summary}</p>
                    <div className="flex items-center gap-1.5">
                      <OriginBadge label="Public initiative" />
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary border border-primary/10">
                        {init.estimated_magnitude}
                      </span>
                      <TagsRow tags={init.technology_domain.filter((d) => d !== 'other')} max={5} />
                    </div>
                  </div>
                </ExpandableRow>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/60">
              {aiLens ? 'No AI-related initiatives.' : 'No public initiatives data.'}
            </p>
          )}

          {/* Proof / Success Stories */}
          {proofArtifacts && proofArtifacts.proof_artifacts.length > 0 && !aiLens && (
            <div className="space-y-2 pt-3 border-t border-border/30">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Proof / Success Stories ({proofArtifacts.proof_artifacts.length})
              </p>
              {proofArtifacts.proof_artifacts.map((pa) => (
                <div key={pa.id} className="p-2.5 rounded-lg bg-muted/10 border border-border/30 space-y-1">
                  <div className="flex items-start gap-2">
                    {pa.source_url ? (
                      <a href={pa.source_url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-foreground hover:text-primary flex-1 underline-offset-2 hover:underline">
                        {pa.title}
                      </a>
                    ) : (
                      <p className="text-xs font-medium text-foreground flex-1">{pa.title}</p>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{pa.summary}</p>
                  <div className="flex items-center gap-1.5">
                    <OriginBadge label="Proof" />
                    <ConfidenceBadge level={pa.confidence_level} />
                    <TagsRow tags={pa.capability_proven.filter((c) => c !== 'other')} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </DocSection>

        {/* SECTION 4: Authority Trends (compact expandable rows) */}
        <DocSection
          id="ai-trends"
          title="Authority-Backed Trends"
          icon={<TrendingUp className="w-3.5 h-3.5" />}
          count={filteredTrends.length}
          badge={<span className="text-[9px] text-muted-foreground/50 mr-1">12-24 mo horizon</span>}
          isOpen={openSection === 'ai-trends'}
          onToggle={() => toggleSection('ai-trends')}
        >
          {filteredTrends.length > 0 ? (
            <div className="space-y-1">
              {filteredTrends.map((t) => (
                <ExpandableRow
                  key={t.id}
                  title={t.trend_title}
                  preview={t.applied_to_focus?.why_it_matters ?? t.thesis_summary.slice(0, 100)}
                  tags={[t.confidence, t.source_org]}
                  isExpanded={expandedTrend === t.id}
                  onToggle={() => setExpandedTrend((prev) => prev === t.id ? null : t.id)}
                  dealPlanAction={
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
                  }
                >
                  <div className="pt-2 space-y-2">
                    <p className="text-[10px] text-muted-foreground/70">{t.source_org}{t.source_published_at ? ` · ${t.source_published_at}` : ''}</p>
                    <p className="text-[11px] text-foreground leading-relaxed">{t.thesis_summary}</p>
                    <div className="flex items-center gap-1.5">
                      <OriginBadge label="Authority trend" />
                      <ConfidenceBadge level={t.confidence} />
                    </div>
                    {t.applied_to_focus && (
                      <div className="rounded-md bg-muted/20 border border-border/20 p-2 space-y-1 mt-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Impact on {accountName}</p>
                        {t.applied_to_focus.why_it_matters && (
                          <p className="text-[11px] text-foreground">{t.applied_to_focus.why_it_matters}</p>
                        )}
                        {t.applied_to_focus.where_it_shows_up && (
                          <p className="text-[10px] text-muted-foreground">Shows up: {t.applied_to_focus.where_it_shows_up}</p>
                        )}
                      </div>
                    )}
                  </div>
                </ExpandableRow>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/60">
              {aiLens ? 'No AI-related trends.' : 'No authority trends data.'}
            </p>
          )}
        </DocSection>

        {/* SECTION 5: Commercial Footprint */}
        <DocSection
          id="ai-commercial"
          title="Commercial Footprint"
          icon={<DollarSign className="w-3.5 h-3.5" />}
          isOpen={openSection === 'ai-commercial'}
          onToggle={() => toggleSection('ai-commercial')}
        >
          {commercial ? (
            <div className="space-y-3">
              {/* Sub-tabs */}
              <div className="flex items-center gap-1 border-b border-border/30 pb-2">
                {(['licenses', 'contracts', 'renewals', 'spend'] as CommercialTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCommercialTab(tab)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors capitalize",
                      commercialTab === tab
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground/60 hover:text-muted-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {commercialTab === 'licenses' && (
                <div className="space-y-1">
                  {commercial.existing_licenses?.map((l, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs text-foreground">
                      <Layers className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      {l}
                    </div>
                  )) ?? <p className="text-xs text-muted-foreground/60">No license data.</p>}
                </div>
              )}
              {commercialTab === 'contracts' && (
                <div className="space-y-1">
                  {commercial.contract_end_dates?.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs text-foreground">
                      <FileText className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      {c}
                    </div>
                  )) ?? <p className="text-xs text-muted-foreground/60">No contract data.</p>}
                </div>
              )}
              {commercialTab === 'renewals' && (
                <div className="space-y-1">
                  {commercial.renewal_windows?.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs text-foreground">
                      <TrendingUp className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      {r}
                    </div>
                  )) ?? <p className="text-xs text-muted-foreground/60">No renewal data.</p>}
                </div>
              )}
              {commercialTab === 'spend' && (
                <div className="py-2 px-3 rounded bg-muted/10">
                  <p className="text-xs text-foreground">{commercial.estimated_spend_band ?? 'No spend estimate available.'}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/60">No commercial data.</p>
          )}
        </DocSection>

        {/* SECTION 6: Technical Landscape */}
        <DocSection
          id="ai-technical"
          title="Technical Landscape"
          icon={<Server className="w-3.5 h-3.5" />}
          isOpen={openSection === 'ai-technical'}
          onToggle={() => toggleSection('ai-technical')}
        >
          {technical ? (
            <div className="space-y-3">
              {/* Sub-tabs */}
              <div className="flex items-center gap-1 border-b border-border/30 pb-2">
                {(['vendors', 'applications', 'architecture'] as TechTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setTechTab(tab)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors capitalize",
                      techTab === tab
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground/60 hover:text-muted-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {techTab === 'vendors' && (
                <div className="space-y-1">
                  {technical.known_vendors?.map((v, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs text-foreground">
                      <Building2 className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      {v}
                    </div>
                  )) ?? <p className="text-xs text-muted-foreground/60">No vendor data.</p>}
                </div>
              )}
              {techTab === 'applications' && (
                <div className="space-y-1">
                  {technical.known_applications?.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs text-foreground">
                      <Layers className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      {a}
                    </div>
                  )) ?? <p className="text-xs text-muted-foreground/60">No application data.</p>}
                </div>
              )}
              {techTab === 'architecture' && (
                <div className="space-y-2">
                  {technical.architecture_patterns?.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs text-foreground">
                      <Server className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      {p}
                    </div>
                  )) ?? <p className="text-xs text-muted-foreground/60">No architecture data.</p>}
                  {technical.cloud_strategy && (
                    <div className="flex items-start gap-2 pt-1">
                      <span className="text-[10px] text-muted-foreground min-w-[100px]">Cloud Strategy</span>
                      <span className="text-xs text-foreground">{technical.cloud_strategy}</span>
                    </div>
                  )}
                  {/* Visual tags */}
                  <div className="flex items-center gap-1.5 pt-1">
                    {technical.cloud_strategy?.toLowerCase().includes('hybrid') && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">Hybrid</span>
                    )}
                    {technical.architecture_patterns?.some(p => p.toLowerCase().includes('legacy')) && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-muted/40 text-muted-foreground border border-border/40">Legacy constraint</span>
                    )}
                    {(technical.known_applications?.some(a => a.toLowerCase().includes('ai') || a.toLowerCase().includes('ml')) ||
                      technical.cloud_strategy?.toLowerCase().includes('ai')) && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-medium bg-primary/10 text-primary border border-primary/20">AI-Ready</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/60">No technical data.</p>
          )}
        </DocSection>

        {/* SECTION 7: Evidence & Memory */}
        <DocSection
          id="ai-evidence"
          title="Evidence & Memory"
          icon={<FileText className="w-3.5 h-3.5" />}
          count={evidenceCount}
          isOpen={openSection === 'ai-evidence'}
          onToggle={() => toggleSection('ai-evidence')}
        >
          {/* Evidence categories */}
          <div className="space-y-2">
            {EVIDENCE_CATEGORIES.map((cat) => {
              const isExpanded = expandedEvidence === cat.value;
              const catItems = inbox.filter((item) => {
                const t = item.type;
                if (cat.value === 'security') return false;
                if (cat.value === 'technical') return t === 'architecture_diagram' || t === 'rfp_requirements';
                if (cat.value === 'business') return t === 'slides_deck' || t === 'news_article';
                if (cat.value === 'procurement') return t === 'other' || t === 'link';
                return false;
              });
              return (
                <div key={cat.value} className="rounded-lg border border-border/30 overflow-hidden">
                  <button
                    onClick={() => setExpandedEvidence(isExpanded ? null : cat.value)}
                    className="w-full flex items-center gap-2 p-2.5 text-left hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-muted-foreground/60">{cat.icon}</span>
                    <span className="text-xs font-medium text-foreground flex-1">{cat.label}</span>
                    <span className="text-[10px] text-muted-foreground/50">{catItems.length}</span>
                    <ChevronDown className={cn("w-3 h-3 text-muted-foreground/40 transition-transform", isExpanded && "rotate-180")} />
                  </button>
                  {isExpanded && (
                    <div className="px-2.5 pb-2.5 space-y-1">
                      {catItems.length > 0 ? catItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs">
                          <FileText className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                          <span className="text-foreground truncate">{item.title}</span>
                          <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">{item.type.replace(/_/g, ' ')}</span>
                        </div>
                      )) : (
                        <p className="text-[10px] text-muted-foreground/50 py-1">No items in this category.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Uncategorized inbox items */}
          {inbox.filter((i) => i.type === 'recording' || i.type === 'transcript_notes').length > 0 && (
            <div className="pt-3 border-t border-border/30 space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Context & Recordings</p>
              {inbox.filter((i) => i.type === 'recording' || i.type === 'transcript_notes').map((item) => (
                <div key={item.id} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs">
                  <FileText className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                  <span className="text-foreground truncate">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">{item.type.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Content Requests */}
          {requests.length > 0 && (
            <div className="pt-3 border-t border-border/30 space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Content Requests ({requests.length})</p>
              {requests.map((req) => (
                <div key={req.request_id} className="flex items-center gap-2 py-1.5 px-2 rounded bg-muted/10 text-xs">
                  <MessageSquare className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-medium flex-shrink-0",
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
          )}
        </DocSection>
      </div>
    </div>
  );
}
