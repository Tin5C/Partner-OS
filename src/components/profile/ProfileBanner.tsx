// Profile completion banner for homepage
import { User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ProfileBannerProps {
  completeness: number;
  onOpenProfile: () => void;
  className?: string;
}

export function ProfileBanner({ completeness, onOpenProfile, className }: ProfileBannerProps) {
  const isComplete = completeness === 100;
  
  if (isComplete) {
    return null; // Don't show banner if profile is complete
  }

  return (
    <div
      className={cn(
        'relative p-4 rounded-2xl border border-border bg-card shadow-card',
        'hover:shadow-card-hover transition-all duration-200 cursor-pointer',
        className
      )}
      onClick={onOpenProfile}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-primary" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-sm text-foreground">Complete your profile</h3>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            Help us personalize every briefing and skill for you — in 60 seconds.
          </p>
          
          {/* Progress */}
          <div className="flex items-center gap-3">
            <Progress value={completeness} className="h-1.5 flex-1" />
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              {completeness}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
