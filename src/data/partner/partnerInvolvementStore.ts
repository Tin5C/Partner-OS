// Partner Involvement Store — in-memory singleton for partner landscape metadata

export type PartnerInvolvement = {
  focusId: string;
  hubOrgId: string;
  microsoft_account_team_known?: "Yes" | "No" | "Unknown";
  active_partners?: string[];
  competitor_partners?: string[];
  public_case_studies?: "Yes" | "No" | "Unknown";
  recent_partner_activity_count?: number;
  notes?: string;
};

const store = new Map<string, PartnerInvolvement>();

export function getByFocusId(focusId: string): PartnerInvolvement | null {
  return store.get(focusId) ?? null;
}

export function upsert(item: PartnerInvolvement): void {
  store.set(item.focusId, item);
}

// Seed demo data
upsert({
  focusId: 'schindler',
  hubOrgId: 'helioworks',
  microsoft_account_team_known: 'Yes',
  active_partners: ['HelioWorks (us)', 'Avanade'],
  competitor_partners: ['Accenture', 'TCS', 'Infosys'],
  public_case_studies: 'Yes',
  recent_partner_activity_count: 4,
  notes: 'Strong Azure footprint; co-sell opportunity via IoT modernization.',
});
