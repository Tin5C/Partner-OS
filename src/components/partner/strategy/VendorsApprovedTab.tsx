// Vendors — Approved Tab
// Admin view for managing approved vendors with enterprise governance

import { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Shield,
  Package,
  Clock,
  Users,
  ExternalLink,
  Plus,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Vendor,
  getApprovedVendors,
  getVerificationStatus,
  VENDOR_CATEGORY_LABELS,
  COMMERCIAL_MODEL_LABELS,
  INTEGRATION_COMPLEXITY_LABELS,
  VERIFICATION_STATUS_LABELS,
} from '@/data/partnerVendors';
import { SEED_PACKAGES } from '@/data/partnerPackages';
import { ToolFitPanel } from './ToolFitPanel';

function VerificationBadge({ vendor }: { vendor: Vendor }) {
  const status = getVerificationStatus(vendor);
  const label = VERIFICATION_STATUS_LABELS[status];

  if (status === 'verified') {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-medium flex items-center gap-0.5">
        <ShieldCheck className="w-3 h-3" /> {label}
      </span>
    );
  }
  if (status === 'partially-verified') {
    return (
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 font-medium flex items-center gap-0.5">
        <ShieldAlert className="w-3 h-3" /> {label}
      </span>
    );
  }
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-medium flex items-center gap-0.5">
      <ShieldX className="w-3 h-3" /> {label}
    </span>
  );
}

export function VendorsApprovedTab() {
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const approved = getApprovedVendors();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Approved vendors for use in service packages. Sellers only see these within package context.
        </p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Vendor
        </button>
      </div>

      <div className="space-y-3">
        {approved.map(vendor => {
          const isExpanded = expandedVendor === vendor.id;

          return (
            <div key={vendor.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setExpandedVendor(isExpanded ? null : vendor.id)}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/20 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                      {VENDOR_CATEGORY_LABELS[vendor.category]}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-medium">
                      Approved
                    </span>
                    <VerificationBadge vendor={vendor} />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Delivery Notes */}
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

                    {/* Security Notes */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Security</p>
                      {vendor.securityNotes === 'DATA_NEEDED' ? (
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> DATA NEEDED
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {[
                            { label: 'Deploy', value: vendor.securityNotes.deploymentModel },
                            { label: 'Data', value: vendor.securityNotes.dataHandlingSummary },
                            { label: 'SSO/Audit', value: vendor.securityNotes.ssoScimAudit },
                            { label: 'Residency', value: vendor.securityNotes.residencyNotes },
                          ].map(item => (
                            <div key={item.label}>
                              <span className="text-[10px] text-muted-foreground">{item.label}: </span>
                              <span className="text-[11px] text-foreground">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Commercial */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Commercial</p>
                      <div className="space-y-1">
                        <p className="text-xs text-foreground">
                          Model: {COMMERCIAL_MODEL_LABELS[vendor.commercialModel]}
                        </p>
                        <p className="text-xs text-foreground">
                          Economics: {vendor.partnerEconomics}
                        </p>
                        {vendor.displacementRisk && (
                          <p className="text-xs text-foreground">
                            Displacement risk: <span className="capitalize">{vendor.displacementRisk}</span>
                          </p>
                        )}
                        {vendor.reviewCadence && (
                          <p className="text-xs text-foreground">
                            Review cadence: {vendor.reviewCadence}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Verification */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Verification</p>
                      <div className="space-y-1">
                        {vendor.lastVerifiedAt ? (
                          <p className="text-xs text-foreground">
                            Last verified: {vendor.lastVerifiedAt}
                          </p>
                        ) : (
                          <p className="text-xs text-amber-600 dark:text-amber-400">Not verified</p>
                        )}
                        {vendor.verificationSourceLinks.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {vendor.verificationSourceLinks.map((link, i) => (
                              <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] text-primary hover:underline flex items-center gap-0.5">
                                Source {i + 1} <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ))}
                          </div>
                        )}
                        <p className="text-[11px] text-muted-foreground">
                          Owner: {vendor.ownerName} ({vendor.ownerRole})
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mapped Packages */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Mapped Packages</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.mappedPackages.map(pkgId => {
                        const pkg = SEED_PACKAGES.find(p => p.id === pkgId);
                        return pkg ? (
                          <span key={pkgId} className="text-[11px] px-2 py-1 rounded-md bg-muted text-foreground flex items-center gap-1">
                            <Package className="w-3 h-3" /> {pkg.name}
                          </span>
                        ) : null;
                      })}
                      {vendor.mappedPackages.length === 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Must be mapped to ≥1 package
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Partner Profile Fit */}
                  <ToolFitPanel mappedPackageIds={vendor.mappedPackages} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
