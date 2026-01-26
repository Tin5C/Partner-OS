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
import { focusCards, FocusCard, focusEpisodes } from '@/lib/focusCards';
import { continueListening } from '@/lib/data';
import { usePlayer } from '@/contexts/PlayerContext';
import { useWeekSelection } from '@/hooks/useWeekSelection';
import userAvatar from '@/assets/user-avatar.jpg';

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
              <h2 className="text-section text-foreground">Your Focus</h2>
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
            className="mb-5"
          />

          {/* Focus Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <FocusCardComponent
                  key={card.id}
                  card={card}
                  onListen={() => handleListenClick(card)}
                  onRead={() => handleExecSummaryClick(card)}
                />
              ))
            ) : (
              <EmptyWeekState />
            )}
          </div>
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
