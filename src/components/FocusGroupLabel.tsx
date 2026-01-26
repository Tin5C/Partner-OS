import { cn } from '@/lib/utils';

interface FocusGroupLabelProps {
  id: string;
  label: string;
  sublabel?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  className?: string;
}

export function FocusGroupLabel({ 
  id,
  label, 
  sublabel, 
  variant = 'primary',
  className 
}: FocusGroupLabelProps) {
  return (
    <div 
      id={id}
      className={cn(
        'flex items-baseline gap-2 scroll-mt-24',
        className
      )}
    >
      <h3 className={cn(
        'font-semibold',
        variant === 'primary' && 'text-body text-foreground',
        variant === 'secondary' && 'text-sm text-foreground/80',
        variant === 'tertiary' && 'text-sm text-muted-foreground'
      )}>
        {label}
      </h3>
      {sublabel && (
        <span className="text-caption text-muted-foreground">
          — {sublabel}
        </span>
      )}
    </div>
  );
}
