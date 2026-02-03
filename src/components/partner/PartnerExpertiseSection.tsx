// Partner-only Expertise Signals section for profile
// Shows topic-based expertise earned from watching Expert Corners

import { Award, BookOpen, Check, Sparkles, ChevronRight } from 'lucide-react';
import { TopicExpertise, ExpertiseLevel, getExpertiseLevelLabel } from '@/hooks/usePartnerExpertise';
import { cn } from '@/lib/utils';

interface PartnerExpertiseSectionProps {
  topicExpertise: TopicExpertise[];
  onExploreMore?: () => void;
  className?: string;
}

export function PartnerExpertiseSection({
  topicExpertise,
  onExploreMore,
  className,
}: PartnerExpertiseSectionProps) {
  if (topicExpertise.length === 0) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Expertise signals</h3>
        </div>
        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
          <Sparkles className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Watch Expert Corners to build expertise signals.
          </p>
          {onExploreMore && (
            <button
              onClick={onExploreMore}
              className="mt-2 text-xs font-medium text-primary hover:underline"
            >
              Explore Expert Corners →
            </button>
          )}
        </div>
      </div>
    );
  }
  
  const getLevelIcon = (level: ExpertiseLevel) => {
    switch (level) {
      case 'recognized':
        return <Award className="w-4 h-4 text-primary" />;
      case 'practitioner':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'exploring':
        return <BookOpen className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  const getLevelStyle = (level: ExpertiseLevel) => {
    switch (level) {
      case 'recognized':
        return 'border-primary/30 bg-primary/5';
      case 'practitioner':
        return 'border-green-500/30 bg-green-500/5';
      case 'exploring':
        return 'border-border bg-muted/30';
      default:
        return 'border-border';
    }
  };
  
  // Group by level
  const recognized = topicExpertise.filter(t => t.level === 'recognized');
  const practitioner = topicExpertise.filter(t => t.level === 'practitioner');
  const exploring = topicExpertise.filter(t => t.level === 'exploring');
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Expertise signals</h3>
        {onExploreMore && (
          <button
            onClick={onExploreMore}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
          >
            Browse all
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {/* Recognized (top priority) */}
        {recognized.map((te) => (
          <ExpertiseRow key={te.topic} expertise={te} />
        ))}
        
        {/* Practitioner */}
        {practitioner.map((te) => (
          <ExpertiseRow key={te.topic} expertise={te} />
        ))}
        
        {/* Exploring */}
        {exploring.map((te) => (
          <ExpertiseRow key={te.topic} expertise={te} />
        ))}
      </div>
      
      {/* Summary */}
      <p className="text-[11px] text-muted-foreground">
        Expertise signals are earned by completing Expert Corner videos. They help personalize recommendations.
      </p>
    </div>
  );
}

function ExpertiseRow({ expertise }: { expertise: TopicExpertise }) {
  const { topic, level, episodesCompleted } = expertise;
  
  const getLevelIcon = () => {
    switch (level) {
      case 'recognized':
        return <Award className="w-3.5 h-3.5 text-primary" />;
      case 'practitioner':
        return <Check className="w-3.5 h-3.5 text-green-600" />;
      case 'exploring':
        return <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  const getLevelColor = () => {
    switch (level) {
      case 'recognized':
        return 'text-primary';
      case 'practitioner':
        return 'text-green-700';
      case 'exploring':
        return 'text-muted-foreground';
      default:
        return '';
    }
  };
  
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2">
        {getLevelIcon()}
        <span className="text-sm font-medium text-foreground">{topic}</span>
      </div>
      <span className={cn("text-xs font-medium", getLevelColor())}>
        {getExpertiseLevelLabel(level)}
      </span>
    </div>
  );
}
