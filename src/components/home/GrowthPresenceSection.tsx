import * as React from 'react';
import { TrendingUp, Calendar, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PresenceEmptyState, PresenceDashboard } from '@/components/presence';
import { usePresence } from '@/hooks/usePresence';
import { PresenceData } from '@/lib/presenceConfig';

interface CompactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration?: string;
  isNew?: boolean;
  onClick?: () => void;
}

function CompactCard({ icon, title, description, duration, isNew, onClick }: CompactCardProps) {
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
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {description}
        </p>
        {duration && (
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
  onPresenceSetup?: () => void;
  onPresenceEdit?: () => void;
}

export function GrowthPresenceSection({ 
  onSkillClick, 
  onEventsClick, 
  onPresenceSetup,
  onPresenceEdit,
}: GrowthPresenceSectionProps) {
  const { presence, isConfigured, isLoaded, removeSource } = usePresence();

  // Local state to handle setup modal trigger
  const handleSetupClick = () => {
    onPresenceSetup?.();
  };

  const handleSkipClick = () => {
    // Just dismiss - don't force setup
  };

  const handleEditClick = () => {
    onPresenceEdit?.();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Growth Section */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
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

      {/* Presence Section */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Presence
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track and improve your visibility signals over time. Optional.
          </p>
        </div>
        
        {isLoaded && (
          <>
            {isConfigured && presence ? (
              <PresenceDashboard
                presence={presence}
                onEdit={handleEditClick}
                onRemoveSource={removeSource}
              />
            ) : (
              <PresenceEmptyState
                onSetup={handleSetupClick}
                onSkip={handleSkipClick}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
