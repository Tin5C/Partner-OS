// Partner Story Tile — Bloomberg × Intelligence Briefing style
// 16:9 visual area + headline + intelligence strip
// Uses rotated category images, tints, source badges, freshness

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { PartnerStory, signalTypeColors } from '@/data/partnerStories';
import { ListenedState } from '@/lib/stories';
import { Volume2, Check, Clock, Users } from 'lucide-react';
import { getRotatedCategoryImage, CATEGORY_TINTS, getTimeAgo } from '@/data/partner/signalImageTaxonomy';
import type { SignalCategory } from '@/data/partner/signalImageTaxonomy';

// Urgency chip logic
function getUrgencyChip(story: PartnerStory): { label: string; emoji: string } | null {
  const score = story.relevance_score ?? 0;
  if (score >= 90) return { label: 'Hot', emoji: '🔥' };
  if (score >= 80) return { label: 'Data', emoji: '📊' };
  if (story.tags?.some(t => t.toLowerCase().includes('deadline') || t.toLowerCase().includes('regulation')))
    return { label: 'Deadline', emoji: '⚠' };
  return null;
}

// Impact score from relevance
function getImpactScore(story: PartnerStory): string {
  const score = story.relevance_score ?? 70;
  return (score / 10).toFixed(1);
}

// Mock promotion count (deterministic from id)
function getPromotionCount(storyId: string): number {
  let h = 0;
  for (let i = 0; i < storyId.length; i++) h = ((h << 5) - h) + storyId.charCodeAt(i);
  return (Math.abs(h) % 4) + 1; // 1-4
}

interface PartnerStoryTileProps {
  story: PartnerStory;
  listenedState: ListenedState;
  onClick: () => void;
  onQuickBrief?: () => void;
  onPromote?: () => void;
}

export function PartnerStoryTile({ story, listenedState, onClick }: PartnerStoryTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  const category = story.signalType as SignalCategory;
  const coverImg = story.coverUrl || getRotatedCategoryImage(category, story.id);
  const tintClass = CATEGORY_TINTS[category] || CATEGORY_TINTS.Vendor;
  const urgency = getUrgencyChip(story);
  const impact = getImpactScore(story);
  const roles = (story.whoCares ?? []).slice(0, 3);
  const timeAgo = getTimeAgo(story.publishedAt);
  const promoCount = getPromotionCount(story.id);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex-shrink-0 w-[280px] rounded-xl overflow-hidden text-left",
        "bg-card border transition-all duration-300",
        "shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
        "hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1",
        listenedState === 'unseen' && "border-border",
        listenedState === 'seen' && "border-primary/20",
        listenedState === 'listened' && "border-primary/40"
      )}
    >
      {/* ===== Top: Visual Context Area (16:9) ===== */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={coverImg}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-500",
            isHovered && "scale-[1.03]"
          )}
        />
        {/* Category color tint overlay */}
        <div className={cn("absolute inset-0", tintClass)} />
        {/* Dark gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top-left: Category badge */}
        <span className={cn(
          "absolute top-2.5 left-2.5 px-2.5 py-1 text-[10px] font-semibold rounded-full border backdrop-blur-md z-10",
          signalTypeColors[story.signalType]
        )}>
          {story.signalType}
        </span>

        {/* Top-right: Urgency chip */}
        {urgency && (
          <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-card/90 backdrop-blur-md border border-border/60 text-foreground z-10">
            {urgency.emoji} {urgency.label}
          </span>
        )}

        {/* Bottom-left: Source badge */}
        {story.sourceName && (
          <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 text-[9px] font-medium rounded bg-black/50 backdrop-blur-sm text-white/90 z-10 truncate max-w-[160px]">
            {story.sourceName}
          </span>
        )}

        {/* Bottom-right: Listened indicator */}
        {listenedState === 'listened' && (
          <div className="absolute bottom-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center z-10">
            <Check className="w-3 h-3 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* ===== Middle: Headline + So What ===== */}
      <div className="px-3.5 pt-3 pb-2 space-y-1.5">
        <h3 className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2">
          {story.headline}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {story.soWhat}
        </p>
      </div>

      {/* ===== Bottom: Intelligence Strip ===== */}
      <div className="px-3.5 pb-3 pt-1 border-t border-border/40">
        <div className="flex items-center gap-2">
          {/* Impact score */}
          <span className="text-[10px] font-bold text-foreground tabular-nums">
            {impact}
            <span className="text-muted-foreground font-normal">/10</span>
          </span>

          <span className="w-px h-3 bg-border/60" />

          {/* Freshness indicator */}
          <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo}
          </span>

          <span className="w-px h-3 bg-border/60" />

          {/* Social proof */}
          <span className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
            <Users className="w-2.5 h-2.5" />
            {promoCount}
          </span>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Affected roles (show on wider tiles) */}
          <div className="hidden sm:flex items-center gap-1 overflow-hidden">
            {roles.slice(0, 2).map((role, i) => (
              <span
                key={i}
                className="text-[8px] px-1 py-0.5 rounded bg-muted/50 text-muted-foreground border border-border/40 truncate max-w-[60px]"
              >
                {role.split('/')[0]}
              </span>
            ))}
          </div>

          {/* Micro icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center" title="Microcast available">
              <Volume2 className="w-2.5 h-2.5 text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>

      {/* Removed hover action overlay — actions live in the modal now */}
    </button>
  );
}
