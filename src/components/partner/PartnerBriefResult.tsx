// Partner Brief Result View
// Exec-summary style output showing recommendations

import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  DollarSign, 
  FileText, 
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PartnerBriefInput, PartnerBriefOutput } from '@/data/partnerBriefData';
import { toast } from 'sonner';

interface PartnerBriefResultProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  input: PartnerBriefInput | null;
  output: PartnerBriefOutput | null;
  onNewBrief: () => void;
}

function SectionCard({
  icon,
  title,
  children,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export function PartnerBriefResult({
  open,
  onOpenChange,
  input,
  output,
  onNewBrief,
}: PartnerBriefResultProps) {
  if (!output || !input) return null;

  const handleCopySection = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatNextSteps = () => {
    return output.nextSevenDays.join('\n• ');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-[600px] overflow-y-auto p-0"
      >
        <SheetHeader className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-xl font-semibold">
                Partner Brief
              </SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {input.customerName}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onNewBrief}
              className="gap-1"
            >
              <Sparkles className="w-3 h-3" />
              New Brief
            </Button>
          </div>
        </SheetHeader>

        <div className="px-6 py-6 space-y-5">
          {/* Top Recommendations */}
          <SectionCard
            icon={<Sparkles className="w-4 h-4 text-primary" />}
            title="Recommended Microsoft Support"
          >
            <div className="space-y-3">
              {output.topRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg",
                    rec.priority === 'high' 
                      ? 'bg-primary/5 border border-primary/20' 
                      : 'bg-muted/30'
                  )}
                >
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Programs & Eligibility */}
          <SectionCard
            icon={<Building2 className="w-4 h-4 text-muted-foreground" />}
            title="Programs & Eligibility"
          >
            <div className="space-y-3">
              {/* Co-sell */}
              <div className="flex items-start gap-3">
                {output.programs.coSell.recommended ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Co-Sell: {output.programs.coSell.recommended ? 'Recommended' : 'Optional'}
                  </p>
                  <p className="text-xs text-muted-foreground">{output.programs.coSell.notes}</p>
                </div>
              </div>

              {/* Deal Registration */}
              <div className="flex items-start gap-3">
                {output.programs.dealRegistration.recommended ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Deal Registration: {output.programs.dealRegistration.recommended ? 'Recommended' : 'Optional'}
                  </p>
                  <p className="text-xs text-muted-foreground">{output.programs.dealRegistration.notes}</p>
                </div>
              </div>

              {/* Partner Programs */}
              {output.programs.partnerPrograms.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Applicable Programs</p>
                  <ul className="space-y-1">
                    {output.programs.partnerPrograms.map((prog, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        {prog}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Funding & Incentives */}
          <SectionCard
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            title="Funding & Incentives"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Workshop Funding</p>
                <p className="text-sm text-foreground">{output.funding.workshopFunding}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">POC Support</p>
                <p className="text-sm text-foreground">{output.funding.pocSupport}</p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Evidence Needed</p>
                <ul className="space-y-1">
                  {output.funding.evidenceNeeded.map((ev, idx) => (
                    <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Workshop Suggestion */}
          {output.workshop && (
            <SectionCard
              icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
              title="Workshop Suggestion"
              className="bg-primary/5 border-primary/20"
            >
              <div className="space-y-3">
                <p className="text-sm font-semibold text-primary">{output.workshop.name}</p>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Agenda</p>
                  <ul className="space-y-1">
                    {output.workshop.agenda.map((item, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-muted-foreground">{idx + 1}.</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Expected Outputs</p>
                  <ul className="space-y-1">
                    {output.workshop.expectedOutputs.map((out, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        {out}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Who to Contact */}
          <SectionCard
            icon={<Users className="w-4 h-4 text-muted-foreground" />}
            title="Who to Contact / How to Route"
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Microsoft Contacts</p>
                <div className="flex flex-wrap gap-2">
                  {output.routing.contacts.map((contact, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-muted/50 rounded-md text-sm text-foreground"
                    >
                      {contact}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Next Steps</p>
                <ul className="space-y-1">
                  {output.routing.steps.map((step, idx) => (
                    <li key={idx} className="text-sm text-foreground">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Assets */}
          <SectionCard
            icon={<FileText className="w-4 h-4 text-muted-foreground" />}
            title="Assets You Should Use"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {output.assets.map((asset, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{asset.name}</p>
                    <p className="text-xs text-muted-foreground">{asset.type}</p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Next 7 Days */}
          <SectionCard
            icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
            title="Next 7 Days Plan"
          >
            <div className="space-y-2">
              {output.nextSevenDays.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full border border-border text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-foreground">{action}</p>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 gap-2"
              onClick={() => handleCopySection(`Next 7 Days:\n• ${formatNextSteps()}`)}
            >
              <Copy className="w-3 h-3" />
              Copy action list
            </Button>
          </SectionCard>
        </div>
      </SheetContent>
    </Sheet>
  );
}
