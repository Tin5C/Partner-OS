// Partner Request Info Data
// Types, templates, and logic for "Request info from colleagues" feature

export interface RequestType {
  id: string;
  label: string;
  description: string;
}

export const REQUEST_TYPES: RequestType[] = [
  { id: 'app-landscape', label: 'Application landscape', description: 'Including proprietary apps' },
  { id: 'architecture', label: 'Architecture diagram / integration patterns', description: 'Current technical setup' },
  { id: 'licenses', label: 'Existing licenses / entitlements', description: 'Microsoft & third-party' },
  { id: 'security', label: 'Security/compliance constraints', description: 'Regulatory & internal policies' },
  { id: 'stakeholders', label: 'Current initiatives + stakeholders', description: 'Key people & projects' },
  { id: 'budget', label: 'Budget/timeline/decision process', description: 'Procurement context' },
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
    : 'We\'re preparing a brief for an upcoming engagement.';
  const deadline = 'If you can share by end of day today, that would be ideal — otherwise before our next sync.';

  const slack = `Hey team 👋

I'm prepping for **${customerName}** and need a few data points from anyone who's touched this account.

${meetingLine}

Could you help with any of the following?
${bullets}${customLine}

Screenshots or docs are great (redacted is fine).

${deadline}

Thanks!`;

  const email = `Subject: Quick ask — ${customerName} account context needed

Hi team,

I'm putting together a brief for ${customerName} and could use your help filling in some gaps.

${meetingLine}

Specifically, I'm looking for:
${bullets}${customLine}

If you have screenshots, architecture diagrams, or any docs — even redacted — that would be very helpful.

${deadline}

Thanks in advance.`;

  const short = `Need info on ${customerName}:
${bullets}${customLine}
Screenshots/docs welcome (redacted ok). ${deadline}`;

  return { slack, email, short };
}
