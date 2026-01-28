import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileText, ExternalLink, Filter } from 'lucide-react';
import { EvidenceItem } from '@/lib/presenceScorecardData';

interface ScorecardEvidenceProps {
  evidence: EvidenceItem[];
}

const ALL_LABELS = ['Visibility', 'Relevance', 'Credibility', 'Consistency', 'External validation'] as const;

const LABEL_COLORS: Record<string, string> = {
  'Visibility': 'bg-blue-500/10 text-blue-700',
  'Relevance': 'bg-purple-500/10 text-purple-700',
  'Credibility': 'bg-emerald-500/10 text-emerald-700',
  'Consistency': 'bg-amber-500/10 text-amber-700',
  'External validation': 'bg-rose-500/10 text-rose-700',
};

export function ScorecardEvidence({ evidence }: ScorecardEvidenceProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredEvidence = activeFilter
    ? evidence.filter((e) => e.labels.includes(activeFilter as any))
    : evidence;

  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50">
          <FileText className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground">Evidence log</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{evidence.length} items found</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <button
          onClick={() => setActiveFilter(null)}
          className={cn(
            "text-[10px] px-2 py-1 rounded-full whitespace-nowrap transition-colors",
            activeFilter === null
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          All
        </button>
        {ALL_LABELS.map((label) => (
          <button
            key={label}
            onClick={() => setActiveFilter(activeFilter === label ? null : label)}
            className={cn(
              "text-[10px] px-2 py-1 rounded-full whitespace-nowrap transition-colors",
              activeFilter === label
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Evidence List */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto">
        {filteredEvidence.map((item) => (
          <div 
            key={item.id}
            className="p-3 rounded-lg bg-muted/30 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">{item.domain}</p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Labels */}
            <div className="flex flex-wrap gap-1">
              {item.labels.map((label) => (
                <span
                  key={label}
                  className={cn(
                    "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                    LABEL_COLORS[label]
                  )}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Buyer relevance */}
            <p className="text-[10px] text-muted-foreground italic">
              "{item.buyerRelevance}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
