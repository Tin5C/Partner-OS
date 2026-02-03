// HomeRenderer - Config-driven homepage renderer
// Reads space config and renders sections using shared components

import { useState } from 'react';
import { useSpace } from '@/contexts/SpaceContext';
import { SpaceHeader } from '@/components/shared/SpaceHeader';
import { BottomNav } from '@/components/BottomNav';
import { AccountPrepSection } from '@/components/home/AccountPrepSection';
import {
  StoriesRow, 
  PackGrid, 
  SectionHeader, 
  ReadPanel, 
  ListenPlayer,
  EnablementProgress,
  SpaceIndicator,
  PackGridItem,
} from '@/components/shared';
import { GrowthPresenceSection } from '@/components/home/GrowthPresenceSection';
import { EventsPanel } from '@/components/events';
import { ScorecardModal, SourcesModal } from '@/components/presence';
import { SkillExecSummaryPanel } from '@/components/skills';
import { CustomerBriefSection } from '@/components/partner/CustomerBriefSection';
import { ExpertCornersRail } from '@/components/partner/ExpertCornersRail';
import { usePresenceSources } from '@/hooks/usePresenceSources';
import { PackContent } from '@/config/contentModel';
import { SectionConfig } from '@/config/spaces';
import { cn } from '@/lib/utils';

// Access Gate Component (inline for simplicity)
function AccessGate({ onUnlock }: { onUnlock: (password: string) => boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { spaceType } = useSpace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(password);
    if (!success) {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <SpaceIndicator spaceType={spaceType} />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Enter access password</h1>
          <p className="text-muted-foreground">Please enter your password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

// Mock briefings data - would come from content feed in production
const getMockBriefings = (packIds: string[]): PackGridItem[] => {
  const allBriefings: Record<string, PackGridItem> = {
    'top-focus': {
      id: 'top-focus',
      title: 'Top Focus',
      description: 'Your priority accounts and key updates this week',
      duration: '6 min',
      isNew: true,
    },
    'competitive-radar': {
      id: 'competitive-radar',
      title: 'Competitive Radar',
      description: 'What competitors are doing and how to respond',
      duration: '5 min',
      isNew: true,
    },
    'industry-signals': {
      id: 'industry-signals',
      title: 'Industry Signals',
      description: 'Market trends and buyer behavior shifts',
      duration: '4 min',
      isNew: false,
    },
    'objection-handling': {
      id: 'objection-handling',
      title: 'Objection Handling',
      description: 'Common pushbacks and proven responses',
      duration: '5 min',
      isNew: false,
    },
    'product-focus': {
      id: 'product-focus',
      title: 'Product Focus',
      description: 'Latest product updates and positioning',
      duration: '5 min',
      isNew: true,
    },
    'competitive-overview': {
      id: 'competitive-overview',
      title: 'Competitive Overview',
      description: 'Approved competitive positioning and responses',
      duration: '4 min',
      isNew: false,
    },
  };

  return packIds.map(id => allBriefings[id]).filter(Boolean);
};

export function HomeRenderer() {
  const { spaceType, spaceConfig, isUnlocked, unlock } = useSpace();
  const { sources, connectSource, disconnectSource } = usePresenceSources(spaceType);

  // Panel states
  const [readPanelOpen, setReadPanelOpen] = useState(false);
  const [listenPlayerOpen, setListenPlayerOpen] = useState(false);
  const [selectedPackContent, setSelectedPackContent] = useState<PackContent | null>(null);
  const [selectedPackTitle, setSelectedPackTitle] = useState('');
  const [eventsPanelOpen, setEventsPanelOpen] = useState(false);
  const [skillPanelOpen, setSkillPanelOpen] = useState(false);
  const [scorecardOpen, setScorecardOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // If not unlocked, show access gate
  if (!isUnlocked) {
    return <AccessGate onUnlock={unlock} />;
  }

  // Handle briefing play
  const handleBriefingPlay = (briefingId: string) => {
    setSelectedPackTitle(getBriefingTitle(briefingId));
    setSelectedPackContent({
      listenUrl: '/audio/mock-briefing.mp3',
      execSummary: {
        tldr: 'Key insights for this week.',
        whatChanged: ['Market conditions have shifted this week.'],
        whyItMatters: ['These changes affect your positioning.'],
        nextBestActions: ['Update your talking points.'],
        questionsToAsk: ['What has changed for you recently?'],
      }
    });
    setListenPlayerOpen(true);
  };

  // Handle briefing open (read)
  const handleBriefingOpen = (briefingId: string) => {
    setSelectedPackTitle(getBriefingTitle(briefingId));
    setSelectedPackContent({
      listenUrl: '/audio/mock-briefing.mp3',
      execSummary: {
        tldr: 'Key insights for this week.',
        whatChanged: [
          'Market conditions have shifted this week with new competitor moves.',
          'New developments in the regulatory landscape.',
        ],
        whyItMatters: [
          'These changes affect your positioning in upcoming customer conversations.',
          'Early awareness enables better preparation.',
        ],
        nextBestActions: [
          'Review and apply insights to your next conversation.',
          'Update your strategy based on new signals.',
        ],
        questionsToAsk: [
          'What has changed for you in the past quarter?',
          'How are you currently addressing this challenge?',
        ],
      }
    });
    setReadPanelOpen(true);
  };

  // Render a section based on its config
  const renderSection = (section: SectionConfig) => {
    if (!section.enabled) return null;

    switch (section.type) {
      case 'storiesRow':
        return (
          <StoriesRow
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            allowedTypes={spaceConfig.allowedStoryTypes}
          />
        );

      case 'accountPrep':
        // Uses the full AccountPrepSection centerpiece (not AccountPrepCard)
        // AccountPrepSection includes its own header, controls, and snapshot output
        return spaceConfig.features.accountPrep ? (
          <AccountPrepSection key={section.id} />
        ) : null;

      case 'packGrid':
        return (
          <PackGrid
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            items={getMockBriefings(section.packs || [])}
            onPlay={handleBriefingPlay}
            onOpen={handleBriefingOpen}
          />
        );

      case 'growth':
        return spaceConfig.features.skillOfWeek || spaceConfig.features.events ? (
          <GrowthPresenceSection
            key={section.id}
            onSkillClick={() => setSkillPanelOpen(true)}
            onEventsClick={() => setEventsPanelOpen(true)}
            onScorecardClick={() => setScorecardOpen(true)}
          />
        ) : null;

      case 'reputation':
        return spaceConfig.features.reputation ? (
          // Reputation is handled within GrowthPresenceSection
          null
        ) : null;

      case 'enablementProgress':
        return (
          <EnablementProgress
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
            onViewProgress={() => {
              // Handle view progress
            }}
          />
        );

      case 'customerBrief':
        return spaceConfig.features.customerBrief ? (
          <CustomerBriefSection key={section.id} />
        ) : null;

      case 'expertCorners':
        return spaceConfig.features.expertCorners ? (
          <ExpertCornersRail
            key={section.id}
            title={section.title}
            subtitle={section.subtitle}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <SpaceHeader showGreeting showSearch />

      {/* Main Content - Centered container */}
      <main className="max-w-[1140px] mx-auto px-5 lg:px-8 space-y-10">
        {/* Render sections in order from config */}
        {spaceConfig.sections.map(renderSection)}
      </main>

      <BottomNav />

      {/* Panels */}
      <ReadPanel
        open={readPanelOpen}
        onOpenChange={setReadPanelOpen}
        title={selectedPackTitle}
        content={selectedPackContent}
        onListenClick={() => {
          setReadPanelOpen(false);
          setListenPlayerOpen(true);
        }}
      />

      <ListenPlayer
        open={listenPlayerOpen}
        onOpenChange={setListenPlayerOpen}
        title={selectedPackTitle}
        subtitle={spaceConfig.displayName}
        audioUrl={selectedPackContent?.listenUrl}
        onReadClick={() => {
          setListenPlayerOpen(false);
          setReadPanelOpen(true);
        }}
      />

      <EventsPanel
        open={eventsPanelOpen}
        onOpenChange={setEventsPanelOpen}
        tenantSlug={spaceType}
      />

      <SkillExecSummaryPanel
        open={skillPanelOpen}
        onOpenChange={setSkillPanelOpen}
      />

      <ScorecardModal
        open={scorecardOpen}
        onOpenChange={setScorecardOpen}
      />

      <SourcesModal
        open={sourcesOpen}
        onOpenChange={setSourcesOpen}
        sources={sources}
        onConnect={connectSource}
        onDisconnect={disconnectSource}
      />
    </div>
  );
}

// Helper to get briefing title
function getBriefingTitle(id: string): string {
  const titles: Record<string, string> = {
    'top-focus': 'Top Focus',
    'competitive-radar': 'Competitive Radar',
    'industry-signals': 'Industry Signals',
    'objection-handling': 'Objection Handling',
    'product-focus': 'Product Focus',
    'competitive-overview': 'Competitive Overview',
  };
  return titles[id] || 'Briefing';
}
