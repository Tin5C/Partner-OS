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
import accountFnbCto from '@/assets/stories/account-fnb-cto.jpg';

// Video imports
import startupVisionQaVideo from '@/assets/stories/startup-vision-qa.mp4';
import startupEnergyVideo from '@/assets/stories/startup-energy.mp4';
import startupMaintenanceVideo from '@/assets/stories/startup-maintenance.mp4';

export type StoryType = "competitor" | "startup" | "customer" | "industry" | "expert" | "account" | "lead" | "event" | "success";
export type ListenedState = "unseen" | "seen" | "listened";
export type MediaType = "image" | "video" | "audio";

export interface StoryItem {
  id: string;
  type: StoryType;
  badge: string;
  headline: string; // max 6-7 words, title case
  one_liner: string; // max 110 chars - what changed
  why_it_matters: string; // max 140 chars - business implication
  talk_track: string; // one sentence a seller can say
  cta_label: string; // "Listen Briefing" or "Exec Summary"
  duration_sec: number; // 30-90 seconds
  media_type: MediaType;
  topic_tags: string[]; // 1-3 tags

  // Cover rendering fields (new)
  companyName: string; // Used for monogram fallback
  personName?: string; // Optional - for customer stories
  logoUrl?: string; // Optional - company logo for competitor/startup
  personImageUrl?: string; // Optional - portrait for customer stories
  coverImageUrl?: string; // Optional - fallback cover image

  // Audio/media fields
  audio_title: string;
  audio_script: string; // 70-140 words
  imageUrl?: string; // Legacy - will be deprecated in favor of coverImageUrl
  videoUrl?: string;
  audioUrl?: string;
  relatedEpisodeId?: string;
  relatedPlaylistId?: string;
  publishedAt?: string;
  sourceName?: string;
  sourceUrl?: string;
}

// Seed stories - Competitors first per spec
export const stories: StoryItem[] = [
  // COMPETITOR STORIES (first)
  {
    id: "story-001",
    type: "competitor",
    badge: "Competitor",
    headline: "Competitor Pushes Sovereignty Hard",
    one_liner: "Major cloud player now leads sales pitches with data sovereignty messaging in DACH region.",
    why_it_matters: "Procurement teams use sovereignty as an early filter—if you can't answer it, you're out.",
    talk_track: "We're seeing sovereignty come up earlier in deals. What's your current stance on workload boundaries?",
    cta_label: "Listen",
    duration_sec: 45,
    media_type: "audio",
    topic_tags: ["Sovereignty", "Security", "DACH"],
    companyName: "AWS",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    audio_title: "Competitor Pushes Sovereignty Hard",
    audio_script: "A major competitor is now leading with data sovereignty in every DACH sales pitch. They're positioning workload boundaries and local controls as table stakes. Procurement teams are using this as an early filter—if you can't answer sovereignty questions clearly, you don't make the shortlist. Here's how to use it: Lead with your own controls story. Ask the customer: 'What's your current stance on workload boundaries and data residency?' This positions you as informed, not reactive.",
    coverImageUrl: competitorSovereignty,
    relatedEpisodeId: "ep-competitive-radar",
    publishedAt: "2026-01-22",
    sourceName: "Field Intel"
  },
  {
    id: "story-002",
    type: "competitor",
    badge: "Competitor",
    headline: "Competitor Simplifies Pricing Tiers",
    one_liner: "Competitor consolidated 5 pricing tiers into 3, bundling support and SLAs by default.",
    why_it_matters: "Buyers expect simpler commercial terms—complex pricing creates friction that kills deals.",
    talk_track: "Buyers are pushing back on pricing complexity. How do you typically structure your vendor agreements?",
    cta_label: "Listen",
    duration_sec: 40,
    media_type: "audio",
    topic_tags: ["Pricing", "Commercial"],
    companyName: "Salesforce",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
    audio_title: "Competitor Simplifies Pricing Tiers",
    audio_script: "A key competitor just consolidated their pricing from 5 tiers to 3, bundling support and SLAs into each tier by default. This matters because buyers are increasingly frustrated with complex commercial terms—they want predictability. Commercial friction is a silent deal killer. Use this: Emphasize your own pricing clarity. Ask: 'How do you typically structure vendor agreements—do you prefer bundled or à la carte?' This surfaces their buying preference early.",
    coverImageUrl: competitorPackaging,
    relatedEpisodeId: "ep-competitive-radar",
    publishedAt: "2026-01-22",
    sourceName: "Field Intel"
  },

  // STARTUP STORIES
  {
    id: "story-003",
    type: "startup",
    badge: "Startup",
    headline: "Vision QA Startups Winning Pilots",
    one_liner: "Three vision QA startups expanded factory pilots to full deployments this quarter.",
    why_it_matters: "Quality improvement projects still get funded even under cost pressure—buyers see direct ROI.",
    talk_track: "Vision QA is gaining traction because it hits scrap and rework costs directly. What's your baseline for quality costs?",
    cta_label: "Listen",
    duration_sec: 50,
    media_type: "video",
    topic_tags: ["Manufacturing", "Quality", "Vision QA"],
    companyName: "Landing AI",
    logoUrl: "https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1476357668/q4oy6thwq5wj5yrzxmk8.png",
    audio_title: "Vision QA Startups Winning Pilots",
    audio_script: "Three vision QA startups expanded from factory pilots to full deployments this quarter. They're winning because quality improvements have clear ROI—scrap and rework reduction are measurable. Even under cost pressure, these projects get funded. Here's how to use it: Tie your conversation to quality cost baselines. Ask: 'What's your current baseline for scrap and rework costs?' This opens a discussion about measurable outcomes, not features.",
    coverImageUrl: startupVisionQa,
    videoUrl: startupVisionQaVideo,
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-22",
    sourceName: "Field Intel"
  },
  {
    id: "story-004",
    type: "startup",
    badge: "Startup",
    headline: "Energy Optimization Tools Expand",
    one_liner: "Industrial energy startups report 40% increase in plant-level pilot requests since Q4.",
    why_it_matters: "Energy volatility remains a board-level concern—quick payback projects get priority.",
    talk_track: "Energy optimization is top of mind for ops leaders. What's your current approach to energy cost visibility?",
    cta_label: "Listen",
    duration_sec: 45,
    media_type: "video",
    topic_tags: ["Energy", "Manufacturing", "Sustainability"],
    companyName: "Turntide",
    audio_title: "Energy Optimization Tools Expand",
    audio_script: "Industrial energy startups are seeing 40% more pilot requests since Q4. Plants are looking for tools that address energy volatility and reporting burden. Energy remains a board-level constraint—projects with quick payback get priority. Use this: Position around fast value realization. Ask: 'What's your current approach to energy cost visibility across sites?' This surfaces whether they're reactive or proactive on energy.",
    coverImageUrl: startupEnergy,
    videoUrl: startupEnergyVideo,
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-22",
    sourceName: "Field Intel"
  },
  {
    id: "story-005",
    type: "startup",
    badge: "Startup",
    headline: "Predictive Maintenance Goes Outcome",
    one_liner: "Leading PdM vendors now selling uptime guarantees, not just software licenses.",
    why_it_matters: "Maintenance is shifting from cost center to margin lever—buyers want outcomes, not tools.",
    talk_track: "Maintenance vendors are selling outcomes now. Are you evaluating partners based on uptime guarantees?",
    cta_label: "Listen",
    duration_sec: 55,
    media_type: "video",
    topic_tags: ["Maintenance", "Manufacturing", "IoT"],
    companyName: "Augury",
    audio_title: "Predictive Maintenance Goes Outcome",
    audio_script: "Predictive maintenance vendors are shifting from selling software to selling outcomes—uptime guarantees, spares planning, service contracts. This matters because maintenance is moving from cost center to margin lever. Buyers want to pay for results. Here's how to use it: Connect to installed base value. Ask: 'Are you evaluating maintenance partners based on uptime guarantees or software features?' This reveals their maturity level.",
    coverImageUrl: startupMaintenance,
    videoUrl: startupMaintenanceVideo,
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-22",
    sourceName: "Field Intel"
  },

  // EXPERT STORIES
  {
    id: "story-006",
    type: "expert",
    badge: "Expert",
    headline: "Execution Risk Is the New Cost",
    one_liner: "Industry analyst: 'CFOs now view execution risk as equal to or greater than project cost.'",
    why_it_matters: "Buyers hesitate not because of price, but fear of failed implementations.",
    talk_track: "We hear CFOs worry more about execution risk than cost. What gives your team confidence in delivery?",
    cta_label: "Listen",
    duration_sec: 50,
    media_type: "audio",
    topic_tags: ["Execution", "Risk", "Enterprise"],
    companyName: "McKinsey",
    personName: "Sarah Chen",
    personImageUrl: expertExecution,
    audio_title: "Execution Risk Is the New Cost",
    audio_script: "A leading industry analyst said: 'Execution risk is the new cost.' CFOs now view implementation risk as equal to or greater than project cost. This reframes buyer hesitation—it's not about price, it's about fear of failure. Use this: Position around delivery certainty. Ask: 'What gives your team confidence in a vendor's ability to deliver?' This opens a conversation about proof points, references, and methodology.",
    coverImageUrl: expertExecution,
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-22",
    sourceName: "McKinsey Quarterly"
  },
  {
    id: "story-007",
    type: "expert",
    badge: "Expert",
    headline: "ROI Proof Required in 90 Days",
    one_liner: "Gartner: 'Enterprises now expect measurable ROI proof within first 90 days of any pilot.'",
    why_it_matters: "Long-horizon value stories don't work anymore—buyers need early wins to justify expansion.",
    talk_track: "We're seeing buyers demand 90-day proof of value. What metric would need to move in 12 weeks for this to be a win?",
    cta_label: "Listen",
    duration_sec: 45,
    media_type: "audio",
    topic_tags: ["ROI", "Value", "Pilots"],
    companyName: "Gartner",
    personName: "Michael Torres",
    personImageUrl: expertRoi,
    audio_title: "ROI Proof Required in 90 Days",
    audio_script: "Gartner reports that enterprises now expect measurable ROI proof within 90 days of any pilot. Long-horizon value stories don't work—buyers need early wins to justify expanding the project. Here's how to use it: Shape discovery around measurable outcomes. Ask: 'What metric would need to move in 12 weeks for this to be a win for you?' This forces specificity and reveals true success criteria.",
    coverImageUrl: expertRoi,
    relatedEpisodeId: "ep-competitive-radar",
    publishedAt: "2026-01-22",
    sourceName: "Gartner Research"
  },

  // ACCOUNT/CUSTOMER STORY
  {
    id: "story-008",
    type: "customer",
    badge: "Customer",
    headline: "First National Bank: CTO Transition",
    one_liner: "First National Bank announces new CTO starting Q2—comes from cloud-native fintech background.",
    why_it_matters: "New technology leadership often triggers vendor reviews and modernization initiatives.",
    talk_track: "I noticed First National has a new CTO starting in Q2. New tech leadership often triggers vendor reviews—is that on your radar?",
    cta_label: "Listen",
    duration_sec: 40,
    media_type: "audio",
    topic_tags: ["Banking", "Leadership", "Account Intel"],
    companyName: "First National Bank",
    personName: "Elena Rodriguez",
    personImageUrl: accountFnbCto,
    audio_title: "First National Bank: CTO Transition",
    audio_script: "First National Bank just announced a new CTO starting Q2. She comes from a cloud-native fintech background, which signals potential modernization priorities. New technology leadership often triggers vendor reviews within 6 months. Use this: Reach out to your contacts there. Ask: 'I saw the CTO announcement—are you expecting any shifts in technology priorities as the new leadership settles in?' This shows you're informed and opens the door.",
    coverImageUrl: accountFnbCto,
    relatedEpisodeId: "ep-account-briefing",
    publishedAt: "2026-01-22",
    sourceName: "LinkedIn / Press Release"
  },

  // LEAD/INDUSTRY STORY
  {
    id: "story-009",
    type: "industry",
    badge: "Industry",
    headline: "Cost Reduction Intent Signals Up",
    one_liner: "Intent data shows 25% increase in cost reduction content consumption among DACH industrials.",
    why_it_matters: "Customers actively researching cost reduction are open to fast-value conversations.",
    talk_track: "We're seeing more industrials actively researching cost reduction. What's driving the urgency in your org?",
    cta_label: "Listen",
    duration_sec: 45,
    media_type: "audio",
    topic_tags: ["Intent", "Cost", "DACH"],
    companyName: "DACH Industrials",
    audio_title: "Cost Reduction Intent Signals Up",
    audio_script: "Intent data shows a 25% increase in cost reduction content consumption among DACH industrial companies. These customers are actively researching—which means they're open to conversations about fast value. Here's how to use it: Open with a value baseline. Ask: 'We're seeing a lot of industrials prioritizing cost reduction right now. What's driving the urgency in your organization?' This validates the signal and opens discovery.",
    coverImageUrl: leadsCost,
    relatedEpisodeId: "ep-objection-handling",
    publishedAt: "2026-01-22",
    sourceName: "Bombora Intent Data"
  },

  // EVENT STORY
  {
    id: "story-010",
    type: "event",
    badge: "Event",
    headline: "Automation Summit This Month",
    one_liner: "Major automation summit in Munich this month—expect announcements on AI integration roadmaps.",
    why_it_matters: "Events generate talking points—knowing what's real vs. hype helps you sound credible.",
    talk_track: "The automation summit is coming up. What are you hoping to learn—or skeptical about?",
    cta_label: "Listen",
    duration_sec: 35,
    media_type: "audio",
    topic_tags: ["Automation", "Events", "Manufacturing"],
    companyName: "Hannover Messe",
    audio_title: "Automation Summit This Month",
    audio_script: "The major automation summit in Munich is this month. Expect announcements on AI integration roadmaps from most major players. This matters because events generate industry talking points—knowing what's hype vs. real helps you sound credible. Use this: Reference the event in conversations. Ask: 'The automation summit is coming up—what are you hoping to learn, or skeptical about?' This positions you as plugged in.",
    coverImageUrl: eventAutomation,
    relatedEpisodeId: "ep-industry-news-manufacturing",
    publishedAt: "2026-01-22",
    sourceName: "Event Calendar"
  },
];

// Type colors for pills/badges - refined enterprise palette
export const storyTypeColors: Record<StoryType, string> = {
  competitor: "bg-slate-100/90 text-slate-700 border-slate-300 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-600",
  startup: "bg-teal-50/90 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-700",
  customer: "bg-violet-50/90 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-700",
  industry: "bg-amber-50/90 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700",
  expert: "bg-sky-50/90 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-700",
  account: "bg-violet-50/90 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-700",
  lead: "bg-amber-50/90 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700",
  event: "bg-indigo-50/90 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-700",
  success: "bg-emerald-50/90 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700",
};

export const storyTypeLabels: Record<StoryType, string> = {
  competitor: "Competitor",
  startup: "Startup",
  customer: "Customer",
  industry: "Industry",
  expert: "Expert",
  account: "Account",
  lead: "Lead",
  event: "Event",
  success: "Success Story",
};

// Monogram gradient backgrounds by story type - refined enterprise gradients
export const storyTypeGradients: Record<StoryType, string> = {
  competitor: "from-slate-500 to-slate-700",
  startup: "from-teal-500 to-teal-700",
  customer: "from-violet-500 to-violet-700",
  industry: "from-amber-500 to-amber-700",
  expert: "from-sky-500 to-sky-700",
  account: "from-violet-500 to-violet-700",
  lead: "from-amber-500 to-amber-700",
  event: "from-indigo-500 to-indigo-700",
  success: "from-emerald-500 to-emerald-700",
};
