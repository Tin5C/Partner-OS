import * as React from 'react';
import { TrendingUp, Calendar, ChevronRight, Clock, User, Link2, Linkedin, Globe, FileText, Mic, Users, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePresenceSources } from '@/hooks/usePresenceSources';

interface CompactCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration?: string;
  isNew?: boolean;
  badge?: string;
  onClick?: () => void;
}

function CompactCard({ icon, title, description, duration, isNew, badge, onClick }: CompactCardProps) {
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
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wide">
              {badge}
            </span>
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
  onScorecardClick?: () => void;
  onSourcesClick?: () => void;
}

export function GrowthPresenceSection({ 
  onSkillClick, 
  onEventsClick, 
  onScorecardClick,
  onSourcesClick,
}: GrowthPresenceSectionProps) {
  const { connectedCount, sources } = usePresenceSources();

  // Source icons for the Sources card
  const sourceIcons = [
    { icon: <Linkedin className="w-3.5 h-3.5" />, type: 'linkedin' },
    { icon: <Globe className="w-3.5 h-3.5" />, type: 'website' },
    { icon: <FileText className="w-3.5 h-3.5" />, type: 'newsletter' },
    { icon: <Mic className="w-3.5 h-3.5" />, type: 'podcast' },
    { icon: <Users className="w-3.5 h-3.5" />, type: 'speaker' },
    { icon: <Upload className="w-3.5 h-3.5" />, type: 'pdf' },
  ];

  const getSourceConnected = (type: string) => sources.find(s => s.type === type)?.connected;

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

      {/* Reputation & Visibility Section */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Reputation & Visibility
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            How buyers are likely to perceive you — and how to improve it.
          </p>
        </div>
        
        <div className="space-y-2">
          {/* Card 1: Buyer Perception Snapshot (Insight) */}
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
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">Buyer Perception Snapshot</h4>
              </div>
              
              {/* Tier, Score, Confidence row */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  Tier 1
                </span>
                <span className="text-sm font-semibold text-foreground">62/100</span>
                <span className="text-[10px] text-muted-foreground">
                  {connectedCount > 0 ? 'With added sources' : 'Public signals only'}
                </span>
              </div>
              
              <p className="text-xs text-muted-foreground mt-1.5">
                Based on public signals and available sources.
              </p>
              
              {/* Actions row */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs font-medium text-primary">Review snapshot</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSourcesClick?.();
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Improve accuracy
                </button>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
          </button>

          {/* Card 2: Improve Signal Quality (Action) */}
          <button
            onClick={onSourcesClick}
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl text-left w-full",
              "bg-card border border-border",
              "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
              "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
              "hover:border-border/80",
              "transition-all duration-200"
            )}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50">
              <Link2 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-foreground">Improve Signal Quality</h4>
                {connectedCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {connectedCount} connected
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add sources to increase accuracy and strengthen credibility.
              </p>
              
              {/* Source icons row */}
              <div className="flex items-center gap-2 mt-2">
                {sourceIcons.map((s, idx) => (
                  <span 
                    key={idx} 
                    className={cn(
                      "transition-colors",
                      getSourceConnected(s.type) 
                        ? "text-primary" 
                        : "text-muted-foreground/60"
                    )}
                  >
                    {s.icon}
                  </span>
                ))}
              </div>
              
              <span className="inline-block text-xs font-medium text-primary mt-2">
                Add sources
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
          </button>
        </div>
      </section>
    </div>
  );
}
