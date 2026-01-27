import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeekNavigatorProps {
  weekLabel: string;
  weekRange: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

export function WeekNavigator({
  weekLabel,
  weekRange,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  className,
}: WeekNavigatorProps) {
  return (
    <div className={cn(
      'flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-chip',
      className
    )}>
      {/* Left Arrow */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          canGoPrevious
            ? 'hover:bg-secondary active:scale-95 text-foreground'
            : 'text-muted-foreground/40 cursor-not-allowed'
        )}
        aria-label="Previous week"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Center: Week Info */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{weekLabel}</span>
        </div>
        <span className="text-xs text-muted-foreground mt-0.5">
          {weekRange}
        </span>
      </div>

      {/* Right Arrow */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          canGoNext
            ? 'hover:bg-secondary active:scale-95 text-foreground'
            : 'text-muted-foreground/40 cursor-not-allowed'
        )}
        aria-label="Next week"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
