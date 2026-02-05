// Seller Snapshot Output
// Generated positioning, proof points, and talk tracks

import { Copy, Check, FileText, MessageSquare, Linkedin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SellerOutput } from '@/data/partnerCapabilityData';

interface SellerSnapshotOutputProps {
  output: SellerOutput;
}

export function SellerSnapshotOutput({ output }: SellerSnapshotOutputProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Positioning Statement */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              Your positioning statement
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {output.positioningStatement}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={() => handleCopy(output.positioningStatement, 'positioning')}
          >
            {copiedField === 'positioning' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Proof Points */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="text-sm font-medium text-foreground">
            3 proof points
          </h4>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={() => handleCopy(output.proofPoints.map((p, i) => `${i + 1}. ${p}`).join('\n'), 'proofpoints')}
          >
            {copiedField === 'proofpoints' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>
        <ol className="space-y-2">
          {output.proofPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-foreground flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              {point}
            </li>
          ))}
        </ol>
      </div>

      {/* Talk Track */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Intro call talk track
          </h4>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={() => handleCopy(output.talkTrack, 'talktrack')}
          >
            {copiedField === 'talktrack' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          {output.talkTrack}
        </p>
      </div>

      {/* LinkedIn Post Ideas */}
      <div className="p-4 rounded-xl border border-border bg-muted/20">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
          <Linkedin className="w-4 h-4 text-muted-foreground" />
          LinkedIn post ideas
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            Optional
          </span>
        </h4>
        <ul className="space-y-2">
          {output.linkedinPostIdeas.map((idea, idx) => (
            <li key={idx} className="flex items-start justify-between gap-3">
              <span className="text-sm text-muted-foreground">• {idea}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 flex-shrink-0"
                onClick={() => handleCopy(idea, `linkedin-${idx}`)}
              >
                {copiedField === `linkedin-${idx}` ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground" />
                )}
              </Button>
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-muted-foreground mt-3">
          Draft for internal use only — no public publishing in MVP.
        </p>
      </div>
    </div>
  );
}
