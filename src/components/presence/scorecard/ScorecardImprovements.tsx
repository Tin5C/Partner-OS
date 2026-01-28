import { cn } from '@/lib/utils';
import { Lightbulb, PenLine, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { ImprovementData } from '@/lib/presenceScorecardData';

interface ScorecardImprovementsProps {
  improvements: ImprovementData;
}

export function ScorecardImprovements({ improvements }: ScorecardImprovementsProps) {
  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50">
          <Lightbulb className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-foreground">Improvements</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Practical next steps to improve your presence</p>
        </div>
      </div>

      {/* Profile Edits */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PenLine className="w-3.5 h-3.5 text-muted-foreground" />
          <h4 className="text-xs font-medium text-foreground">3 profile edits</h4>
        </div>
        <ul className="space-y-1.5 pl-5">
          {improvements.profileEdits.map((edit, idx) => (
            <li key={idx} className="text-xs text-muted-foreground list-disc">
              {edit}
            </li>
          ))}
        </ul>
      </div>

      {/* Post Ideas */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          <h4 className="text-xs font-medium text-foreground">3 post ideas</h4>
        </div>
        <div className="space-y-1.5">
          {improvements.postIdeas.map((post, idx) => (
            <div key={idx} className="flex items-start gap-2 pl-5">
              <span className="text-xs text-muted-foreground list-disc">• {post.idea}</span>
              <span className={cn(
                "text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0",
                "bg-primary/10 text-primary"
              )}>
                {post.theme}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground pl-5 italic">
          Aligned with this week's themes
        </p>
      </div>

      {/* Signature POV */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
          <h4 className="text-xs font-medium text-foreground">Signature POV</h4>
        </div>
        <p className="text-xs text-muted-foreground pl-5 border-l-2 border-primary/20">
          "{improvements.signaturePov}"
        </p>
      </div>

      {/* Next External Move */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 mb-1.5">
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
          <h4 className="text-xs font-medium text-primary">Next external validation move</h4>
        </div>
        <p className="text-xs text-foreground">
          {improvements.nextExternalMove}
        </p>
      </div>
    </div>
  );
}
