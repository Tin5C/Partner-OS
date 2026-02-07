// AI Services Strategy — Single Admin Cockpit (Partner-only)
// Tabs: Partner Profile, Packages, Vendors Approved, Vendors Trending, Tools & Agents

import { useState } from 'react';
import {
  Briefcase,
  Package,
  Wrench,
  ChevronLeft,
  Plus,
  CheckCircle2,
  Clock,
  Archive,
  FileText,
  Sparkles,
  Shield,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronRight,
  Building2,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  AIPackage,
  ToolAgent,
  SEED_PACKAGES,
  SEED_TOOLS,
  PACKAGE_CATEGORY_LABELS,
  PackageStatus,
  generateSellerKit,
  getToolsForPackage,
} from '@/data/partnerPackages';
import { PackageDetailPanel } from '@/components/partner/packages/PackageDetailPanel';
import { SellerKitPanel } from '@/components/partner/packages/SellerKitPanel';
import { ToolFitPanel } from '@/components/partner/strategy/ToolFitPanel';
import { PartnerProfileTab } from '@/components/partner/strategy/PartnerProfileTab';
import { VendorsApprovedTab } from '@/components/partner/strategy/VendorsApprovedTab';
import { VendorsTrendingTab } from '@/components/partner/strategy/VendorsTrendingTab';

const STATUS_CONFIG: Record<PackageStatus, { label: string; icon: React.ReactNode; color: string }> = {
  approved: { label: 'Approved', icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-green-600' },
  draft: { label: 'Draft', icon: <Clock className="w-3.5 h-3.5" />, color: 'text-amber-500' },
  retired: { label: 'Retired', icon: <Archive className="w-3.5 h-3.5" />, color: 'text-muted-foreground' },
};

function PackagesFactory() {
  const [selectedPackage, setSelectedPackage] = useState<AIPackage | null>(null);
  const [sellerKitPackage, setSellerKitPackage] = useState<AIPackage | null>(null);
  const [statusFilter, setStatusFilter] = useState<PackageStatus | 'all'>('all');

  const filtered = statusFilter === 'all'
    ? SEED_PACKAGES
    : SEED_PACKAGES.filter(p => p.status === statusFilter);

  const grouped = {
    approved: filtered.filter(p => p.status === 'approved'),
    draft: filtered.filter(p => p.status === 'draft'),
    retired: filtered.filter(p => p.status === 'retired'),
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['all', 'approved', 'draft', 'retired'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          New Package
        </button>
      </div>

      {/* Package list */}
      {Object.entries(grouped).map(([status, pkgs]) => {
        if (pkgs.length === 0) return null;
        const config = STATUS_CONFIG[status as PackageStatus];
        return (
          <div key={status} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={config.color}>{config.icon}</span>
              <h3 className="text-sm font-semibold text-foreground">{config.label}</h3>
              <span className="text-xs text-muted-foreground">({pkgs.length})</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {pkgs.map(pkg => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{pkg.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{pkg.shortOutcome}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {PACKAGE_CATEGORY_LABELS[pkg.category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {pkg.timebox}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" /> {pkg.targetBuyers.length} buyers
                    </span>
                    {pkg.recurringModel !== 'none' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        Recurring
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/60">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSellerKitPackage(pkg);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-primary hover:bg-primary/5 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      Seller Kit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage(pkg);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Panels */}
      <PackageDetailPanel
        pkg={selectedPackage}
        open={!!selectedPackage}
        onOpenChange={(open) => !open && setSelectedPackage(null)}
        isAdmin
      />
      <SellerKitPanel
        pkg={sellerKitPackage}
        open={!!sellerKitPackage}
        onOpenChange={(open) => !open && setSellerKitPackage(null)}
      />
    </div>
  );
}

function ToolsAgentsTab() {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Curated tools and agents embedded within packages. Not a standalone marketplace.
        </p>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Add Tool
        </button>
      </div>

      <div className="space-y-3">
        {SEED_TOOLS.map(tool => {
          const isExpanded = expandedTool === tool.id;
          const typeConfig: Record<string, { label: string; color: string }> = {
            agent: { label: 'Agent', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
            tool: { label: 'Tool', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
            template: { label: 'Template', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
          };
          const tc = typeConfig[tool.type];

          return (
            <div
              key={tool.id}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/20 transition-colors"
              >
                <Wrench className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{tool.name}</p>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", tc.color)}>
                      {tc.label}
                    </span>
                    {tool.status === 'deprecated' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
                        Deprecated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
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
                    {/* When to use */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">When to use</p>
                      <ul className="space-y-1">
                        {tool.whenToUse.map((item, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Security notes */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Security notes</p>
                      <ul className="space-y-1">
                        {tool.securityNotes.map((item, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <Shield className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Inputs */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Input needed</p>
                      <ul className="space-y-1">
                        {tool.inputNeeded.map((item, i) => (
                          <li key={i} className="text-xs text-foreground">• {item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Outputs */}
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Outputs produced</p>
                      <ul className="space-y-1">
                        {tool.outputsProduced.map((item, i) => (
                          <li key={i} className="text-xs text-foreground">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Mapped packages */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Used in packages</p>
                    <div className="flex flex-wrap gap-2">
                      {tool.mappedPackages.map(pkgId => {
                        const pkg = SEED_PACKAGES.find(p => p.id === pkgId);
                        return pkg ? (
                          <span key={pkgId} className="text-[11px] px-2 py-1 rounded-md bg-muted text-foreground">
                            {pkg.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  {/* Partner Profile Fit */}
                  <ToolFitPanel mappedPackageIds={tool.mappedPackages} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PartnerStrategyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-[1140px] mx-auto px-5 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/partner')}
              className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                AI Services Strategy
              </h1>
              <p className="text-xs text-muted-foreground">
                Single admin cockpit — profile, packages, vendors, and tools
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1140px] mx-auto px-5 lg:px-8 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-muted/50 border border-border w-full justify-start overflow-x-auto">
            <TabsTrigger value="profile" className="gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              Partner Profile
            </TabsTrigger>
            <TabsTrigger value="packages" className="gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Packages
            </TabsTrigger>
            <TabsTrigger value="vendors-approved" className="gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Vendors — Approved
            </TabsTrigger>
            <TabsTrigger value="vendors-trending" className="gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Vendors — Trending
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              Tools & Agents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <PartnerProfileTab />
          </TabsContent>

          <TabsContent value="packages">
            <PackagesFactory />
          </TabsContent>

          <TabsContent value="vendors-approved">
            <VendorsApprovedTab />
          </TabsContent>

          <TabsContent value="vendors-trending">
            <VendorsTrendingTab />
          </TabsContent>

          <TabsContent value="tools">
            <ToolsAgentsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
