import { CheckCircle2, Target, Forward, Flag, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactionType, REACTIONS } from '@/hooks/useStoryReactions';

const iconMap = {
  CheckCircle2,
  Target,
  Forward,
  Flag,
};

interface StoryReactionsProps {
  storyId: string;
  activeReactions: ReactionType[];
  onToggle: (storyId: string, type: ReactionType) => void;
  compact?: boolean;
}

export function StoryReactions({ 
  storyId, 
  activeReactions, 
  onToggle,
  compact = false 
}: StoryReactionsProps) {
  return (
    <div 
      className={cn(
        "flex flex-wrap gap-1.5",
        compact && "gap-1"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {REACTIONS.map((reaction) => {
        const Icon = iconMap[reaction.icon as keyof typeof iconMap];
        const isActive = activeReactions.includes(reaction.type);
        
        return (
          <button
            key={reaction.type}
            onClick={(e) => {
              e.stopPropagation();
              onToggle(storyId, reaction.type);
            }}
            className={cn(
              "group/reaction flex items-center gap-1 px-2 py-1 rounded-md",
              "text-[10px] font-medium transition-all duration-150",
              "border",
              isActive
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-background/80 text-muted-foreground border-border/50 hover:bg-muted/50 hover:border-border",
              compact && "px-1.5 py-0.5"
            )}
            title={reaction.label}
          >
            <span className="relative">
              <Icon className={cn(
                "transition-all",
                compact ? "w-3 h-3" : "w-3.5 h-3.5",
                isActive && "text-primary"
              )} />
              {isActive && (
                <Check className="absolute -top-0.5 -right-0.5 w-2 h-2 text-primary" />
              )}
            </span>
            {!compact && (
              <span className={cn(
                "truncate max-w-[80px]",
                reaction.type === 'relevant' && "max-w-[100px]"
              )}>
                {reaction.type === 'relevant' ? 'Relevant' : reaction.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
