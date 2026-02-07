// Partner Profile Tab — Admin-editable Commercial Baseline
// Renders inside AI Services Strategy cockpit as a tab

import { useState } from 'react';
import {
  Plus,
  Trash2,
  Briefcase,
  Layers,
  BarChart3,
  Settings,
  DollarSign,
  PieChart,
  X,
  Save,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  PartnerProfile,
  ExistingService,
  AttachScale,
  CapabilityLevel,
  CapacitySignal,
  DeliveryModelPref,
  RiskAppetite,
  VendorPosture,
  RevenueMixType,
  ServiceType,
  ContractLength,
  VendorPreference,
  VendorCurrentEntry,
  VendorDisallowedEntry,
  VendorPreferenceReason,
  VendorMaturityLevel,
  VendorDisallowReason,
  getPartnerProfile,
  savePartnerProfile,
  ATTACH_SURFACE_OPTIONS,
  CAPABILITY_DIMENSIONS,
  CAPABILITY_LEVEL_LABELS,
  SCALE_LABELS,
  SERVICE_TYPE_LABELS,
  CONTRACT_LENGTH_LABELS,
  CAPACITY_LABELS,
  DELIVERY_MODEL_LABELS,
  RISK_LABELS,
  VENDOR_POSTURE_LABELS,
  REVENUE_MIX_LABELS,
  VENDOR_PREFERENCE_REASON_LABELS,
  VENDOR_MATURITY_LEVEL_LABELS,
  VENDOR_DISALLOW_REASON_LABELS,
} from '@/data/partnerProfile';
import { getAllActiveVendors, getVendorById } from '@/data/partnerVendors';
import { ProfileSummaryBlock } from './ProfileSummaryBlock';

// ============= Reusable sub-components =============

function SectionCard({ title, subtitle, icon, children }: {
  title: string; subtitle?: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function ChipSelector<T extends string>({ options, value, onChange, labels }: {
  options: T[]; value: T; onChange: (v: T) => void; labels: Record<T, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => onChange(opt)}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
            value === opt
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:text-foreground"
          )}>
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

function ScaleSelector({ value, onChange }: { value: AttachScale; onChange: (v: AttachScale) => void }) {
  const scales: AttachScale[] = ['none', 'low', 'medium', 'high'];
  return (
    <div className="flex gap-1">
      {scales.map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className={cn("px-2 py-1 rounded text-[11px] font-medium transition-all",
            value === s
              ? s === 'high' ? "bg-green-600 text-white"
              : s === 'medium' ? "bg-amber-500 text-white"
              : s === 'low' ? "bg-orange-400 text-white"
              : "bg-muted text-muted-foreground"
              : "bg-muted/30 text-muted-foreground hover:bg-muted"
          )}>
          {SCALE_LABELS[s]}
        </button>
      ))}
    </div>
  );
}

function CapabilitySlider({ value, onChange }: { value: CapabilityLevel; onChange: (v: CapabilityLevel) => void }) {
  const levels: CapabilityLevel[] = [0, 1, 2, 3];
  return (
    <div className="flex gap-1">
      {levels.map(l => (
        <button key={l} type="button" onClick={() => onChange(l)}
          className={cn("px-2.5 py-1 rounded text-[11px] font-medium transition-all",
            value === l
              ? l === 3 ? "bg-green-600 text-white"
              : l === 2 ? "bg-primary text-primary-foreground"
              : l === 1 ? "bg-amber-500 text-white"
              : "bg-muted text-muted-foreground"
              : "bg-muted/30 text-muted-foreground hover:bg-muted"
          )}>
          {CAPABILITY_LEVEL_LABELS[l]}
        </button>
      ))}
    </div>
  );
}

function ServiceForm({ service, onChange, onRemove }: {
  service: ExistingService; onChange: (s: ExistingService) => void; onRemove: () => void;
}) {
  return (
    <div className="p-3 rounded-lg border border-border/60 bg-muted/10 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <input value={service.name} onChange={e => onChange({ ...service, name: e.target.value })}
          placeholder="Service name"
          className="flex-1 text-sm font-medium bg-transparent border-b border-border/60 focus:border-primary outline-none pb-1 text-foreground placeholder:text-muted-foreground" />
        <button type="button" onClick={onRemove}
          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <input value={service.description} onChange={e => onChange({ ...service, description: e.target.value })}
        placeholder="One-line description"
        className="w-full text-xs bg-transparent border-b border-border/40 focus:border-primary outline-none pb-1 text-foreground placeholder:text-muted-foreground" />
      <div className="flex flex-wrap gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Type</p>
          <select value={service.serviceType} onChange={e => onChange({ ...service, serviceType: e.target.value as ServiceType })}
            className="text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground">
            {(Object.entries(SERVICE_TYPE_LABELS) as [ServiceType, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Contract</p>
          <select value={service.contractLength} onChange={e => onChange({ ...service, contractLength: e.target.value as ContractLength })}
            className="text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground">
            {(Object.entries(CONTRACT_LENGTH_LABELS) as [ContractLength, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Pricing band</p>
          <input value={service.pricingBand || ''} onChange={e => onChange({ ...service, pricingBand: e.target.value || undefined })}
            placeholder="e.g. $10K–$30K"
            className="text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground placeholder:text-muted-foreground w-32" />
        </div>
      </div>
    </div>
  );
}

// ============= Main Tab Component =============

export function PartnerProfileTab() {
  const [profile, setProfile] = useState<PartnerProfile>(() => getPartnerProfile());
  const [verticalInput, setVerticalInput] = useState('');
  const [topLineInput, setTopLineInput] = useState('');

  const allVendors = getAllActiveVendors();

  const handleSave = () => {
    savePartnerProfile(profile);
    toast.success('Partner Profile saved');
  };

  // Service CRUD
  const addService = () => {
    setProfile(p => ({
      ...p,
      services: [...p.services, {
        id: `svc-${Date.now()}`, name: '', description: '',
        serviceType: 'implementation' as ServiceType, contractLength: '3-6mo' as ContractLength,
      }],
    }));
  };
  const updateService = (i: number, s: ExistingService) =>
    setProfile(p => ({ ...p, services: p.services.map((x, j) => j === i ? s : x) }));
  const removeService = (i: number) =>
    setProfile(p => ({ ...p, services: p.services.filter((_, j) => j !== i) }));

  // Verticals
  const addVertical = () => {
    const v = verticalInput.trim();
    if (v && !profile.verticalFocus.includes(v)) {
      setProfile(p => ({ ...p, verticalFocus: [...p.verticalFocus, v] }));
      setVerticalInput('');
    }
  };

  // Top service lines
  const addTopLine = () => {
    const v = topLineInput.trim();
    if (v && !profile.topServiceLines.includes(v) && profile.topServiceLines.length < 3) {
      setProfile(p => ({ ...p, topServiceLines: [...p.topServiceLines, v] }));
      setTopLineInput('');
    }
  };

  // Vendor posture helpers
  const addPreferredVendor = (vendorId: string) => {
    if (profile.vendorPostureConfig.preferredVendors.some(v => v.vendorId === vendorId)) return;
    setProfile(p => ({
      ...p,
      vendorPostureConfig: {
        ...p.vendorPostureConfig,
        preferredVendors: [...p.vendorPostureConfig.preferredVendors, { vendorId, priority: 2 as 1|2|3, reason: 'delivery' as VendorPreferenceReason }],
      },
    }));
  };
  const removePreferredVendor = (vendorId: string) =>
    setProfile(p => ({ ...p, vendorPostureConfig: { ...p.vendorPostureConfig, preferredVendors: p.vendorPostureConfig.preferredVendors.filter(v => v.vendorId !== vendorId) } }));

  const addCurrentVendor = (vendorId: string) => {
    if (profile.vendorPostureConfig.currentVendors.some(v => v.vendorId === vendorId)) return;
    setProfile(p => ({
      ...p,
      vendorPostureConfig: {
        ...p.vendorPostureConfig,
        currentVendors: [...p.vendorPostureConfig.currentVendors, { vendorId, maturity: 'exploring' as VendorMaturityLevel }],
      },
    }));
  };
  const removeCurrentVendor = (vendorId: string) =>
    setProfile(p => ({ ...p, vendorPostureConfig: { ...p.vendorPostureConfig, currentVendors: p.vendorPostureConfig.currentVendors.filter(v => v.vendorId !== vendorId) } }));

  const addDisallowedVendor = (vendorId: string) => {
    if (profile.vendorPostureConfig.disallowedVendors.some(v => v.vendorId === vendorId)) return;
    setProfile(p => ({
      ...p,
      vendorPostureConfig: {
        ...p.vendorPostureConfig,
        disallowedVendors: [...p.vendorPostureConfig.disallowedVendors, { vendorId, reason: 'strategy' as VendorDisallowReason }],
      },
    }));
  };
  const removeDisallowedVendor = (vendorId: string) =>
    setProfile(p => ({ ...p, vendorPostureConfig: { ...p.vendorPostureConfig, disallowedVendors: p.vendorPostureConfig.disallowedVendors.filter(v => v.vendorId !== vendorId) } }));

  // Vendors not yet assigned to any posture list
  const assignedVendorIds = new Set([
    ...profile.vendorPostureConfig.preferredVendors.map(v => v.vendorId),
    ...profile.vendorPostureConfig.currentVendors.map(v => v.vendorId),
    ...profile.vendorPostureConfig.disallowedVendors.map(v => v.vendorId),
  ]);
  const unassignedVendors = allVendors.filter(v => !assignedVendorIds.has(v.id));

  return (
    <div className="space-y-6">
      {/* Save bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Capture your current services and capabilities so recommendations match your reality.
        </p>
        <button onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" /> Save
        </button>
      </div>

      {/* 1) Services */}
      <SectionCard title="Existing Service Catalog" subtitle="Managed and project services you offer today."
        icon={<Briefcase className="w-4 h-4 text-primary" />}>
        <div className="space-y-3">
          {profile.services.map((svc, i) => (
            <ServiceForm key={svc.id} service={svc} onChange={s => updateService(i, s)} onRemove={() => removeService(i)} />
          ))}
          <button type="button" onClick={addService}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary border border-dashed border-primary/40 hover:bg-primary/5 transition-colors w-full justify-center">
            <Plus className="w-3.5 h-3.5" /> Add service
          </button>
        </div>
      </SectionCard>

      {/* 2) Attach Surfaces */}
      <SectionCard title="Attach Surface Areas" subtitle="Installed base surfaces — not customer-specific."
        icon={<Layers className="w-4 h-4 text-primary" />}>
        <div className="space-y-3">
          {profile.attachSurfaces.map(surface => (
            <div key={surface.key} className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground min-w-0">{surface.label}</span>
              <ScaleSelector value={surface.scale} onChange={scale => setProfile(p => ({
                ...p, attachSurfaces: p.attachSurfaces.map(s => s.key === surface.key ? { ...s, scale } : s),
              }))} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 3) Capabilities */}
      <SectionCard title="Delivery Capability Levels" subtitle="0=None, 1=Some, 2=Strong, 3=Recognized."
        icon={<BarChart3 className="w-4 h-4 text-primary" />}>
        <div className="space-y-3">
          {profile.capabilities.map(cap => (
            <div key={cap.key} className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm text-foreground min-w-0 flex-1">{cap.label}</span>
              <CapabilitySlider value={cap.level} onChange={level => setProfile(p => ({
                ...p, capabilities: p.capabilities.map(c => c.key === cap.key ? { ...c, level } : c),
              }))} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 4) Capacity */}
      <SectionCard title="Capacity Signal" icon={<Settings className="w-4 h-4 text-primary" />}>
        <div className="space-y-3">
          <ChipSelector options={['constrained', 'balanced', 'available'] as CapacitySignal[]}
            value={profile.capacity} onChange={v => setProfile(p => ({ ...p, capacity: v }))} labels={CAPACITY_LABELS} />
          <input value={profile.capacityNotes} onChange={e => setProfile(p => ({ ...p, capacityNotes: e.target.value }))}
            placeholder="Notes (optional)"
            className="w-full text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground" />
        </div>
      </SectionCard>

      {/* 5) Commercial Preferences */}
      <SectionCard title="Commercial Preferences" icon={<DollarSign className="w-4 h-4 text-primary" />}>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Delivery model</p>
            <ChipSelector options={['fixed-price', 'time-materials', 'hybrid'] as DeliveryModelPref[]}
              value={profile.deliveryModel} onChange={v => setProfile(p => ({ ...p, deliveryModel: v }))} labels={DELIVERY_MODEL_LABELS} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Minimum retainer (optional)</p>
            <input value={profile.minimumRetainer || ''}
              onChange={e => setProfile(p => ({ ...p, minimumRetainer: e.target.value || undefined }))}
              placeholder="e.g. $5K/mo"
              className="text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground w-40" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Risk appetite</p>
            <ChipSelector options={['conservative', 'balanced', 'experimental'] as RiskAppetite[]}
              value={profile.riskAppetite} onChange={v => setProfile(p => ({ ...p, riskAppetite: v }))} labels={RISK_LABELS} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Vendor posture mode</p>
            <ChipSelector options={['microsoft-first', 'vendor-neutral', 'mixed'] as VendorPosture[]}
              value={profile.vendorPosture} onChange={v => setProfile(p => ({ ...p, vendorPosture: v }))} labels={VENDOR_POSTURE_LABELS} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Vertical focus</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {profile.verticalFocus.map(v => (
                <span key={v} className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-foreground">
                  {v}
                  <button type="button" onClick={() => setProfile(p => ({ ...p, verticalFocus: p.verticalFocus.filter(x => x !== v) }))}
                    className="hover:text-destructive"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={verticalInput} onChange={e => setVerticalInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVertical())}
                placeholder="Add industry…"
                className="text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground flex-1" />
              <button type="button" onClick={addVertical}
                className="text-xs px-3 py-1.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors">Add</button>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 6) Revenue Mix */}
      <SectionCard title="Revenue Mix" subtitle="Non-financial, coarse signals only."
        icon={<PieChart className="w-4 h-4 text-primary" />}>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Project vs Managed Services</p>
            <ChipSelector options={['mostly-project', 'balanced', 'mostly-managed'] as RevenueMixType[]}
              value={profile.revenueMix} onChange={v => setProfile(p => ({ ...p, revenueMix: v }))} labels={REVENUE_MIX_LABELS} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Top 3 service lines by revenue (rank only)</p>
            <div className="space-y-1.5 mb-2">
              {profile.topServiceLines.map((line, i) => (
                <div key={line} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground w-4">#{i + 1}</span>
                  <span className="text-xs text-foreground flex-1">{line}</span>
                  <button type="button" onClick={() => setProfile(p => ({ ...p, topServiceLines: p.topServiceLines.filter(x => x !== line) }))}
                    className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            {profile.topServiceLines.length < 3 && (
              <div className="flex gap-2">
                <input value={topLineInput} onChange={e => setTopLineInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTopLine())}
                  placeholder="Add service line…"
                  className="text-xs border border-border rounded-lg px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground flex-1" />
                <button type="button" onClick={addTopLine}
                  className="text-xs px-3 py-1.5 rounded-lg bg-muted text-foreground hover:bg-muted/80 transition-colors">Add</button>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* 7) Vendor Posture */}
      <SectionCard title="Vendor Posture" subtitle="Admin-confirmed vendor preferences for recommendations."
        icon={<Shield className="w-4 h-4 text-primary" />}>
        {allVendors.length === 0 ? (
          <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              DATA NEEDED: Add vendors in the Vendors tab first.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Preferred */}
            <div>
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Preferred Vendors</p>
              <div className="space-y-2 mb-2">
                {profile.vendorPostureConfig.preferredVendors.map(pv => {
                  const vendor = getVendorById(pv.vendorId);
                  return (
                    <div key={pv.vendorId} className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30">
                      <span className="text-sm text-foreground flex-1">{vendor?.name || pv.vendorId}</span>
                      <select value={pv.priority}
                        onChange={e => setProfile(p => ({ ...p, vendorPostureConfig: { ...p.vendorPostureConfig, preferredVendors: p.vendorPostureConfig.preferredVendors.map(v => v.vendorId === pv.vendorId ? { ...v, priority: Number(e.target.value) as 1|2|3 } : v) } }))}
                        className="text-[11px] border border-border rounded px-1.5 py-0.5 bg-background">
                        <option value={1}>P1</option><option value={2}>P2</option><option value={3}>P3</option>
                      </select>
                      <select value={pv.reason}
                        onChange={e => setProfile(p => ({ ...p, vendorPostureConfig: { ...p.vendorPostureConfig, preferredVendors: p.vendorPostureConfig.preferredVendors.map(v => v.vendorId === pv.vendorId ? { ...v, reason: e.target.value as VendorPreferenceReason } : v) } }))}
                        className="text-[11px] border border-border rounded px-1.5 py-0.5 bg-background">
                        {Object.entries(VENDOR_PREFERENCE_REASON_LABELS).map(([k, l]) => (
                          <option key={k} value={k}>{l}</option>
                        ))}
                      </select>
                      <button onClick={() => removePreferredVendor(pv.vendorId)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {unassignedVendors.length > 0 && (
                <select onChange={e => { if (e.target.value) { addPreferredVendor(e.target.value); e.target.value = ''; } }}
                  defaultValue=""
                  className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background text-muted-foreground">
                  <option value="">+ Add preferred vendor…</option>
                  {unassignedVendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              )}
            </div>

            {/* Current */}
            <div>
              <p className="text-xs font-semibold text-primary mb-2">Current Vendors</p>
              <div className="space-y-2 mb-2">
                {profile.vendorPostureConfig.currentVendors.map(cv => {
                  const vendor = getVendorById(cv.vendorId);
                  return (
                    <div key={cv.vendorId} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/60">
                      <span className="text-sm text-foreground flex-1">{vendor?.name || cv.vendorId}</span>
                      <select value={cv.maturity}
                        onChange={e => setProfile(p => ({ ...p, vendorPostureConfig: { ...p.vendorPostureConfig, currentVendors: p.vendorPostureConfig.currentVendors.map(v => v.vendorId === cv.vendorId ? { ...v, maturity: e.target.value as VendorMaturityLevel } : v) } }))}
                        className="text-[11px] border border-border rounded px-1.5 py-0.5 bg-background">
                        {Object.entries(VENDOR_MATURITY_LEVEL_LABELS).map(([k, l]) => (
                          <option key={k} value={k}>{l}</option>
                        ))}
                      </select>
                      <button onClick={() => removeCurrentVendor(cv.vendorId)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {unassignedVendors.length > 0 && (
                <select onChange={e => { if (e.target.value) { addCurrentVendor(e.target.value); e.target.value = ''; } }}
                  defaultValue=""
                  className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background text-muted-foreground">
                  <option value="">+ Add current vendor…</option>
                  {unassignedVendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              )}
            </div>

            {/* Disallowed */}
            <div>
              <p className="text-xs font-semibold text-destructive mb-2">Disallowed Vendors</p>
              <div className="space-y-2 mb-2">
                {profile.vendorPostureConfig.disallowedVendors.map(dv => {
                  const vendor = getVendorById(dv.vendorId);
                  return (
                    <div key={dv.vendorId} className="flex items-center gap-2 p-2 rounded-lg bg-destructive/5 border border-destructive/20">
                      <span className="text-sm text-foreground flex-1">{vendor?.name || dv.vendorId}</span>
                      <select value={dv.reason}
                        onChange={e => setProfile(p => ({ ...p, vendorPostureConfig: { ...p.vendorPostureConfig, disallowedVendors: p.vendorPostureConfig.disallowedVendors.map(v => v.vendorId === dv.vendorId ? { ...v, reason: e.target.value as VendorDisallowReason } : v) } }))}
                        className="text-[11px] border border-border rounded px-1.5 py-0.5 bg-background">
                        {Object.entries(VENDOR_DISALLOW_REASON_LABELS).map(([k, l]) => (
                          <option key={k} value={k}>{l}</option>
                        ))}
                      </select>
                      <button onClick={() => removeDisallowedVendor(dv.vendorId)} className="text-muted-foreground hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {unassignedVendors.length > 0 && (
                <select onChange={e => { if (e.target.value) { addDisallowedVendor(e.target.value); e.target.value = ''; } }}
                  defaultValue=""
                  className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background text-muted-foreground">
                  <option value="">+ Add disallowed vendor…</option>
                  {unassignedVendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              )}
            </div>
          </div>
        )}
      </SectionCard>

      {/* Derived Insights */}
      <ProfileSummaryBlock />

      {/* Attribution */}
      <p className="text-[11px] text-muted-foreground text-center py-2">
        Based on your Partner Profile + Dialogue activity.
      </p>
    </div>
  );
}
