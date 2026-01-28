import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperience } from '@/contexts/ExperienceContext';
import { useAuth } from '@/contexts/AuthContext';
import { TenantHeader } from '@/components/TenantHeader';
import { BottomNav } from '@/components/BottomNav';
import { 
  StoriesSection, 
  AccountPrepSection, 
  BriefingsSection, 
  GrowthPresenceSection 
} from '@/components/home';
import { EventsPanel } from '@/components/events';
import { ProfilePanel, QuickSetupModal } from '@/components/profile';
import { ScorecardModal, SourcesModal } from '@/components/presence';
import { ReadPanel, ListenPlayer } from '@/components/shared';
import { SkillExecSummaryPanel } from '@/components/skills';
import { useProfile } from '@/hooks/useProfile';
import { getTenantContent, PackContent } from '@/config/contentModel';
import { cn } from '@/lib/utils';

// Access Gate Component
function AccessGate({ onUnlock }: { onUnlock: (password: string) => boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

export default function ExperiencePage() {
  const { 
    tenantSlug, 
    tenantConfig, 
    experienceConfig, 
    isUnlocked, 
    unlock 
  } = useExperience();
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Profile state
  const { profile, needsOnboarding, saveFullProfile, completeOnboarding } = useProfile();
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  const [quickSetupOpen, setQuickSetupOpen] = useState(false);

  // Scorecard and Sources modals
  const [scorecardOpen, setScorecardOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // Show quick setup on first run
  useEffect(() => {
    if (needsOnboarding && isUnlocked) {
      setQuickSetupOpen(true);
    }
  }, [needsOnboarding, isUnlocked]);
  
  // Panel states
  const [readPanelOpen, setReadPanelOpen] = useState(false);
  const [listenPlayerOpen, setListenPlayerOpen] = useState(false);
  const [selectedPackContent, setSelectedPackContent] = useState<PackContent | null>(null);
  const [selectedPackTitle, setSelectedPackTitle] = useState('');
  const [eventsPanelOpen, setEventsPanelOpen] = useState(false);
  const [skillPanelOpen, setSkillPanelOpen] = useState(false);

  // If not unlocked, show access gate
  if (!isUnlocked) {
    return <AccessGate onUnlock={unlock} />;
  }

  // If tenant not found
  if (!tenantConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Not Found</h1>
          <p className="text-muted-foreground mb-4">This portal doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
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

  return (
    <div className="min-h-screen bg-background pb-24">
      <TenantHeader showGreeting showSearch />

      {/* Main Content - Centered container with max-width */}
      <main className="max-w-[1140px] mx-auto px-5 lg:px-8 space-y-10">
        {/* Section 1: Stories (Awareness) */}
        {experienceConfig.features.stories && (
          <StoriesSection />
        )}

        {/* Section 2: Account Prep (Centerpiece) */}
        <AccountPrepSection />

        {/* Section 3: Briefings (Readiness) */}
        <BriefingsSection 
          onPlay={handleBriefingPlay}
          onOpen={handleBriefingOpen}
        />

        {/* Section 4: Growth + Presence (Lower Priority) */}
        <GrowthPresenceSection
          onSkillClick={() => setSkillPanelOpen(true)}
          onEventsClick={() => setEventsPanelOpen(true)}
          onScorecardClick={() => setScorecardOpen(true)}
          onSourcesClick={() => setSourcesOpen(true)}
        />
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
        subtitle={tenantConfig.displayName}
        audioUrl={selectedPackContent?.listenUrl}
        onReadClick={() => {
          setListenPlayerOpen(false);
          setReadPanelOpen(true);
        }}
      />

      <EventsPanel
        open={eventsPanelOpen}
        onOpenChange={setEventsPanelOpen}
        tenantSlug={tenantSlug}
      />

      <ProfilePanel
        open={profilePanelOpen}
        onOpenChange={setProfilePanelOpen}
        profile={profile}
        onSave={saveFullProfile}
      />

      <SkillExecSummaryPanel
        open={skillPanelOpen}
        onOpenChange={setSkillPanelOpen}
      />

      {/* Quick Setup Modal (first-run onboarding) */}
      <QuickSetupModal
        open={quickSetupOpen}
        onOpenChange={setQuickSetupOpen}
        profile={profile}
        userName={user?.name}
        onSave={(p) => {
          saveFullProfile(p);
          completeOnboarding();
        }}
        onSkip={completeOnboarding}
      />

      {/* Scorecard Modal */}
      <ScorecardModal
        open={scorecardOpen}
        onOpenChange={setScorecardOpen}
      />

      {/* Sources Modal */}
      <SourcesModal
        open={sourcesOpen}
        onOpenChange={setSourcesOpen}
      />
    </div>
  );
}

// Helper to get briefing title
function getBriefingTitle(id: string): string {
  const titles: Record<string, string> = {
    'briefing-1': 'Top Focus',
    'briefing-2': 'Competitive Radar',
    'briefing-3': 'Industry Signals',
    'briefing-4': 'Objection Handling',
  };
  return titles[id] || 'Briefing';
}
