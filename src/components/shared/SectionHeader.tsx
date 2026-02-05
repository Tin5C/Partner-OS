// Shared Section Header Component
import * as React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  inlineSubtitle?: boolean;
  className?: string;
  action?: React.ReactNode;
}

const variantStyles = {
  primary: '',
  secondary: 'text-sm font-semibold text-muted-foreground uppercase tracking-wide',
  tertiary: 'text-sm font-semibold text-muted-foreground uppercase tracking-wide',
};

export function SectionHeader({ 
  title, 
  subtitle, 
  variant = 'primary',
  inlineSubtitle = false,
  className,
  action
}: SectionHeaderProps) {
  if (inlineSubtitle) {
    return (
      <div className={cn("flex items-baseline gap-2", className)}>
        <h2 className={cn(
          variant === 'primary' 
            ? "text-lg font-semibold text-foreground" 
            : variantStyles[variant]
        )}>
          {title}
        </h2>
        {subtitle && (
          <span className="text-xs text-muted-foreground">
            {subtitle}
          </span>
        )}
        {action && <div className="ml-auto">{action}</div>}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn(
            variant === 'primary' 
              ? "text-lg font-semibold text-foreground" 
              : variantStyles[variant]
          )}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}
