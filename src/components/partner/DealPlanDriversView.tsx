// Deal Plan Drivers View — comprehensive workspace with full driver detail,
// role toggle (Seller/Engineer), and editable planning sections.

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
  Info,
  Users,
  Briefcase,
  Wrench,
  Target,
  MessageSquare,
  FileText,
  Shield,
  Clock,
  HelpCircle,
  Pencil,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  getDealPlan,
  removePromotedSignal,
  type PromotedSignal,
} from '@/data/partner/dealPlanStore';
import type { Signal } from '@/data/partner/signalStore';

const FOCUS_ID = 'schindler';
const WEEK_OF = '2026-02-10';

type RoleView = 'seller' | 'engineer';

interface DealPlanDriversViewProps {
  onGoToQuickBrief: () => void;
}

// ============= Editable Text Block =============

function EditableBlock({ label, icon, value, onChange, placeholder }: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
    toast.success(`${label} updated`);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          {icon}
          {label}
        </p>
        {!editing ? (
          <button onClick={() => { setDraft(value); setEditing(true); }} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">
            <Pencil className="w-3 h-3" /> Edit
          </button>
        ) : (
          <button onClick={handleSave} className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5">
            <Check className="w-3 h-3" /> Save
          </button>
        )}
      </div>
      {editing ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="text-xs min-h-[60px]"
        />
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {value || <span className="italic">{placeholder}</span>}
        </p>
      )}
    </div>
  );
}

// ============= Signal Type Badge =============

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

  // Editable workspace fields (session-only for MVP)
  const [dealObjective, setDealObjective] = useState('');
  const [currentSituation, setCurrentSituation] = useState('');
  const [stakeholders, setStakeholders] = useState('');
  const [risks, setRisks] = useState('');
  const [executionPlan, setExecutionPlan] = useState('');

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

  // Confidence summary
  const avgConfidence = useMemo(() => {
    if (drivers.length === 0) return null;
    const avg = Math.round(drivers.reduce((a, d) => a + d.snapshot.confidence, 0) / drivers.length);
    return { score: avg, label: avg >= 60 ? 'High' : avg >= 40 ? 'Medium' : 'Low' };
  }, [drivers]);

  // Aggregated objections & proof
  const aggregatedProof = useMemo(() => {
    const items = new Set<string>();
    drivers.forEach((d) => d.snapshot.proofToRequest.forEach((p) => items.add(p)));
    return Array.from(items);
  }, [drivers]);

  const aggregatedMissing = useMemo(() => {
    const items = new Set<string>();
    drivers.forEach((d) => d.snapshot.whatsMissing.forEach((m) => items.add(m)));
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
            Promote signals from Quick Brief to start Deal Planning.
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Deal Planning — {drivers.length} driver{drivers.length !== 1 ? 's' : ''}
          </h3>
        </div>

        {/* Role toggle */}
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

      {/* Confidence summary */}
      {avgConfidence && (
        <div className="p-3 rounded-xl bg-muted/20 border border-border/40 flex items-center gap-3">
          <span className={cn('text-lg font-bold', confidenceColor(avgConfidence.score))}>
            {avgConfidence.score}%
          </span>
          <div>
            <p className="text-xs font-medium text-foreground">
              {avgConfidence.label} confidence
            </p>
            <p className="text-[11px] text-muted-foreground">
              Average across {drivers.length} promoted signal{drivers.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Drivers */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Promoted Drivers
        </p>
        <div className="space-y-2">
          {drivers.map((d) => (
            <DriverCard
              key={d.signalId}
              driver={d}
              isExpanded={expandedIds.has(d.signalId)}
              roleView={roleView}
              onToggle={() => toggleExpand(d.signalId)}
              onRemove={() => handleRemove(d.signalId)}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* Aggregated sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {aggregatedMissing.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              Open Questions (aggregated)
            </p>
            <div className="space-y-1.5">
              {aggregatedMissing.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <AlertTriangle className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {aggregatedProof.length > 0 && (
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-primary" />
              Proof to Request (aggregated)
            </p>
            <div className="space-y-1.5">
              {aggregatedProof.map((item, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs">
                  <Link2 className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editable workspace sections */}
      <div className="space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Planning Workspace
        </p>

        <EditableBlock
          label="Deal Objective"
          icon={<Target className="w-3.5 h-3.5" />}
          value={dealObjective}
          onChange={setDealObjective}
          placeholder="What is the primary outcome we're pursuing with this account?"
        />

        <EditableBlock
          label="Current Situation"
          icon={<Info className="w-3.5 h-3.5" />}
          value={currentSituation}
          onChange={setCurrentSituation}
          placeholder="Describe the current state of the engagement, recent interactions, and context."
        />

        <EditableBlock
          label="Stakeholders"
          icon={<Users className="w-3.5 h-3.5" />}
          value={stakeholders}
          onChange={setStakeholders}
          placeholder="Key stakeholders, their roles, priorities, and influence level."
        />

        <EditableBlock
          label="Risks & Blockers"
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
          value={risks}
          onChange={setRisks}
          placeholder="Known risks, blockers, or dependencies that could delay the deal."
        />

        <EditableBlock
          label="Execution Plan"
          icon={<Clock className="w-3.5 h-3.5" />}
          value={executionPlan}
          onChange={setExecutionPlan}
          placeholder="Key milestones, timeline, and next steps."
        />
      </div>
    </div>
  );
}

// ============= Driver Card =============

function DriverCard({
  driver,
  isExpanded,
  roleView,
  onToggle,
  onRemove,
  onCopy,
}: {
  driver: PromotedSignal;
  isExpanded: boolean;
  roleView: RoleView;
  onToggle: () => void;
  onRemove: () => void;
  onCopy: (text: string) => void;
}) {
  const s = driver.snapshot;
  const typeColor = TYPE_COLORS[s.type] ?? 'bg-muted text-muted-foreground border-border';

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Collapsed header */}
      <div
        className="flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={onToggle}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full border', typeColor)}>
              {s.type}
            </span>
            <span className={cn('text-[10px] font-bold', s.confidence >= 60 ? 'text-green-600' : 'text-primary')}>
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
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Remove from Deal Plan"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/40 pt-3">
          {/* So what */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">So what</p>
            <p className="text-xs text-foreground leading-relaxed">{s.soWhat}</p>
          </div>

          {/* Action / Next Move */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">Recommended Action</p>
            <p className="text-xs text-foreground">{s.recommendedAction}</p>
          </div>

          {/* Talk Track — emphasized in seller view */}
          <div className={cn(roleView === 'seller' && 'ring-1 ring-primary/20 rounded-lg')}>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Talk Track
                  {roleView === 'seller' && <span className="text-primary ml-1">★</span>}
                </p>
                <button onClick={() => onCopy(s.talkTrack)} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{s.talkTrack}</p>
            </div>
          </div>

          {/* What changed */}
          {s.whatChanged.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">What changed</p>
              <ul className="space-y-1">
                {s.whatChanged.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Two-column: Proof + Missing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Proof to request — emphasized in seller */}
            {s.proofToRequest.length > 0 && (
              <div className={cn(roleView === 'seller' && 'ring-1 ring-primary/20 rounded-lg p-0.5')}>
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Proof to Request
                    {roleView === 'seller' && <span className="text-primary ml-1">★</span>}
                  </p>
                  <div className="space-y-1">
                    {s.proofToRequest.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs">
                        <Link2 className="w-3 h-3 text-primary/50 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* What's missing — emphasized in engineer */}
            {s.whatsMissing.length > 0 && (
              <div className={cn(roleView === 'engineer' && 'ring-1 ring-primary/20 rounded-lg p-0.5')}>
                <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    What&apos;s Missing
                    {roleView === 'engineer' && <span className="text-primary ml-1">★</span>}
                  </p>
                  <div className="space-y-1">
                    {s.whatsMissing.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs">
                        <AlertTriangle className="w-3 h-3 text-primary/50 mt-0.5 flex-shrink-0" />
                        <p className="text-muted-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Who cares — emphasized in seller */}
          {s.whoCares.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Who Cares
                {roleView === 'seller' && <span className="text-primary ml-1">★</span>}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {s.whoCares.map((role, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50 text-[10px] font-medium">
                    <Users className="w-2.5 h-2.5" />
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {s.sources.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {s.sources.map((src, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[10px] text-muted-foreground">{src}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
