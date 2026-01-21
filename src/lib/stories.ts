// Image imports
import startupVisionQa from '@/assets/stories/startup-vision-qa.jpg';
import startupEnergy from '@/assets/stories/startup-energy.jpg';
import startupMaintenance from '@/assets/stories/startup-maintenance.jpg';
import expertExecution from '@/assets/stories/expert-execution.jpg';
import expertRoi from '@/assets/stories/expert-roi.jpg';
import competitorSovereignty from '@/assets/stories/competitor-sovereignty.jpg';
import competitorPackaging from '@/assets/stories/competitor-packaging.jpg';
import eventAutomation from '@/assets/stories/event-automation.jpg';
import eventWebinar from '@/assets/stories/event-webinar.jpg';
import leadsCost from '@/assets/stories/leads-cost.jpg';

export type StoryType = "startup" | "expert" | "competitor" | "event" | "leads";
export type ListenedState = "unseen" | "seen" | "listened";

export interface StoryItem {
  id: string;
  type: StoryType;
  label: string;
  title: string; // max 42 chars
  bullets: string[]; // 2-4 items, each max 10 words
  whyItMatters?: string; // max 1 line
  sourceName: string;
  sourceUrl?: string;
  audioUrl?: string;
  durationSec?: number;
  tags?: string[];
  relatedEpisodeId?: string;
  relatedPlaylistId?: string;
  publishedAt?: string;
  imageUrl?: string; // Story thumbnail image
}

// Seed stories for demo/testing
export const stories: StoryItem[] = [
  {
    id: "story-001",
    type: "startup",
    label: "Startup",
    title: "Startup: Vision QA traction",
    bullets: [
      "Signal: Factory vision QA pilots expanding",
      "Solves: scrap + rework reduction",
      "Seller angle: tie to quality cost baseline"
    ],
    whyItMatters: "Quality improvements still get funded under cost pressure.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 20,
    tags: ["Manufacturing", "Quality"],
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-10",
    imageUrl: startupVisionQa
  },
  {
    id: "story-002",
    type: "startup",
    label: "Startup",
    title: "Startup: Energy optimization push",
    bullets: [
      "Signal: Energy tooling interest in plants",
      "Solves: volatility + reporting burden",
      "Seller angle: position quick payback projects"
    ],
    whyItMatters: "Energy remains a board-level constraint in operations.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 22,
    tags: ["Manufacturing", "Energy"],
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-10",
    imageUrl: startupEnergy
  },
  {
    id: "story-003",
    type: "startup",
    label: "Startup",
    title: "Startup: Predictive maintenance",
    bullets: [
      "Signal: PdM vendors selling service outcomes",
      "Solves: downtime + spares planning",
      "Seller angle: connect to installed base value"
    ],
    whyItMatters: "Maintenance is shifting from cost to margin lever.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 18,
    tags: ["Manufacturing", "Maintenance"],
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-10",
    imageUrl: startupMaintenance
  },
  {
    id: "story-004",
    type: "expert",
    label: "Expert",
    title: "Expert: Execution is the risk",
    bullets: [
      "Claim: 'Execution risk is the new cost.'",
      "Implication: buyers want delivery certainty",
      "Use line: 'Standardize before you scale.'"
    ],
    whyItMatters: "This reframes hesitation as risk management.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 20,
    tags: ["Manufacturing", "Ops"],
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-10",
    imageUrl: expertExecution
  },
  {
    id: "story-005",
    type: "expert",
    label: "Expert",
    title: "Expert: ROI needs proof",
    bullets: [
      "Claim: 'ROI needs proof in 90 days.'",
      "Implication: pilots must show measurable wins",
      "Ask: 'What metric moves in 12 weeks?'"
    ],
    whyItMatters: "Helps shape discovery around measurable outcomes.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 24,
    tags: ["Manufacturing", "Value"],
    relatedEpisodeId: "ep-competitive-radar",
    publishedAt: "2026-01-10",
    imageUrl: expertRoi
  },
  {
    id: "story-006",
    type: "competitor",
    label: "Competitor",
    title: "Competitor: Sovereignty angle",
    bullets: [
      "Move: sovereignty messaging pushed harder",
      "Market read: procurement uses it as filter",
      "Position: workload boundaries + controls"
    ],
    whyItMatters: "Sovereignty shows up early—even in ops deals.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 22,
    tags: ["Security", "Procurement"],
    relatedEpisodeId: "ep-competitive-radar",
    publishedAt: "2026-01-10",
    imageUrl: competitorSovereignty
  },
  {
    id: "story-007",
    type: "competitor",
    label: "Competitor",
    title: "Competitor: Packaging change",
    bullets: [
      "Move: packaging/pricing bundles adjusted",
      "Market read: buyers expect simpler terms",
      "Seller angle: lead with clarity + predictability"
    ],
    whyItMatters: "Commercial friction is a silent deal killer.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 18,
    tags: ["Commercial", "Platform"],
    relatedEpisodeId: "ep-competitive-radar",
    publishedAt: "2026-01-10",
    imageUrl: competitorPackaging
  },
  {
    id: "story-008",
    type: "event",
    label: "Event",
    title: "Event: Automation conference",
    bullets: [
      "When: this month (event season)",
      "Why care: what's real vs hype",
      "Bring: 'Where is ROI proven?'"
    ],
    whyItMatters: "Stay current without doomscrolling.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 20,
    tags: ["Manufacturing", "Automation"],
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-10",
    imageUrl: eventAutomation
  },
  {
    id: "story-009",
    type: "event",
    label: "Event",
    title: "Event: Service growth webinar",
    bullets: [
      "Theme: services + installed base monetization",
      "Who: Service Ops / Digital leads",
      "Ask: 'Which service KPI is hardest?'"
    ],
    whyItMatters: "Services growth is a fundable play.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 24,
    tags: ["Service", "Manufacturing"],
    relatedEpisodeId: "ep-top-focus-sulzer",
    publishedAt: "2026-01-10",
    imageUrl: eventWebinar
  },
  {
    id: "story-010",
    type: "leads",
    label: "Leads",
    title: "Lead Signals: Cost pressure",
    bullets: [
      "Intent: more asks for cost reduction cases",
      "Where: industrials (DACH), mid-enterprise",
      "Move: open with 12-week value baseline"
    ],
    whyItMatters: "Customers want fast proof before scaling.",
    sourceName: "Internal note (sample)",
    sourceUrl: "",
    audioUrl: "",
    durationSec: 20,
    tags: ["Intent", "Value"],
    relatedEpisodeId: "ep-objection-handling",
    publishedAt: "2026-01-10",
    imageUrl: leadsCost
  }
];

// Type colors for pills
export const storyTypeColors: Record<StoryType, string> = {
  startup: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  expert: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  competitor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  event: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  leads: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export const storyTypeLabels: Record<StoryType, string> = {
  startup: "Startup",
  expert: "Expert",
  competitor: "Competitor",
  event: "Event",
  leads: "Leads",
};
