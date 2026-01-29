// Shared Enablement Progress Component
// Placeholder card for partner enablement tracking

import * as React from 'react';
import { GraduationCap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { SectionHeader } from './SectionHeader';

interface EnablementProgressProps {
  title?: string;
  subtitle?: string;
  progress?: number;
  completedModules?: number;
  totalModules?: number;
  onViewProgress?: () => void;
  className?: string;
}

export function EnablementProgress({
  title = 'Enablement Progress',
  subtitle = 'Track your partner certification and training.',
  progress = 35,
  completedModules = 2,
  totalModules = 6,
  onViewProgress,
  className,
}: EnablementProgressProps) {
  return (
    <section className={cn("space-y-3", className)}>
      <SectionHeader 
        title={title} 
        subtitle={subtitle}
        variant="tertiary"
        inlineSubtitle
      />

      <div className={cn(
        "rounded-xl bg-card border border-border p-5",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      )}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground">Partner Certification</h4>
            <p className="text-xs text-muted-foreground">
              {completedModules} of {totalModules} modules completed
            </p>
          </div>
          <span className="text-sm font-semibold text-foreground">{progress}%</span>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-2 mb-4" />

        {/* Action */}
        <button
          onClick={onViewProgress}
          className={cn(
            "flex items-center gap-1 text-xs font-medium text-primary",
            "hover:text-primary/80 transition-colors"
          )}
        >
          View progress
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
