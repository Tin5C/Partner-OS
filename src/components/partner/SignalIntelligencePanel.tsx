// Signal Intelligence Panel — full analytical view of a signal
// Sections: Summary, What Changed, Why It Matters, Who Cares, Conversion Paths, Related Signals, Source Layer
// Action bar: Open Quick Brief + See Related Signals

import { useMemo, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  TrendingUp,
  Swords,
  Building2,
  Users,
  Target,
  Link2,
  FileText,
  Clock,
  Briefcase,
  Zap,
  ChevronDown,
  Square,
  CheckSquare,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PartnerStory, signalTypeColors } from '@/data/partnerStories';
import { getRotatedCategoryImage, CATEGORY_TINTS, getTimeAgo } from '@/data/partner/signalImageTaxonomy';
import type { SignalCategory } from '@/data/partner/signalImageTaxonomy';
import { toast } from 'sonner';
import { BriefingModePill } from './BriefingModePill';
import { setQuickBriefTrigger } from '@/data/partner/quickBriefTrigger';
import { resolveCanonicalMeta } from '@/services/ids';

interface SignalIntelligencePanelProps {
  story: PartnerStory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  currentIndex?: number;
  totalCount?: number;
  allStories?: PartnerStory[];
  onBuildAccountBrief?: (anchorStory: PartnerStory, selectedSignals: PartnerStory[]) => void;
}

// Role impact mapping
const ROLE_IMPACTS: Record<string, string> = {
  CTO: 'Owns technical strategy and AI adoption roadmap',
  CISO: 'Gates all AI deployments via security and governance review',
  'CISO/Security': 'Gates all AI deployments via security and governance review',
  'Security Lead/CISO': 'Gates all AI deployments via security and governance review',
  CFO: 'Scrutinizes AI unit economics and ROI thresholds',
  'CFO/Finance': 'Scrutinizes AI unit economics and ROI thresholds',
  'VP Engineering': 'Champions digital transformation initiatives',
  'CIO/IT Program': 'Manages IT portfolio and vendor consolidation',
  Procurement: 'Enforces procurement workflows and cost gates',
  'Head of Procurement': 'Enforces procurement workflows and cost gates',
  Ops: 'Operates field and production systems',
  'Head of Field Service Ops': 'Operates field workforce and maintenance systems',
  Compliance: 'Ensures regulatory alignment and audit readiness',
  'Legal/Compliance': 'Ensures regulatory alignment and audit readiness',
  'Risk/Compliance': 'Ensures regulatory alignment and audit readiness',
  'Chief Compliance Officer': 'Ensures regulatory alignment and audit readiness',
  'Enterprise Architect': 'Designs system architecture and integration patterns',
  'Solution Architect': 'Designs solution architecture and validates feasibility',
  Finance: 'Controls budgets and spend governance',
  'IT Program': 'Coordinates cross-functional IT initiatives',
  'Head of Digital Transformation': 'Drives digital strategy and innovation programs',
  'Head of Product': 'Owns product roadmap and feature prioritization',
};

// Strategic impact assessment by signal type
function getStrategicImpact(story: PartnerStory): { market: string; competitive: string; regulatory: string; vendor: string } {
  const type = story.signalType;
  return {
    market: type === 'LocalMarket'
      ? 'Direct market impact — affects regional operations and investment decisions.'
      : 'Indirect market effect — shifts industry positioning and buyer expectations.',
    competitive: type === 'Vendor'
      ? 'Vendor capability shift creates first-mover advantage for aligned partners.'
      : 'Competitive landscape is evolving — differentiation window is narrowing.',
    regulatory: type === 'Regulatory'
      ? 'Hard compliance deadline — non-compliance carries financial and operational risk.'
      : 'Soft regulatory influence — governance alignment accelerates deal velocity.',
    vendor: type === 'Vendor'
      ? 'Direct vendor leverage — new capability unlocks previously blocked scenarios.'
      : 'Vendor ecosystem effect — indirect influence on platform selection and migration.',
  };
}

// Conversion paths
function getConversionPaths(story: PartnerStory) {
  return [
    {
      label: 'Discovery Angle',
      icon: <Target className="w-3.5 h-3.5" />,
      description: story.nextMove?.talkTrack || 'Use this signal to open a discovery conversation about current pain points and planned initiatives.',
    },
    {
      label: 'Pilot Angle',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      description: `Propose a scoped pilot to validate the signal's impact — start small, measure fast, expand on evidence.`,
    },
    {
      label: 'Governance Angle',
      icon: <Shield className="w-3.5 h-3.5" />,
      description: 'Align your proposal to the customer\'s governance framework to accelerate approval and reduce friction.',
    },
    {
      label: 'Competitive Angle',
      icon: <Swords className="w-3.5 h-3.5" />,
      description: 'Position against competitors who lack this capability or compliance posture.',
    },
  ];
}

// Source type mapping
function getSourceType(sourceName?: string): string {
  if (!sourceName) return 'Internal';
  const lower = sourceName.toLowerCase();
  if (lower.includes('regulation') || lower.includes('eu') || lower.includes('official')) return 'Regulation';
  if (lower.includes('blog') || lower.includes('announcement')) return 'Blog / PR';
  if (lower.includes('earnings') || lower.includes('ir') || lower.includes('filing')) return 'Earnings';
  if (lower.includes('analyst') || lower.includes('gartner') || lower.includes('idc')) return 'Analyst Report';
  if (lower.includes('internal')) return 'Internal Activity';
  return 'Industry Report';
}

function SectionBlock({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

// Ranking logic for related signals
function rankRelatedSignals(anchor: PartnerStory, candidates: PartnerStory[]): PartnerStory[] {
  return candidates
    .filter(s => s.id !== anchor.id)
    .map(s => {
      let score = 0;
      // Same signal type (vendor/capability cluster)
      if (s.signalType === anchor.signalType) score += 3;
      // Overlapping stakeholders
      const anchorRoles = new Set(anchor.whoCares ?? []);
      (s.whoCares ?? []).forEach(r => { if (anchorRoles.has(r)) score += 2; });
      // Same tags (capability cluster)
      const anchorTags = new Set((anchor.tags ?? []).map(t => t.toLowerCase()));
      (s.tags ?? []).forEach(t => { if (anchorTags.has(t.toLowerCase())) score += 1; });
      // Higher confidence
      score += ((s.relevance_score ?? 50) / 100);
      return { story: s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(r => r.story);
}

// Generate a 1-line implication that doesn't repeat the anchor story text
function getUniqueImplication(signal: PartnerStory, anchor: PartnerStory): string {
  // Use whatChanged if it's different enough from the anchor soWhat
  if (signal.whatChanged && signal.whatChanged !== anchor.soWhat) {
    return signal.whatChanged;
  }
  // Fall back to soWhat but ensure it's different
  if (signal.soWhat !== anchor.soWhat) {
    return signal.soWhat;
  }
  return `${signal.signalType} signal with relevance to same stakeholders.`;
}

export function SignalIntelligencePanel({
  story,
  open,
  onOpenChange,
  onClose,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  currentIndex = 0,
  totalCount = 1,
  allStories = [],
  onBuildAccountBrief,
}: SignalIntelligencePanelProps) {
  const [showRelated, setShowRelated] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Related signals with smart ranking
  const relatedSignals = useMemo(() => {
    if (!story) return [];
    return rankRelatedSignals(story, allStories);
  }, [allStories, story]);

  // Reset state when story changes
  const storyId = story?.id;
  const [prevStoryId, setPrevStoryId] = useState(storyId);
  if (storyId !== prevStoryId) {
    setPrevStoryId(storyId);
    setShowRelated(false);
    setSelectedIds(new Set());
  }

  if (!story) return null;

  const category = story.signalType as SignalCategory;
  const coverImg = story.coverUrl || getRotatedCategoryImage(category, story.id);
  const tintClass = CATEGORY_TINTS[category] || CATEGORY_TINTS.Vendor;
  const timeAgo = getTimeAgo(story.publishedAt);
  const impact = getStrategicImpact(story);
  const paths = getConversionPaths(story);
  const sourceType = getSourceType(story.sourceName);
  const confidenceScore = story.relevance_score ?? 70;

  const whatChangedBullets = story.whatChangedBullets ?? (story.whatChanged ? [story.whatChanged] : []);
  const roles = story.whoCares ?? [];

  const toggleSignalSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const triggerQuickBrief = () => {
    const meta = resolveCanonicalMeta({
      focusId: 'schindler',
      weekOf: '2026-02-10',
    });

    if (import.meta.env.DEV) {
      console.log('[Quick Brief launch]', meta);
    }

    setQuickBriefTrigger({
      storyTitle: story.headline,
      customer: 'Schindler',
      category: story.signalType,
      tags: story.tags,
      canonicalMeta: meta,
    });
    onClose();
    // Scroll to Quick Brief section
    setTimeout(() => {
      const el = document.getElementById('section-quick-brief');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleAddSelectedToQuickBrief = () => {
    triggerQuickBrief();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden flex flex-col",
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
        "sm:max-w-2xl sm:max-h-[90vh] sm:rounded-2xl"
      )}>
        <DialogTitle className="sr-only">Signal Intelligence — {story.headline}</DialogTitle>

        {/* Hero header with image */}
        <div className="relative h-36 overflow-hidden bg-muted">
          <img src={coverImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className={cn("absolute inset-0", tintClass)} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

          {/* Navigation bar */}
          <div className="absolute top-0 inset-x-0 flex items-center justify-between p-3 z-10">
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2.5 py-1 text-[10px] font-semibold rounded-full border backdrop-blur-md",
                signalTypeColors[story.signalType]
              )}>
                {story.signalType}
              </span>
              <span className="text-[10px] text-white/70">
                {currentIndex + 1} / {totalCount}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {hasPrev && (
                <Button variant="ghost" size="icon" onClick={onPrev} className="h-7 w-7 text-white hover:bg-white/20">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {hasNext && (
                <Button variant="ghost" size="icon" onClick={onNext} className="h-7 w-7 text-white hover:bg-white/20">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 text-white hover:bg-white/20">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bottom: headline on hero */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-10">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] text-white/60 uppercase tracking-wide font-medium">Signal Intelligence</p>
              <BriefingModePill mode="curated" className="[&_span]:bg-white/15 [&_span]:text-white/90 [&_span]:border-white/25 [&_button]:text-white/50" />
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">{story.headline}</h2>
          </div>
        </div>

        {/* Action bar — compact, horizontal */}
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={triggerQuickBrief}
          >
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            Open Quick Brief
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setShowRelated(!showRelated)}
          >
            <Link2 className="h-3.5 w-3.5 mr-1.5" />
            {showRelated ? 'Hide Related' : `See Related Signals (${relatedSignals.length})`}
            <ChevronDown className={cn("h-3 w-3 ml-1 transition-transform", showRelated && "rotate-180")} />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">

          {/* Inline Related Signals (expandable) */}
          {showRelated && relatedSignals.length > 0 && (
            <div className="rounded-xl border border-primary/15 bg-primary/[0.02] p-4 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                Related Signals
              </p>
              <div className="space-y-2">
                {relatedSignals.map((s) => {
                  const isSelected = selectedIds.has(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleSignalSelection(s.id)}
                      className={cn(
                        "w-full flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all",
                        isSelected
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/40 bg-card hover:border-border"
                      )}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-primary" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn(
                            "px-2 py-0.5 text-[9px] font-medium rounded-full border flex-shrink-0",
                            signalTypeColors[s.signalType]
                          )}>
                            {s.signalType}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-foreground line-clamp-1">{s.headline}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {getUniqueImplication(s, story)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedIds.size > 0 && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleAddSelectedToQuickBrief}
                >
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Add Selected to Quick Brief ({selectedIds.size})
                </Button>
              )}
            </div>
          )}

          {/* A. Signal Summary */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full",
              confidenceScore >= 75 ? "bg-green-500/10 text-green-600 border border-green-500/20" :
              confidenceScore >= 50 ? "bg-primary/10 text-primary border border-primary/20" :
              "bg-red-500/10 text-red-500 border border-red-500/20"
            )}>
              {confidenceScore}% confidence
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
            {story.sourceName && (
              <span className="text-[11px] text-muted-foreground">
                via {story.sourceName}
              </span>
            )}
          </div>

          {/* So what */}
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-sm leading-relaxed">
              <span className="font-semibold text-primary">So what: </span>
              {story.soWhat}
            </p>
          </div>

          {/* B. What Changed (expanded) */}
          <SectionBlock title="What Changed" icon={<TrendingUp className="w-3.5 h-3.5" />}>
            {whatChangedBullets.length > 0 ? (
              <ul className="space-y-1.5">
                {whatChangedBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    <span className="text-foreground/90">{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">DATA NEEDED</p>
            )}
            {story.relevance_reasons && story.relevance_reasons.length > 0 && (
              <div className="mt-2 p-2.5 rounded-lg bg-muted/30 border border-border/40">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Context</p>
                <ul className="space-y-1">
                  {story.relevance_reasons.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {r}</li>
                  ))}
                </ul>
              </div>
            )}
          </SectionBlock>

          {/* C. Why It Matters (Strategic Impact) */}
          <SectionBlock title="Why It Matters — Strategic Impact" icon={<Swords className="w-3.5 h-3.5" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: 'Market Impact', value: impact.market, icon: <TrendingUp className="w-3 h-3" /> },
                { label: 'Competitive Pressure', value: impact.competitive, icon: <Swords className="w-3 h-3" /> },
                { label: 'Regulatory Implication', value: impact.regulatory, icon: <Shield className="w-3 h-3" /> },
                { label: 'Vendor Leverage', value: impact.vendor, icon: <Building2 className="w-3 h-3" /> },
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase flex items-center gap-1">
                    {item.icon} {item.label}
                  </p>
                  <p className="text-xs text-foreground/80 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* D. Who Cares (Role Map) */}
          <SectionBlock title="Who Cares — Role Map" icon={<Users className="w-3.5 h-3.5" />}>
            {roles.length > 0 ? (
              <div className="space-y-1.5">
                {roles.map((role, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-muted/20 border border-border/40">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {role.charAt(0)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{role}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {ROLE_IMPACTS[role] || 'Key stakeholder in this decision area.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">DATA NEEDED</p>
            )}
          </SectionBlock>

          {/* E. Conversion Paths */}
          <SectionBlock title="Conversion Paths" icon={<Target className="w-3.5 h-3.5" />}>
            <div className="space-y-2">
              {paths.map((path, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-card border border-border/50">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {path.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground">{path.label}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{path.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionBlock>

          {/* F. Source Layer */}
          <SectionBlock title="Source Layer" icon={<FileText className="w-3.5 h-3.5" />}>
            <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">{story.sourceName || 'Internal signals'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/40">
                  {sourceType}
                </span>
              </div>
              {story.tags && story.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {story.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </SectionBlock>
        </div>
      </DialogContent>
    </Dialog>
  );
}
