import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperience, useExperiencePacks } from '@/contexts/ExperienceContext';
import { TenantHeader } from '@/components/TenantHeader';
import { BottomNav } from '@/components/BottomNav';
import { StoriesRail } from '@/components/StoriesRail';
import { JumpNav } from '@/components/JumpNav';
import { Separator } from '@/components/ui/separator';
import { PackSection, WeekNavigator, ReadPanel, ListenPlayer } from '@/components/shared';
import { AccountPrepCard } from '@/components/AccountPrepCard';
import { useWeekSelection, formatLocalDate } from '@/hooks/useWeekSelection';
import { getTenantContent, PackContent } from '@/config/contentModel';

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
    audience, 
    tenantSlug, 
    tenantConfig, 
    experienceConfig, 
    weekKey,
    isUnlocked, 
    unlock 
  } = useExperience();
  
  const packs = useExperiencePacks();
  const navigate = useNavigate();
  
  const { 
    weekLabel, 
    weekRange, 
    canGoPrevious, 
    canGoNext, 
    goToPreviousWeek, 
    goToNextWeek,
    selectedWeekStart
  } = useWeekSelection();

  // Panel states
  const [readPanelOpen, setReadPanelOpen] = useState(false);
  const [listenPlayerOpen, setListenPlayerOpen] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [selectedPackContent, setSelectedPackContent] = useState<PackContent | null>(null);
  const [selectedPackTitle, setSelectedPackTitle] = useState('');

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

  const handlePackPrimaryAction = (packId: string) => {
    const pack = experienceConfig.packDefinitions[packId];
    if (!pack) return;

    // Special handling for wizard packs
    if (pack.isWizard) {
      // Account prep wizard is handled by its own component
      return;
    }

    // Get content for this pack
    const content = getTenantContent(tenantSlug)[formatLocalDate(selectedWeekStart)]?.[packId];
    
    setSelectedPackId(packId);
    setSelectedPackTitle(pack.title);
    setSelectedPackContent(content || null);
    setListenPlayerOpen(true);
  };

  const handlePackSecondaryAction = (packId: string) => {
    const pack = experienceConfig.packDefinitions[packId];
    if (!pack) return;

    // Get content for this pack
    const content = getTenantContent(tenantSlug)[formatLocalDate(selectedWeekStart)]?.[packId];
    
    setSelectedPackId(packId);
    setSelectedPackTitle(pack.title);
    setSelectedPackContent(content || null);
    setReadPanelOpen(true);
  };

  // Custom card renderer for special packs
  const renderCustomCard = (packId: string) => {
    if (packId === 'account-prep') {
      return <AccountPrepCard />;
    }
    return null;
  };

  // Build jump nav items from sections
  const jumpNavItems = experienceConfig.sections.map((section) => ({
    id: `group-${section.id}`,
    label: section.title,
  }));

  return (
    <div className="min-h-screen bg-background pb-24">
      <TenantHeader showGreeting showSearch />

      <main className="px-5 space-y-8">
        {/* Stories Rail */}
        {experienceConfig.features.stories && (
          <StoriesRail />
        )}

        {/* Focus Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">This Week's Focus Pack</h2>
          </div>
          
          {/* Week Navigator */}
          {experienceConfig.features.weekNavigator && (
            <WeekNavigator
              weekLabel={weekLabel}
              weekRange={weekRange}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              onPrevious={goToPreviousWeek}
              onNext={goToNextWeek}
            />
          )}

          {/* Jump Navigation */}
          {experienceConfig.features.jumpNav && (
            <div className="mt-4">
              <JumpNav items={jumpNavItems} />
            </div>
          )}

          {/* Sections */}
          <div className="space-y-8 mt-6">
            {experienceConfig.sections
              .filter((section) => (packs[section.id]?.length || 0) > 0)
              .map((section, idx, filteredSections) => {
                const sectionPacks = packs[section.id] || [];

                return (
                  <div key={section.id}>
                    <PackSection
                      section={section}
                      packs={sectionPacks}
                      onPackPrimaryAction={handlePackPrimaryAction}
                      onPackSecondaryAction={handlePackSecondaryAction}
                      renderCustomCard={renderCustomCard}
                    />
                    {idx < filteredSections.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      </main>

      <BottomNav />

      {/* Read Panel */}
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

      {/* Listen Player */}
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
    </div>
  );
}
