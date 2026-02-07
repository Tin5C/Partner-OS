// Vendors — Approved Tab
// Admin view for managing approved vendors with enterprise governance
// Groups vendors by category with enterprise-grade visual hierarchy

import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Vendor,
  VendorCategory,
  getApprovedVendors,
  VENDOR_CATEGORY_LABELS,
} from '@/data/partnerVendors';
import { VendorRow } from './VendorRow';

// ── Category grouping order ────────────────────────────
// Strategic categories shown first; others grouped at end
const CATEGORY_GROUP_ORDER: { key: VendorCategory; label: string }[] = [
  { key: 'llm', label: 'Foundation Models (LLMs)' },
  { key: 'agent-platform', label: 'Agent Platforms' },
  { key: 'orchestration', label: 'Orchestration & Frameworks' },
  { key: 'vector-db', label: 'Data & Retrieval' },
  { key: 'governance', label: 'Governance' },
  { key: 'security', label: 'Security' },
  { key: 'observability', label: 'Observability' },
  { key: 'mlops', label: 'MLOps & Experiment Tracking' },
  { key: 'evals', label: 'Evals' },
  { key: 'other', label: 'Other' },
];

function groupVendorsByCategory(vendors: Vendor[]) {
  const groups: { key: VendorCategory; label: string; vendors: Vendor[] }[] = [];

  for (const group of CATEGORY_GROUP_ORDER) {
    const matching = vendors.filter(v => v.category === group.key);
    if (matching.length > 0) {
      groups.push({ ...group, vendors: matching });
    }
  }

  return groups;
}

export function VendorsApprovedTab() {
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const approved = getApprovedVendors();
  const groups = groupVendorsByCategory(approved);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Approved vendors for use in service packages. Sellers only see these within package context.
        </p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Vendor
        </button>
      </div>

      {groups.map(group => (
        <div key={group.key} className="space-y-2">
          {/* Category section header */}
          <div className="flex items-center gap-2 pt-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {group.label}
            </h3>
            <span className="text-[10px] text-muted-foreground/60 font-medium">
              {group.vendors.length}
            </span>
            <div className="flex-1 border-t border-border/40" />
          </div>

          {/* Vendor rows */}
          <div className="space-y-2">
            {group.vendors.map(vendor => (
              <VendorRow
                key={vendor.id}
                vendor={vendor}
                isExpanded={expandedVendor === vendor.id}
                onToggle={() =>
                  setExpandedVendor(
                    expandedVendor === vendor.id ? null : vendor.id,
                  )
                }
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
