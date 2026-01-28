import { cn } from '@/lib/utils';
import { Search, Check, X } from 'lucide-react';
import { QueryResult, FindabilityVerdict } from '@/lib/presenceScorecardData';

interface ScorecardFindabilityProps {
  queries: QueryResult[];
  verdict: FindabilityVerdict;
  linkedInPercent: number;
  externalPercent: number;
}

const VERDICT_LABELS: Record<FindabilityVerdict, { label: string; color: string }> = {
  'linkedin-contained': { label: 'LinkedIn-contained', color: 'text-amber-700 bg-amber-500/10' },
  'cross-channel': { label: 'Cross-channel', color: 'text-blue-700 bg-blue-500/10' },
  'strong-external': { label: 'Strong external presence', color: 'text-emerald-700 bg-emerald-500/10' },
};

export function ScorecardFindability({ 
  queries, 
  verdict, 
  linkedInPercent, 
  externalPercent 
}: ScorecardFindabilityProps) {
  const verdictInfo = VERDICT_LABELS[verdict];

  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground">Findability</h3>
          <p className="text-xs text-muted-foreground mt-0.5">What shows up when buyers search for you</p>
        </div>
      </div>

      {/* Query Results */}
      <div className="space-y-2">
        {queries.map((q, idx) => (
          <div 
            key={idx}
            className="flex items-start gap-3 py-2 px-3 rounded-lg bg-muted/30"
          >
            <span className="text-[10px] font-medium text-muted-foreground w-6 flex-shrink-0 pt-0.5">
              Q{idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-foreground truncate">{q.query}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{q.dominantResult}</p>
            </div>
            <div className={cn(
              "flex items-center gap-1 text-[10px] flex-shrink-0",
              q.nonLinkedInAppears ? "text-emerald-600" : "text-muted-foreground"
            )}>
              {q.nonLinkedInAppears ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>External</span>
                </>
              ) : (
                <>
                  <X className="w-3 h-3" />
                  <span>LinkedIn only</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">Verdict</span>
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", verdictInfo.color)}>
          {verdictInfo.label}
        </span>
      </div>

      {/* Horizontal Bar Visualization */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Result dominance</span>
          <span>{linkedInPercent}% LinkedIn / {externalPercent}% External</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex bg-muted">
          <div 
            className="bg-blue-500/70 transition-all duration-500"
            style={{ width: `${linkedInPercent}%` }}
          />
          <div 
            className="bg-emerald-500/70 transition-all duration-500"
            style={{ width: `${externalPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-center gap-4 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500/70" />
            LinkedIn
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
            External
          </span>
        </div>
      </div>
    </div>
  );
}
