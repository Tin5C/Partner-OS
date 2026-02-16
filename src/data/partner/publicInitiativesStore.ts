// PublicInitiatives — publicly visible IT initiatives for an account
// In-memory singleton. Additive only.

export type InitiativeType =
  | 'cloud_migration'
  | 'erp_transformation'
  | 'ai_deployment'
  | 'security_modernization'
  | 'digital_workplace'
  | 'data_platform'
  | 'field_service_digitalization'
  | 'automation_program'
  | 'vendor_strategic_partnership'
  | 'platform_consolidation'
  | 'modernization_program'
  | 'other';

export type TechnologyDomain =
  | 'cloud'
  | 'ai'
  | 'data'
  | 'erp'
  | 'security'
  | 'workplace'
  | 'iot'
  | 'automation'
  | 'other';

export interface PublicITInitiative {
  id: string;
  announcement_date: string | null;
  source_published_at: string | null;
  year: number | null;
  source_published_year: number | null;
  title: string;
  initiative_type: InitiativeType;
  summary: string;
  business_objective: string | null;
  technology_domain: TechnologyDomain[];
  vendors_mentioned: string[];
  internal_business_units_affected: string[];
  geographic_scope: 'global' | 'regional' | 'local' | 'unknown';
  estimated_magnitude: 'enterprise-wide' | 'program-level' | 'pilot' | 'unknown';
  source_type: 'press_release' | 'blog' | 'earnings_call' | 'analyst_report' | 'conference' | 'case_study';
  source_url: string;
  confidence_level: 'high' | 'medium' | 'low';
}

export interface PublicInitiativesRecord {
  focusId: string;
  hubOrgId: string;
  generated_at: string;
  time_range_years: number;
  public_it_initiatives: PublicITInitiative[];
}

const store: PublicInitiativesRecord[] = [];

export function getByFocusId(focusId: string): PublicInitiativesRecord | null {
  return store.find((s) => s.focusId === focusId) ?? null;
}

export function upsert(record: PublicInitiativesRecord): PublicInitiativesRecord {
  const idx = store.findIndex((s) => s.focusId === record.focusId);
  if (idx >= 0) {
    store[idx] = { ...store[idx], ...record };
    return store[idx];
  }
  store.push(record);
  return record;
}

// ============= Seed =============

function seedDemoData(): void {
  if (getByFocusId('focus_schindler')) return;
  upsert({
    focusId: 'focus_schindler',
    hubOrgId: 'hub_helioworks_ag',
    generated_at: '2026-02-16T12:00:00+01:00',
    time_range_years: 5,
    public_it_initiatives: [
      {
        id: 'init_schindler_0001',
        announcement_date: null,
        source_published_at: null,
        year: null,
        source_published_year: null,
        title: 'Schindler ActionBoard (customer digital dashboard for connected units)',
        initiative_type: 'field_service_digitalization',
        summary:
          'Customer-facing dashboard providing overview of connected units and related service/portfolio information (digital services layer).',
        business_objective:
          'Improve transparency and portfolio management for customers; enable faster prioritization and service planning.',
        technology_domain: ['iot', 'data', 'automation', 'other'],
        vendors_mentioned: [],
        internal_business_units_affected: ['Service', 'Digital Services'],
        geographic_scope: 'unknown',
        estimated_magnitude: 'program-level',
        source_type: 'case_study',
        source_url: 'https://group.schindler.com/en/company/innovations/digital-services.html',
        confidence_level: 'high',
      },
      {
        id: 'init_schindler_0002',
        announcement_date: null,
        source_published_at: null,
        year: null,
        source_published_year: null,
        title: 'Schindler Ahead ActionBoard (portfolio management with real-time insights)',
        initiative_type: 'field_service_digitalization',
        summary:
          'Portfolio management platform emphasizing real-time and actionable insights to help prioritize tasks and improve service schedule planning.',
        business_objective:
          'Reduce interruptions and improve maintenance/service planning through visibility and faster issue detection.',
        technology_domain: ['iot', 'data', 'automation'],
        vendors_mentioned: [],
        internal_business_units_affected: ['Service', 'Field Operations'],
        geographic_scope: 'unknown',
        estimated_magnitude: 'program-level',
        source_type: 'case_study',
        source_url: 'https://www.jardineschindler.com/en/services/digital/actionboard.html',
        confidence_level: 'medium',
      },
      {
        id: 'init_schindler_0003',
        announcement_date: null,
        source_published_at: null,
        year: null,
        source_published_year: null,
        title: 'Organization-wide cyber resilience program (24/7 SOC)',
        initiative_type: 'security_modernization',
        summary:
          'Schindler describes an always-on cybersecurity approach with a 24/7 Security Operations Center (SOC) involving internal and external experts.',
        business_objective:
          'Protect information assets and enable rapid detection/response to incidents.',
        technology_domain: ['security', 'other'],
        vendors_mentioned: [],
        internal_business_units_affected: ['IT', 'Security'],
        geographic_scope: 'global',
        estimated_magnitude: 'enterprise-wide',
        source_type: 'press_release',
        source_url:
          'https://group.schindler.com/en/responsibility/value-chain/cyber-resilient-across-the-organization.html',
        confidence_level: 'high',
      },
      {
        id: 'init_schindler_0004',
        announcement_date: null,
        source_published_at: null,
        year: null,
        source_published_year: null,
        title: 'Schindler Developer Portal and trial environment for APIs',
        initiative_type: 'platform_consolidation',
        summary:
          'Developer Portal provides access to technical documents and a trial environment for specific APIs of Schindler digital products (ecosystem enablement).',
        business_objective:
          'Enable third parties to embed Schindler digital products/APIs into broader solutions and workflows.',
        technology_domain: ['data', 'automation', 'other'],
        vendors_mentioned: [],
        internal_business_units_affected: ['Digital Products', 'Platform/Engineering'],
        geographic_scope: 'global',
        estimated_magnitude: 'program-level',
        source_type: 'blog',
        source_url: 'https://developer.schindler.com/getting-started',
        confidence_level: 'high',
      },
    ],
  });
}

seedDemoData();
