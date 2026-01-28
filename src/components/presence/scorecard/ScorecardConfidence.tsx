import { cn } from '@/lib/utils';
import { Shield, AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfidenceLevel, CONFIDENCE_LABELS } from '@/lib/presenceScorecardData';

interface ScorecardConfidenceProps {
  level: ConfidenceLevel;
  percent: number;
  sourcesUsed: number;
  maxSources: number;
  onAddSources?: () => void;
}

const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  low: 'text-amber-600',
  medium: 'text-blue-600',
  high: 'text-emerald-600',
};

const CONFIDENCE_BG: Record<ConfidenceLevel, string> = {
  low: 'bg-amber-500/10',
  medium: 'bg-blue-500/10',
  high: 'bg-emerald-500/10',
};

export function ScorecardConfidence({ 
  level, 
  percent, 
  sourcesUsed, 
  maxSources,
  onAddSources,
}: ScorecardConfidenceProps) {
  const canImprove = sourcesUsed < maxSources;

  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
            CONFIDENCE_BG[level]
          )}>
            <Shield className={cn("w-4 h-4", CONFIDENCE_COLORS[level])} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Scan confidence</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on {sourcesUsed} of {maxSources} possible sources
            </p>
          </div>
        </div>

        {/* Confidence badge */}
        <span className={cn(
          "text-xs px-2.5 py-1 rounded-full font-medium",
          CONFIDENCE_BG[level],
          CONFIDENCE_COLORS[level]
        )}>
          {CONFIDENCE_LABELS[level]}
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Confidence level</span>
          <span>{percent}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              level === 'high' ? "bg-emerald-500" :
              level === 'medium' ? "bg-blue-500" : "bg-amber-500"
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Improve accuracy CTA */}
      {canImprove && (
        <div className="pt-2 border-t border-border">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
            <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-foreground font-medium">
                Improve accuracy
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Add more sources to increase scan confidence and unlock richer insights.
              </p>
              {onAddSources && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs mt-2"
                  onClick={onAddSources}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add sources
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
