import { useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { FocusCardComponent } from '@/components/FocusCard';
import { PreviewDrawer } from '@/components/PreviewDrawer';
import { EpisodeRow } from '@/components/EpisodeRow';
import { focusCards, FocusCard } from '@/lib/focusCards';
import { continueListening } from '@/lib/data';
import { usePlayer } from '@/contexts/PlayerContext';

export default function Home() {
  const { currentEpisode } = usePlayer();
  const [selectedCard, setSelectedCard] = useState<FocusCard | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCardClick = (card: FocusCard) => {
    setSelectedCard(card);
    setDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header showGreeting showSearch />

      <main className="px-4 space-y-6 stagger-children">
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

        {/* Focus Cards Grid */}
        <section>
          <h2 className="font-semibold text-lg mb-3">Your Focus</h2>
          <div className="grid grid-cols-2 gap-3">
            {focusCards.map((card) => (
              <FocusCardComponent
                key={card.id}
                card={card}
                onClick={() => handleCardClick(card)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Preview Drawer */}
      <PreviewDrawer
        card={selectedCard}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
