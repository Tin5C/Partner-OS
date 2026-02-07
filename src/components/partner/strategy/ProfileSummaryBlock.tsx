import {
  Briefcase,
  Layers,
  BarChart3,
  Shield,
  TrendingUp,
  Package,
  Zap,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import {
  getPartnerProfile,
  CAPABILITY_LEVEL_LABELS,
  SCALE_LABELS,
  CAPACITY_LABELS,
  RISK_LABELS,
  VENDOR_POSTURE_LABELS,
  REVENUE_MIX_LABELS,
  SERVICE_TYPE_LABELS,
  deriveStrategyRecommendations,
  CapabilityLevel,
  AttachScale,
} from '@/data/partnerProfile';

const CAP_COLORS: Record<CapabilityLevel, string> = {
  0: 'bg-muted text-muted-foreground',
  1: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  2: 'bg-primary/10 text-primary',
  3: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

const SCALE_COLORS: Record<AttachScale, string> = {
  none: 'bg-muted text-muted-foreground',
  low: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export function ProfileSummaryBlock() {
  const navigate = useNavigate();
  const profile = getPartnerProfile();
  const recs = deriveStrategyRecommendations(profile);

  return (
    <div className="space-y-5">
      {/* Profile Overview */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary" />
            Partner Commercial Baseline
          </h3>
          <button
            onClick={() => navigate('/partner/profile')}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Edit profile
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Existing services */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Existing services</p>
          <div className="space-y-1.5">
            {profile.services.slice(0, 4).map(svc => (
              <div key={svc.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm text-foreground">{svc.name}</p>
                  <p className="text-[11px] text-muted-foreground">{SERVICE_TYPE_LABELS[svc.serviceType]}</p>
                </div>
                {svc.pricingBand && (
                  <span className="text-[11px] text-muted-foreground">{svc.pricingBand}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Attach surfaces */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <Layers className="w-3 h-3" />
            Attach surfaces
          </p>
          <div className="flex flex-wrap gap-1.5">
            {profile.attachSurfaces.filter(s => s.scale !== 'none').map(s => (
              <span
                key={s.key}
                className={cn("text-[10px] px-2 py-0.5 rounded-md font-medium", SCALE_COLORS[s.scale])}
              >
                {s.label} ({SCALE_LABELS[s.scale]})
              </span>
            ))}
          </div>
        </div>

        {/* Capability heat */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
            <BarChart3 className="w-3 h-3" />
            Capability heat
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {profile.capabilities.map(cap => (
              <div key={cap.key} className="flex items-center justify-between p-2 rounded-lg bg-muted/20">
                <span className="text-[11px] text-foreground truncate mr-2">{cap.label}</span>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0", CAP_COLORS[cap.level])}>
                  {CAPABILITY_LEVEL_LABELS[cap.level]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick signals */}
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> Risk: {RISK_LABELS[profile.riskAppetite]}
          </span>
          <span>{CAPACITY_LABELS[profile.capacity]} capacity</span>
          <span>{VENDOR_POSTURE_LABELS[profile.vendorPosture]}</span>
          <span>Revenue: {REVENUE_MIX_LABELS[profile.revenueMix]}</span>
        </div>
      </div>

      {/* Derived Recommendations */}
      <div className="p-5 rounded-xl border border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Recommendations
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Based on your Partner Profile + Dialogue activity.
        </p>

        {/* Easy Attach */}
        {recs.easyAttach.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Easy Attach ({recs.easyAttach.length})
            </p>
            <div className="space-y-2">
              {recs.easyAttach.map(rec => (
                <div key={rec.package.id} className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200/50 dark:border-green-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-foreground">{rec.package.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Net-New */}
        {recs.netNew.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Net-New Capability ({recs.netNew.length})
            </p>
            <div className="space-y-2">
              {recs.netNew.map(rec => (
                <div key={rec.package.id} className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm font-medium text-foreground">{rec.package.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
