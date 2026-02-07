// Strategy Shift Tab — SI business model change surface (admin-only)
// 3 capped sections, action-anchored to Packages / Profile / Vendors / Tools

import { useState } from 'react';
import {
  TrendingDown,
  Map,
  Layers,
  ArrowRight,
  Package,
  Building2,
  TrendingUp,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  StrategyCard,
  StrategyCardCategory,
  getStrategyCardsByCategory,
  STRATEGY_CATEGORY_LABELS,
  STRATEGY_ACTION_LABELS,
} from '@/data/partnerStrategyShift';

// ── Section config ─────────────────────────────────────

const SECTIONS: {
  category: StrategyCardCategory;
  icon: React.ReactNode;
  maxVisible: number;
}[] = [
  { category: 'economics', icon: <TrendingDown className="w-4 h-4" />, maxVisible: 3 },
  { category: 'roadmap', icon: <Map className="w-4 h-4" />, maxVisible: 3 },
  { category: 'vendors', icon: <Layers className="w-4 h-4" />, maxVisible: 3 },
];

const ACTION_ICONS: Record<string, React.ReactNode> = {
  'create-package': <Package className="w-3.5 h-3.5" />,
  'update-profile': <Building2 className="w-3.5 h-3.5" />,
  'add-trending-vendor': <TrendingUp className="w-3.5 h-3.5" />,
  'attach-tool': <Wrench className="w-3.5 h-3.5" />,
};

// ── Time filter ────────────────────────────────────────

type TimeRange = 'month' | 'quarter';

function isWithinRange(dateStr: string, range: TimeRange): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  if (range === 'month') {
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - 1);
    return d >= cutoff;
  }
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - 3);
  return d >= cutoff;
}

// ── Strategy Card Component ────────────────────────────

function StrategyCardView({ card }: { card: StrategyCard }) {
  const actionLabel = STRATEGY_ACTION_LABELS[card.recommendedAction.type];
  const actionIcon = ACTION_ICONS[card.recommendedAction.type];

  const handleAction = () => {
    switch (card.recommendedAction.type) {
      case 'create-package':
        toast.success(`Package draft "${card.recommendedAction.suggestedName}" queued for creation`, {
          description: 'Open the Packages tab to complete the draft.',
        });
        break;
      case 'update-profile':
        toast.info(`Navigate to Partner Profile → ${card.recommendedAction.section}`, {
          description: 'Review and update the relevant baseline section.',
        });
        break;
      case 'add-trending-vendor':
        toast.success(`"${card.recommendedAction.suggestedName}" added to Trending watchlist`, {
          description: 'Open Vendors — Trending to set expiry and recommended action.',
        });
        break;
      case 'attach-tool':
        toast.info(`Map "${card.recommendedAction.toolName}" to package`, {
          description: 'Open Tools & Agents tab to configure the mapping.',
        });
        break;
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3 hover:shadow-sm transition-shadow">
      {/* Title */}
      <p className="text-sm font-semibold text-foreground leading-snug">{card.title}</p>

      {/* What changed */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          What changed
        </p>
        <ul className="space-y-1">
          {card.whatChanged.map((bullet, i) => (
            <li key={i} className="text-xs text-foreground leading-relaxed flex items-start gap-1.5">
              <span className="text-muted-foreground mt-1 flex-shrink-0">•</span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* So what */}
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
          So what for partners
        </p>
        <ul className="space-y-1">
          {card.soWhatForPartners.map((bullet, i) => (
            <li key={i} className="text-xs text-foreground leading-relaxed flex items-start gap-1.5">
              <ChevronRight className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Decision prompt */}
      <div className="bg-muted/40 rounded-lg px-3 py-2">
        <p className="text-xs text-foreground italic leading-relaxed">
          {card.decisionPrompt}
        </p>
      </div>

      {/* Primary CTA */}
      <button
        onClick={handleAction}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {actionIcon}
        {actionLabel}
        <ArrowRight className="w-3 h-3" />
      </button>

      {/* Meta */}
      <p className="text-[10px] text-muted-foreground text-right">
        Updated {card.updatedAt}
      </p>
    </div>
  );
}

// ── Section Component ──────────────────────────────────

function StrategySection({
  category,
  icon,
  maxVisible,
  timeRange,
}: {
  category: StrategyCardCategory;
  icon: React.ReactNode;
  maxVisible: number;
  timeRange: TimeRange;
}) {
  const [showAll, setShowAll] = useState(false);
  const allCards = getStrategyCardsByCategory(category).filter(c =>
    isWithinRange(c.updatedAt, timeRange),
  );
  const visible = showAll ? allCards : allCards.slice(0, maxVisible);
  const hasMore = allCards.length > maxVisible;
  const label = STRATEGY_CATEGORY_LABELS[category];

  if (allCards.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <span className="text-[10px] text-muted-foreground/60 font-medium">{allCards.length}</span>
        <div className="flex-1 border-t border-border/40" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map(card => (
          <StrategyCardView key={card.id} card={card} />
        ))}
      </div>

      {/* View all toggle */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-primary font-medium hover:underline"
        >
          {showAll ? 'Show fewer' : `View all ${allCards.length}`}
        </button>
      )}
    </div>
  );
}

// ── Main Tab ───────────────────────────────────────────

export function StrategyShiftTab() {
  const [timeRange, setTimeRange] = useState<TimeRange>('quarter');

  return (
    <div className="space-y-6">
      {/* Intro + time filter */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            What's changing in SI economics — and what to build next.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg border border-border p-0.5">
          {(['month', 'quarter'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                timeRange === range
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {range === 'month' ? 'This month' : 'This quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      {SECTIONS.map(section => (
        <StrategySection
          key={section.category}
          category={section.category}
          icon={section.icon}
          maxVisible={section.maxVisible}
          timeRange={timeRange}
        />
      ))}
    </div>
  );
}
