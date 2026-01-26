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
        'flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 border border-border/50',
        className
      )}
    >
      {/* Previous Week Button */}
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous week"
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          canGoPrevious
            ? 'hover:bg-muted active:scale-95 text-foreground'
            : 'text-muted-foreground/40 cursor-not-allowed'
        )}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Week Label */}
      <div className="flex-1 text-center min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{weekLabel}</p>
        <p className="text-xs text-muted-foreground">{weekRange}</p>
      </div>

      {/* Next Week Button */}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next week"
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary/50',
          canGoNext
            ? 'hover:bg-muted active:scale-95 text-foreground'
            : 'text-muted-foreground/40 cursor-not-allowed'
        )}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
