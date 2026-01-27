// Skill of the Week Selection Logic
// Rotates through user's selected skills, avoiding repeats within last 4 weeks

import { UserProfile, SKILLS_LIST } from './profileConfig';

// Storage key for skill history per tenant/audience
function getSkillHistoryKey(tenantSlug: string, audience: string): string {
  return `skill_of_week_history_${audience}_${tenantSlug}`;
}

// Get skill history (weekKey -> skill mapping)
function getSkillHistory(tenantSlug: string, audience: string): Record<string, string> {
  const key = getSkillHistoryKey(tenantSlug, audience);
  const stored = localStorage.getItem(key);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

// Save skill history
function saveSkillHistory(tenantSlug: string, audience: string, history: Record<string, string>): void {
  const key = getSkillHistoryKey(tenantSlug, audience);
  localStorage.setItem(key, JSON.stringify(history));
}

// Get the last N week keys (for checking repeats)
function getLastNWeekKeys(currentWeekKey: string, n: number): string[] {
  const keys: string[] = [];
  const [year, month, day] = currentWeekKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  for (let i = 1; i <= n; i++) {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - (i * 7));
    const weekKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(prevDate.getDate()).padStart(2, '0')}`;
    keys.push(weekKey);
  }
  
  return keys;
}

// Select skill for a given week
export function getSkillOfTheWeek(
  tenantSlug: string,
  audience: string,
  weekKey: string,
  userSkills: string[]
): string | null {
  if (!userSkills || userSkills.length === 0) {
    return null;
  }

  const history = getSkillHistory(tenantSlug, audience);
  
  // If this week already has a skill assigned, return it
  if (history[weekKey]) {
    // Verify it's still in user's selected skills
    if (userSkills.includes(history[weekKey])) {
      return history[weekKey];
    }
  }
  
  // Get skills used in last 4 weeks
  const last4Weeks = getLastNWeekKeys(weekKey, 4);
  const recentlyUsed = last4Weeks
    .map(wk => history[wk])
    .filter(Boolean);
  
  // Filter to skills not used recently (if possible)
  const availableSkills = userSkills.filter(skill => !recentlyUsed.includes(skill));
  
  // If all skills were recently used, just pick from all
  const skillPool = availableSkills.length > 0 ? availableSkills : userSkills;
  
  // Deterministic selection based on weekKey hash
  const hash = weekKey.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedIndex = hash % skillPool.length;
  const selectedSkill = skillPool[selectedIndex];
  
  // Store the selection
  history[weekKey] = selectedSkill;
  saveSkillHistory(tenantSlug, audience, history);
  
  return selectedSkill;
}

// Generate mock content for a skill
export interface SkillContent {
  skillTitle: string;
  whyMattersThisWeek: string[];
  tacticsToTry: string[];
  exampleScript: string;
  exercise: string;
}

// Content templates per skill
const SKILL_CONTENT: Record<string, Omit<SkillContent, 'skillTitle'>> = {
  'Discovery & qualification': {
    whyMattersThisWeek: [
      'Buyers are 60% through their journey before engaging sales — strong discovery closes that gap',
      'Your pipeline review highlighted qualification gaps in recent opportunities',
      'Early-stage deals need sharper qualifying questions to accelerate velocity',
    ],
    tacticsToTry: [
      'Use the "3 Whys" technique — dig three levels deep on every pain point',
      'Ask about the cost of inaction: "What happens if you do nothing for 12 months?"',
      'Map the buying committee early: "Who else needs to be convinced?"',
    ],
    exampleScript: '"Help me understand — what prompted you to take this meeting now? What changed in the last 90 days that made this a priority?"',
    exercise: 'In your next discovery call, pause after each answer and ask "Tell me more about that" before moving to the next question. Track how much deeper you go.',
  },
  'Executive messaging': {
    whyMattersThisWeek: [
      'C-suite deals close 3x faster but require different language than manager-level',
      'Your upcoming QBR needs executive-level framing to land budget approval',
      'Recent win/loss analysis shows executive engagement correlates with 2x win rates',
    ],
    tacticsToTry: [
      'Lead with business outcomes, not features — translate everything to revenue, cost, or risk',
      'Use the "So what?" test on every slide — if an exec would ask it, reframe',
      'Reference peer executives by title: "Other CIOs tell us..."',
    ],
    exampleScript: '"The CFO cares about one thing: predictable revenue. Here\'s how we help you deliver 15% more forecast accuracy..."',
    exercise: 'Rewrite your opening email for your top account as if the CEO will read it first. Remove all jargon and feature mentions.',
  },
  'Objection handling': {
    whyMattersThisWeek: [
      'Deals are stalling at the "we need to think about it" stage — objection handling skills unblock them',
      'Competitive pressure is increasing — you need crisp responses ready',
      'Late-stage objections often surface budget or priority concerns in disguise',
    ],
    tacticsToTry: [
      'Use "Feel, Felt, Found": Acknowledge the concern, relate to others, share resolution',
      'Isolate objections: "If we solved X, would you be ready to move forward?"',
      'Turn objections into questions: "That\'s a great point — can you tell me more about why that concerns you?"',
    ],
    exampleScript: '"I understand that concern — other customers felt the same way initially. What they found was that the ROI offset the investment within 6 months. Would you like to see their data?"',
    exercise: 'List the top 3 objections you hear most often. Write a one-sentence response for each and practice saying them out loud.',
  },
  'Negotiation': {
    whyMattersThisWeek: [
      'End of quarter means procurement is pushing hard on discounts',
      'Strong negotiation skills protect margin while closing deals faster',
      'Last month\'s average discount was above target — time to sharpen skills',
    ],
    tacticsToTry: [
      'Never discount without getting something in return: "We can discuss pricing, but I\'d need X..."',
      'Use silence as a tool — state your position and wait',
      'Anchor high: Start with your ideal outcome, not your minimum acceptable',
    ],
    exampleScript: '"I understand budget is tight. If we can get sign-off this week and a case study commitment, I can talk to my team about the pricing."',
    exercise: 'Before your next negotiation, write down your walk-away point and your ideal outcome. Commit to not going below your walk-away.',
  },
  'Competitive positioning': {
    whyMattersThisWeek: [
      'Competitors are increasingly in your deals — differentiation is critical',
      'Customers are doing more research before engaging — your story must be sharper',
      'Recent losses cited competitive features — time to reframe the conversation',
    ],
    tacticsToTry: [
      'Focus on their weaknesses you can prove, not claims you can\'t back up',
      'Ask about their competitive evaluation criteria: "What would make you choose one over another?"',
      'Position around outcomes, not features: "They do X, but does X get you to your goal?"',
    ],
    exampleScript: '"I know [Competitor] is strong at X. The question is: does X solve your actual problem? Let me show you how we approach it differently..."',
    exercise: 'Create a 2-column comparison: Competitor claims vs. what customers actually experience. Use this to prep for your next competitive deal.',
  },
  'Account strategy / account planning': {
    whyMattersThisWeek: [
      'Q4 planning season is approaching — strong account plans unlock budget',
      'Multi-threaded accounts close 4x more revenue than single-threaded ones',
      'Your top accounts need refreshed strategies based on recent market changes',
    ],
    tacticsToTry: [
      'Map the org chart to the budget: understand who controls what spend',
      'Identify the "power sponsor" — the person who can accelerate or kill a deal',
      'Build a 90-day action plan with specific milestones for each account',
    ],
    exampleScript: '"Based on our research, your digital transformation initiative is a priority for the CEO. How does that connect to your team\'s goals this year?"',
    exercise: 'For your top account, list 5 people you\'ve never met but should. Identify one path to each through your existing contacts.',
  },
  'Stakeholder mapping': {
    whyMattersThisWeek: [
      'Deals with 4+ stakeholders engaged close at 2x the rate of single-threaded deals',
      'Recent losses involved "surprise" stakeholders at the end — mapping prevents this',
      'Your champion alone can\'t close the deal — you need the buying committee',
    ],
    tacticsToTry: [
      'Ask your champion: "Who else needs to say yes? Who could say no?"',
      'Map stakeholders by influence AND interest, not just title',
      'Identify the "mobilizer" — the person who will sell internally for you',
    ],
    exampleScript: '"I want to make sure we\'re set up for success. Can you walk me through who else will be involved in this decision?"',
    exercise: 'Draw the stakeholder map for your top deal. Identify one person you haven\'t engaged yet and plan how to reach them this week.',
  },
  'Value selling (ROI / business case)': {
    whyMattersThisWeek: [
      'Budget scrutiny is increasing — every deal needs a clear business case',
      'Customers are asking for ROI earlier in the cycle than before',
      'Deals with quantified value close 50% faster than those without',
    ],
    tacticsToTry: [
      'Ask about current costs: "What does this problem cost you today?"',
      'Use their numbers, not yours: "You said X costs you Y — here\'s how we change that"',
      'Build the business case together: co-create ROI rather than presenting it',
    ],
    exampleScript: '"Let\'s build this together. You mentioned the current process takes 20 hours/week. At your team\'s fully-loaded cost, that\'s $X per month. We typically cut that by 60%..."',
    exercise: 'For your next opportunity, calculate the customer\'s cost of doing nothing for 12 months. Use that number in your next conversation.',
  },
  'Storytelling & presentations': {
    whyMattersThisWeek: [
      'Customers remember stories 22x more than facts alone',
      'Your upcoming presentations need to land emotionally, not just logically',
      'Competitors are drowning customers in features — stories differentiate',
    ],
    tacticsToTry: [
      'Use the "Before-After-Bridge" structure: problem, solution, transformation',
      'Include a customer quote in every presentation — social proof beats claims',
      'Start with the end: what do you want them to feel at the end?',
    ],
    exampleScript: '"Let me tell you about a customer just like you. Before working with us, they were struggling with X. Now, 6 months later, they\'ve achieved Y. Here\'s how they got there..."',
    exercise: 'Rewrite your standard pitch as a 60-second story with a clear protagonist, challenge, and resolution. Practice it until it feels natural.',
  },
  'Follow-up & deal control': {
    whyMattersThisWeek: [
      'Deals without clear next steps stall 3x more often',
      'Your pipeline has aging opportunities that need re-engagement',
      'Strong follow-up separates winners from also-rans',
    ],
    tacticsToTry: [
      'End every meeting with a concrete next step — date, time, and owner',
      'Follow up within 24 hours with a summary and clear asks',
      'Create "micro-commitments" — small asks that build momentum',
    ],
    exampleScript: '"To summarize: you\'re going to share this with your CFO by Thursday, and we\'ll reconvene Friday at 2pm to discuss. I\'ll send the calendar invite now."',
    exercise: 'Review your top 5 opportunities. For any without a next step scheduled, send a follow-up today proposing a specific date and time.',
  },
  'Personal brand / thought leadership': {
    whyMattersThisWeek: [
      'Buyers are researching you before they meet you — your presence matters',
      'Strong personal brands generate 3x more inbound opportunities',
      'Your competitors are showing up online — you should too',
    ],
    tacticsToTry: [
      'Post one insight per week on LinkedIn — consistency beats perfection',
      'Comment thoughtfully on industry news before sharing your own content',
      'Share customer wins (with permission) — success stories build credibility',
    ],
    exampleScript: '"Just had a conversation with a CIO about their AI strategy. Three things I learned: 1) They care more about integration than features. 2) Trust is built in the first 5 minutes. 3) ROI needs to be visible in 90 days, not 12 months."',
    exercise: 'Write one LinkedIn post about something you learned this week. Keep it under 150 words and include one actionable insight.',
  },
};

// Get content for a skill
export function getSkillContent(skillTitle: string): SkillContent {
  const content = SKILL_CONTENT[skillTitle];
  
  if (content) {
    return {
      skillTitle,
      ...content,
    };
  }
  
  // Fallback for any skill not in the map
  return {
    skillTitle,
    whyMattersThisWeek: [
      'This skill is critical for closing deals faster',
      'Market conditions make this skill more relevant than ever',
      'Top performers consistently excel in this area',
    ],
    tacticsToTry: [
      'Practice this skill in your next customer conversation',
      'Ask a peer for feedback on your approach',
      'Study how top performers apply this skill',
    ],
    exampleScript: '"Apply this skill in your conversations by focusing on customer outcomes and listening actively."',
    exercise: 'Identify one opportunity to practice this skill today and reflect on what worked.',
  };
}
