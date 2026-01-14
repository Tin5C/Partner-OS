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
        'inline-flex items-center font-medium transition-colors',
        size === 'sm' && 'px-2 py-0.5 text-xs rounded-md',
        size === 'md' && 'px-3 py-1 text-sm rounded-lg',
        variant === 'default' && 'bg-tag text-tag-foreground',
        variant === 'outline' && 'border border-border text-muted-foreground',
        variant === 'active' && 'bg-primary text-primary-foreground',
        isClickable && 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      {children}
    </span>
  );
}
