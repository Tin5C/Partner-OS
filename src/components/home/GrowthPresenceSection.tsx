import * as React from 'react';
import { TrendingUp, Calendar, ChevronRight, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface CompactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration?: string;
  isNew?: boolean;
  badge?: string;
  meta?: React.ReactNode;
  onClick?: () => void;
}

function CompactCard({ icon, title, description, duration, isNew, badge, meta, onClick }: CompactCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl text-left w-full",
        "bg-card border border-border",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
        "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        "hover:border-border/80",
        "transition-all duration-200"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
        "bg-muted/50"
      )}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
          {isNew && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
          )}
          {badge && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {description}
        </p>
        {meta && (
          <div className="mt-1.5">
            {meta}
          </div>
        )}
        {duration && !meta && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-1.5">
            <Clock className="w-3 h-3" />
            {duration}
          </span>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
    </button>
  );
}

interface GrowthPresenceSectionProps {
  onSkillClick?: () => void;
  onEventsClick?: () => void;
  onScorecardClick?: () => void;
}

export function GrowthPresenceSection({ 
  onSkillClick, 
  onEventsClick, 
  onScorecardClick,
}: GrowthPresenceSectionProps) {

  // Mock score for display
  const mockScore = 62;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Growth Column */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Growth
          </h2>
        </div>
        <div className="space-y-2">
          <CompactCard
            icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
            title="Skill of the Week"
            description="Active listening techniques for discovery calls"
            duration="4 min"
            isNew={true}
            onClick={onSkillClick}
          />
          <CompactCard
            icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
            title="Upcoming Events"
            description="3 events matching your interests this month"
            onClick={onEventsClick}
          />
        </div>
      </section>

      {/* Reputation & Visibility Column */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Reputation & Visibility
          </h2>
        </div>
        
        {/* Single Buyer Perception Snapshot Card */}
        <button
          onClick={onScorecardClick}
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl text-left w-full",
            "bg-card border border-border",
            "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
            "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
            "hover:border-border/80",
            "transition-all duration-200"
          )}
        >
          {/* Icon */}
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
            "bg-muted/50"
          )}>
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-foreground">Buyer Perception Snapshot</h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                Tier 1
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              How buyers are likely to perceive you.
            </p>
            {/* Score + Progress */}
            <div className="flex items-center gap-2 mt-2">
              <Progress value={mockScore} className="h-1 flex-1 max-w-[100px]" />
              <span className="text-[10px] font-medium text-foreground">{mockScore}/100</span>
            </div>
            {/* Subtle hint */}
            <p className="text-[10px] text-muted-foreground/70 mt-1.5">
              Add sources to improve accuracy
            </p>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        </button>
      </section>
    </div>
  );
}
