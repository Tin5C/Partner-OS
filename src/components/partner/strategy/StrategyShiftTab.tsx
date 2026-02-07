// Strategy Shift Tab — visually aligned with Trending Packs card language
// Signal chips → Impact line → Single CTA, grouped by category

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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  StrategyCard,
  StrategyCardCategory,
  getStrategyCardsByCategory,
  STRATEGY_CATEGORY_LABELS,
  STRATEGY_CATEGORY_SUBTITLES,
  STRATEGY_ACTION_LABELS,
} from '@/data/partnerStrategyShift';
import { Tag } from '@/components/Tag';

// ── Icons ──────────────────────────────────────────────

const CATEGORY_ICONS: Record<StrategyCardCategory, React.ReactNode> = {
  economics: <TrendingDown className="w-4 h-4" />,
  roadmap: <Map className="w-4 h-4" />,
  vendors: <Layers className="w-4 h-4" />,
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  'create-package': <Package className="w-3.5 h-3.5" />,
  'update-profile': <Building2 className="w-3.5 h-3.5" />,
  'add-trending-vendor': <TrendingUp className="w-3.5 h-3.5" />,
  'attach-tool': <Wrench className="w-3.5 h-3.5" />,
};

const SECTION_ORDER: StrategyCardCategory[] = ['economics', 'roadmap', 'vendors'];

// ── Time filter ────────────────────────────────────────

type TimeRange = 'month' | 'quarter';

function isWithinRange(dateStr: string, range: TimeRange): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - (range === 'month' ? 1 : 3));
  return d >= cutoff;
}

// ── Strategy Card (matches Trending Pack card style) ───

function StrategyCardView({ card }: { card: StrategyCard }) {
  const actionLabel = STRATEGY_ACTION_LABELS[card.recommendedAction.type];
  const actionIcon = ACTION_ICONS[card.recommendedAction.type];

  const handleAction = () => {
    switch (card.recommendedAction.type) {
      case 'create-package':
        toast.success(`Package draft "${card.recommendedAction.suggestedName}" queued`, {
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

  // Emphasize first word of impact line
  const impactParts = card.impactLine.split(': ');
  const impactPrefix = impactParts.length > 1 ? impactParts[0] + ': ' : '';
  const impactBody = impactParts.length > 1 ? impactParts.slice(1).join(': ') : card.impactLine;

  return (
    <div
      className={cn(
        'group relative flex flex-col p-4 rounded-xl',
        'border border-border bg-card',
        'hover:shadow-md hover:border-border/80 transition-all duration-200',
      )}
    >
      {/* Header: category icon + timestamp */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-muted/60 flex items-center justify-center text-muted-foreground">
          {CATEGORY_ICONS[card.category]}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {card.updatedAt}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-3">
        {card.title}
      </h3>

      {/* Signal chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {card.signals.map((signal) => (
          <Tag key={signal} variant="default" size="sm">
            {signal}
          </Tag>
        ))}
      </div>

      {/* Impact line */}
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        <span className="font-semibold text-foreground">{impactPrefix}</span>
        {impactBody}
      </p>

      {/* Single CTA */}
      <div className="mt-auto pt-3 border-t border-border/50">
        <button
          onClick={handleAction}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          {actionIcon}
          {actionLabel}
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ── Section (horizontal row of max 3 cards) ────────────

function StrategySection({
  category,
  timeRange,
}: {
  category: StrategyCardCategory;
  timeRange: TimeRange;
}) {
  const [showAll, setShowAll] = useState(false);
  const allCards = getStrategyCardsByCategory(category).filter((c) =>
    isWithinRange(c.updatedAt, timeRange),
  );
  const maxVisible = 3;
  const visible = showAll ? allCards : allCards.slice(0, maxVisible);
  const hasMore = allCards.length > maxVisible;

  if (allCards.length === 0) return null;

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {STRATEGY_CATEGORY_LABELS[category]}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {STRATEGY_CATEGORY_SUBTITLES[category]}
          </p>
        </div>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-medium text-primary hover:underline"
          >
            {showAll ? 'Show fewer' : `View all ${allCards.length}`}
          </button>
        )}
      </div>

      {/* Horizontal card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((card) => (
          <StrategyCardView key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}

// ── Main Tab ───────────────────────────────────────────

export function StrategyShiftTab() {
  const [timeRange, setTimeRange] = useState<TimeRange>('quarter');

  return (
    <div className="space-y-8">
      {/* Intro + time filter pill */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          What's changing in SI economics — and what to build next.
        </p>
        <div className="flex items-center gap-1 bg-muted/50 rounded-full border border-border p-0.5">
          {(['month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
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
      {SECTION_ORDER.map((category) => (
        <StrategySection
          key={category}
          category={category}
          timeRange={timeRange}
        />
      ))}
    </div>
  );
}
