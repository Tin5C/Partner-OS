import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { FocusCardComponent } from '@/components/FocusCard';
import { ListenBriefingView } from '@/components/ListenBriefingView';
import { ExecSummaryView } from '@/components/ExecSummaryView';
import { ProjectionMode } from '@/components/ProjectionMode';
import { EpisodeRow } from '@/components/EpisodeRow';
import { StoriesRail } from '@/components/StoriesRail';
import { WeekPicker } from '@/components/WeekPicker';
import { EmptyWeekState } from '@/components/EmptyWeekState';
import { FocusGroupLabel } from '@/components/FocusGroupLabel';
import { JumpNav } from '@/components/JumpNav';
import { Separator } from '@/components/ui/separator';
import { focusCards, FocusCard, focusEpisodes, FocusCategory } from '@/lib/focusCards';
import { continueListening } from '@/lib/data';
import { usePlayer } from '@/contexts/PlayerContext';
import { useWeekSelection } from '@/hooks/useWeekSelection';
import userAvatar from '@/assets/user-avatar.jpg';

// Define the order for Core cards
const coreCardOrder = ['top-focus', 'competitive-radar', 'industry-news', 'objection-handling'];

// Sort function to maintain consistent order within groups
function sortCoreCards(cards: FocusCard[]): FocusCard[] {
  return cards.sort((a, b) => {
    const aIndex = coreCardOrder.findIndex(prefix => a.id.startsWith(prefix));
    const bIndex = coreCardOrder.findIndex(prefix => b.id.startsWith(prefix));
    return aIndex - bIndex;
  });
}

// Jump navigation items
const jumpNavItems = [
  { id: 'group-core', label: 'Core' },
  { id: 'group-improve', label: 'Improve' },
  { id: 'group-reputation', label: 'Reputation' },
];

export default function Home() {
  const { currentEpisode, play } = usePlayer();
  const [selectedCard, setSelectedCard] = useState<FocusCard | null>(null);
  const [listenDrawerOpen, setListenDrawerOpen] = useState(false);
  const [execSummaryOpen, setExecSummaryOpen] = useState(false);
  const [projectionOpen, setProjectionOpen] = useState(false);

  // Week selection state
  const {
    weekLabel,
    weekRange,
    canGoPrevious,
    canGoNext,
    goToPreviousWeek,
    goToNextWeek,
    isDateInWeek,
  } = useWeekSelection();

  // Filter focus cards by selected week
  const filteredCards = useMemo(() => {
    return focusCards.filter((card) => isDateInWeek(card.weekStart));
  }, [isDateInWeek]);

  // Group cards by category
  const groupedCards = useMemo(() => {
    const coreCards = sortCoreCards(filteredCards.filter(c => c.category === 'core'));
    const improveCards = filteredCards.filter(c => c.category === 'improve');
    const reputationCards = filteredCards.filter(c => c.category === 'reputation');
    
    return { core: coreCards, improve: improveCards, reputation: reputationCards };
  }, [filteredCards]);

  const handleListenClick = (card: FocusCard) => {
    setSelectedCard(card);
    // Start playing immediately
    const episode = focusEpisodes[card.id];
    if (episode) {
      play(episode);
    }
    setListenDrawerOpen(true);
  };

  const handleExecSummaryClick = (card: FocusCard) => {
    setSelectedCard(card);
    setExecSummaryOpen(true);
  };

  const handleOpenExecSummaryFromListen = () => {
    setListenDrawerOpen(false);
    setTimeout(() => setExecSummaryOpen(true), 100);
  };

  const handleOpenListenFromExecSummary = () => {
    setExecSummaryOpen(false);
    setTimeout(() => {
      if (selectedCard) {
        const episode = focusEpisodes[selectedCard.id];
        if (episode) {
          play(episode);
        }
      }
      setListenDrawerOpen(true);
    }, 100);
  };

  const handleOpenProjection = () => {
    setListenDrawerOpen(false);
    setExecSummaryOpen(false);
    setTimeout(() => setProjectionOpen(true), 100);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header showGreeting showSearch />

      <main className="px-5 space-y-8 stagger-children">
        {/* Stories Rail - Today's Highlights */}
        <StoriesRail />

        {/* Continue Listening */}
        {continueListening && !currentEpisode && (
          <section className="p-4 rounded-2xl bg-card border border-border shadow-card">
            <h2 className="text-section mb-3">Continue Listening</h2>
            <EpisodeRow 
              episode={continueListening} 
              showProgress 
              progress={continueListening.progress}
            />
          </section>
        )}

        {/* Focus Cards Grid - Command Center */}
        <section>
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={userAvatar} 
              alt="Your focus" 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-border shadow-soft"
            />
            <div>
              <h2 className="text-section text-foreground">This Week's Focus Pack</h2>
              <p className="text-caption text-muted-foreground">What needs attention</p>
            </div>
          </div>

          {/* Week Picker */}
          <WeekPicker
            weekLabel={weekLabel}
            weekRange={weekRange}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
            className="mb-4"
          />

          {/* Jump Navigation */}
          <JumpNav items={jumpNavItems} className="mb-6" />

          {filteredCards.length > 0 ? (
            <div className="space-y-8">
              {/* CORE GROUP */}
              {groupedCards.core.length > 0 && (
                <div>
                  <FocusGroupLabel 
                    id="group-core"
                    label="Core" 
                    sublabel="Customer Readiness"
                    variant="primary"
                    className="mb-4"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {groupedCards.core.map((card) => (
                      <FocusCardComponent
                        key={card.id}
                        card={card}
                        onListen={() => handleListenClick(card)}
                        onRead={() => handleExecSummaryClick(card)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {groupedCards.core.length > 0 && (groupedCards.improve.length > 0 || groupedCards.reputation.length > 0) && (
                <Separator className="my-2" />
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
                        onListen={() => handleListenClick(card)}
                        onRead={() => handleExecSummaryClick(card)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {groupedCards.improve.length > 0 && groupedCards.reputation.length > 0 && (
                <Separator className="my-2" />
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
                        onListen={() => handleListenClick(card)}
                        onRead={() => handleExecSummaryClick(card)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyWeekState />
          )}
        </section>
      </main>

      {/* Listen Briefing View */}
      <ListenBriefingView
        card={selectedCard}
        open={listenDrawerOpen}
        onOpenChange={setListenDrawerOpen}
        onOpenExecSummary={handleOpenExecSummaryFromListen}
        onOpenProjection={handleOpenProjection}
      />

      {/* Exec Summary View */}
      <ExecSummaryView
        card={selectedCard}
        open={execSummaryOpen}
        onOpenChange={setExecSummaryOpen}
        onOpenListenBriefing={handleOpenListenFromExecSummary}
        onOpenProjection={handleOpenProjection}
      />

      {/* Projection Mode */}
      <ProjectionMode
        card={selectedCard}
        open={projectionOpen}
        onOpenChange={setProjectionOpen}
      />

      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
