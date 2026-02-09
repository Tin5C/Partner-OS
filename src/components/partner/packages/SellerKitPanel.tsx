// Seller Kit Panel — Generated discovery questions, talk tracks, objections
// Opened from Package Factory or Package Detail

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Sparkles,
  Copy,
  MessageSquare,
  Target,
  Shield,
  Calendar,
  ChevronRight,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AIPackage, generateSellerKit, SellerKit } from '@/data/partnerPackages';
import { useMemo } from 'react';

interface SellerKitPanelProps {
  pkg: AIPackage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SellerKitPanel({ pkg, open, onOpenChange }: SellerKitPanelProps) {
  const kit = useMemo(() => (pkg ? generateSellerKit(pkg) : null), [pkg]);

  if (!pkg || !kit) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto p-0">
        <SheetHeader className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
              Generated
            </span>
          </div>
          <SheetTitle className="text-lg">Seller Kit: {pkg.name}</SheetTitle>
          <p className="text-sm text-muted-foreground">
            Ready-to-use materials for your first meeting and follow-up.
          </p>
        </SheetHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Discovery Questions */}
          <KitSection
            title="Discovery Questions"
            icon={<Target className="w-3.5 h-3.5 text-primary" />}
            count={kit.discoveryQuestions.length}
            onCopy={() => handleCopy(kit.discoveryQuestions.join('\n'), 'Discovery questions')}
          >
            <ol className="space-y-2">
              {kit.discoveryQuestions.map((q, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </KitSection>

          {/* Talk Track */}
          <KitSection
            title="Talk Track"
            icon={<MessageSquare className="w-3.5 h-3.5 text-primary" />}
            count={kit.talkTrack.length}
            onCopy={() => handleCopy(kit.talkTrack.join('\n'), 'Talk track')}
          >
            <ol className="space-y-2">
              {kit.talkTrack.map((t, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
          </KitSection>

          {/* Objections & Responses */}
          <KitSection
            title="Objections & Responses"
            icon={<Shield className="w-3.5 h-3.5 text-[#6D6AF6]/70" />}
            count={kit.objections.length}
            onCopy={() => handleCopy(
              kit.objections.map(o => `Q: ${o.objection}\nA: ${o.response}`).join('\n\n'),
              'Objections'
            )}
          >
            <div className="space-y-3">
              {kit.objections.map((obj, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/60">
                  <p className="text-sm font-medium text-foreground mb-1.5">
                    "{obj.objection}"
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {obj.response}
                  </p>
                </div>
              ))}
            </div>
          </KitSection>

          {/* First Meeting Agenda */}
          <KitSection
            title="First Meeting Agenda"
            icon={<Calendar className="w-3.5 h-3.5 text-primary" />}
            count={kit.firstMeetingAgenda.length}
            onCopy={() => handleCopy(kit.firstMeetingAgenda.join('\n'), 'Meeting agenda')}
          >
            <ol className="space-y-1.5">
              {kit.firstMeetingAgenda.map((item, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-xs text-muted-foreground mt-0.5">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </KitSection>

          {/* Next Steps */}
          <KitSection
            title="Next Steps & Pilot Path"
            icon={<ChevronRight className="w-3.5 h-3.5 text-primary" />}
            count={kit.nextSteps.length}
            onCopy={() => handleCopy(kit.nextSteps.join('\n'), 'Next steps')}
          >
            <ol className="space-y-1.5">
              {kit.nextSteps.map((step, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </KitSection>

          {/* Email Draft */}
          {kit.emailDraft && (
            <KitSection
              title="Follow-up Email"
              icon={<Mail className="w-3.5 h-3.5 text-primary" />}
              onCopy={() => handleCopy(kit.emailDraft!, 'Email draft')}
            >
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                  {kit.emailDraft}
                </p>
              </div>
            </KitSection>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function KitSection({
  title,
  icon,
  count,
  onCopy,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  onCopy: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
          {count !== undefined && (
            <span className="text-[10px] text-muted-foreground">({count})</span>
          )}
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <Copy className="w-3 h-3" />
          Copy
        </button>
      </div>
      {children}
    </div>
  );
}
