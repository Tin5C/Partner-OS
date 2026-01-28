import * as React from 'react';
import { TrendingUp, Calendar, ChevronRight, Clock, Linkedin, Globe, FileText, Mic, Users, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePresenceSources } from '@/hooks/usePresenceSources';
import { Progress } from '@/components/ui/progress';

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

  // Source icons for the Sources row
  const sourceIcons = [
    { icon: <Linkedin className="w-3.5 h-3.5" />, type: 'linkedin', label: 'LinkedIn' },
    { icon: <Globe className="w-3.5 h-3.5" />, type: 'website', label: 'Website' },
    { icon: <FileText className="w-3.5 h-3.5" />, type: 'newsletter', label: 'Newsletter' },
    { icon: <Mic className="w-3.5 h-3.5" />, type: 'podcast', label: 'Podcast' },
    { icon: <Users className="w-3.5 h-3.5" />, type: 'speaker', label: 'Speaker page' },
    { icon: <Upload className="w-3.5 h-3.5" />, type: 'pdf', label: 'PDF' },
  ];

  const getSourceConnected = (type: string) => sources.find(s => s.type === type)?.connected;

  // Mock score for display
  const mockScore = 62;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Growth Section */}
      <section className="space-y-3">
        <div className="flex items-baseline gap-2">
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
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Reputation & Visibility
          </h2>
          <span className="text-xs text-muted-foreground">
            How buyers are likely to perceive you — and how to improve it.
          </span>
        </div>
        
        {/* Unified Module Card */}
        <div className={cn(
          "rounded-xl bg-card border border-border",
          "shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
        )}>
          {/* Row A — Insight */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">Buyer Perception Snapshot</h4>
            </div>
            
            {/* Tier, Score, Confidence inline */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                Tier 1
              </span>
              <span className="text-sm font-semibold text-foreground">{mockScore}/100</span>
              <span className="text-[10px] text-muted-foreground">
                {connectedCount > 0 ? 'With added sources' : 'Public signals only'}
              </span>
            </div>
            
            {/* Progress bar */}
            <Progress value={mockScore} className="h-1.5 mb-3" />
            
            {/* Action links */}
            <div className="flex items-center gap-4">
              <button 
                onClick={onScorecardClick}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Review snapshot
              </button>
              <button 
                onClick={onSourcesClick}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Improve accuracy
              </button>
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-border" />
          
          {/* Row B — Action */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-medium text-foreground">Improve Signal Quality</h4>
              {connectedCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {connectedCount} connected
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Add sources to increase accuracy and strengthen credibility.
            </p>
            
            {/* Source icons inline */}
            <div className="flex items-center gap-3 mb-2">
              {sourceIcons.map((s, idx) => (
                <span 
                  key={idx} 
                  className={cn(
                    "transition-colors",
                    getSourceConnected(s.type) 
                      ? "text-primary" 
                      : "text-muted-foreground/50"
                  )}
                  title={s.label}
                >
                  {s.icon}
                </span>
              ))}
            </div>
            
            {/* Action link */}
            <button 
              onClick={onSourcesClick}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Add sources
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
