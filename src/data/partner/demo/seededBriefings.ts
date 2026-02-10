// Seeded On-Demand Briefing Artifacts for Demo Mode
// Keyed by signature in the briefing provider

import type { BriefingArtifact } from '../briefingContracts';

export const SEEDED_BRIEFINGS: BriefingArtifact[] = [
  // ===== 1. Vendor Product Updates =====
  {
    id: 'brief-vendor-001',
    hubOrgId: 'hub-alpnova',
    vendorId: 'vendor-microsoft',
    briefingType: 'vendor_updates',
    title: 'Microsoft AI Updates — Week of Feb 9',
    estMinutes: 4,
    scriptText: `Welcome to your Microsoft product update briefing for the week of February 9th.

Three updates matter for your pipeline this week.

First, Azure OpenAI is now generally available in Switzerland North. This is a significant expansion — it means Swiss-regulated customers like Schindler can process sensitive data entirely in-country. If you've been hitting data residency objections, this removes the blocker.

Second, Copilot for Field Service has entered public preview. This is purpose-built for organizations with large field workforces. For customers in manufacturing, logistics, or facilities management, this is a natural conversation opener.

Third, the Partner Cloud AI incentive tiers have been updated. If your organization is above $50K/month in Azure AI consumption, you can now unlock a 15% rebate. Check your current tier and plan accordingly.

The bottom line: Azure's AI footprint is expanding geographically and functionally. Lead with data residency for regulated accounts and Copilot for workforce-heavy accounts.`,
    readText: `## Microsoft AI Updates — Week of Feb 9

### 1. Azure OpenAI in Switzerland North (GA)
Azure OpenAI is now available in Switzerland North. Removes data residency blockers for Swiss-regulated customers.

### 2. Copilot for Field Service (Public Preview)
Purpose-built for large field workforces. Natural conversation opener for manufacturing, logistics, and facilities management.

### 3. Partner Incentive Tiers Updated
15% rebate on Azure AI consumption above $50K/month. Review your current tier.

### Summary
Lead with data residency for regulated accounts. Lead with Copilot for workforce-heavy accounts.`,
    actions: [
      { title: 'Update data residency messaging', who: 'Seller', whatToClarify: 'Which accounts have residency blockers?', howToThink: 'Lead with Switzerland North for any Swiss-regulated prospect.' },
      { title: 'Identify Copilot field service candidates', who: 'Seller', whatToClarify: 'Which accounts have 500+ field workers?', howToThink: 'Focus on accounts already on Dynamics 365.' },
      { title: 'Check partner incentive tier', who: 'Practice Lead', whatToClarify: 'Current Azure AI consumption level?', howToThink: 'Plan to hit $50K threshold for 15% rebate.' },
    ],
    proofArtifacts: [
      'Azure OpenAI region availability matrix',
      'Copilot for Field Service preview documentation',
      'Partner incentive tier calculator',
    ],
    sources: [
      { name: 'Microsoft', title: 'Azure Updates Blog', url: 'https://azure.microsoft.com/updates', sourceType: 'url', isInternalNote: false },
      { name: 'Microsoft', title: 'Partner Center incentives', url: 'https://partner.microsoft.com', sourceType: 'url', isInternalNote: false },
    ],
    createdAt: '2026-02-10T08:00:00Z',
    isSimulated: true,
  },

  // ===== 2. Account Microcast =====
  {
    id: 'brief-account-001',
    hubOrgId: 'hub-alpnova',
    focusId: 'focus-schindler',
    briefingType: 'account_microcast',
    title: 'Schindler Account Briefing — Week of Feb 9',
    estMinutes: 4,
    scriptText: `Welcome to your Schindler account briefing for the week of February 9th.

Three signals matter this week. First, Azure OpenAI is now generally available in Switzerland North. This removes the data residency objection that Schindler's compliance team raised. You can now position in-country AI processing as standard.

Second, the EU Machinery Regulation mandates digital twins by 2027. For Schindler, this creates compliance urgency. Position the AI Readiness Assessment as a compliance prerequisite.

Third, Copilot for Field Service entered public preview. With 20,000+ field technicians, Schindler is an ideal candidate. Propose a 30-day pilot scoped to dispatching.

Competitive context: Kone partnered with Google Cloud. Different use case, but creates urgency for Schindler to act on Azure.

Your three actions: Lead with Switzerland North to unblock compliance. Position AI Readiness as EU compliance prerequisite. Propose a Copilot Sprint for field service.`,
    readText: `## Schindler Account Briefing — Week of Feb 9

### Key Signals
1. **Azure OpenAI in Switzerland North** — removes data residency objection
2. **EU Machinery Regulation** — digital twins mandatory by 2027
3. **Copilot for Field Service** — relevant to 20K+ technicians

### Competitive Context
Kone partnered with Google Cloud. Creates urgency for Schindler.

### Actions
1. Lead with Switzerland North availability
2. Position AI Readiness Assessment as EU compliance prerequisite
3. Propose 30-day Copilot Sprint for field service`,
    actions: [
      { title: 'Lead with Switzerland North', who: 'Seller', whatToClarify: 'Has compliance team been briefed?', howToThink: 'Position as "blocker removed" not "new capability".' },
      { title: 'Pitch AI Readiness Assessment', who: 'Seller', whatToClarify: 'Who owns EU compliance at Schindler?', howToThink: 'Frame as compliance prerequisite, not innovation.' },
      { title: 'Propose Copilot Sprint', who: 'Seller + Engineer', whatToClarify: 'Is Schindler on Dynamics 365?', howToThink: 'Scope tightly to field service dispatching.' },
    ],
    proofArtifacts: [
      'Azure OpenAI Switzerland North GA announcement',
      'EU Machinery Regulation 2027 compliance timeline',
      'Copilot for Field Service preview docs',
    ],
    sources: [
      { name: 'Azure', title: 'Azure Updates Blog', url: 'https://azure.microsoft.com/updates', sourceType: 'url', isInternalNote: false },
      { name: 'EU', title: 'European Commission', url: 'https://ec.europa.eu', sourceType: 'url', isInternalNote: false },
      { name: 'Internal', title: 'Schindler CTO conference notes', sourceType: 'internal_note', isInternalNote: true },
    ],
    createdAt: '2026-02-10T08:00:00Z',
    isSimulated: true,
  },

  // ===== 3. Industry Microcast =====
  {
    id: 'brief-industry-001',
    hubOrgId: 'hub-alpnova',
    focusId: 'focus-schindler',
    briefingType: 'industry_microcast',
    title: 'Industrial AI Landscape — Week of Feb 9',
    estMinutes: 4,
    scriptText: `Welcome to your industrial AI landscape briefing.

Swiss manufacturing AI adoption has reached 35%. Companies below this threshold risk falling behind peers. Use this benchmark as peer pressure in executive conversations.

The EU Machinery Regulation mandates digital twins by 2027. This is the biggest regulatory development — it changes how OEMs need to think about digital infrastructure.

Kone's Google Cloud partnership signals major OEMs are committing to AI. Every industrial player will need an AI platform strategy.

For partners, these trends converge: regulatory pressure plus competitive urgency plus technology availability equals a narrow window for AI engagements.

Key takeaways: Use the 35% benchmark as conversation starter. Position AI readiness as compliance necessity. Differentiate Azure IoT from Google Cloud analytics.`,
    readText: `## Industrial AI Landscape — Week of Feb 9

### Market Signals
- **Swiss Manufacturing AI at 35%** — peer pressure benchmark
- **EU Machinery Regulation 2027** — digital twins mandatory
- **Kone–Google Cloud Partnership** — competitive signal

### Convergence
Regulatory + competitive + technology = narrow window for engagements.

### Takeaways
1. Use 35% benchmark as peer pressure
2. Position AI readiness as compliance necessity
3. Differentiate Azure IoT from Google Cloud analytics`,
    actions: [
      { title: 'Use 35% benchmark in pitches', who: 'Seller', whatToClarify: 'Which prospects are below 35%?', howToThink: 'Peer pressure works best at C-level.' },
      { title: 'Link AI to EU compliance', who: 'Seller', whatToClarify: 'Which prospects are affected by EU Machinery Reg?', howToThink: 'Frame as deadline-driven, not optional.' },
      { title: 'Prepare Azure vs GCP positioning', who: 'Seller + Engineer', whatToClarify: 'Any prospects evaluating GCP?', howToThink: 'Focus on IoT integration, not raw ML benchmarks.' },
    ],
    proofArtifacts: [
      'Swiss Digital Economy Report 2026',
      'EU Machinery Regulation timeline',
      'Azure vs GCP industrial IoT comparison',
    ],
    sources: [
      { name: 'Swiss Economy', title: 'Swiss Digital Economy Report 2026', sourceType: 'url', isInternalNote: false },
      { name: 'EU', title: 'European Commission', url: 'https://ec.europa.eu', sourceType: 'url', isInternalNote: false },
      { name: 'Internal', title: 'Competitive analysis', sourceType: 'internal_note', isInternalNote: true },
    ],
    createdAt: '2026-02-10T08:00:00Z',
    isSimulated: true,
  },

  // ===== 4. Competitive Microcast =====
  {
    id: 'brief-competitive-001',
    hubOrgId: 'hub-alpnova',
    vendorId: 'vendor-microsoft',
    briefingType: 'competitive_microcast',
    title: 'Azure vs Google Cloud for Industrial AI',
    estMinutes: 5,
    scriptText: `This competitive briefing covers Azure versus Google Cloud for industrial AI workloads.

Google Cloud's strengths: strong in data analytics and ML research. Their BigQuery and Vertex AI platforms are mature. Kone chose GCP for consumer analytics — this is a real reference.

Azure's advantages for industrial: deeper enterprise integration with M365, Dynamics, and SAP. Azure OpenAI in Switzerland North — GCP lacks equivalent AI hosting in Switzerland. Azure IoT Hub and Digital Twins are purpose-built for industrial scenarios. The partner ecosystem in DACH is significantly stronger.

Key differentiator: Schindler is already on Azure. Adding AI to their existing stack is faster and lower-risk than introducing a second cloud platform.

When GCP comes up in conversation: Acknowledge their ML strengths. Pivot to enterprise readiness and data residency. Quantify switching cost — multi-cloud adds complexity for AI workloads specifically.

Don't dismiss Google Cloud. Instead, differentiate the use case: GCP for analytics, Azure for enterprise AI with governance.`,
    readText: `## Azure vs Google Cloud for Industrial AI

### Google Cloud Strengths
- Strong data analytics (BigQuery) and ML research (Vertex AI)
- Kone chose GCP for consumer analytics

### Azure Advantages (Industrial)
- Deeper enterprise integration (M365, Dynamics, SAP)
- Azure OpenAI in Switzerland North — no GCP equivalent
- IoT Hub + Digital Twins — purpose-built for industrial
- Stronger DACH partner ecosystem

### Key Differentiator
Schindler already on Azure. Adding AI is faster than multi-cloud.

### Positioning
Acknowledge GCP ML strengths → Pivot to enterprise readiness + data residency → Quantify switching cost.`,
    actions: [
      { title: 'Prepare tailored comparison', who: 'Seller + Engineer', whatToClarify: 'What specific GCP features interest the customer?', howToThink: 'Focus on enterprise readiness, not model benchmarks.' },
      { title: 'Engage Microsoft field team', who: 'Seller', whatToClarify: 'Is there competitive funding available?', howToThink: 'Microsoft may co-invest to defend against GCP.' },
      { title: 'Emphasize existing Azure footprint', who: 'Seller', whatToClarify: 'What is the customer already running on Azure?', howToThink: 'Lower risk and faster time-to-value argument.' },
    ],
    proofArtifacts: [
      'Azure vs GCP enterprise AI comparison',
      'Azure OpenAI Switzerland North availability',
      'Kone use case differentiation analysis',
      'Azure AI model catalog documentation',
    ],
    objections: [
      { theme: 'GCP has better AI tools', pushback: 'Google Cloud has better ML and AI capabilities.', response: 'GCP excels at research-grade ML, but Azure OpenAI offers production-ready enterprise AI with governance built in.', evidence: 'Azure vs GCP enterprise AI comparison matrix' },
      { theme: 'Kone chose Google', pushback: 'Our competitor Kone chose Google Cloud — should we follow?', response: 'Kone\'s use case is consumer analytics, not predictive maintenance. Azure is purpose-built for industrial IoT scenarios.', evidence: 'Kone vs Schindler use case differentiation' },
      { theme: 'Vendor lock-in', pushback: 'We want to avoid vendor lock-in with Microsoft.', response: 'Azure supports open models (Llama, Mistral) alongside OpenAI. You choose the model, not the vendor.', evidence: 'Azure AI model catalog' },
    ],
    sources: [
      { name: 'Internal', title: 'Azure vs GCP competitive brief', sourceType: 'internal_note', isInternalNote: true },
      { name: 'Microsoft', title: 'Azure AI model catalog', url: 'https://azure.microsoft.com/products/ai-model-catalog', sourceType: 'url', isInternalNote: false },
    ],
    createdAt: '2026-02-10T08:00:00Z',
    isSimulated: true,
  },

  // ===== 5. Objection Briefing =====
  {
    id: 'brief-objections-001',
    hubOrgId: 'hub-alpnova',
    focusId: 'focus-schindler',
    briefingType: 'objections_brief',
    title: 'Objection Briefing — Schindler AI Engagement',
    estMinutes: 5,
    scriptText: `This is your objection briefing for the Schindler AI engagement.

The five most likely objections and your approved responses:

One — "We're not ready for AI." Reframe: readiness isn't binary. Propose an AI Readiness Assessment as the logical first step, not a full deployment. The bigger risk is waiting while Kone moves ahead.

Two — "Our data isn't clean enough." You don't need perfect data. The assessment identifies what data exists, what's missing, and how to close gaps. Start with the data you have.

Three — "We don't have AI skills internally." That's exactly what a partner provides. AlpNova brings AI expertise; Schindler brings domain knowledge. It's a partnership, not a skills gap criticism.

Four — "Data must stay in Switzerland." Solved. Azure OpenAI is now GA in Switzerland North. All processing stays in-country.

Five — "Our board hasn't approved AI investments." The readiness assessment produces exactly the business case your board needs — ROI estimates, risk assessment, and a phased roadmap.

For each objection, acknowledge the concern first, then reframe with evidence.`,
    readText: `## Objection Briefing — Schindler AI Engagement

### Top 5 Objections

**1. "We're not ready for AI"**
Reframe: readiness isn't binary. Propose AI Readiness Assessment as first step.

**2. "Our data isn't clean enough"**
You don't need perfect data. Assessment identifies gaps.

**3. "We don't have AI skills"**
That's what a partner provides. Partnership, not criticism.

**4. "Data must stay in Switzerland"**
Solved — Azure OpenAI GA in Switzerland North.

**5. "Board hasn't approved AI"**
Assessment produces the business case the board needs.

### Approach
Acknowledge → Reframe → Evidence`,
    actions: [
      { title: 'Prepare evidence pack', who: 'Seller', whatToClarify: 'Which objections are most likely for next meeting?', howToThink: 'Have proof artifacts ready before the conversation.' },
      { title: 'Practice reframes', who: 'Seller', whatToClarify: 'Which stakeholder raises which objection?', howToThink: 'Tailor the reframe to the stakeholder\'s concern.' },
      { title: 'Share board-ready template', who: 'Seller', whatToClarify: 'Does the champion need help building the internal case?', howToThink: 'Provide the template proactively, don\'t wait to be asked.' },
    ],
    proofArtifacts: [
      'AI Readiness Assessment sample output',
      'Azure OpenAI Switzerland North GA announcement',
      'Board-ready AI business case template',
      'AlpNova AI capability overview',
    ],
    objections: [
      { theme: 'Not ready for AI', pushback: 'We\'re not ready for AI yet.', response: 'Readiness isn\'t binary. An AI Readiness Assessment takes 2–3 weeks and shows you exactly where to start.', evidence: 'AI Readiness Assessment sample output' },
      { theme: 'Data quality', pushback: 'Our data isn\'t clean enough for AI.', response: 'You don\'t need perfect data. The assessment identifies what exists, what\'s missing, and how to close gaps.', evidence: 'Data readiness assessment framework' },
      { theme: 'Skills gap', pushback: 'We don\'t have AI skills internally.', response: 'That\'s what a partner provides. AlpNova brings AI expertise; you bring domain knowledge.', evidence: 'AlpNova AI capability overview' },
      { theme: 'Data residency', pushback: 'Our data must stay in Switzerland.', response: 'Azure OpenAI is now GA in Switzerland North. All processing stays in-country.', evidence: 'Azure region availability matrix' },
      { theme: 'No board approval', pushback: 'Our board hasn\'t approved AI investments.', response: 'The readiness assessment produces the business case your board needs — ROI, risk, and phased roadmap.', evidence: 'Board-ready AI business case template' },
    ],
    sources: [
      { name: 'Internal', title: 'Objection handling methodology', sourceType: 'internal_note', isInternalNote: true },
      { name: 'Azure', title: 'Azure OpenAI region availability', url: 'https://azure.microsoft.com/regions', sourceType: 'url', isInternalNote: false },
    ],
    createdAt: '2026-02-10T08:00:00Z',
    isSimulated: true,
  },
];
