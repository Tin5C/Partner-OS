// Engineer Snapshot Output
// Generated capability snapshot, risks/assumptions, and next artifacts

import { Copy, Check, Shield, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EngineerOutput } from '@/data/partnerCapabilityData';

interface EngineerSnapshotOutputProps {
  output: EngineerOutput;
}

export function EngineerSnapshotOutput({ output }: EngineerSnapshotOutputProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Capability Snapshot */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Capability snapshot
          </h4>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={() => handleCopy(output.capabilitySnapshot.join('\n• '), 'capability')}
          >
            {copiedField === 'capability' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>
        <ul className="space-y-1.5">
          {output.capabilitySnapshot.map((item, idx) => (
            <li key={idx} className="text-sm text-foreground flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Risks & Assumptions Checklist */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Risks & assumptions you typically cover
          </h4>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 flex-shrink-0"
            onClick={() => handleCopy(output.risksAssumptions.map((r, i) => `${i + 1}. ${r}`).join('\n'), 'risks')}
          >
            {copiedField === 'risks' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </Button>
        </div>
        <ol className="space-y-2">
          {output.risksAssumptions.map((risk, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center text-[10px] text-amber-700 flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              {risk}
            </li>
          ))}
        </ol>
      </div>

      {/* Technical Post Outline */}
      {output.technicalPostOutline && (
        <div className="p-4 rounded-xl border border-border bg-muted/20">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Technical post idea
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                Optional
              </span>
            </h4>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 flex-shrink-0"
              onClick={() => handleCopy(output.technicalPostOutline || '', 'post')}
            >
              {copiedField === 'post' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground italic">
            "{output.technicalPostOutline}"
          </p>
          <p className="text-[10px] text-muted-foreground mt-2">
            Draft for internal use only — no public publishing in MVP.
          </p>
        </div>
      )}

      {/* Next Artifacts to Upload */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          Next artifacts to strengthen signal
        </h4>
        <ul className="space-y-2">
          {output.nextArtifacts.map((artifact, idx) => (
            <li 
              key={idx} 
              className={cn(
                "flex items-center justify-between p-2.5 rounded-lg",
                "bg-muted/30 hover:bg-muted/50 transition-colors"
              )}
            >
              <span className="text-sm text-foreground">{artifact}</span>
              <Button size="sm" variant="ghost" className="h-7 text-xs">
                Upload
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
