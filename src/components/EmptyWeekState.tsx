import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyWeekStateProps {
  className?: string;
}

export function EmptyWeekState({ className }: EmptyWeekStateProps) {
  return (
    <div
      className={cn(
        'col-span-2 flex flex-col items-center justify-center py-10 px-4 rounded-xl',
        'bg-muted/30 border border-dashed border-border/50 text-center',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <Calendar className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">No items this week</h3>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        Try another week using the arrows above.
      </p>
    </div>
  );
}
