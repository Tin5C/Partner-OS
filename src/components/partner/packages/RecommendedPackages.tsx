// Recommended Packages Section — Shown inside AI Deal Brief output
// Recommends 1-3 packages based on maturity gaps

import { useState } from 'react';
import {
  Package,
  ChevronRight,
  Target,
  Clock,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  AIPackage,
  PricingTierName,
  PACKAGE_CATEGORY_LABELS,
  recommendPackages,
  addPackageAttachment,
} from '@/data/partnerPackages';
import { PackageDetailPanel } from './PackageDetailPanel';

interface RecommendedPackagesProps {
  maturityGaps: Record<string, number>;
  briefId?: string;
  onPackageAdded?: (packageId: string, tier: PricingTierName) => void;
}

export function RecommendedPackages({
  maturityGaps,
  briefId,
  onPackageAdded,
}: RecommendedPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<AIPackage | null>(null);

  const recommendations = recommendPackages(maturityGaps, 3);

  if (recommendations.length === 0) return null;

  const handleAddToDealPlan = (packageId: string, tier: PricingTierName) => {
    if (briefId) {
      addPackageAttachment({
        briefId,
        packageId,
        selectedTier: tier,
        notes: '',
        addedAt: new Date().toISOString(),
      });
    }
    onPackageAdded?.(packageId, tier);
    toast.success('Package added to deal plan');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Recommended Packages
        </h3>
      </div>

      <div className="space-y-2">
        {recommendations.map(({ package: pkg, reason }) => (
          <div
            key={pkg.id}
            className="p-3 rounded-xl border border-border bg-card hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground">{pkg.name}</p>
                  {pkg.recurringModel !== 'none' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      Recurring
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{pkg.shortOutcome}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground flex-shrink-0 ml-2">
                {PACKAGE_CATEGORY_LABELS[pkg.category]}
              </span>
            </div>

            {/* Why recommended */}
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">{reason}</p>
            </div>

            {/* Quick facts */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {pkg.timebox}
              </span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3" /> {pkg.targetBuyers.slice(0, 2).join(', ')}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAddToDealPlan(pkg.id, 'better')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Package className="w-3 h-3" />
                Add to deal plan
              </button>
              <button
                onClick={() => setSelectedPackage(pkg)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-border hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                View package
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <PackageDetailPanel
        pkg={selectedPackage}
        open={!!selectedPackage}
        onOpenChange={(open) => !open && setSelectedPackage(null)}
        onAddToDealPlan={handleAddToDealPlan}
        briefId={briefId}
      />
    </div>
  );
}
