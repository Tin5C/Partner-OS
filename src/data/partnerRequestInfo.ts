// Partner Request Info Data — AI-native taxonomy
// Types, templates, and logic for "Request info from colleagues" feature

export interface RequestType {
  id: string;
  label: string;
  description: string;
}

// AI-native Account Memory buckets
export const REQUEST_TYPES: RequestType[] = [
  { id: 'use-cases', label: 'Use cases', description: 'AI use cases being explored or deployed' },
  { id: 'data-sources', label: 'Data sources & owners', description: 'Where data lives and who owns it' },
  { id: 'security-compliance', label: 'Security/compliance constraints', description: 'Data residency, privacy, regulatory' },
  { id: 'architecture', label: 'Architecture notes', description: 'Current infra, integration patterns, AI stack' },
  { id: 'licenses', label: 'Licenses/entitlements/incentives', description: 'Microsoft, third-party, cloud commitments' },
  { id: 'stakeholders', label: 'Stakeholders & decision process', description: 'Key people, budget, timeline' },
  { id: 'governance', label: 'Governance maturity', description: 'Shadow AI policies, responsible AI stance' },
];

export interface RequestTracking {
  requestedAt: Date | null;
  received: boolean;
}

export interface GeneratedTemplates {
  slack: string;
  email: string;
  short: string;
}

function formatRequestBullets(selectedTypes: string[]): string {
  return selectedTypes
    .map(id => {
      const rt = REQUEST_TYPES.find(r => r.id === id);
      return rt ? `• ${rt.label}` : null;
    })
    .filter(Boolean)
    .join('\n');
}

export function generateRequestTemplates(
  customerName: string,
  selectedTypes: string[],
  customQuestion: string,
  meetingContext?: string,
): GeneratedTemplates {
  const bullets = formatRequestBullets(selectedTypes);
  const customLine = customQuestion.trim()
    ? `\nAlso: ${customQuestion.trim()}`
    : '';
  const meetingLine = meetingContext
    ? `We have a meeting/goal coming up: ${meetingContext}.`
    : 'We\'re preparing an AI deal brief for an upcoming engagement.';
  const deadline = 'If you can share by end of day today, that would be ideal — otherwise before our next sync.';

  const slack = `Hey team 👋

I'm prepping an AI deal brief for **${customerName}** and need a few data points from anyone who's touched this account.

${meetingLine}

Could you help with any of the following?
${bullets}${customLine}

Screenshots, docs, or quick notes are great (redacted is fine).

${deadline}

Thanks!`;

  const email = `Subject: Quick ask — ${customerName} AI deal context needed

Hi team,

I'm putting together an AI deal brief for ${customerName} and could use your help filling in some gaps.

${meetingLine}

Specifically, I'm looking for:
${bullets}${customLine}

If you have screenshots, architecture diagrams, or any docs — even redacted — that would be very helpful.

${deadline}

Thanks in advance.`;

  const short = `Need AI deal context on ${customerName}:
${bullets}${customLine}
Screenshots/docs welcome (redacted ok). ${deadline}`;

  return { slack, email, short };
}
