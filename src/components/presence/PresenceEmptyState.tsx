import { Globe, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PresenceEmptyStateProps {
  onSetup: () => void;
  onSkip: () => void;
  className?: string;
}

export function PresenceEmptyState({ onSetup, onSkip, className }: PresenceEmptyStateProps) {
  return (
    <div className={cn(
      "rounded-xl border border-border bg-card p-6",
      className
    )}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center flex-shrink-0">
          <Globe className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground mb-1">
            Set up Presence
            <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span>
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Connect your LinkedIn to personalize visibility signals and content recommendations.
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onSetup}
              className="gap-2"
            >
              <Linkedin className="w-3.5 h-3.5" />
              Connect LinkedIn
            </Button>
            <button
              onClick={onSkip}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
