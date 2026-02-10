// On-Demand Briefings Section for Partner homepage
// Replaces Trending Packs + Plays with a unified briefing system

import { useState } from 'react';
import {
  Headphones,
  BookOpen,
  Radio,
  Globe,
  Sword,
  Shield,
  Cpu,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { MicrocastViewer } from './MicrocastViewer';
import { usePartnerData } from '@/contexts/FocusDataContext';
import type { BriefingType, BriefingArtifact, BriefingSourceMode } from '@/data/partner/briefingContracts';
import {
  hasSeededBriefing,
  createBriefingRequest,
  generateBriefingArtifactFromRequest,
  listBriefingArtifacts,
} from '@/data/partner/briefingProvider';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { MicrocastV1 } from '@/data/partner/contracts';

interface BriefingCardConfig {
  type: BriefingType;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultFocusId?: string;
  defaultVendorId?: string;
}

const BRIEFING_CARDS: BriefingCardConfig[] = [
  {
    type: 'vendor_updates',
    label: 'Vendor Product Updates',
    description: 'Latest vendor changes relevant to your pipeline.',
    icon: <Cpu className="w-4 h-4" />,
    defaultVendorId: 'vendor-microsoft',
  },
  {
    type: 'account_microcast',
    label: 'Account Microcast',
    description: 'Key signals and actions for a specific account.',
    icon: <Radio className="w-4 h-4" />,
    defaultFocusId: 'focus-schindler',
  },
  {
    type: 'industry_microcast',
    label: 'Industry Microcast',
    description: 'Market trends and peer benchmarks.',
    icon: <Globe className="w-4 h-4" />,
    defaultFocusId: 'focus-schindler',
  },
  {
    type: 'competitive_microcast',
    label: 'Competitive Angle',
    description: 'Positioning guidance against key competitors.',
    icon: <Sword className="w-4 h-4" />,
    defaultVendorId: 'vendor-microsoft',
  },
  {
    type: 'objections_brief',
    label: 'Objection Briefing',
    description: 'Top objections with approved responses and evidence.',
    icon: <Shield className="w-4 h-4" />,
    defaultFocusId: 'focus-schindler',
  },
];

interface OnDemandBriefingsSectionProps {
  sourceMode?: BriefingSourceMode;
}

export function OnDemandBriefingsSection({ sourceMode = 'seeded_only' }: OnDemandBriefingsSectionProps) {
  const { provider } = usePartnerData();
  const ctx = provider.getActiveContext();
  const hubOrgId = ctx?.hubOrgId ?? 'hub-alpnova';

  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<BriefingArtifact | null>(null);
  const [viewMode, setViewMode] = useState<'play' | 'read'>('play');
  const [recentList, setRecentList] = useState<BriefingArtifact[]>([]);

  const handleOpen = (card: BriefingCardConfig, mode: 'play' | 'read') => {
    const req = createBriefingRequest({
      hubOrgId,
      focusId: card.defaultFocusId,
      vendorId: card.defaultVendorId,
      briefingType: card.type,
    });
    const result = generateBriefingArtifactFromRequest(req, sourceMode);
    if (result.kind === 'found') {
      setActiveArtifact(result.artifact);
      setViewMode(mode);
      setViewerOpen(true);
      setRecentList(listBriefingArtifacts(hubOrgId, undefined, 3));
    }
  };

  const isAvailable = (card: BriefingCardConfig): boolean => {
    return hasSeededBriefing({
      hubOrgId,
      briefingType: card.type,
      focusId: card.defaultFocusId,
      vendorId: card.defaultVendorId,
    });
  };

  return (
    <section className="space-y-4">
      <SectionHeader
        title="On-Demand Briefings"
        subtitle="Generate short briefings when you need them — audio or read."
      />

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {BRIEFING_CARDS.map((card) => {
          const available = sourceMode === 'seeded_then_generate' || isAvailable(card);
          return (
            <div
              key={card.type}
              className={cn(
                "rounded-xl border bg-card p-4 space-y-3",
                "shadow-[0_1px_3px_rgba(0,0,0,0.04)]",
                available
                  ? "border-border hover:border-primary/30 transition-colors"
                  : "border-border/50 opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{card.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{card.description}</p>
                </div>
              </div>

              {available ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpen(card, 'play')}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                      "bg-primary text-primary-foreground",
                      "hover:bg-primary/90 transition-colors"
                    )}
                  >
                    <Headphones className="w-3 h-3" />
                    {sourceMode === 'seeded_then_generate' && !isAvailable(card) ? 'Generate' : 'Play'}
                  </button>
                  <button
                    onClick={() => handleOpen(card, 'read')}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                      "border border-border text-foreground",
                      "hover:bg-muted/50 transition-colors"
                    )}
                  >
                    <BookOpen className="w-3 h-3" />
                    Open
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Not available in demo
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Briefings */}
      {recentList.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Recent briefings
          </p>
          <div className="space-y-2">
            {recentList.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/60"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{b.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {b.estMinutes} min
                    {b.isSimulated && ' · Simulated (Demo)'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setActiveArtifact(b);
                      setViewMode('play');
                      setViewerOpen(true);
                    }}
                    className="text-xs text-primary font-medium hover:text-primary/80"
                  >
                    Play
                  </button>
                  <button
                    onClick={() => {
                      setActiveArtifact(b);
                      setViewMode('read');
                      setViewerOpen(true);
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Briefing Viewer Dialog */}
      <BriefingViewerDialog
        artifact={activeArtifact}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        initialMode={viewMode}
      />
    </section>
  );
}

// ============= Briefing Viewer Dialog =============

function BriefingViewerDialog({
  artifact,
  open,
  onOpenChange,
  initialMode = 'play',
}: {
  artifact: BriefingArtifact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: 'play' | 'read';
}) {
  const [mode, setMode] = useState<'play' | 'read'>(initialMode);

  // Reset mode when artifact changes
  if (!artifact) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        "max-sm:h-[100dvh] max-sm:max-h-[100dvh] max-sm:w-full max-sm:max-w-full max-sm:rounded-none",
        "sm:max-w-lg sm:max-h-[85vh] sm:rounded-2xl"
      )}>
        <DialogTitle className="sr-only">{artifact.title}</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Briefing</p>
              <p className="text-[11px] text-muted-foreground">{artifact.estMinutes} min</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>

        {/* Mode toggle */}
        <div className="px-4 pt-3">
          <div className="inline-flex rounded-lg bg-muted/50 p-0.5 border border-border/60">
            <button
              onClick={() => setMode('play')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                mode === 'play'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Headphones className="w-3 h-3" />
              Play
            </button>
            <button
              onClick={() => setMode('read')}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                mode === 'read'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <BookOpen className="w-3 h-3" />
              Read
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <h2 className="text-lg font-semibold leading-tight text-foreground">{artifact.title}</h2>

          {artifact.isSimulated && (
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Info className="w-3 h-3" /> Demo artifact — simulated content
            </p>
          )}

          {/* Script or Read */}
          {mode === 'play' ? (
            <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5" /> Now Playing — Script
              </p>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {artifact.scriptText}
              </div>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {artifact.readText}
              </div>
            </div>
          )}

          {/* Actions */}
          {artifact.actions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Actions</p>
              <div className="space-y-2">
                {artifact.actions.map((action, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-foreground">{action.title}</p>
                    </div>
                    <div className="ml-[30px] space-y-0.5">
                      <p className="text-[11px] text-muted-foreground">
                        <span className="font-medium">Who:</span> {action.who}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        <span className="font-medium">Clarify:</span> {action.whatToClarify}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Objections (if present) */}
          {artifact.objections && artifact.objections.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Objections & Proof
              </p>
              <div className="space-y-2">
                {artifact.objections.map((obj, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1.5">
                    <p className="text-xs font-semibold text-destructive/80">{obj.theme}</p>
                    <p className="text-sm text-muted-foreground italic">"{obj.pushback}"</p>
                    <p className="text-sm text-foreground">{obj.response}</p>
                    {obj.evidence && (
                      <p className="text-[11px] text-primary">📎 {obj.evidence}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proof Artifacts */}
          {artifact.proofArtifacts.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Evidence</p>
              <div className="space-y-1.5">
                {artifact.proofArtifacts.map((proof, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary/60 mt-0.5">✓</span>
                    <p className="text-foreground">{proof}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sources */}
          {artifact.sources.length > 0 && (
            <div className="pt-2 border-t border-border/60">
              <p className="text-[11px] text-muted-foreground mb-1.5">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {artifact.sources.map((src, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground border border-border/40">
                    {src.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
