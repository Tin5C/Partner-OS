import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { FocusCardComponent } from '@/components/FocusCard';
import { PreviewDrawer } from '@/components/PreviewDrawer';
import { ReadDrawer } from '@/components/ReadDrawer';
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
  const [readDrawerOpen, setReadDrawerOpen] = useState(false);

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

  const handleReadClick = (card: FocusCard) => {
    setSelectedCard(card);
    setReadDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header showGreeting showSearch />

      <main className="px-4 space-y-6 stagger-children">
        {/* Stories Rail - Today's Highlights */}
        <StoriesRail />

        {/* Continue Listening */}
        {continueListening && !currentEpisode && (
          <section>
            <h2 className="font-semibold text-lg mb-3">Continue Listening</h2>
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
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={userAvatar} 
              alt="Your focus" 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
            />
            <div>
              <h2 className="font-semibold text-base leading-tight">Your Focus</h2>
              <p className="text-xs text-muted-foreground">What needs attention</p>
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

          {/* Focus Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <FocusCardComponent
                  key={card.id}
                  card={card}
                  onListen={() => handleListenClick(card)}
                  onRead={() => handleReadClick(card)}
                />
              ))
            ) : (
              <EmptyWeekState />
            )}
          </div>
        </section>
      </main>

      {/* Listen Drawer (audio-focused) */}
      <PreviewDrawer
        card={selectedCard}
        open={listenDrawerOpen}
        onOpenChange={setListenDrawerOpen}
      />

      {/* Read Drawer (reading-focused) */}
      <ReadDrawer
        card={selectedCard}
        open={readDrawerOpen}
        onOpenChange={setReadDrawerOpen}
      />

      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
