// Deal Plan Drivers View — Sales / Business / Technical tabs with shared Recommended Plays header
// Sales: operational deal execution (stakeholders, execution motion, CRM, inbox, risks)
// Business: investment justification (strategy, hypothesis, commercial path, evidence, positioning)
// Technical: feasibility & delivery (requirements, architecture, delivery, technical risks)

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
  Plus,
  Search,
  FolderOpen,
  Inbox as InboxIcon,
  X,
  ClipboardCheck,
  Cpu,
  FileText,
  Layers,
  Server,
  DollarSign,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import {
  getDealPlan,
  removePromotedSignal,
  promoteSignalsToDealPlan,
  type PromotedSignal,
} from '@/data/partner/dealPlanStore';
import { listSignals, type Signal } from '@/data/partner/signalStore';
import { AccountInbox } from './AccountInbox';
import {
  DealPlanMetadata,
  type EngagementType,
  type Motion,
} from './DealPlanMetadata';
import { scoreServicePacks, type ScoredPack } from '@/data/partner/servicePackStore';
import { partner_service_configuration } from '@/data/partner/partnerServiceConfiguration';
import {
  listByFocusId,
  removeItem as removeInboxItem,
  type DealPlanningInboxItem,
} from '@/data/partner/dealPlanningInboxStore';
import { addTags } from '@/data/partner/dealPlanningSignalTagsStore';
import { RecommendedPlaysPanel } from '@/partner/components/dealPlanning/RecommendedPlaysPanel';
import { SignalPickerPanel } from '@/partner/components/dealPlanning/SignalPickerPanel';
import { StrategicFramingSection } from '@/partner/components/dealPlanning/StrategicFramingSection';
import { TechnicalRecommendationsSection } from '@/partner/components/dealPlanning/TechnicalRecommendationsSection';
import { PLAY_SERVICE_PACKS } from '@/partner/data/dealPlanning/servicePacks';
import { scorePlayPacks } from '@/partner/lib/dealPlanning/propensity';
import { setActivePlay, getActivePlay } from '@/partner/data/dealPlanning/selectedPackStore';
import { hydratePlan, getHydratedPlan } from '@/partner/data/dealPlanning/planHydrationStore';
import { WhatWeNeedSection } from '@/partner/components/dealPlanning/WhatWeNeedSection';
import { ExecutionBundleSection } from '@/partner/components/dealPlanning/ExecutionBundleSection';
import { DealHypothesisBlock } from '@/partner/components/dealPlanning/DealHypothesisBlock';
import { RisksBlockersSection } from '@/partner/components/dealPlanning/RisksBlockersSection';
import { getReadinessScore } from '@/data/partner/accountMemoryStore';
import { buildComposerInputBusiness } from '@/services/partner/dealPlanning/buildComposerInputBusiness';
import { getActiveSignalIds } from '@/partner/data/dealPlanning/activeSignalsStore';
import { getByFocusId as getTechLandscape } from '@/data/partner/technicalLandscapeStore';
import { CollapsibleSection } from '@/components/shared/CollapsibleSection';
import { getBusinessPlayPackage, getAvailableVariants, type BusinessVariant } from '@/data/partner/businessPlayPackageStore';
import '@/data/partner/demo/businessPlayPackagesSeed';
import { BusinessPlayPackageView } from '@/partner/components/dealPlanning/BusinessPlayPackageView';
import { ensureSchindlerDefaults } from '@/data/partner/demo/schindlerDefaults';
import { getDealPlanningSelection } from '@/data/partner/dealPlanningSelectionStore';

const WEEK_OF = '2026-02-10';

const ACCOUNTS = [
  { id: 'schindler', label: 'Schindler' },
  { id: 'sulzer', label: 'Sulzer' },
  { id: 'ubs', label: 'UBS' },
];

type ViewTab = 'sales' | 'business' | 'technical';

interface DealPlanDriversViewProps {
  onGoToQuickBrief: () => void;
  onGoToAccountIntelligence?: () => void;
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

// ============= Account Selector Dropdown =============

function AccountSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-border/60 bg-background hover:border-primary/30 transition-colors"
      >
        {selectedId ? (
          <span className="text-foreground">
            {ACCOUNTS.find((a) => a.id === selectedId)?.label ?? selectedId}
          </span>
        ) : (
          <span className="text-muted-foreground">Select account...</span>
        )}
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-52 rounded-lg border border-border bg-card shadow-lg z-50 py-1">
          {ACCOUNTS.map((acc) => (
            <button
              key={acc.id}
              onClick={() => { onSelect(acc.id); setOpen(false); }}
              className={cn(
                'w-full text-left px-3 py-2 text-xs hover:bg-muted/40 transition-colors',
                selectedId === acc.id ? 'text-primary font-medium' : 'text-foreground'
              )}
            >
              {acc.label}
            </button>
          ))}
          <div className="border-t border-border/40 mt-1 pt-1">
            <button
              onClick={() => { toast.info('Add account — coming soon'); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" />
              Add new account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============= Enterprise Empty State =============

function EmptyPlaceholder({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border/50 bg-muted/10 p-4 text-center space-y-1.5">
      <div className="flex justify-center text-muted-foreground">{icon}</div>
      <p className="text-[11px] font-medium text-foreground">{title}</p>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

// ============= Next Recommended Action Strip =============

function NextActionStrip({ readinessScore }: { readinessScore: number | null }) {
  if (readinessScore == null) return null;
  const advice = readinessScore < 50
    ? 'Engage missing executive sponsor before progressing proposal.'
    : 'Formalize scope and confirm commercial pathway.';
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/40">
      <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      <p className="text-[11px] text-muted-foreground">
        <span className="font-semibold text-foreground">Next action:</span> {advice}
      </p>
    </div>
  );
}

// ============= Main Component =============

export function DealPlanDriversView({ onGoToQuickBrief, onGoToAccountIntelligence }: DealPlanDriversViewProps) {
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);
  const strategicFramingRef = useRef<HTMLDivElement>(null);

  // Bootstrap Schindler defaults once per session
  useEffect(() => { ensureSchindlerDefaults(); }, []);

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const plan = useMemo(
    () => selectedAccount ? getDealPlan(selectedAccount, WEEK_OF) : undefined,
    [selectedAccount],
  );
  const drivers = plan?.promotedSignals ?? [];

  const [showPicker, setShowPicker] = useState(false);
  const [viewTab, setViewTab] = useState<ViewTab>('sales');

  const [engagementType, setEngagementType] = useState<EngagementType | null>(null);
  const [motion, setMotion] = useState<Motion | null>(null);

  // Apply preselected type/motion when account changes
  useEffect(() => {
    if (!selectedAccount) return;
    const sel = getDealPlanningSelection(selectedAccount);
    if (sel) {
      setEngagementType(sel.type as EngagementType);
      setMotion(sel.motion as Motion);
    }
  }, [selectedAccount]);

  // Strategic Framing details
  const [showStrategicDetails, setShowStrategicDetails] = useState(false);
  const [whyNow, setWhyNow] = useState('Azure OpenAI available in Swiss North + EU Machinery Regulation deadline 2027 = dual urgency window.');
  const [wedge, setWedge] = useState('Data residency objection removed — first-mover advantage for AI predictive maintenance.');
  const [competitivePressure, setCompetitivePressure] = useState('Google Cloud and AWS lack Swiss-hosted AI services with equivalent compliance posture.');
  const [execFraming, setExecFraming] = useState('Position as compliance-driven digital transformation partner, not generic cloud reseller.');

  // Political Map
  const [sponsor, setSponsor] = useState({ name: 'VP Engineering', notes: 'Champion of digital twin initiative' });
  const [champion, setChampion] = useState({ name: 'Head of Digital Transformation', notes: 'Pushing Copilot pilot internally' });
  const [blocker, setBlocker] = useState({ name: 'CISO', notes: 'Gates all AI via RACI — align proposals to governance framework' });
  const [procurement, setProcurement] = useState({ name: 'Head of Procurement', notes: 'Requires FinOps review for AI spend > CHF 50K' });

  // Execution Motion
  const [entryPack, setEntryPack] = useState('AI Readiness Assessment + Azure Swiss Architecture Workshop');
  const [pilotScope, setPilotScope] = useState('50-technician Copilot for Field Service pilot — work-order triage + parts prediction');
  const [timeline, setTimeline] = useState('Week 1-2: Architecture workshop\nWeek 3-4: Pilot design\nWeek 5-8: 50-user pilot\nWeek 9-10: ROI review + expansion proposal');

  // CRM Signals
  const [lastMeeting] = useState('2026-01-28 — Discovery call with VP Engineering (data residency concerns discussed)');
  const [engagementScore] = useState('72 / 100 — Active engagement, multiple stakeholders involved');
  const [vendorInvolvement] = useState('Microsoft CSA assigned. Azure Swiss North GA confirmed. Copilot preview access pending.');

  const handleRemove = useCallback(
    (signalId: string) => {
      if (!selectedAccount) return;
      removePromotedSignal(selectedAccount, WEEK_OF, signalId);
      refresh();
      toast.success('Removed from Deal Planning');
    },
    [refresh, selectedAccount],
  );

  const avgConfidence = useMemo(() => {
    if (drivers.length === 0) return null;
    const avg = Math.round(drivers.reduce((a, d) => a + d.snapshot.confidence, 0) / drivers.length);
    return { score: avg, label: avg >= 60 ? 'High' : avg >= 40 ? 'Medium' : 'Low' };
  }, [drivers]);

  const confidenceColor = (score: number) =>
    score >= 60 ? 'text-green-600' : score >= 40 ? 'text-primary' : 'text-red-500';

  const aggregatedRisks = useMemo(() => {
    const items = new Set<string>();
    drivers.forEach((d) => d.snapshot.whatsMissing.forEach((m) => items.add(m)));
    drivers.forEach((d) => d.snapshot.proofToRequest.forEach((p) => items.add(`Proof needed: ${p}`)));
    return Array.from(items);
  }, [drivers]);

  const [planGenerated, setPlanGenerated] = useState(false);
  const [composerFallbackJson, setComposerFallbackJson] = useState<string | null>(null);
  const [businessVariant, setBusinessVariant] = useState<BusinessVariant>('executive');
  const canGenerate = selectedAccount !== null && engagementType !== null && motion !== null;

  const [inboxVersion, setInboxVersion] = useState(0);
  const inboxItems = useMemo(
    () => (selectedAccount ? listByFocusId(selectedAccount) : []),
    [selectedAccount, inboxVersion],
  );

  const handlePromoteInboxItem = useCallback((item: DealPlanningInboxItem) => {
    addTags(item.focusId, item.tags);
    removeInboxItem(item.focusId, item.id);
    setInboxVersion((v) => v + 1);
    refresh();
    toast.success('Promoted — tags applied to scoring');
  }, [refresh]);

  const handleDismissInboxItem = useCallback((item: DealPlanningInboxItem) => {
    removeInboxItem(item.focusId, item.id);
    setInboxVersion((v) => v + 1);
    toast('Dismissed from inbox');
  }, []);

  const recommendedPacks = useMemo<ScoredPack[]>(() => {
    if (!selectedAccount || !planGenerated) return [];
    return scoreServicePacks({
      mode: engagementType,
      trigger: motion,
      vendorPosture: partner_service_configuration.vendor_posture,
      partnerCapabilities: partner_service_configuration.partner_capabilities,
    });
  }, [selectedAccount, engagementType, motion, planGenerated, inboxVersion]);

  const topPlayPackName = useMemo(() => {
    if (drivers.length === 0) return null;
    const plays = scorePlayPacks(PLAY_SERVICE_PACKS, {
      promotedSignals: drivers,
      engagementType: engagementType as 'new_logo' | 'existing_customer' | null,
      motion,
    });
    return plays.length > 0 ? plays[0].packName : null;
  }, [drivers, engagementType, motion]);

  const handleAddSignals = useCallback((signals: Signal[]) => {
    if (!selectedAccount) return;
    promoteSignalsToDealPlan(selectedAccount, WEEK_OF, signals);
    refresh();
    toast.success(`Added ${signals.length} signal${signals.length > 1 ? 's' : ''} to Deal Plan`);
  }, [refresh, selectedAccount]);

  const handlePlaySelected = useCallback((play: { packId: string; packName: string; drivers: string[]; gaps: string[] }) => {
    if (!selectedAccount) return;
    const whatText = `Launch ${play.packName} to validate priority use cases and define a delivery scope.`;
    const howText = `Entry via ${play.packName} — phased engagement with clear pilot milestones.`;
    const whyDrivers = play.drivers.slice(0, 2).join('; ');
    const whyText = whyDrivers
      ? `${whyDrivers}. Act now to capture the engagement window.`
      : 'Strategic alignment with current account priorities creates a natural engagement window.';
    const activePlay = {
      playId: play.packId,
      playTitle: play.packName,
      framing: { what: whatText, how: howText, why: whyText },
    };
    setActivePlay(selectedAccount, activePlay);
    const hp = hydratePlan(
      selectedAccount,
      activePlay,
      engagementType as 'new_logo' | 'existing_customer' | null,
      motion,
      play.gaps,
    );
    if (hp.politicalMap.length === 4) {
      setSponsor({ name: hp.politicalMap[0].title, notes: hp.politicalMap[0].notes });
      setChampion({ name: hp.politicalMap[1].title, notes: hp.politicalMap[1].notes });
      setBlocker({ name: hp.politicalMap[2].title, notes: hp.politicalMap[2].notes });
      setProcurement({ name: hp.politicalMap[3].title, notes: hp.politicalMap[3].notes });
    }
    refresh();
    setTimeout(() => {
      strategicFramingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [selectedAccount, refresh, engagementType, motion]);

  const readinessData = useMemo(() => {
    if (!selectedAccount) return null;
    return getReadinessScore(selectedAccount, drivers.length > 0);
  }, [selectedAccount, drivers.length]);

  const techLandscape = useMemo(() => {
    if (!selectedAccount) return null;
    return getTechLandscape(selectedAccount);
  }, [selectedAccount]);

  const hydratedPlan = useMemo(() => {
    if (!selectedAccount) return null;
    return getHydratedPlan(selectedAccount) ?? null;
  }, [selectedAccount, planGenerated, drivers]);

  // ============= HEADER =============
  const header = (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">Deal Planning</h3>
        {avgConfidence && (
          <span className={cn('text-xs font-bold ml-1', confidenceColor(avgConfidence.score))}>
            {avgConfidence.score}% avg
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Account</span>
          <AccountSelector selectedId={selectedAccount} onSelect={setSelectedAccount} />
        </div>
        <DealPlanMetadata
          accountId={selectedAccount ?? ''}
          hasPromotedSignals={drivers.length > 0}
          engagementType={engagementType}
          onEngagementTypeChange={setEngagementType}
          motion={motion}
          onMotionChange={setMotion}
          showNextAdds={false}
        />
      </div>
    </div>
  );

  // ============= PLAN INBOX =============
  const planInbox = inboxItems.length > 0 ? (
    <div className="rounded-lg border border-border/50 bg-muted/10 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <InboxIcon className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold text-foreground">Plan Inbox</p>
        <span className="px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-bold">
          {inboxItems.length}
        </span>
      </div>
      <div className="space-y-1.5">
        {inboxItems.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-md border border-border/40 bg-card">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-foreground leading-snug">{item.title}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{item.why_now}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/40 text-muted-foreground border border-border/40">
                  {item.impact_area}
                </span>
                {item.tags.map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-primary/5 text-primary border border-primary/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handlePromoteInboxItem(item)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Check className="w-3 h-3" />
                Promote
              </button>
              <button
                onClick={() => handleDismissInboxItem(item)}
                className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  // ============= CONTEXT STRIP (compact Account Intelligence) =============
  const contextStrip = onGoToAccountIntelligence && drivers.length > 0 ? (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border/40">
      <Zap className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <p className="text-[11px] text-muted-foreground flex-1">
        <span className="font-medium text-foreground">Context:</span> {drivers.length} signal{drivers.length !== 1 ? 's' : ''} impacting this account
      </p>
      <button
        onClick={onGoToAccountIntelligence}
        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        Open Account Intelligence <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  ) : null;

  // ============= TAB DEFINITIONS =============
  const TABS: { key: ViewTab; label: string; icon: React.ReactNode }[] = [
    { key: 'sales', label: 'Sales', icon: <Target className="w-3 h-3" /> },
    { key: 'business', label: 'Business', icon: <Briefcase className="w-3 h-3" /> },
    { key: 'technical', label: 'Technical', icon: <Wrench className="w-3 h-3" /> },
  ];

  // ============= RETURN =============
  return (
    <div className="space-y-4">
      {header}

      {!selectedAccount && (
        <p className="text-xs text-muted-foreground -mt-2">
          Select or create an account to ground this plan.
        </p>
      )}

      {/* Generate Plan CTA */}
      {!planGenerated && (
        <div className="flex flex-col items-center gap-3 py-4">
          <button
            onClick={() => setPlanGenerated(true)}
            disabled={!canGenerate}
            className={cn(
              'w-full max-w-md inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all',
              canGenerate
                ? 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-card active:scale-[0.98]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Rocket className="w-4.5 h-4.5" />
            Generate Plan
          </button>
          {!canGenerate && (
            <p className="text-[11px] text-muted-foreground text-center">
              {!selectedAccount
                ? 'Select an account, then choose Engagement Type and Motion to generate the plan.'
                : 'Select Engagement Type and Motion to generate the plan.'}
            </p>
          )}
        </div>
      )}

      {/* Plan workspace */}
      {planGenerated && (<>
      <div className="space-y-4">
        {/* Main workspace (full-width — right rail removed) */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* ===== SHARED HERO: Recommended Plays ===== */}
          <RecommendedPlaysPanel
            accountId={selectedAccount}
            promotedSignals={drivers}
            engagementType={engagementType as 'new_logo' | 'existing_customer' | null}
            motion={motion}
            readinessScore={readinessData?.score}
            weekOf={WEEK_OF}
            onRefresh={refresh}
            onRemoveSignal={handleRemove}
            onOpenPicker={() => setShowPicker(true)}
            showPicker={showPicker}
            onPlaySelected={handlePlaySelected}
            onGoToAccountIntelligence={onGoToAccountIntelligence}
            pickerNode={
              showPicker ? (
                <SignalPickerPanel
                  accountId={selectedAccount}
                  weekOf={WEEK_OF}
                  onClose={() => setShowPicker(false)}
                  onChanged={refresh}
                />
              ) : null
            }
          />

          {/* ===== Context strip (compact Account Intelligence) ===== */}
          {contextStrip}

          {/* ===== Tab toggle ===== */}
          <div className="flex items-center justify-between">
            <div className="inline-flex rounded-lg bg-muted/50 p-0.5 border border-border/60">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setViewTab(tab.key)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    viewTab === tab.key
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ===== SALES TAB ===== */}
          {viewTab === 'sales' && (
            <div className="space-y-3">
              {/* Next Recommended Action */}
              <NextActionStrip readinessScore={readinessData?.score ?? null} />

              {/* Stakeholders & Process */}
              <CollapsibleSection title="Stakeholders & Process" subtitle="Political map and procurement pathway" defaultOpen={true}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <StakeholderRow role="Sponsor" icon={<Crown className="w-3 h-3" />} name={sponsor.name} notes={sponsor.notes} onChange={(n, no) => setSponsor({ name: n, notes: no })} />
                  <StakeholderRow role="Champion" icon={<UserCheck className="w-3 h-3" />} name={champion.name} notes={champion.notes} onChange={(n, no) => setChampion({ name: n, notes: no })} />
                  <StakeholderRow role="Blocker" icon={<UserX className="w-3 h-3" />} name={blocker.name} notes={blocker.notes} onChange={(n, no) => setBlocker({ name: n, notes: no })} />
                  <StakeholderRow role="Procurement" icon={<ShoppingCart className="w-3 h-3" />} name={procurement.name} notes={procurement.notes} onChange={(n, no) => setProcurement({ name: n, notes: no })} />
                </div>
              </CollapsibleSection>

              {/* Execution Motion */}
              <CollapsibleSection title="Execution Motion" subtitle="Entry pack, pilot scope, and timeline" defaultOpen={true}>
                <div className="space-y-3">
                  <EditableBlock label="Recommended Entry Pack" icon={<Package className="w-3 h-3" />} value={entryPack} onChange={setEntryPack} placeholder="Which package or engagement model opens the door?" compact />
                  <EditableBlock label="Pilot Scope" icon={<Target className="w-3 h-3" />} value={pilotScope} onChange={setPilotScope} placeholder="Define the initial pilot: users, scope, success criteria." compact />
                  <EditableBlock label="Timeline Hypothesis" icon={<CalendarDays className="w-3 h-3" />} value={timeline} onChange={setTimeline} placeholder="Week-by-week execution plan." compact />
                </div>
              </CollapsibleSection>

              {/* CRM Context */}
              <CollapsibleSection title="CRM Context" subtitle="Recent engagement and vendor involvement" defaultOpen={false}>
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
                    <p className="text-xs font-bold text-foreground">72 / 100</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Active, multi-stakeholder</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> Vendor Involvement
                    </p>
                    <p className="text-xs text-foreground">Microsoft CSA assigned</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Azure Swiss GA — Copilot preview pending</p>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Plan Inbox */}
              {planInbox}

              {/* Risks & Blockers (Sales) */}
              <CollapsibleSection title="Risks & Blockers" subtitle="Sales risks and deal blockers" defaultOpen={false}>
                {hydratedPlan ? (
                  <RisksBlockersSection
                    risks={hydratedPlan.risks}
                    focusId={selectedAccount}
                    onRefresh={refresh}
                  />
                ) : aggregatedRisks.length > 0 ? (
                  <div className="space-y-1.5">
                    {aggregatedRisks.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <AlertTriangle className="w-3 h-3 text-destructive/60 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No risks identified yet — add signals to surface gaps.</p>
                )}
              </CollapsibleSection>
            </div>
          )}

          {/* ===== BUSINESS TAB ===== */}
          {viewTab === 'business' && (
            <div className="space-y-3">
              {(() => {
                const activePlay = selectedAccount ? getActivePlay(selectedAccount) : null;
                const lookupParams = {
                  focusId: selectedAccount ?? '',
                  playId: activePlay?.playId ?? '',
                  type: engagementType ?? '',
                  motion: motion ?? '',
                };
                const variants = getAvailableVariants(lookupParams);
                const effectiveVariant = variants.includes(businessVariant)
                  ? businessVariant
                  : variants[0] ?? null;
                const pkg = effectiveVariant
                  ? getBusinessPlayPackage({ ...lookupParams, variant: effectiveVariant })
                  : null;

                if (pkg && effectiveVariant) {
                  return (
                    <BusinessPlayPackageView
                      pkg={pkg}
                      availableVariants={variants}
                      activeVariant={effectiveVariant}
                      onVariantChange={setBusinessVariant}
                    />
                  );
                }

                // Fallback: existing editable sections when no package is materialized
                return (
                  <>
                    {/* Deal Strategy */}
                    <div ref={strategicFramingRef}>
                      <CollapsibleSection title="Deal Strategy" subtitle="Strategic framing and positioning" defaultOpen={true}>
                        <div className="space-y-3">
                          <StrategicFramingSection
                            promotedSignals={drivers}
                            topPackName={topPlayPackName}
                            activePlayFraming={selectedAccount ? getActivePlay(selectedAccount)?.framing ?? null : null}
                          />
                          <button
                            onClick={() => setShowStrategicDetails(!showStrategicDetails)}
                            className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showStrategicDetails ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            Details
                          </button>
                          {showStrategicDetails && (
                            <div className="space-y-3 pt-1 border-t border-border/30">
                              <EditableBlock label="Why Now" icon={<Clock className="w-3 h-3" />} value={whyNow} onChange={setWhyNow} placeholder="What creates urgency for this deal right now?" compact />
                              <EditableBlock label="Wedge" icon={<Target className="w-3 h-3" />} value={wedge} onChange={setWedge} placeholder="What's our differentiated entry point?" compact />
                              <EditableBlock label="Competitive Pressure" icon={<Swords className="w-3 h-3" />} value={competitivePressure} onChange={setCompetitivePressure} placeholder="Key competitive dynamics to navigate." compact />
                              <EditableBlock label="Executive Framing" icon={<Crown className="w-3 h-3" />} value={execFraming} onChange={setExecFraming} placeholder="How should we frame this to the C-suite?" compact />
                            </div>
                          )}
                        </div>
                      </CollapsibleSection>
                    </div>

                    {/* Deal Hypothesis */}
                    <CollapsibleSection title="Deal Hypothesis" subtitle="Investment thesis and expected outcome" defaultOpen={true}>
                      {hydratedPlan ? (
                        <DealHypothesisBlock hypothesis={hydratedPlan.dealHypothesis} />
                      ) : (
                        <EmptyPlaceholder
                          icon={<Lightbulb className="w-5 h-5" />}
                          title="No hypothesis generated yet"
                          description="Add a play to your plan to generate the deal hypothesis and commercial framing."
                        />
                      )}
                    </CollapsibleSection>

                    {/* Commercial Path */}
                    <CollapsibleSection title="Commercial Path" subtitle="Sizing, budget, and commercial pathway" defaultOpen={false}>
                      <div className="space-y-3">
                        <EmptyPlaceholder
                          icon={<DollarSign className="w-5 h-5" />}
                          title="Sizing and budget"
                          description="Deal sizing and budget framing will be generated based on play selection and account context."
                        />
                        {hydratedPlan && (
                          <div className="border-t border-border/30 pt-3">
                            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Evidence Checklist</p>
                            <WhatWeNeedSection
                              items={hydratedPlan.checklist}
                              focusId={selectedAccount}
                              onRefresh={refresh}
                            />
                          </div>
                        )}
                      </div>
                    </CollapsibleSection>

                    {/* Commercial Assets */}
                    {hydratedPlan && (
                      <CollapsibleSection title="Commercial Assets" subtitle="Execution materials and deliverables" defaultOpen={false}>
                        <ExecutionBundleSection assets={hydratedPlan.executionBundle} />
                      </CollapsibleSection>
                    )}

                    {/* Positioning */}
                    <CollapsibleSection title="Positioning" subtitle="Executive POV and talk tracks" defaultOpen={false}>
                      <EmptyPlaceholder
                        icon={<MessageSquare className="w-5 h-5" />}
                        title="Positioning framework"
                        description="Executive point-of-view outline and stakeholder talk tracks will be generated from deal strategy and play selection."
                      />
                    </CollapsibleSection>
                  </>
                );
              })()}

              {/* Copy Composer Input */}
              {selectedAccount && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={async () => {
                      const activePlay = getActivePlay(selectedAccount);
                      const input = buildComposerInputBusiness({
                        focusId: selectedAccount,
                        playId: activePlay?.playId ?? '',
                        type: engagementType ?? '',
                        motion: motion ?? '',
                        activeSignalIds: getActiveSignalIds(selectedAccount),
                      });
                      const json = JSON.stringify(input, null, 2);
                      try {
                        await navigator.clipboard.writeText(json);
                        toast.success('Composer input copied');
                      } catch {
                        setComposerFallbackJson(json);
                      }
                    }}
                    className="h-8 px-3 rounded text-[11px] font-medium whitespace-nowrap transition-colors border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center gap-1.5"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Composer Input
                  </button>
                </div>
              )}

              {/* Composer Fallback Modal */}
              {composerFallbackJson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setComposerFallbackJson(null)}>
                  <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg mx-4 p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">Composer Input</p>
                      <button onClick={() => setComposerFallbackJson(null)} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="text-[10px] text-muted-foreground bg-muted/20 border border-border rounded-lg p-3 max-h-80 overflow-auto whitespace-pre-wrap break-words">
                      {composerFallbackJson}
                    </pre>
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(composerFallbackJson);
                          toast.success('Copied');
                          setComposerFallbackJson(null);
                        } catch { /* ignore */ }
                      }}
                      className="h-8 px-3 rounded text-[11px] font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted/30 flex items-center gap-1.5"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* Cross-reference to Sales risks */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/30">
                <AlertTriangle className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <p className="text-[10px] text-muted-foreground">
                  Risks and blockers are tracked in the{' '}
                  <button onClick={() => setViewTab('sales')} className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors">
                    Sales
                  </button> tab.
                </p>
              </div>
            </div>
          )}

          {/* ===== TECHNICAL TAB ===== */}
          {viewTab === 'technical' && (
            <div className="space-y-3">
              {/* 1) HERO: Technical Recommendations */}
              <TechnicalRecommendationsSection
                promotedSignals={drivers}
                engagementType={engagementType as 'new_logo' | 'existing_customer' | null}
                motion={motion}
                readinessScore={readinessData?.score}
              />

              {/* 2) Requirements & Constraints */}
              <CollapsibleSection title="Requirements & Constraints" subtitle="Customer requirements and technical constraints" defaultOpen={true}>
                <EmptyPlaceholder
                  icon={<FileText className="w-5 h-5" />}
                  title="No requirements captured yet"
                  description="Add customer evidence to extract constraints. Upload RFPs, architecture documents, or meeting notes in Customer Evidence to surface requirements."
                />
              </CollapsibleSection>

              {/* 3) Architecture & Landscape */}
              <CollapsibleSection title="Architecture & Landscape" subtitle="Known vendor stack and architecture patterns" defaultOpen={true}>
                {techLandscape ? (
                  <div className="space-y-3">
                    {techLandscape.cloud_strategy && (
                      <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Cloud Strategy</p>
                        <p className="text-xs text-foreground">{techLandscape.cloud_strategy}</p>
                      </div>
                    )}
                    {techLandscape.known_vendors && techLandscape.known_vendors.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Known Vendors</p>
                        <div className="flex flex-wrap gap-1.5">
                          {techLandscape.known_vendors.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted/40 text-foreground border border-border/30">{v}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {techLandscape.known_applications && techLandscape.known_applications.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Applications</p>
                        <div className="space-y-0.5">
                          {techLandscape.known_applications.map((a, i) => (
                            <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary/40 mt-0.5">-</span> {a}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {techLandscape.architecture_patterns && techLandscape.architecture_patterns.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Architecture Patterns</p>
                        <div className="space-y-0.5">
                          {techLandscape.architecture_patterns.map((p, i) => (
                            <p key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary/40 mt-0.5">-</span> {p}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <EmptyPlaceholder
                    icon={<Server className="w-5 h-5" />}
                    title="No landscape data available"
                    description="Technical landscape information will appear once account intelligence is populated."
                  />
                )}
              </CollapsibleSection>

              {/* 4) Delivery Feasibility */}
              <CollapsibleSection title="Delivery Feasibility" subtitle="Readiness assessment for delivery" defaultOpen={false}>
                {readinessData ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border/40">
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Evidence Readiness</p>
                        <p className="text-xs font-medium text-foreground mt-0.5">{readinessData.score}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {Object.entries(readinessData.pillars).map(([pillar, covered]) => (
                          <span
                            key={pillar}
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[9px] font-medium border',
                              covered
                                ? 'bg-muted/40 text-foreground border-border/30'
                                : 'bg-muted/20 text-muted-foreground/60 border-border/20'
                            )}
                          >
                            {pillar}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Delivery feasibility is derived from evidence coverage across five pillars. Add customer evidence to improve coverage and unlock detailed feasibility assessment.
                    </p>
                  </div>
                ) : (
                  <EmptyPlaceholder
                    icon={<Layers className="w-5 h-5" />}
                    title="No readiness data"
                    description="Select an account and add customer evidence to generate delivery feasibility insights."
                  />
                )}
              </CollapsibleSection>

              {/* 5) Technical Risks & Blockers */}
              <CollapsibleSection title="Technical Risks & Blockers" subtitle="Technical risks and delivery blockers" defaultOpen={false}>
                {hydratedPlan ? (
                  <RisksBlockersSection
                    risks={hydratedPlan.risks}
                    focusId={selectedAccount}
                    onRefresh={refresh}
                  />
                ) : (
                  <EmptyPlaceholder
                    icon={<AlertTriangle className="w-5 h-5" />}
                    title="No technical risks identified"
                    description="Technical risks will surface once a plan is generated and delivery context is added."
                  />
                )}
              </CollapsibleSection>

              {/* Cross-reference */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 border border-border/30">
                <Briefcase className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <p className="text-[10px] text-muted-foreground">
                  Commercial sizing and ROI are tracked in the{' '}
                  <button onClick={() => setViewTab('business')} className="text-foreground underline underline-offset-2 decoration-border hover:decoration-foreground transition-colors">
                    Business
                  </button> tab.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
      </>)}
    </div>
  );
}
