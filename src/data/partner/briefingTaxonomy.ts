// Canonical taxonomy seed data for On-Demand Briefing pickers (Partner space)

export interface TaxonomyItem {
  id: string;
  label: string;
}

export const VENDOR_OPTIONS: TaxonomyItem[] = [
  { id: 'vendor-microsoft', label: 'Microsoft' },
  { id: 'vendor-google', label: 'Google' },
  { id: 'vendor-databricks', label: 'Databricks' },
];

export const INDUSTRY_OPTIONS: TaxonomyItem[] = [
  { id: 'ind-entertainment', label: 'Entertainment & Sports' },
  { id: 'ind-manufacturing', label: 'Manufacturing' },
  { id: 'ind-banking', label: 'Banking' },
];

export const ACCOUNT_OPTIONS: TaxonomyItem[] = [
  { id: 'acct-schindler', label: 'Schindler' },
  { id: 'acct-pflanzer', label: 'Pflanzer' },
  { id: 'acct-fifa', label: 'FIFA' },
  { id: 'acct-ubs', label: 'UBS' },
];

export const COMPETITIVE_ANGLE_OPTIONS: TaxonomyItem[] = [
  { id: 'angle-cloud', label: 'Cloud Platform Competition' },
  { id: 'angle-ai', label: 'AI Platform Competition' },
  { id: 'angle-data', label: 'Data Platform Competition' },
  { id: 'angle-industry-ai', label: 'Industry-Specific AI Positioning' },
  { id: 'angle-sovereign', label: 'Sovereign & Compliance Positioning' },
  { id: 'angle-build-buy', label: 'Build vs Buy (Copilot vs Custom)' },
];

export const OBJECTION_CATEGORY_OPTIONS: TaxonomyItem[] = [
  { id: 'obj-security', label: 'Security & Compliance Risk' },
  { id: 'obj-data-readiness', label: 'Data Readiness & Permissions' },
  { id: 'obj-roi', label: 'ROI / Cost Governance (FinOps)' },
  { id: 'obj-change', label: 'Change Management / Adoption' },
  { id: 'obj-competitive', label: 'Competitive Pressure / Vendor Lock-in' },
];
