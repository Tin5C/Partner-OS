// Vendor Row — single vendor entry for the Approved list
// Extracted from VendorsApprovedTab for maintainability

import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Package,
  Clock,
  Users,
  ExternalLink,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Vendor,
  getVerificationStatus,
  VENDOR_CATEGORY_LABELS,
  COMMERCIAL_MODEL_LABELS,
  INTEGRATION_COMPLEXITY_LABELS,
  VERIFICATION_STATUS_LABELS,
  VerificationStatus,
} from '@/data/partnerVendors';
import { SEED_PACKAGES } from '@/data/partnerPackages';
import { ToolFitPanel } from './ToolFitPanel';
import { VendorLogo } from './VendorLogo';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// ── Verification tooltip copy ──────────────────────────
const VERIFICATION_TOOLTIPS: Record<VerificationStatus, string> = {
  verified:
    'Reviewed and validated by Dialogue using vendor documentation and partner evidence.',
  'partially-verified':
    'Approved for use. Some claims or integrations not yet fully validated.',
  unverified:
    'Approved by partner. Formal verification pending.',
};

// ── Verification badge (with tooltip) ──────────────────
function VerificationBadge({ vendor }: { vendor: Vendor }) {
  const status = getVerificationStatus(vendor);
  const label = VERIFICATION_STATUS_LABELS[status];
  const tooltip = VERIFICATION_TOOLTIPS[status];

  const styles: Record<VerificationStatus, { badge: string; Icon: typeof ShieldCheck }> = {
    verified: {
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      Icon: ShieldCheck,
    },
    'partially-verified': {
      badge: 'bg-[#EEF0FF] text-[#4F46E5] dark:bg-indigo-900/30 dark:text-indigo-300',
      Icon: ShieldAlert,
    },
    unverified: {
      badge: 'bg-muted text-muted-foreground',
      Icon: Shield,
    },
  };

  const { badge, Icon } = styles[status];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 cursor-default',
            badge,
          )}
        >
          <Icon className="w-3 h-3" /> {label}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[260px] text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

// ── Main vendor row ────────────────────────────────────
interface VendorRowProps {
  vendor: Vendor;
  isExpanded: boolean;
  onToggle: () => void;
}

export function VendorRow({ vendor, isExpanded, onToggle }: VendorRowProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Collapsed row */}
      <button
        onClick={onToggle}
        className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-muted/20 transition-colors"
      >
        {/* 1. Vendor Identity */}
        <VendorLogo logo={vendor.logo} vendorName={vendor.name} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
            {/* 2. Vendor Type — primary badge */}
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
              {VENDOR_CATEGORY_LABELS[vendor.category]}
            </span>
            {/* 3. Approval Status — muted green */}
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 font-medium flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Approved
            </span>
            {/* 4. Verification — strongest trust signal */}
            <VerificationBadge vendor={vendor} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{vendor.oneLiner}</p>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border/60 pt-3">
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
                  <p className="text-xs text-muted-foreground">Verification pending</p>
                )}
                {vendor.verificationSourceLinks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.verificationSourceLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                      >
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
                  <span
                    key={pkgId}
                    className="text-[11px] px-2 py-1 rounded-md bg-muted text-foreground flex items-center gap-1"
                  >
                    <Package className="w-3 h-3" /> {pkg.name}
                  </span>
                ) : null;
              })}
              {vendor.mappedPackages.length === 0 && (
                <p className="text-xs text-[#6D6AF6] dark:text-indigo-400 flex items-center gap-1">
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
}
