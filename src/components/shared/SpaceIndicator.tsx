// Shared Space Indicator Component
// Subtle label showing active space in header

import * as React from 'react';
import { cn } from '@/lib/utils';
import { SpaceType } from '@/config/spaces';

interface SpaceIndicatorProps {
  spaceType: SpaceType;
  className?: string;
}

export function SpaceIndicator({ spaceType, className }: SpaceIndicatorProps) {
  const label = spaceType === 'internal' ? 'Internal' : 'Partner';
  
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wide",
      spaceType === 'internal'
        ? "bg-primary/10 text-primary border border-primary/20"
        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800",
      className
    )}>
      {label}
    </span>
  );
}
