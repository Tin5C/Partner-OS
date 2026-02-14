// StrategyPillars — strategic intent pillars for an account
// In-memory singleton. Additive only.

export interface StrategyPillar {
  id: string;
  title: string;
  summary: string;
  time_horizon: 'multi-year' | 'ongoing' | 'unknown';
  source_type: string;
  source_url: string;
  confidence_level: 'high' | 'medium' | 'low';
}

export interface StrategyPillarsRecord {
  focusId: string;
  hubOrgId: string;
  generated_at: string;
  strategy_pillars: StrategyPillar[];
}

const store: StrategyPillarsRecord[] = [];

export function getByFocusId(focusId: string): StrategyPillarsRecord | null {
  return store.find((s) => s.focusId === focusId) ?? null;
}

export function upsert(record: StrategyPillarsRecord): StrategyPillarsRecord {
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
  if (getByFocusId('schindler')) return;
  upsert({
    focusId: 'schindler',
    hubOrgId: 'helioworks',
    generated_at: '2026-02-14T19:30:00+01:00',
    strategy_pillars: [
      {
        id: 'strat_schindler_0001',
        title: 'Leverage innovation and AI to enable data-driven transformation',
        summary:
          'Schindler explicitly frames innovation and AI as levers to drive data-driven transformation (strategy-level intent, not a weekly signal).',
        time_horizon: 'multi-year',
        source_type: 'investor_presentation',
        source_url:
          'https://group.schindler.com/content/dam/website/group/docs/investors/2024/2024-schindler-fy-presentation.pdf',
        confidence_level: 'high',
      },
      {
        id: 'strat_schindler_0002',
        title: 'Digital services and connectivity as a customer-facing operating layer',
        summary:
          'Schindler positions digital services (including dashboards and connected-unit visibility) as part of how customers manage portfolios and service interactions.',
        time_horizon: 'multi-year',
        source_type: 'company_innovation_page',
        source_url:
          'https://group.schindler.com/en/company/innovations/digital-services.html',
        confidence_level: 'high',
      },
      {
        id: 'strat_schindler_0003',
        title: 'Cyber resilience as an organization-wide capability',
        summary:
          "Schindler describes an 'always-on' approach to cybersecurity including a 24/7 Security Operations Center (SOC).",
        time_horizon: 'ongoing',
        source_type: 'company_responsibility_page',
        source_url:
          'https://group.schindler.com/en/responsibility/value-chain/cyber-resilient-across-the-organization.html',
        confidence_level: 'high',
      },
    ],
  });
}

seedDemoData();
