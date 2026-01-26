import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'active';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export function Tag({ 
  children, 
  variant = 'default', 
  size = 'sm',
  onClick,
  className 
}: TagProps) {
  const isClickable = !!onClick;
  
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center font-medium transition-all duration-200',
        // Pill shape with rounded-full
        size === 'sm' && 'px-3 py-1 text-xs rounded-full',
        size === 'md' && 'px-4 py-1.5 text-sm rounded-full',
        // Default - light background with thin border
        variant === 'default' && 'bg-card text-muted-foreground border border-border shadow-chip',
        variant === 'outline' && 'border border-border text-muted-foreground bg-transparent',
        variant === 'active' && 'bg-primary text-primary-foreground shadow-soft',
        // Hover states
        isClickable && 'cursor-pointer hover:shadow-card hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </span>
  );
}
