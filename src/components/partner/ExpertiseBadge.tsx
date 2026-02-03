// Partner-only Expertise Badge component
// Shows expertise level with subtle, professional styling

import { Award, BookOpen, Sparkles, Check } from 'lucide-react';
import { ExpertiseLevel, getExpertiseLevelLabel } from '@/hooks/usePartnerExpertise';
import { cn } from '@/lib/utils';

interface ExpertiseBadgeProps {
  topic: string;
  level: ExpertiseLevel;
  compact?: boolean;
  className?: string;
}

export function ExpertiseBadge({ topic, level, compact = false, className }: ExpertiseBadgeProps) {
  if (level === 'none') return null;
  
  const levelLabel = getExpertiseLevelLabel(level);
  
  const getLevelIcon = () => {
    switch (level) {
      case 'recognized':
        return <Award className="w-3.5 h-3.5" />;
      case 'practitioner':
        return <Check className="w-3.5 h-3.5" />;
      case 'exploring':
        return <BookOpen className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };
  
  const getLevelColor = () => {
    switch (level) {
      case 'recognized':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'practitioner':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'exploring':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return '';
    }
  };
  
  if (compact) {
    return (
      <div 
        className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border",
          getLevelColor(),
          className
        )}
      >
        {getLevelIcon()}
        <span>{topic}</span>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg border",
        getLevelColor(),
        className
      )}
    >
      <div className="flex-shrink-0">
        {getLevelIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{topic}</p>
        <p className="text-[11px] opacity-70">{levelLabel}</p>
      </div>
    </div>
  );
}

// Inline badge for list views
export function ExpertiseLevelPill({ level }: { level: ExpertiseLevel }) {
  if (level === 'none') return null;
  
  const label = getExpertiseLevelLabel(level);
  
  const getColor = () => {
    switch (level) {
      case 'recognized':
        return 'bg-primary/10 text-primary';
      case 'practitioner':
        return 'bg-green-500/10 text-green-700';
      case 'exploring':
        return 'bg-muted text-muted-foreground';
      default:
        return '';
    }
  };
  
  return (
    <span className={cn(
      "inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium",
      getColor()
    )}>
      {label}
    </span>
  );
}
