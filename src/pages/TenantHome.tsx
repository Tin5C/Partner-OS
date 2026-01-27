import { useMemo, useState } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { TenantHeader } from '@/components/TenantHeader';
import { BottomNav } from '@/components/BottomNav';
import { StoriesRail } from '@/components/StoriesRail';
import { FocusCardComponent } from '@/components/FocusCard';
import { FocusGroupLabel } from '@/components/FocusGroupLabel';
import { JumpNav } from '@/components/JumpNav';
import { WeekPicker } from '@/components/WeekPicker';
import { Separator } from '@/components/ui/separator';
import { PreviewDrawer } from '@/components/PreviewDrawer';
import { AccountPrepCard } from '@/components/AccountPrepCard';
import { focusCards, FocusCard } from '@/lib/focusCards';
import { useWeekSelection, formatLocalDate } from '@/hooks/useWeekSelection';

// Card order for Core group (Account Prep is 5th, handled separately)
const CORE_ORDER = ['Top Focus', 'Competitive Radar', 'Industry Signals', 'Objection Handling'];

function sortCoreCards(cards: FocusCard[]): FocusCard[] {
  return [...cards].sort((a, b) => {
    const aTitle = a.title.split(' — ')[0];
    const bTitle = b.title.split(' — ')[0];
    const aIndex = CORE_ORDER.findIndex(name => aTitle.includes(name));
    const bIndex = CORE_ORDER.findIndex(name => bTitle.includes(name));
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export default function TenantHome() {
  const { tenant, tenantType } = useTenant();
  const { 
    selectedWeekStart, 
    weekLabel, 
    weekRange, 
    canGoPrevious, 
    canGoNext, 
    goToPreviousWeek, 
    goToNextWeek 
  } = useWeekSelection();
  const [selectedCard, setSelectedCard] = useState<FocusCard | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get week start as string for comparison
  const selectedWeekStartStr = formatLocalDate(selectedWeekStart);

  // Filter cards based on tenant packs
  const filteredCards = useMemo(() => {
    if (!tenant) return [];
    
    return focusCards.filter(card => {
      // Filter by week
      if (card.weekStart !== selectedWeekStartStr) return false;
      
      // Filter by enabled packs
      const titleLower = card.title.toLowerCase();
      
      if (titleLower.includes('top focus') && !tenant.packs.topFocus) return false;
      if (titleLower.includes('competitive') && !tenant.packs.competitiveRadar) return false;
      if (titleLower.includes('industry') && !tenant.packs.industrySignals) return false;
      if (titleLower.includes('objection') && !tenant.packs.objectionHandling) return false;
      if (titleLower.includes('skill') && !tenant.packs.skillOfWeek) return false;
      if (titleLower.includes('market presence') && !tenant.packs.marketPresence) return false;
      if (titleLower.includes('pre-meeting') && !tenant.packs.preMeetingPrep) return false;
      
      return true;
    });
  }, [tenant, selectedWeekStartStr]);

  // Group cards by category
  const groupedCards = useMemo(() => {
    const groups = {
      core: [] as FocusCard[],
      improve: [] as FocusCard[],
      reputation: [] as FocusCard[],
    };

    filteredCards.forEach(card => {
      groups[card.category].push(card);
    });

    // Sort core cards in specific order
    groups.core = sortCoreCards(groups.core);

    return groups;
  }, [filteredCards]);

  // Get subtitle based on tenant type
  const getExecuteSubtitle = () => {
    return tenantType === 'partner' ? 'Partner Sales Readiness' : 'Customer Readiness';
  };

  const handleCardListen = (card: FocusCard) => {
    setSelectedCard(card);
    setDrawerOpen(true);
  };

  const handleCardRead = (card: FocusCard) => {
    setSelectedCard(card);
    setDrawerOpen(true);
  };

  if (!tenant) {
    return null;
  }

  // Build jump nav items
  const jumpNavItems = [
    { id: 'group-core', label: 'Core' },
    ...(groupedCards.improve.length > 0 ? [{ id: 'group-improve', label: 'Improve' }] : []),
    ...(groupedCards.reputation.length > 0 ? [{ id: 'group-reputation', label: 'Reputation' }] : []),
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <TenantHeader showGreeting showSearch />

      <main className="px-5 space-y-8">
        {/* Stories Rail */}
        {tenant.packs.stories && (
          <StoriesRail />
        )}

        {/* Focus Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">This Week's Focus Pack</h2>
          </div>
          
          <WeekPicker
            weekLabel={weekLabel}
            weekRange={weekRange}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
          />

          {/* Jump Navigation */}
          <div className="mt-4">
            <JumpNav items={jumpNavItems} />
          </div>

          <div className="space-y-8 mt-6">
            {/* CORE GROUP */}
            {(groupedCards.core.length > 0 || tenant.packs.preMeetingPrep) && (
              <div>
                <FocusGroupLabel 
                  id="group-core"
                  label="Core" 
                  sublabel={getExecuteSubtitle()}
                  variant="primary"
                  className="mb-4"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupedCards.core.map((card) => (
                    <FocusCardComponent
                      key={card.id}
                      card={card}
                      onListen={() => handleCardListen(card)}
                      onRead={() => handleCardRead(card)}
                    />
                  ))}
                  {/* Account Prep Card - 5th in EXECUTE group */}
                  {tenant.packs.preMeetingPrep && (
                    <AccountPrepCard />
                  )}
                </div>
              </div>
            )}

            {groupedCards.core.length > 0 && (groupedCards.improve.length > 0 || groupedCards.reputation.length > 0) && (
              <Separator className="my-6" />
            )}

            {/* IMPROVE GROUP */}
            {groupedCards.improve.length > 0 && (
              <div>
                <FocusGroupLabel 
                  id="group-improve"
                  label="Improve" 
                  variant="secondary"
                  className="mb-4"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupedCards.improve.map((card) => (
                    <FocusCardComponent
                      key={card.id}
                      card={card}
                      onListen={() => handleCardListen(card)}
                      onRead={() => handleCardRead(card)}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedCards.improve.length > 0 && groupedCards.reputation.length > 0 && (
              <Separator className="my-6" />
            )}

            {/* REPUTATION GROUP */}
            {groupedCards.reputation.length > 0 && (
              <div>
                <FocusGroupLabel 
                  id="group-reputation"
                  label="Reputation" 
                  variant="tertiary"
                  className="mb-4"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupedCards.reputation.map((card) => (
                    <FocusCardComponent
                      key={card.id}
                      card={card}
                      onListen={() => handleCardListen(card)}
                      onRead={() => handleCardRead(card)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />

      <PreviewDrawer
        card={selectedCard}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
