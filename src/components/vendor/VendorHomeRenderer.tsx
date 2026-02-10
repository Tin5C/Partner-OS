// Vendor Home Renderer — Config-driven homepage for Vendor Space
// Uses VendorDataProvider exclusively (no Partner providers)

import { useState } from 'react';
import { useSpace } from '@/contexts/SpaceContext';
import { SpaceHeader } from '@/components/shared/SpaceHeader';
import { BottomNav } from '@/components/BottomNav';
import { SpaceIndicator } from '@/components/shared/SpaceIndicator';
import { ProgramSignalsSection } from './ProgramSignalsSection';
import { PublishingSection } from './PublishingSection';
import { PartnerBriefingPresetsSection } from './PartnerBriefingPresetsSection';
import { VendorInsightsSection } from './VendorInsightsSection';

// Inline AccessGate (same as HomeRenderer pattern)
function VendorAccessGate({ onUnlock }: { onUnlock: (password: string) => boolean }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { spaceType } = useSpace();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUnlock(password)) {
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
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
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

export function VendorHomeRenderer() {
  const { isUnlocked, unlock } = useSpace();

  if (!isUnlocked) {
    return <VendorAccessGate onUnlock={unlock} />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <SpaceHeader showGreeting showSearch />

      <main className="max-w-[1140px] mx-auto px-5 lg:px-8 space-y-10">
        <ProgramSignalsSection />
        <PublishingSection />
        <PartnerBriefingPresetsSection />
        <VendorInsightsSection />
      </main>

      <BottomNav />
    </div>
  );
}
