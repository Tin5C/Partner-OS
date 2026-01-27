// Mock Events Data - Swap-ready for Eventbrite/Meetup integration
// Replace this file's exports with API calls when ready

export interface EventData {
  id: string;
  title: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  city: string;
  venue: string;
  organizer: string;
  topics: EventTopic[];
  description: string;
  agenda?: string[];
  whoShouldAttend?: string[];
  relevanceReason: string;
  url?: string;
  imageUrl?: string;
}

export type EventTopic = 'AI' | 'Data' | 'Security' | 'Sales' | 'Startups' | 'Leadership';

export const ALL_TOPICS: EventTopic[] = ['AI', 'Data', 'Security', 'Sales', 'Startups', 'Leadership'];

export const CITIES = ['Zurich', 'Basel', 'Bern', 'Lausanne', 'Munich', 'Geneva'] as const;
export type City = typeof CITIES[number];

// Helper to generate dates relative to today
function futureDate(daysFromNow: number, hour: number = 18, minute: number = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

function endDate(startIso: string, durationHours: number = 2): string {
  const date = new Date(startIso);
  date.setHours(date.getHours() + durationHours);
  return date.toISOString();
}

export const mockEvents: EventData[] = [
  // Zurich Events
  {
    id: 'evt-001',
    title: 'AI in Enterprise: From Hype to Impact',
    startDateTime: futureDate(2, 18, 0),
    endDateTime: futureDate(2, 20, 30),
    city: 'Zurich',
    venue: 'Google Europaallee',
    organizer: 'Swiss AI Community',
    topics: ['AI', 'Data'],
    description: 'Join industry leaders discussing practical AI implementation strategies in enterprise environments. Learn from real case studies and network with practitioners.',
    agenda: ['Welcome & Networking', 'Keynote: AI Maturity in Swiss Companies', 'Panel: Overcoming Implementation Challenges', 'Lightning Talks', 'Networking Drinks'],
    whoShouldAttend: ['Enterprise architects', 'IT leaders', 'AI/ML engineers', 'Digital transformation leads'],
    relevanceReason: 'Your accounts in FSI are evaluating AI solutions',
    url: 'https://example.com/ai-enterprise',
  },
  {
    id: 'evt-002',
    title: 'Data Mesh Meetup Zurich',
    startDateTime: futureDate(4, 17, 30),
    endDateTime: futureDate(4, 20, 0),
    city: 'Zurich',
    venue: 'Zühlke Innovation Hub',
    organizer: 'Data Engineering Zurich',
    topics: ['Data'],
    description: 'Deep dive into data mesh architecture patterns. Featuring talks from Zalando and Swiss Re on their data mesh journeys.',
    agenda: ['Intro to Data Mesh', 'Case Study: Zalando', 'Case Study: Swiss Re', 'Open Discussion'],
    whoShouldAttend: ['Data engineers', 'Data architects', 'Platform teams'],
    relevanceReason: 'Aligns with data modernization initiatives',
  },
  {
    id: 'evt-003',
    title: 'Cybersecurity Summit Switzerland',
    startDateTime: futureDate(6, 9, 0),
    endDateTime: futureDate(6, 17, 0),
    city: 'Zurich',
    venue: 'Kongresshaus Zürich',
    organizer: 'InfoSec Switzerland',
    topics: ['Security'],
    description: 'The premier cybersecurity event in Switzerland. Full-day conference with workshops, keynotes, and an expo floor.',
    agenda: ['Keynote: Threat Landscape 2025', 'Track A: Cloud Security', 'Track B: Zero Trust', 'Expo & Demos', 'CISO Panel'],
    whoShouldAttend: ['CISOs', 'Security architects', 'IT managers', 'Risk officers'],
    relevanceReason: 'Key accounts attending; potential meeting opportunities',
  },
  {
    id: 'evt-004',
    title: 'Sales Leadership Roundtable',
    startDateTime: futureDate(3, 12, 0),
    endDateTime: futureDate(3, 14, 0),
    city: 'Zurich',
    venue: 'Soho House Zurich',
    organizer: 'Sales Leaders Network',
    topics: ['Sales', 'Leadership'],
    description: 'Exclusive lunch roundtable for VP Sales and above. Topic: Building high-performance sales teams in a hybrid world.',
    whoShouldAttend: ['VP Sales', 'CROs', 'Sales Directors'],
    relevanceReason: 'Connect with enterprise sales leaders in your territory',
  },
  {
    id: 'evt-005',
    title: 'Startup Grind Zurich: FinTech Edition',
    startDateTime: futureDate(8, 18, 30),
    endDateTime: futureDate(8, 21, 0),
    city: 'Zurich',
    venue: 'Impact Hub Zurich',
    organizer: 'Startup Grind',
    topics: ['Startups', 'AI'],
    description: 'Fireside chat with the founders of Yokoy, followed by networking. Great for meeting the next generation of FinTech disruptors.',
    whoShouldAttend: ['Founders', 'Investors', 'Corporate innovators', 'FinTech enthusiasts'],
    relevanceReason: 'FinTech is expanding in your account base',
  },
  {
    id: 'evt-006',
    title: 'Cloud Native Zurich Meetup',
    startDateTime: futureDate(10, 18, 0),
    endDateTime: futureDate(10, 20, 30),
    city: 'Zurich',
    venue: 'Microsoft Schweiz',
    organizer: 'CNCF Zurich',
    topics: ['Data', 'Security'],
    description: 'Monthly meetup covering Kubernetes, service mesh, and observability. This month: Platform Engineering best practices.',
    whoShouldAttend: ['DevOps engineers', 'Platform engineers', 'SREs'],
    relevanceReason: 'Platform engineering is a hot topic with IT leads',
  },
  {
    id: 'evt-007',
    title: 'Women in Tech Leadership Summit',
    startDateTime: futureDate(12, 9, 0),
    endDateTime: futureDate(12, 17, 0),
    city: 'Zurich',
    venue: 'The Dolder Grand',
    organizer: 'Women in Tech Switzerland',
    topics: ['Leadership'],
    description: 'Annual summit celebrating and empowering women leaders in technology. Keynotes, mentoring sessions, and career workshops.',
    whoShouldAttend: ['Tech leaders', 'HR executives', 'D&I champions', 'Aspiring leaders'],
    relevanceReason: 'Network with influential decision-makers',
  },
  {
    id: 'evt-008',
    title: 'Generative AI Hands-on Workshop',
    startDateTime: futureDate(5, 14, 0),
    endDateTime: futureDate(5, 17, 0),
    city: 'Zurich',
    venue: 'ETH Zentrum',
    organizer: 'ETH AI Center',
    topics: ['AI'],
    description: 'Practical workshop on building with LLMs. Bring your laptop and learn to create RAG applications.',
    agenda: ['LLM Fundamentals', 'RAG Architecture', 'Hands-on Lab', 'Q&A'],
    whoShouldAttend: ['Developers', 'Data scientists', 'Solution architects'],
    relevanceReason: 'GenAI is top priority for your accounts',
  },
  
  // Basel Events
  {
    id: 'evt-009',
    title: 'Pharma Digital Innovation Forum',
    startDateTime: futureDate(7, 9, 0),
    endDateTime: futureDate(7, 16, 0),
    city: 'Basel',
    venue: 'Congress Center Basel',
    organizer: 'Pharma IT Network',
    topics: ['AI', 'Data'],
    description: 'Digital transformation in life sciences. Featuring case studies from Novartis, Roche, and emerging biotechs.',
    whoShouldAttend: ['Pharma IT leaders', 'Digital health innovators', 'Life sciences consultants'],
    relevanceReason: 'Your pharma accounts will be represented',
  },
  {
    id: 'evt-010',
    title: 'Basel Security Breakfast',
    startDateTime: futureDate(9, 8, 0),
    endDateTime: futureDate(9, 10, 0),
    city: 'Basel',
    venue: 'Grand Hotel Les Trois Rois',
    organizer: 'CISO Network Basel',
    topics: ['Security'],
    description: 'Intimate breakfast session for security leaders. Topic: Managing third-party risk in complex supply chains.',
    whoShouldAttend: ['CISOs', 'Security managers', 'Risk officers'],
    relevanceReason: 'Meet security leaders from your target accounts',
  },
  {
    id: 'evt-011',
    title: 'Startup Basel Demo Day',
    startDateTime: futureDate(14, 17, 0),
    endDateTime: futureDate(14, 20, 0),
    city: 'Basel',
    venue: 'BaselArea.swiss',
    organizer: 'Basel Startup Ecosystem',
    topics: ['Startups'],
    description: '10 promising startups pitch to investors and corporates. Great scouting opportunity for innovation partnerships.',
    whoShouldAttend: ['Investors', 'Corporate innovation teams', 'Startup enthusiasts'],
    relevanceReason: 'Scout potential partners and disruptors',
  },
  
  // Bern Events
  {
    id: 'evt-012',
    title: 'Swiss Government IT Conference',
    startDateTime: futureDate(11, 9, 0),
    endDateTime: futureDate(11, 17, 0),
    city: 'Bern',
    venue: 'Kursaal Bern',
    organizer: 'BIT - Bundesamt für Informatik',
    topics: ['Data', 'Security'],
    description: 'Annual conference on digital government. Focus on data sovereignty, cloud strategy, and citizen services.',
    whoShouldAttend: ['Government IT leaders', 'Public sector consultants', 'Regulated industry leaders'],
    relevanceReason: 'Public sector is expanding in your territory',
  },
  {
    id: 'evt-013',
    title: 'AI in Public Sector Workshop',
    startDateTime: futureDate(15, 13, 0),
    endDateTime: futureDate(15, 17, 0),
    city: 'Bern',
    venue: 'Rathaus Bern',
    organizer: 'eCH',
    topics: ['AI', 'Data'],
    description: 'Workshop on responsible AI implementation in government. Ethics, procurement, and pilot project design.',
    whoShouldAttend: ['Public sector IT', 'Policy makers', 'AI vendors'],
    relevanceReason: 'Understand public sector AI requirements',
  },
  
  // Lausanne Events
  {
    id: 'evt-014',
    title: 'EPFL AI & Robotics Showcase',
    startDateTime: futureDate(13, 10, 0),
    endDateTime: futureDate(13, 16, 0),
    city: 'Lausanne',
    venue: 'EPFL Campus',
    organizer: 'EPFL',
    topics: ['AI', 'Startups'],
    description: 'Annual showcase of EPFL\'s cutting-edge AI and robotics research. Lab tours, demos, and startup pitches.',
    whoShouldAttend: ['Tech scouts', 'R&D leaders', 'Investors', 'AI researchers'],
    relevanceReason: 'Early access to next-gen technologies',
  },
  {
    id: 'evt-015',
    title: 'Romandie Sales Excellence Summit',
    startDateTime: futureDate(16, 9, 0),
    endDateTime: futureDate(16, 17, 0),
    city: 'Lausanne',
    venue: 'SwissTech Convention Center',
    organizer: 'Sales Association Romandie',
    topics: ['Sales', 'Leadership'],
    description: 'The largest sales conference in French-speaking Switzerland. Workshops, keynotes, and networking.',
    whoShouldAttend: ['Sales professionals', 'Sales leaders', 'Business development'],
    relevanceReason: 'Build relationships with Romandie sales leaders',
  },
  {
    id: 'evt-016',
    title: 'Data Privacy & Compliance Forum',
    startDateTime: futureDate(18, 14, 0),
    endDateTime: futureDate(18, 18, 0),
    city: 'Lausanne',
    venue: 'Lausanne Palace',
    organizer: 'Swiss Privacy Association',
    topics: ['Data', 'Security'],
    description: 'Deep dive into Swiss and EU data regulations. FADP, GDPR, and the new AI Act implications.',
    whoShouldAttend: ['DPOs', 'Legal counsel', 'Compliance officers', 'IT leaders'],
    relevanceReason: 'Compliance is a key concern for your accounts',
  },
  
  // Munich Events
  {
    id: 'evt-017',
    title: 'Munich AI Summit',
    startDateTime: futureDate(20, 9, 0),
    endDateTime: futureDate(20, 18, 0),
    city: 'Munich',
    venue: 'ICM Munich',
    organizer: 'Applied AI Initiative',
    topics: ['AI', 'Data'],
    description: 'Major AI conference featuring enterprise case studies, research presentations, and an AI startup expo.',
    whoShouldAttend: ['AI leaders', 'Data scientists', 'Enterprise architects', 'Investors'],
    relevanceReason: 'Cross-border opportunity with German accounts',
  },
  {
    id: 'evt-018',
    title: 'Oktane Europe - Identity Conference',
    startDateTime: futureDate(22, 9, 0),
    endDateTime: futureDate(23, 17, 0),
    city: 'Munich',
    venue: 'Messe München',
    organizer: 'Okta',
    topics: ['Security'],
    description: 'Two-day identity and access management conference. Zero trust, passwordless, and workforce identity.',
    whoShouldAttend: ['IAM specialists', 'Security architects', 'IT directors'],
    relevanceReason: 'IAM projects are active in your pipeline',
  },
  {
    id: 'evt-019',
    title: 'German Startup Awards Ceremony',
    startDateTime: futureDate(25, 18, 0),
    endDateTime: futureDate(25, 22, 0),
    city: 'Munich',
    venue: 'BMW Welt',
    organizer: 'Startup Association Germany',
    topics: ['Startups', 'Leadership'],
    description: 'Gala evening celebrating the best German startups of the year. Excellent networking with the DACH ecosystem.',
    whoShouldAttend: ['Investors', 'Corporate innovators', 'Startup founders'],
    relevanceReason: 'Network with the DACH startup ecosystem',
  },
  
  // Geneva Events
  {
    id: 'evt-020',
    title: 'UN AI for Good Summit',
    startDateTime: futureDate(28, 9, 0),
    endDateTime: futureDate(29, 17, 0),
    city: 'Geneva',
    venue: 'ITU Headquarters',
    organizer: 'ITU',
    topics: ['AI', 'Leadership'],
    description: 'Global summit on AI for sustainable development. NGOs, governments, and tech leaders collaborate on AI ethics.',
    whoShouldAttend: ['Policy makers', 'AI ethics experts', 'NGO leaders', 'Tech executives'],
    relevanceReason: 'Thought leadership opportunity for your brand',
  },
  {
    id: 'evt-021',
    title: 'International Cybersecurity Forum',
    startDateTime: futureDate(30, 9, 0),
    endDateTime: futureDate(30, 17, 0),
    city: 'Geneva',
    venue: 'Palexpo',
    organizer: 'GCSP',
    topics: ['Security'],
    description: 'High-level forum on global cybersecurity challenges. Featuring speakers from CERN, WEF, and major governments.',
    whoShouldAttend: ['CISOs', 'Government security officials', 'International org IT leaders'],
    relevanceReason: 'International org accounts attending',
  },
  
  // More Zurich events for variety
  {
    id: 'evt-022',
    title: 'FinTech Regulatory Breakfast',
    startDateTime: futureDate(1, 8, 0),
    endDateTime: futureDate(1, 10, 0),
    city: 'Zurich',
    venue: 'Widder Hotel',
    organizer: 'Swiss FinTech Association',
    topics: ['Data', 'Security'],
    description: 'Morning briefing on upcoming regulatory changes affecting FinTech. FINMA updates and compliance strategies.',
    whoShouldAttend: ['FinTech founders', 'Compliance officers', 'Legal counsel'],
    relevanceReason: 'Stay ahead of regulatory changes for FSI accounts',
  },
  {
    id: 'evt-023',
    title: 'Product Management Zurich Meetup',
    startDateTime: futureDate(5, 18, 30),
    endDateTime: futureDate(5, 21, 0),
    city: 'Zurich',
    venue: 'Spotify Zurich',
    organizer: 'Product Managers Zurich',
    topics: ['AI', 'Startups'],
    description: 'Monthly PM meetup. This month: AI-powered product discovery and user research automation.',
    whoShouldAttend: ['Product managers', 'UX researchers', 'Startup founders'],
    relevanceReason: 'Understand how PMs are thinking about AI',
  },
  {
    id: 'evt-024',
    title: 'CIO Executive Dinner',
    startDateTime: futureDate(7, 19, 0),
    endDateTime: futureDate(7, 22, 0),
    city: 'Zurich',
    venue: 'Baur au Lac',
    organizer: 'Gartner',
    topics: ['Leadership', 'AI'],
    description: 'Invite-only dinner for Fortune 500 CIOs. Topic: Navigating the AI investment landscape.',
    whoShouldAttend: ['CIOs', 'CTOs', 'IT executives'],
    relevanceReason: 'Your key accounts\' CIOs will attend',
  },
  {
    id: 'evt-025',
    title: 'DevOps Days Zurich',
    startDateTime: futureDate(21, 9, 0),
    endDateTime: futureDate(22, 17, 0),
    city: 'Zurich',
    venue: 'Alte Börse',
    organizer: 'DevOpsDays',
    topics: ['Data', 'Security'],
    description: 'Two-day conference on DevOps culture, automation, and platform engineering. Workshops and open spaces.',
    whoShouldAttend: ['DevOps engineers', 'SREs', 'Platform teams', 'Engineering managers'],
    relevanceReason: 'DevOps transformation is ongoing at your accounts',
  },
];

// Event prep mock content generator
export interface EventPrepContent {
  conversationStarters: string[];
  questionsToAsk: string[];
  followUpDraft: string;
}

export function generateEventPrep(event: EventData, goal: string): EventPrepContent {
  const starters: Record<string, string[]> = {
    'Network': [
      `"I noticed you're also interested in ${event.topics[0]} – what brings you to this event?"`,
      `"Have you been to ${event.venue} before? I'm curious what you think of the ${event.city} tech scene."`,
      `"Are you working on any ${event.topics[0].toLowerCase()}-related initiatives at your company?"`,
    ],
    'Learn': [
      `"What's the one thing you're hoping to learn here today?"`,
      `"Have you implemented anything similar to what ${event.organizer} is presenting?"`,
      `"I'm curious – what's your biggest challenge with ${event.topics[0].toLowerCase()} right now?"`,
    ],
    'Find leads': [
      `"What does your company do in the ${event.topics[0].toLowerCase()} space?"`,
      `"Are you evaluating any new solutions for ${event.topics[0].toLowerCase()} this year?"`,
      `"What would make your ${event.topics[0].toLowerCase()} initiatives more successful?"`,
    ],
    'Partner meeting': [
      `"How does your team typically approach ${event.topics[0].toLowerCase()} partnerships?"`,
      `"I'd love to understand how ${event.organizer} thinks about collaboration."`,
      `"What would an ideal partnership look like for your organization?"`,
    ],
  };

  const questions: Record<string, string[]> = {
    'Network': [
      'What projects are you most excited about right now?',
      'How is your industry being impacted by these trends?',
    ],
    'Learn': [
      'What resources have been most valuable for staying current?',
      'Any recommended sessions or speakers today?',
    ],
    'Find leads': [
      "What's your current tech stack for this area?",
      'When are you planning to make decisions on new investments?',
    ],
    'Partner meeting': [
      'What are your partnership criteria and process?',
      'Who else is involved in partnership decisions?',
    ],
  };

  const followUps: Record<string, string> = {
    'Network': `Hi [Name],\n\nGreat meeting you at ${event.title}! I enjoyed our conversation about ${event.topics[0]}.\n\nI'd love to continue the discussion over coffee sometime. Would next week work for you?\n\nBest,\n[Your name]`,
    'Learn': `Hi [Name],\n\nThanks for the insights at ${event.title}. Your perspective on ${event.topics[0]} was really valuable.\n\nI'd be happy to share my notes from the session if helpful. Let me know!\n\nBest,\n[Your name]`,
    'Find leads': `Hi [Name],\n\nIt was great connecting at ${event.title}. Based on our conversation about your ${event.topics[0]} challenges, I think there might be some interesting ways we could help.\n\nWould you have 20 minutes next week for a brief call?\n\nBest,\n[Your name]`,
    'Partner meeting': `Hi [Name],\n\nThank you for the productive conversation at ${event.title}. I'm excited about the potential collaboration we discussed.\n\nAs a next step, I'd suggest a follow-up call with our partnership team. Would Tuesday or Wednesday work?\n\nBest,\n[Your name]`,
  };

  return {
    conversationStarters: starters[goal] || starters['Network'],
    questionsToAsk: questions[goal] || questions['Network'],
    followUpDraft: followUps[goal] || followUps['Network'],
  };
}

// Filtering utilities
export function filterEvents(
  events: EventData[],
  filters: {
    city?: string;
    topics?: EventTopic[];
    daysAhead?: number;
  }
): EventData[] {
  const now = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + (filters.daysAhead || 30));

  return events.filter((event) => {
    const eventDate = new Date(event.startDateTime);
    
    // Date filter
    if (eventDate < now || eventDate > maxDate) return false;
    
    // City filter
    if (filters.city && filters.city !== 'All' && event.city !== filters.city) return false;
    
    // Topics filter
    if (filters.topics && filters.topics.length > 0) {
      const hasMatchingTopic = event.topics.some((t) => filters.topics!.includes(t));
      if (!hasMatchingTopic) return false;
    }
    
    return true;
  }).sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
}
