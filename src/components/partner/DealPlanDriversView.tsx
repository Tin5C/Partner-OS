// Deal Plan Drivers View — comprehensive 7-section workspace
// 1) Promoted Drivers  2) Strategic Positioning  3) Political Map
// 4) Execution Motion  5) CRM + Account Signals  6) Risks & Blockers  7) Asset Packs

import { useState, useMemo, useCallback } from 'react';
import {
  Brain,
  Zap,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Link2,
  Trash2,
  Copy,
  Users,
  Briefcase,
  Wrench,
  Target,
  MessageSquare,
  Shield,
  Clock,
  Pencil,
  Check,
  Crosshair,
  Crown,
  UserCheck,
  UserX,
  ShoppingCart,
  Rocket,
  BarChart3,
  CalendarDays,
  Activity,
  Building2,
  Package,
  FileCheck,
  Scale,
  Swords,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
  getDealPlan,
  removePromotedSignal,
  type PromotedSignal,
} from '@/data/partner/dealPlanStore';
import { BriefingModePill } from './BriefingModePill';

const FOCUS_ID = 'schindler';
const WEEK_OF = '2026-02-10';

type RoleView = 'seller' | 'engineer';

interface DealPlanDriversViewProps {
  onGoToQuickBrief: () => void;
}

// ============= Editable Text Block =============

function EditableBlock({ label, icon, value, onChange, placeholder, compact }: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  compact?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  return (
    <div className={cn("space-y-1.5", compact && "space-y-1")}>
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          {icon}
          {label}
        </p>
        {!editing ? (
          <button onClick={() => { setDraft(value); setEditing(true); }} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">
            <Pencil className="w-2.5 h-2.5" /> Edit
          </button>
        ) : (
          <button onClick={handleSave} className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5">
            <Check className="w-2.5 h-2.5" /> Save
          </button>
        )}
      </div>
      {editing ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="text-xs min-h-[48px]"
        />
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {value || <span className="italic opacity-60">{placeholder}</span>}
        </p>
      )}
    </div>
  );
}

// ============= Section Wrapper =============

function Section({ number, title, icon, children, roleHighlight }: {
  number: number;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  roleHighlight?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 space-y-3",
      roleHighlight
        ? "border-primary/30 shadow-[0_0_0_1px_hsl(var(--primary)/0.1)]"
        : "border-border/60"
    )}>
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
          {number}
        </span>
        <span className="text-primary">{icon}</span>
        <p className="text-xs font-semibold text-foreground">{title}</p>
        {roleHighlight && (
          <span className="text-[10px] text-primary font-medium ml-auto">★ Key for this role</span>
        )}
      </div>
      {children}
    </div>
  );
}

// ============= Asset Pack Card =============

function AssetPackCard({ label, icon, description }: {
  label: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <button
      onClick={() => toast.info(`${label} — coming soon`)}
      className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-card hover:border-primary/30 hover:bg-primary/[0.02] transition-all text-left group"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/15 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-foreground flex items-center gap-1">
          {label}
          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// ============= Stakeholder Row =============

function StakeholderRow({ role, icon, name, notes, onChange }: {
  role: string;
  icon: React.ReactNode;
  name: string;
  notes: string;
  onChange: (name: string, notes: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftNotes, setDraftNotes] = useState(notes);

  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/20 border border-border/40">
      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{role}</p>
        {editing ? (
          <div className="space-y-1">
            <input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Name / title"
              className="w-full text-xs px-2 py-1 rounded border border-border bg-background"
            />
            <input
              value={draftNotes}
              onChange={(e) => setDraftNotes(e.target.value)}
              placeholder="Approach notes"
              className="w-full text-xs px-2 py-1 rounded border border-border bg-background"
            />
            <button
              onClick={() => { onChange(draftName, draftNotes); setEditing(false); }}
              className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5"
            >
              <Check className="w-2.5 h-2.5" /> Save
            </button>
          </div>
        ) : (
          <div className="cursor-pointer" onClick={() => setEditing(true)}>
            <p className="text-xs text-foreground">{name || <span className="italic text-muted-foreground/60">Click to add</span>}</p>
            {notes && <p className="text-[11px] text-muted-foreground mt-0.5">{notes}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ============= Signal Type Badge Colors =============

const TYPE_COLORS: Record<string, string> = {
  vendor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  regulatory: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  internalActivity: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  competitive: 'bg-red-500/10 text-red-600 border-red-500/20',
  localMarket: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
};

// ============= Main Component =============

export function DealPlanDriversView({ onGoToQuickBrief }: DealPlanDriversViewProps) {
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const plan = useMemo(() => getDealPlan(FOCUS_ID, WEEK_OF), []);
  const drivers = plan?.promotedSignals ?? [];

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [roleView, setRoleView] = useState<RoleView>('seller');

  // Section 2: Strategic Positioning
  const [whyNow, setWhyNow] = useState('Azure OpenAI available in Swiss North + EU Machinery Regulation deadline 2027 = dual urgency window.');
  const [wedge, setWedge] = useState('Data residency objection removed — first-mover advantage for AI predictive maintenance.');
  const [competitivePressure, setCompetitivePressure] = useState('Google Cloud and AWS lack Swiss-hosted AI services with equivalent compliance posture.');
  const [execFraming, setExecFraming] = useState('Position as compliance-driven digital transformation partner, not generic cloud reseller.');

  // Section 3: Political Map
  const [sponsor, setSponsor] = useState({ name: 'VP Engineering', notes: 'Champion of digital twin initiative' });
  const [champion, setChampion] = useState({ name: 'Head of Digital Transformation', notes: 'Pushing Copilot pilot internally' });
  const [blocker, setBlocker] = useState({ name: 'CISO', notes: 'Gates all AI via RACI — align proposals to governance framework' });
  const [procurement, setProcurement] = useState({ name: 'Head of Procurement', notes: 'Requires FinOps review for AI spend > CHF 50K' });

  // Section 4: Execution Motion
  const [entryPack, setEntryPack] = useState('AI Readiness Assessment + Azure Swiss Architecture Workshop');
  const [pilotScope, setPilotScope] = useState('50-technician Copilot for Field Service pilot — work-order triage + parts prediction');
  const [timeline, setTimeline] = useState('Week 1-2: Architecture workshop\nWeek 3-4: Pilot design\nWeek 5-8: 50-user pilot\nWeek 9-10: ROI review + expansion proposal');

  // Section 5: CRM Signals
  const [lastMeeting, setLastMeeting] = useState('2026-01-28 — Discovery call with VP Engineering (data residency concerns discussed)');
  const [engagementScore, setEngagementScore] = useState('72 / 100 — Active engagement, multiple stakeholders involved');
  const [vendorInvolvement, setVendorInvolvement] = useState('Microsoft CSA assigned. Azure Swiss North GA confirmed. Copilot preview access pending.');

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRemove = useCallback(
    (signalId: string) => {
      removePromotedSignal(FOCUS_ID, WEEK_OF, signalId);
      refresh();
      toast.success('Removed from Deal Planning');
    },
    [refresh],
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const confidenceColor = (score: number) =>
    score >= 60 ? 'text-green-600' : score >= 40 ? 'text-primary' : 'text-red-500';

  const avgConfidence = useMemo(() => {
    if (drivers.length === 0) return null;
    const avg = Math.round(drivers.reduce((a, d) => a + d.snapshot.confidence, 0) / drivers.length);
    return { score: avg, label: avg >= 60 ? 'High' : avg >= 40 ? 'Medium' : 'Low' };
  }, [drivers]);

  // Aggregated risks
  const aggregatedRisks = useMemo(() => {
    const items = new Set<string>();
    drivers.forEach((d) => d.snapshot.whatsMissing.forEach((m) => items.add(m)));
    drivers.forEach((d) => d.snapshot.proofToRequest.forEach((p) => items.add(`Proof needed: ${p}`)));
    return Array.from(items);
  }, [drivers]);

  // Empty state
  if (drivers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
          <Brain className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">No promoted signals yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Add signals from Stories to build your Deal Plan.
          </p>
        </div>
        <button
          onClick={onGoToQuickBrief}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Zap className="w-4 h-4" />
          Go to Quick Brief
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header + Role Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Deal Planning — {drivers.length} driver{drivers.length !== 1 ? 's' : ''}
          </h3>
          <BriefingModePill mode="curated" />
          {avgConfidence && (
            <span className={cn('text-xs font-bold ml-2', confidenceColor(avgConfidence.score))}>
              {avgConfidence.score}% avg
            </span>
          )}
        </div>

        <div className="inline-flex rounded-lg bg-muted/50 p-0.5 border border-border/60">
          <button
            onClick={() => setRoleView('seller')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              roleView === 'seller'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Briefcase className="w-3 h-3" />
            Seller view
          </button>
          <button
            onClick={() => setRoleView('engineer')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
              roleView === 'engineer'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Wrench className="w-3 h-3" />
            Engineer view
          </button>
        </div>
      </div>

      {/* ===== 1) Promoted Drivers ===== */}
      <Section number={1} title="Promoted Drivers" icon={<Zap className="w-3.5 h-3.5" />}>
        <div className="space-y-2">
          {drivers.map((d) => {
            const s = d.snapshot;
            const isExpanded = expandedIds.has(d.signalId);
            const typeColor = TYPE_COLORS[s.type] ?? 'bg-muted text-muted-foreground border-border';

            return (
              <div key={d.signalId} className="rounded-lg border border-border/50 bg-background overflow-hidden">
                <div
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => toggleExpand(d.signalId)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', typeColor)}>
                        {s.type}
                      </span>
                      <span className={cn('text-[10px] font-bold', confidenceColor(s.confidence))}>
                        {s.confidence}%
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">{s.title}</p>
                    {!isExpanded && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.soWhat}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemove(d.signalId); }}
                      className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 space-y-3 border-t border-border/40 pt-3">
                    <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">So what</p>
                      <p className="text-xs text-foreground">{s.soWhat}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">Action</p>
                      <p className="text-xs text-foreground">{s.recommendedAction}</p>
                    </div>
                    <div className={cn("p-2.5 rounded-lg bg-muted/20 border border-border/40", roleView === 'seller' && 'ring-1 ring-primary/20')}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Talk Track
                          {roleView === 'seller' && <span className="text-primary ml-1">★</span>}
                        </p>
                        <button onClick={() => handleCopy(s.talkTrack)} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{s.talkTrack}</p>
                    </div>
                    {s.whoCares.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Who cares</p>
                        <div className="flex flex-wrap gap-1.5">
                          {s.whoCares.map((r, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border/50 text-[10px] font-medium">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {s.proofToRequest.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Proof to request</p>
                        <div className="space-y-1">
                          {s.proofToRequest.map((item, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs">
                              <Link2 className="w-3 h-3 text-primary/50 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {s.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/30">
                        {s.sources.map((src, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[10px] text-muted-foreground">{src}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* ===== 2) Strategic Positioning ===== */}
      <Section
        number={2}
        title="Strategic Positioning"
        icon={<Crosshair className="w-3.5 h-3.5" />}
        roleHighlight={roleView === 'seller'}
      >
        <div className="space-y-3">
          <EditableBlock label="Why Now" icon={<Clock className="w-3 h-3" />} value={whyNow} onChange={setWhyNow} placeholder="What creates urgency for this deal right now?" compact />
          <EditableBlock label="Wedge" icon={<Target className="w-3 h-3" />} value={wedge} onChange={setWedge} placeholder="What's our differentiated entry point?" compact />
          <EditableBlock label="Competitive Pressure" icon={<Swords className="w-3 h-3" />} value={competitivePressure} onChange={setCompetitivePressure} placeholder="Key competitive dynamics to navigate." compact />
          <EditableBlock label="Executive Framing" icon={<Crown className="w-3 h-3" />} value={execFraming} onChange={setExecFraming} placeholder="How should we frame this to the C-suite?" compact />
        </div>
      </Section>

      {/* ===== 3) Political Map ===== */}
      <Section
        number={3}
        title="Political Map"
        icon={<Users className="w-3.5 h-3.5" />}
        roleHighlight={roleView === 'seller'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <StakeholderRow role="Sponsor" icon={<Crown className="w-3 h-3" />} name={sponsor.name} notes={sponsor.notes} onChange={(n, no) => setSponsor({ name: n, notes: no })} />
          <StakeholderRow role="Champion" icon={<UserCheck className="w-3 h-3" />} name={champion.name} notes={champion.notes} onChange={(n, no) => setChampion({ name: n, notes: no })} />
          <StakeholderRow role="Blocker" icon={<UserX className="w-3 h-3" />} name={blocker.name} notes={blocker.notes} onChange={(n, no) => setBlocker({ name: n, notes: no })} />
          <StakeholderRow role="Procurement" icon={<ShoppingCart className="w-3 h-3" />} name={procurement.name} notes={procurement.notes} onChange={(n, no) => setProcurement({ name: n, notes: no })} />
        </div>
      </Section>

      {/* ===== 4) Execution Motion ===== */}
      <Section
        number={4}
        title="Execution Motion"
        icon={<Rocket className="w-3.5 h-3.5" />}
        roleHighlight={roleView === 'engineer'}
      >
        <div className="space-y-3">
          <EditableBlock label="Recommended Entry Pack" icon={<Package className="w-3 h-3" />} value={entryPack} onChange={setEntryPack} placeholder="Which package or engagement model opens the door?" compact />
          <EditableBlock label="Pilot Scope" icon={<Target className="w-3 h-3" />} value={pilotScope} onChange={setPilotScope} placeholder="Define the initial pilot: users, scope, success criteria." compact />
          <EditableBlock label="Timeline Hypothesis" icon={<CalendarDays className="w-3 h-3" />} value={timeline} onChange={setTimeline} placeholder="Week-by-week execution plan." compact />
        </div>
      </Section>

      {/* ===== 5) CRM + Account Signals ===== */}
      <Section number={5} title="CRM + Account Signals" icon={<Activity className="w-3.5 h-3.5" />}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                <CalendarDays className="w-3 h-3" /> Last Meeting
              </p>
              <p className="text-xs text-foreground">{lastMeeting.split('—')[0]}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{lastMeeting.split('—')[1]}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> Engagement Score
              </p>
              <p className="text-xs font-bold text-green-600">72 / 100</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Active, multi-stakeholder</p>
            </div>
            <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3" /> Vendor Involvement
              </p>
              <p className="text-xs text-foreground">Microsoft CSA assigned</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Azure Swiss GA ✓ · Copilot preview pending</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ===== 6) Risks & Blockers ===== */}
      <Section number={6} title="Risks & Blockers" icon={<AlertTriangle className="w-3.5 h-3.5" />}>
        {aggregatedRisks.length > 0 ? (
          <div className="space-y-1.5">
            {aggregatedRisks.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3 h-3 text-destructive/60 mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No risks identified yet.</p>
        )}
      </Section>

      {/* ===== 7) Asset Packs ===== */}
      <Section number={7} title="Asset Packs" icon={<Package className="w-3.5 h-3.5" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <AssetPackCard
            label="Assessment Pack"
            icon={<FileCheck className="w-4 h-4" />}
            description="AI readiness assessment framework + scoring template."
          />
          <AssetPackCard
            label="Governance Pack"
            icon={<Shield className="w-4 h-4" />}
            description="RACI, data classification, approval gate templates."
          />
          <AssetPackCard
            label="Competitive Pack"
            icon={<Swords className="w-4 h-4" />}
            description="Positioning guides against Google Cloud, AWS, SAP."
          />
          <AssetPackCard
            label="ROI Pack"
            icon={<TrendingUp className="w-4 h-4" />}
            description="TCO models, business case templates, FinOps framework."
          />
        </div>
      </Section>
    </div>
  );
}
