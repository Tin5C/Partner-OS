// Quick Brief Output — expandable signal cards with selection & promote flow
import { useState, useCallback } from 'react';
import {
  Zap,
  Copy,
  ChevronRight,
  ChevronDown,
  ArrowUpRight,
  AlertTriangle,
  Shield,
  Target,
  Info,
  Play,
  Check,
  Link2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  promoteSignalsToDealPlan,
  ALL_SECTION_KEYS,
  SECTION_LABELS,
  type DealPlanSectionKey,
} from '@/data/partner/dealPlanSelectionStore';

export type QuickBriefNeed = 'meeting-prep' | 'objection-help' | 'competitive-position' | 'intro-email' | 'value-pitch';

export interface SignalBriefingRef {
  id: string;
  title: string;
  type: string;
}

export interface QuickBriefSignal {
  id: string;
  headline: string;
  soWhat: string;
  whatToDo: string;
  sellerTalkTrack: string[];
  engineerContext: string[];
  confidence: { score: number; label: string; reason: string };
  whatsMissing: string[];
  proofToRequest: string[];
  recommendedBriefings: SignalBriefingRef[];
  sources: { label: string; sourceType: string }[];
}

export interface QuickBriefResult {
  customerName: string;
  needs: QuickBriefNeed[];
  signals: QuickBriefSignal[];
  accountId: string;
  // Legacy fields kept for backward compat
  whatChanged: { headline: string; soWhat: string; whatToDo: string }[];
  sellerView: { talkTrack: string[]; emailDraft?: string };
  engineerView: { technicalContext: string[]; architectureNotes: string };
  confidence: { score: number; label: string; reason: string };
  whatsMissing: string[];
  recommendedPlay?: { playType: string; title: string };
  objections?: { theme: string; responses: string[]; proofArtifact?: string }[];
  contextLine?: string;
}

type PersonaTab = 'seller' | 'engineer';

interface QuickBriefOutputProps {
  result: QuickBriefResult;
  onPromoteToDealBrief: () => void;
  onReset: () => void;
}

export function QuickBriefOutput({ result, onPromoteToDealBrief, onReset }: QuickBriefOutputProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [personaTabs, setPersonaTabs] = useState<Record<string, PersonaTab>>({});
  const [sectionToggles, setSectionToggles] = useState<Record<string, Set<DealPlanSectionKey>>>({});

  const signals = result.signals ?? [];

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // Init section toggles with defaults when selecting
    setSectionToggles((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: new Set(ALL_SECTION_KEYS) };
    });
  }, []);

  const toggleSection = useCallback((signalId: string, section: DealPlanSectionKey) => {
    setSectionToggles((prev) => {
      const current = prev[signalId] ?? new Set(ALL_SECTION_KEYS);
      const next = new Set(current);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return { ...prev, [signalId]: next };
    });
  }, []);

  const getPersona = (id: string): PersonaTab => personaTabs[id] ?? 'seller';
  const setPersona = (id: string, tab: PersonaTab) =>
    setPersonaTabs((p) => ({ ...p, [id]: tab }));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handlePromote = () => {
    const selections = Array.from(selectedIds).map((signalId) => ({
      signalId,
      includedSections: Array.from(sectionToggles[signalId] ?? new Set(ALL_SECTION_KEYS)),
    }));

    promoteSignalsToDealPlan(result.accountId, selections);
    toast.success(`Promoted ${selections.length} signal${selections.length > 1 ? 's' : ''} to Deal Planning`);
  };

  const confidenceColor = (score: number) =>
    score >= 60 ? 'text-green-600' : score >= 40 ? 'text-primary' : 'text-red-500';

  if (signals.length === 0) {
    // Fallback to legacy layout — shouldn't happen with proper data
    return null;
  }

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Quick Brief: {result.customerName}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePromote}
            disabled={selectedIds.size === 0}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              selectedIds.size > 0
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
            )}
          >
            <ArrowUpRight className="w-3 h-3" />
            Promote to Deal Planning
            {selectedIds.size > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary-foreground/20 text-[10px]">
                {selectedIds.size}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-[11px] text-muted-foreground flex items-center gap-1 flex-1">
          <Info className="w-3 h-3" />
          Based on your Dialogue activity
        </p>
        <button
          onClick={() => {
            const allSelected = signals.every((s) => selectedIds.has(s.id));
            if (allSelected) {
              setSelectedIds(new Set());
            } else {
              const allIds = new Set(signals.map((s) => s.id));
              setSelectedIds(allIds);
              setSectionToggles((prev) => {
                const next = { ...prev };
                signals.forEach((s) => { if (!next[s.id]) next[s.id] = new Set(ALL_SECTION_KEYS); });
                return next;
              });
            }
          }}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <Check className="w-3 h-3" />
          {signals.every((s) => selectedIds.has(s.id)) ? 'Deselect all' : 'Select all'}
        </button>
        {selectedIds.size > 0 && (
          <button
            onClick={() => setExpandedIds(new Set(selectedIds))}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ChevronDown className="w-3 h-3" />
            Expand selected
          </button>
        )}
      </div>

      {/* Signal Cards */}
      <div className="space-y-2">
        {signals.map((signal, idx) => {
          const isExpanded = expandedIds.has(signal.id);
          const isSelected = selectedIds.has(signal.id);
          const persona = getPersona(signal.id);
          const sections = sectionToggles[signal.id] ?? new Set(ALL_SECTION_KEYS);

          return (
            <div
              key={signal.id}
              className={cn(
                'rounded-xl border transition-all',
                isSelected
                  ? 'border-primary/40 bg-primary/[0.02]'
                  : 'border-border/60 bg-muted/20'
              )}
            >
              {/* Collapsed header */}
              <div className="flex items-start gap-3 p-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(signal.id)}
                  className={cn(
                    'mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all',
                    isSelected
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </button>

                {/* Number badge */}
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground leading-snug">
                    {signal.headline}
                  </p>
                  {signal.soWhat && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {signal.soWhat}
                    </p>
                  )}
                  {signal.whatToDo && !isExpanded && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
                      → {signal.whatToDo}
                    </p>
                  )}
                </div>

                {/* Expand chevron */}
                <button
                  onClick={() => toggleExpand(signal.id)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex-shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Expanded sections */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t border-border/40 pt-3 ml-[52px]">
                  {/* Section toggles (when selected for promote) */}
                  {isSelected && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="text-[10px] text-muted-foreground/70 mr-1 self-center">Include:</span>
                      {ALL_SECTION_KEYS.map((key) => (
                        <button
                          key={key}
                          onClick={() => toggleSection(signal.id, key)}
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all',
                            sections.has(key)
                              ? 'bg-primary/10 text-primary border-primary/20'
                              : 'bg-muted/30 text-muted-foreground/60 border-border/40 line-through'
                          )}
                        >
                          {SECTION_LABELS[key]}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 1) Talk Track with persona toggle */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <button
                        onClick={() => setPersona(signal.id, 'seller')}
                        className={cn(
                          'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all',
                          persona === 'seller'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <Target className="w-3 h-3 inline mr-1" />
                        Seller
                      </button>
                      <button
                        onClick={() => setPersona(signal.id, 'engineer')}
                        className={cn(
                          'px-2.5 py-1 rounded-md text-[11px] font-medium transition-all',
                          persona === 'engineer'
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        )}
                      >
                        <Shield className="w-3 h-3 inline mr-1" />
                        Engineer
                      </button>
                      <button
                        onClick={() =>
                          handleCopy(
                            (persona === 'seller'
                              ? signal.sellerTalkTrack
                              : signal.engineerContext
                            ).join('\n')
                          )
                        }
                        className="ml-auto text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {(persona === 'seller'
                        ? signal.sellerTalkTrack
                        : signal.engineerContext
                      ).map((point, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-foreground leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2) Confidence */}
                  <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-bold', confidenceColor(signal.confidence.score))}>
                        {signal.confidence.score}%
                      </span>
                      <span className={cn('text-[11px] font-medium', confidenceColor(signal.confidence.score))}>
                        {signal.confidence.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {signal.confidence.reason}
                    </p>
                  </div>

                  {/* 3) What's missing */}
                  {signal.whatsMissing.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        What's missing
                      </p>
                      <div className="space-y-1">
                        {signal.whatsMissing.map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs">
                            <AlertTriangle className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                            <p className="text-muted-foreground">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4) Proof to request */}
                  {signal.proofToRequest.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Proof to request
                      </p>
                      <div className="space-y-1">
                        {signal.proofToRequest.map((item, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs">
                            <Link2 className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
                            <p className="text-muted-foreground">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5) Recommended briefings */}
                  {signal.recommendedBriefings.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Recommended briefings
                      </p>
                      <div className="space-y-1.5">
                        {signal.recommendedBriefings.map((b) => (
                          <div
                            key={b.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/40"
                          >
                            <div>
                              <p className="text-xs font-medium text-foreground">{b.title}</p>
                              <p className="text-[10px] text-muted-foreground capitalize">{b.type.replace(/_/g, ' ')}</p>
                            </div>
                            <button
                              onClick={() => toast.info('Briefing viewer coming soon')}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-primary hover:bg-primary/5 transition-colors"
                            >
                              <Play className="w-3 h-3" />
                              Open
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6) Sources */}
                  {signal.sources.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {signal.sources.map((s, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-muted/40 border border-border/40 text-[10px] text-muted-foreground"
                          >
                            {s.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Promote CTA (bottom, for visibility) */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium">
              {selectedIds.size} signal{selectedIds.size > 1 ? 's' : ''} selected
            </p>
            <p className="text-[11px] text-muted-foreground">
              References will be linked to Deal Planning — no content is copied.
            </p>
          </div>
          <button
            onClick={() => { handlePromote(); onPromoteToDealBrief(); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            Open Deal Planning
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Context attribution */}
      {result.contextLine && (
        <p className="text-[11px] text-muted-foreground/70 text-center italic">
          {result.contextLine}
        </p>
      )}

      {/* Reset */}
      <div className="flex justify-center pt-1">
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          New quick brief
        </button>
      </div>
    </div>
  );
}
