// Trending Packs Section for Partner homepage
// Displays time-bound, opinionated themes in a scannable grid

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { getTrendingPacks, TrendingPack } from '@/data/partnerTrendingPacks';
import { TrendingPackCard } from './TrendingPackCard';
import { TrendingPackViewer } from './TrendingPackViewer';
import { SectionHeader } from '@/components/shared';

interface TrendingPacksSectionProps {
  title?: string;
  subtitle?: string;
  maxItems?: number;
}

export function TrendingPacksSection({ 
  title = 'Trending Packs',
  subtitle = 'What partners are talking about right now',
  maxItems = 5,
}: TrendingPacksSectionProps) {
  const [selectedPack, setSelectedPack] = useState<TrendingPack | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const packs = getTrendingPacks(maxItems);

  const handleOpenPack = (pack: TrendingPack) => {
    setSelectedPack(pack);
    setViewerOpen(true);
  };

  const handlePlayPack = (pack: TrendingPack) => {
    // In production, this would open an audio player
    console.log('Play pack:', pack.id);
  };

  if (packs.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeader 
          title={title}
          subtitle={subtitle}
        />
        {packs.length >= maxItems && (
          <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Browse all
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of trending pack cards - 2 columns on mobile, 3-4 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {packs.map((pack) => (
          <TrendingPackCard
            key={pack.id}
            pack={pack}
            onOpen={() => handleOpenPack(pack)}
            onPlay={pack.hasAudio ? () => handlePlayPack(pack) : undefined}
          />
        ))}
      </div>

      {/* Viewer panel */}
      <TrendingPackViewer
        pack={selectedPack}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onPlay={selectedPack?.hasAudio ? () => handlePlayPack(selectedPack) : undefined}
      />
    </section>
  );
}
