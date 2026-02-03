// Partner Expert Corners Rail
// Horizontal scrolling rail of video-first expert episodes

import { useState } from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ExpertCornersTile } from './ExpertCornersTile';
import { ExpertCornersViewer } from './ExpertCornersViewer';
import { getAllPartnerExpertEpisodes, PartnerExpertEpisode } from '@/data/partnerExpertCorners';
import { cn } from '@/lib/utils';

interface ExpertCornersRailProps {
  title?: string;
  subtitle?: string;
}

export function ExpertCornersRail({ 
  title = 'Expert Corners',
  subtitle = 'Deep-dive video sessions from vendor experts.'
}: ExpertCornersRailProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<PartnerExpertEpisode | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const episodes = getAllPartnerExpertEpisodes();

  const handleEpisodeClick = (episode: PartnerExpertEpisode) => {
    setSelectedEpisode(episode);
    setViewerOpen(true);
  };

  if (episodes.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} />

      {/* Horizontal scrolling rail */}
      <div 
        className={cn(
          "flex gap-4 overflow-x-auto pb-2 -mx-5 px-5",
          "scrollbar-none snap-x snap-mandatory",
          "lg:-mx-8 lg:px-8"
        )}
      >
        {episodes.map((episode) => (
          <ExpertCornersTile
            key={episode.id}
            episode={episode}
            onClick={() => handleEpisodeClick(episode)}
          />
        ))}
      </div>

      {/* Video Viewer */}
      <ExpertCornersViewer
        episode={selectedEpisode}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </section>
  );
}
