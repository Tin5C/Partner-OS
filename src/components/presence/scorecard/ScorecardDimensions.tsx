import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';
import { DimensionScore } from '@/lib/presenceScorecardData';

interface ScorecardDimensionsProps {
  dimensions: DimensionScore[];
}

export function ScorecardDimensions({ dimensions }: ScorecardDimensionsProps) {
  // Calculate weighted total
  const weightedTotal = dimensions.reduce((sum, d) => {
    return sum + (d.score / 5) * d.weight;
  }, 0);

  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50">
          <BarChart3 className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground">Dimension scores</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Weighted average: {Math.round(weightedTotal)}%</p>
        </div>
      </div>

      {/* Grouped Bar Chart */}
      <div className="space-y-3">
        {dimensions.map((dim) => (
          <div key={dim.dimension} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground">{dim.dimension}</span>
              <span className="text-[10px] text-muted-foreground">{dim.weight}% weight</span>
            </div>
            
            {/* Score Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    dim.score >= 4 ? "bg-emerald-500" :
                    dim.score >= 3 ? "bg-blue-500" :
                    dim.score >= 2 ? "bg-amber-500" : "bg-rose-500"
                  )}
                  style={{ width: `${(dim.score / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-foreground w-6 text-right">
                {dim.score}/5
              </span>
            </div>

            {/* Justification */}
            <p className="text-[10px] text-muted-foreground pl-1">
              {dim.justification}
            </p>
          </div>
        ))}
      </div>

      {/* Best Practice Reference */}
      <div className="pt-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground">
          <span className="font-medium">Best practice:</span> Score 4+ in Positioning clarity and Credibility & proof for buyer trust.
        </p>
      </div>
    </div>
  );
}
