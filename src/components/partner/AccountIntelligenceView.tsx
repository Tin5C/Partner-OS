// Account Intelligence View — read-only tab in Partner execution section
// Renders structured sections from AccountIntelligenceVM

import { useMemo } from 'react';
import {
  Building2,
  DollarSign,
  Server,
  Signal,
  Inbox,
  MessageSquare,
  FileText,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReadinessPanel } from '@/components/partner/accountIntelligence/ReadinessPanel';
import { resolveAccountIntelligence } from '@/services/accountIntelligence';
import type { AccountIntelligenceVM } from '@/services/accountIntelligence';
import type { PartnerInvolvement } from '@/data/partner/partnerInvolvementStore';

interface AccountIntelligenceViewProps {
  focusId: string | null;
}

/* ─── Shared primitives ─── */

function SectionCard({ title, icon, children, className }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-4 space-y-3", className)}>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}

function KVRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="text-muted-foreground min-w-[140px] flex-shrink-0">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function BulletList({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <p className="text-sm text-muted-foreground/60">No data yet.</p>;
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm text-foreground flex items-start gap-2">
          <span className="text-muted-foreground/40 mt-1.5 flex-shrink-0">•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function PillarBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-[10px] font-medium border",
      active
        ? "bg-primary/10 text-primary border-primary/20"
        : "bg-muted/30 text-muted-foreground/50 border-border/40"
    )}>
      {label}
    </span>
  );
}

/* ─── Partner Involvement Card ─── */

function PartnerInvolvementCard({ data }: { data: PartnerInvolvement }) {
  return (
    <SectionCard title="Partner Involvement" icon={<Users className="w-3.5 h-3.5" />}>
      <div className="space-y-1.5">
        <KVRow label="MS Account Team" value={data.microsoft_account_team_known} />
        {data.active_partners && data.active_partners.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground min-w-[140px] flex-shrink-0">Active Partners</span>
            <div className="flex flex-wrap gap-1.5">
              {data.active_partners.map((p) => (
                <span key={p} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/5 text-primary border border-primary/10">{p}</span>
              ))}
            </div>
          </div>
        )}
        {data.competitor_partners && data.competitor_partners.length > 0 && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground min-w-[140px] flex-shrink-0">Competitor Partners</span>
            <div className="flex flex-wrap gap-1.5">
              {data.competitor_partners.map((p) => (
                <span key={p} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/40 text-muted-foreground border border-border/40">{p}</span>
              ))}
            </div>
          </div>
        )}
        <KVRow label="Public Case Studies" value={data.public_case_studies} />
        {data.recent_partner_activity_count != null && (
          <KVRow label="Recent Activity" value={`${data.recent_partner_activity_count} engagements (12 mo)`} />
        )}
        {data.notes && <KVRow label="Notes" value={data.notes} />}
      </div>
    </SectionCard>
  );
}

/* ─── Main View ─── */

export function AccountIntelligenceView({ focusId }: AccountIntelligenceViewProps) {
  const vm = useMemo<AccountIntelligenceVM | null>(() => {
    if (!focusId) return null;
    return resolveAccountIntelligence({ focusId, weekOf: '2026-02-10' });
  }, [focusId]);

  if (!focusId) {
    return (
      <div className="py-8 text-center">
        <Building2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Select an account to view intelligence.</p>
      </div>
    );
  }

  if (!vm) return null;

  const { snapshot, commercial, technical, partnerInvolvement, signalHistory, inbox, requests, readiness } = vm;

  return (
    <div className="space-y-4">
      {/* Readiness Panel — top */}
      <ReadinessPanel readinessPercent={readiness.score} pillars={readiness.pillars} />

      {/* Snapshot */}
      <SectionCard title="Account Snapshot" icon={<Building2 className="w-3.5 h-3.5" />}>
        {snapshot ? (
          <div className="space-y-1.5">
            <KVRow label="Industry" value={snapshot.industry} />
            <KVRow label="Region" value={snapshot.region} />
            <KVRow label="Revenue" value={snapshot.revenue_band} />
            <KVRow label="Employees" value={snapshot.employee_band} />
            <KVRow label="Transformation" value={snapshot.transformation_stage} />
            <KVRow label="AI Maturity" value={snapshot.maturity_level} />
            <KVRow label="Primary Vendor" value={snapshot.primary_vendor_relationship} />
            <KVRow label="Competitive Pressure" value={snapshot.competitive_pressure_level} />
            {snapshot.strategic_priority_tags && snapshot.strategic_priority_tags.length > 0 && (
              <div className="flex items-start gap-2 text-sm pt-1">
                <span className="text-muted-foreground min-w-[140px] flex-shrink-0">Priorities</span>
                <div className="flex flex-wrap gap-1.5">
                  {snapshot.strategic_priority_tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary/5 text-primary border border-primary/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/60">No snapshot data.</p>
        )}
      </SectionCard>

      {/* Two-column: Commercial + Technical */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Commercial Footprint" icon={<DollarSign className="w-3.5 h-3.5" />}>
          {commercial ? (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Licenses</p>
                <BulletList items={commercial.existing_licenses} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Contract Dates</p>
                <BulletList items={commercial.contract_end_dates} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Renewal Windows</p>
                <BulletList items={commercial.renewal_windows} />
              </div>
              {commercial.estimated_spend_band && (
                <KVRow label="Est. Spend" value={commercial.estimated_spend_band} />
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">No commercial data.</p>
          )}
        </SectionCard>

        <SectionCard title="Technical Landscape" icon={<Server className="w-3.5 h-3.5" />}>
          {technical ? (
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Vendors</p>
                <BulletList items={technical.known_vendors} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Applications</p>
                <BulletList items={technical.known_applications} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">Architecture</p>
                <BulletList items={technical.architecture_patterns} />
              </div>
              {technical.cloud_strategy && (
                <KVRow label="Cloud Strategy" value={technical.cloud_strategy} />
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">No technical data.</p>
          )}
        </SectionCard>
      </div>

      {/* Partner Involvement */}
      {partnerInvolvement && <PartnerInvolvementCard data={partnerInvolvement} />}

      {/* Signal History */}
      <SectionCard title={`Signal History (${signalHistory.length})`} icon={<Signal className="w-3.5 h-3.5" />}>
        {signalHistory.length > 0 ? (
          <div className="space-y-2">
            {signalHistory.map((sig) => (
              <div key={sig.id} className="flex items-start gap-3 p-2.5 rounded-lg border border-border/40 bg-muted/10">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/5 text-primary border border-primary/10">
                      {sig.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{sig.weekKey}</span>
                    {sig.impact_level && (
                      <span className="text-[10px] text-muted-foreground/60">{sig.impact_level}</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground">{sig.description}</p>
                  {sig.implication && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{sig.implication}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground/60">No signals recorded.</p>
        )}
      </SectionCard>

      {/* Inbox + Requests side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title={`Account Inbox (${inbox.length})`} icon={<Inbox className="w-3.5 h-3.5" />}>
          {inbox.length > 0 ? (
            <div className="space-y-1.5">
              {inbox.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <FileText className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                  <span className="text-foreground truncate">{item.title}</span>
                  <span className="text-[10px] text-muted-foreground/50 flex-shrink-0">{item.type}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">No items in inbox.</p>
          )}
        </SectionCard>

        <SectionCard title={`Content Requests (${requests.length})`} icon={<MessageSquare className="w-3.5 h-3.5" />}>
          {requests.length > 0 ? (
            <div className="space-y-1.5">
              {requests.map((req) => (
                <div key={req.request_id} className="flex items-center gap-2 text-sm">
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-medium",
                    req.status === 'pending' ? "bg-yellow-500/10 text-yellow-600" :
                    req.status === 'answered' ? "bg-primary/10 text-primary" :
                    "bg-muted/30 text-muted-foreground"
                  )}>
                    {req.status}
                  </span>
                  <span className="text-foreground truncate">{req.question_text}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">No requests.</p>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
