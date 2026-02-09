// Vendors — Trending (Watchlist) Tab
// Admin-only: track emerging vendors before promoting to Approved

import { useState } from 'react';
import {
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Clock,
  Users,
  AlertTriangle,
  BarChart3,
  Shield,
  ExternalLink,
  Plus,
  ArrowUpRight,
  CalendarClock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  getTrendingVendors,
  getVendorsByStatus,
  VENDOR_CATEGORY_LABELS,
  COMMERCIAL_MODEL_LABELS,
  INTEGRATION_COMPLEXITY_LABELS,
} from '@/data/partnerVendors';
import { SEED_PACKAGES } from '@/data/partnerPackages';

export function VendorsTrendingTab() {
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const trending = getTrendingVendors();
  const deprecated = getVendorsByStatus('deprecated');

  const handlePromote = (vendorName: string) => {
    toast.info(`Promotion requires mapping ${vendorName} to ≥1 package and completing verification fields.`);
  };

  const getDaysUntilExpiry = (expiryAt?: string) => {
    if (!expiryAt) return null;
    const diff = new Date(expiryAt).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Trending */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Trending Watchlist
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Vendors under evaluation. Not visible to sellers until promoted to Approved.
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" />
            Add to Watchlist
          </button>
        </div>

        {trending.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">No vendors on the watchlist.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trending.map(vendor => {
              const isExpanded = expandedVendor === vendor.id;
              const daysLeft = getDaysUntilExpiry(vendor.expiryAt);

              return (
                <div key={vendor.id} className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                    onClick={() => setExpandedVendor(isExpanded ? null : vendor.id)}
                    className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/20 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-[#6D6AF6] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                          {VENDOR_CATEGORY_LABELS[vendor.category]}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EEF0FF] text-[#4F46E5] dark:bg-indigo-900/30 dark:text-indigo-300 font-medium">
                          Trending
                        </span>
                        {daysLeft !== null && (
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5",
                            daysLeft <= 7
                              ? "bg-destructive/10 text-destructive"
                              : "bg-muted text-muted-foreground"
                          )}>
                            <CalendarClock className="w-3 h-3" />
                            {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{vendor.oneLiner}</p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4 border-t border-border/60 pt-3">
                      {/* Recommended Next Action */}
                      {vendor.recommendedNextAction && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="text-xs font-semibold text-primary mb-1">Recommended Next Action</p>
                          <p className="text-sm text-foreground">{vendor.recommendedNextAction}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Delivery */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Delivery</p>
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-foreground">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              {vendor.deliveryNotes.typicalTimebox}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-foreground">
                              <BarChart3 className="w-3 h-3 text-muted-foreground" />
                              Complexity: {INTEGRATION_COMPLEXITY_LABELS[vendor.deliveryNotes.integrationComplexity]}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-foreground">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              {vendor.deliveryNotes.requiredRolesSkills.join(', ')}
                            </div>
                          </div>
                        </div>

                        {/* Security */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Security</p>
                          {vendor.securityNotes === 'DATA_NEEDED' ? (
                            <p className="text-xs text-[#6D6AF6] dark:text-indigo-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> DATA NEEDED — required before promotion
                            </p>
                          ) : (
                            <div className="space-y-1">
                              <div><span className="text-[10px] text-muted-foreground">Deploy: </span><span className="text-[11px] text-foreground">{vendor.securityNotes.deploymentModel}</span></div>
                              <div><span className="text-[10px] text-muted-foreground">Data: </span><span className="text-[11px] text-foreground">{vendor.securityNotes.dataHandlingSummary}</span></div>
                              <div><span className="text-[10px] text-muted-foreground">Residency: </span><span className="text-[11px] text-foreground">{vendor.securityNotes.residencyNotes}</span></div>
                            </div>
                          )}
                        </div>

                        {/* Commercial */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Commercial</p>
                          <p className="text-xs text-foreground">Model: {COMMERCIAL_MODEL_LABELS[vendor.commercialModel]}</p>
                          <p className="text-xs text-foreground">Economics: {vendor.partnerEconomics}</p>
                        </div>

                        {/* Owner */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Owner</p>
                          <p className="text-xs text-foreground">{vendor.ownerName}</p>
                          <p className="text-[11px] text-muted-foreground">{vendor.ownerRole}</p>
                          {vendor.verificationSourceLinks.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              {vendor.verificationSourceLinks.map((link, i) => (
                                <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                                  className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                                  Source <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Promote action */}
                      <button
                        onClick={() => handlePromote(vendor.name)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        Promote to Approved
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deprecated */}
      {deprecated.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Deprecated</h3>
          {deprecated.map(vendor => (
            <div key={vendor.id} className="p-3 rounded-xl border border-border/60 bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
                  Deprecated
                </span>
                <p className="text-sm text-muted-foreground">{vendor.name}</p>
                <span className="text-[10px] text-muted-foreground">
                  {VENDOR_CATEGORY_LABELS[vendor.category]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{vendor.oneLiner}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
