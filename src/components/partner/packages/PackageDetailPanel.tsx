// Package Detail Panel — Full package view (admin edit / seller read-only)
// Shows all package fields including proof kit, tiers, and embedded tools

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  CheckCircle2,
  Clock,
  Users,
  Target,
  AlertTriangle,
  Package,
  DollarSign,
  FileText,
  Wrench,
  Shield,
  TrendingUp,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AIPackage,
  PricingTierName,
  PACKAGE_CATEGORY_LABELS,
  getToolsForPackage,
  addPackageAttachment,
} from '@/data/partnerPackages';
import { useState } from 'react';

interface PackageDetailPanelProps {
  pkg: AIPackage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin?: boolean;
  onAddToDealPlan?: (packageId: string, tier: PricingTierName) => void;
  briefId?: string;
}

const TIER_LABELS: Record<PricingTierName, string> = {
  good: 'Good',
  better: 'Better',
  best: 'Best',
};

export function PackageDetailPanel({
  pkg,
  open,
  onOpenChange,
  isAdmin = false,
  onAddToDealPlan,
  briefId,
}: PackageDetailPanelProps) {
  const [selectedTier, setSelectedTier] = useState<PricingTierName>('better');

  if (!pkg) return null;

  const tools = getToolsForPackage(pkg);

  const handleAddToDealPlan = () => {
    if (onAddToDealPlan) {
      onAddToDealPlan(pkg.id, selectedTier);
    } else if (briefId) {
      addPackageAttachment({
        briefId,
        packageId: pkg.id,
        selectedTier,
        notes: '',
        addedAt: new Date().toISOString(),
      });
    }
    toast.success(`${pkg.name} (${TIER_LABELS[selectedTier]}) added to deal plan`);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[600px] overflow-y-auto p-0">
        <SheetHeader className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                  {PACKAGE_CATEGORY_LABELS[pkg.category]}
                </span>
              </div>
              <SheetTitle className="text-lg">{pkg.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">{pkg.shortOutcome}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Quick Facts */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {pkg.timebox}
            </div>
            {pkg.recurringModel !== 'none' && (
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                {pkg.recurringModel.replace(/-/g, ' ')}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              {pkg.targetBuyers.join(', ')}
            </div>
          </div>

          {/* When to sell */}
          <Section title="When to sell" icon={<Target className="w-3.5 h-3.5 text-green-600" />}>
            <ul className="space-y-1.5">
              {pkg.whenToSell.map((item, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* When NOT to sell */}
          <Section title="When not to sell" icon={<AlertTriangle className="w-3.5 h-3.5 text-[#6D6AF6]/70" />}>
            <ul className="space-y-1.5">
              {pkg.whenNotToSell.map((item, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#6D6AF6]/70 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Deliverables */}
          <Section title="Deliverables" icon={<FileText className="w-3.5 h-3.5 text-primary" />}>
            <ul className="space-y-1">
              {pkg.deliverables.map((item, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Pricing Tiers */}
          <Section title="Engagement Tiers" icon={<DollarSign className="w-3.5 h-3.5 text-primary" />}>
            <div className="space-y-3">
              {pkg.pricingTiers.map((tier) => (
                <button
                  key={tier.tierName}
                  onClick={() => setSelectedTier(tier.tierName)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all",
                    selectedTier === tier.tierName
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card hover:border-primary/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {TIER_LABELS[tier.tierName]}
                    </span>
                    {tier.indicativeRange && (
                      <span className="text-xs text-primary font-medium">{tier.indicativeRange}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{tier.description}</p>
                  <ul className="space-y-0.5">
                    {tier.deliverablesDelta.map((d, i) => (
                      <li key={i} className="text-[11px] text-foreground/80 flex items-center gap-1.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-600 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </Section>

          {/* Proof Kit */}
          <Section title="Proof Kit" icon={<Shield className="w-3.5 h-3.5 text-primary" />}>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Required customer inputs</p>
                <ul className="space-y-1">
                  {pkg.proofKit.requiredCustomerInputs.map((item, i) => (
                    <li key={i} className="text-sm text-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Proof artifacts to request</p>
                <ul className="space-y-1">
                  {pkg.proofKit.proofArtifactsToRequest.map((item, i) => (
                    <li key={i} className="text-sm text-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Artifacts we provide</p>
                <ul className="space-y-1">
                  {pkg.proofKit.artifactsWeProvide.map((item, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Risk clauses</p>
                <ul className="space-y-1">
                  {pkg.proofKit.riskClauses.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <AlertTriangle className="w-3 h-3 text-[#6D6AF6]/70 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Tools & Agents */}
          {tools.length > 0 && (
            <Section title="Tools & Agents" icon={<Wrench className="w-3.5 h-3.5 text-muted-foreground" />}>
              <div className="space-y-2">
                {tools.map(tool => {
                  const typeConfig: Record<string, { label: string; color: string }> = {
                    agent: { label: 'Agent', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
                    tool: { label: 'Tool', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
                    template: { label: 'Template', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
                  };
                  const tc = typeConfig[tool.type];
                  return (
                    <div key={tool.id} className="p-3 rounded-lg bg-muted/30 border border-border/60">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground">{tool.name}</p>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", tc.color)}>
                          {tc.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{tool.description}</p>
                      {tool.securityNotes.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/40">
                          <p className="text-[10px] font-medium text-muted-foreground mb-1">Security</p>
                          {tool.securityNotes.map((note, i) => (
                            <p key={i} className="text-[11px] text-muted-foreground flex items-start gap-1">
                              <Shield className="w-2.5 h-2.5 text-[#6D6AF6]/70 mt-0.5 flex-shrink-0" />
                              {note}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* Add to deal plan */}
          {!isAdmin && (
            <button
              onClick={handleAddToDealPlan}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl",
                "bg-primary text-primary-foreground font-medium text-sm",
                "shadow-sm hover:bg-primary/90 transition-all"
              )}
            >
              <Package className="w-4 h-4" />
              Add to deal plan — {TIER_LABELS[selectedTier]}
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}
