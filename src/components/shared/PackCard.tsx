import { Clock, Building2, Radar, Newspaper, MessageCircle, User, BookOpen, Calendar, Headphones, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PackDefinition } from '@/config/experienceConfig';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'building-2': Building2,
  'radar': Radar,
  'newspaper': Newspaper,
  'message-circle': MessageCircle,
  'user-circle': User,
  'book-open': BookOpen,
  'calendar': Calendar,
};

// Icon-specific background colors for visual variety
const iconColors: Record<string, string> = {
  'building-2': 'bg-blue-100 dark:bg-blue-900/40',
  'radar': 'bg-rose-100 dark:bg-rose-900/40',
  'newspaper': 'bg-amber-100 dark:bg-amber-900/40',
  'message-circle': 'bg-purple-100 dark:bg-purple-900/40',
  'user-circle': 'bg-violet-100 dark:bg-violet-900/40',
  'book-open': 'bg-teal-100 dark:bg-teal-900/40',
  'calendar': 'bg-emerald-100 dark:bg-emerald-900/40',
};

interface PackCardProps {
  pack: PackDefinition;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  className?: string;
}

export function PackCard({ pack, onPrimaryAction, onSecondaryAction, className }: PackCardProps) {
  const Icon = iconMap[pack.icon] || Building2;
  const iconBg = iconColors[pack.icon] || 'bg-secondary';

  return (
    <div
      className={cn(
        'relative flex flex-col p-5 rounded-2xl text-left',
        'bg-card border border-border shadow-card',
        'hover:shadow-card-hover transition-all duration-200',
        className
      )}
    >
      {/* Icon */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'w-11 h-11 rounded-xl flex items-center justify-center shadow-soft',
          iconBg
        )}>
          <Icon className="w-5 h-5 text-foreground/70" />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-body mb-1 text-foreground">{pack.title}</h3>
      
      {/* Subtitle */}
      <p className="text-caption text-muted-foreground line-clamp-1 mb-4">
        {pack.subtitle}
      </p>

      {/* Footer: Time + Tags */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {pack.duration}
        </span>
        {pack.tags.slice(0, 1).map((tag, idx) => (
          <span 
            key={idx}
            className="px-2.5 py-0.5 rounded-full bg-card text-caption text-muted-foreground border border-border shadow-chip"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrimaryAction();
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium',
            'bg-primary text-primary-foreground shadow-soft',
            'hover:bg-primary/90 hover:shadow-card active:scale-[0.98] transition-all duration-200'
          )}
        >
          <Headphones className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{pack.primaryCTA.label}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSecondaryAction();
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium',
            'bg-card text-secondary-foreground border border-border shadow-chip',
            'hover:bg-secondary hover:shadow-card active:scale-[0.98] transition-all duration-200'
          )}
        >
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{pack.secondaryCTA.label}</span>
        </button>
      </div>
    </div>
  );
}
