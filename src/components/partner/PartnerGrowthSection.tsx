// Partner Growth Section with Expertise Signals
// Similar to GrowthPresenceSection but includes Partner-specific expertise tracking

import * as React from 'react';
import { TrendingUp, Calendar, ChevronRight, Clock, Award, BookOpen, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePartnerExpertise, ExpertiseLevel, getExpertiseLevelLabel } from '@/hooks/usePartnerExpertise';

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

// Helper to get icon and color for expertise level
function getLevelIcon(level: ExpertiseLevel) {
  switch (level) {
    case 'recognized':
      return <Award className="w-3 h-3 text-primary" />;
    case 'practitioner':
      return <Check className="w-3 h-3 text-green-600" />;
    case 'exploring':
      return <BookOpen className="w-3 h-3 text-muted-foreground" />;
    default:
      return null;
  }
}

interface PartnerGrowthSectionProps {
  onSkillClick?: () => void;
  onEventsClick?: () => void;
  onExpertiseClick?: () => void;
}

export function PartnerGrowthSection({ 
  onSkillClick, 
  onEventsClick, 
  onExpertiseClick,
}: PartnerGrowthSectionProps) {
  const { topicExpertise } = usePartnerExpertise();
  
  // Show top 3 expertise signals
  const topExpertise = topicExpertise.slice(0, 3);
  const hasExpertise = topExpertise.length > 0;

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

      {/* Expertise Signals Column (Partner-only) */}
      <section className="space-y-3">
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Expertise Signals
          </h2>
        </div>
        
        {/* Expertise Card */}
        <button
          onClick={onExpertiseClick}
          className={cn(
            "flex flex-col gap-3 p-4 rounded-xl text-left w-full",
            "bg-card border border-border",
            "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
            "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
            "hover:border-border/80",
            "transition-all duration-200"
          )}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
              "bg-muted/50"
            )}>
              <Award className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">Your Expertise</h4>
                {topExpertise.some(t => t.level === 'recognized') && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    Recognized
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {hasExpertise 
                  ? 'Expertise earned from Expert Corners' 
                  : 'Watch Expert Corners to build expertise'
                }
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
          
          {/* Expertise pills */}
          {hasExpertise && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {topExpertise.map((te) => (
                <div 
                  key={te.topic}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium",
                    te.level === 'recognized' && "bg-primary/10 text-primary",
                    te.level === 'practitioner' && "bg-green-500/10 text-green-700",
                    te.level === 'exploring' && "bg-muted text-muted-foreground"
                  )}
                >
                  {getLevelIcon(te.level)}
                  <span>{te.topic}</span>
                  <span className="opacity-60">— {getExpertiseLevelLabel(te.level)}</span>
                </div>
              ))}
            </div>
          )}
          
          {!hasExpertise && (
            <p className="text-[10px] text-muted-foreground/70">
              Complete Expert Corner videos to earn expertise signals
            </p>
          )}
        </button>
      </section>
    </div>
  );
}
