import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeekPickerProps {
  weekLabel: string;
  weekRange: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
}

export function WeekPicker({
  weekLabel,
  weekRange,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  className,
}: WeekPickerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-card',
        className
      )}
    >
      {/* Previous Week Button */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous week"
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          canGoPrevious
            ? 'hover:bg-secondary hover:shadow-chip active:scale-95 text-foreground'
            : 'text-muted-foreground/30 cursor-not-allowed'
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Week Label */}
      <div className="flex-1 text-center min-w-0">
        <p className="text-body font-semibold text-foreground truncate">{weekLabel}</p>
        <p className="text-caption text-muted-foreground">{weekRange}</p>
      </div>

      {/* Next Week Button */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next week"
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          canGoNext
            ? 'hover:bg-secondary hover:shadow-chip active:scale-95 text-foreground'
            : 'text-muted-foreground/30 cursor-not-allowed'
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
