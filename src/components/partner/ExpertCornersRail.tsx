// Partner Expert Corners Rail
// Personalized recommendations based on Partner Brief context + expertise
// Partner-only feature - not shown in Internal space

import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ExpertCornersTile } from './ExpertCornersTile';
import { ExpertCornersViewer } from './ExpertCornersViewer';
import { ExpertCornersLibrary } from './ExpertCornersLibrary';
import { PartnerExpertEpisode } from '@/data/partnerExpertCorners';
import { usePartnerExpertise } from '@/hooks/usePartnerExpertise';
import { getRecommendedEpisodes, hasPartnerBriefContext, RecommendedEpisode } from '@/lib/partnerRecommendations';
import { PartnerBriefInput } from '@/data/partnerBriefData';
import { cn } from '@/lib/utils';

// Storage key for partner brief context (to share across components)
const PARTNER_BRIEF_CONTEXT_KEY = 'partner_brief_last_context';

interface ExpertCornersRailProps {
  title?: string;
  subtitle?: string;
}

export function ExpertCornersRail({ 
  title = 'Recommended based on your projects',
  subtitle = 'Synthetic explainers based on vendor documentation'
}: ExpertCornersRailProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<PartnerExpertEpisode | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [briefContext, setBriefContext] = useState<Partial<PartnerBriefInput> | null>(null);
  
  const { progress, topicExpertise, updateProgress, recentlyCompletedTopic, clearRecentlyCompletedTopic, isCompleted, getEpisodeProgress } = usePartnerExpertise();
  
  // Load brief context from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PARTNER_BRIEF_CONTEXT_KEY);
      if (stored) {
        setBriefContext(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load brief context:', e);
    }
  }, []);
  
  // Get recommended episodes
  const recommendations = useMemo(() => {
    return getRecommendedEpisodes(briefContext, progress, topicExpertise, 6);
  }, [briefContext, progress, topicExpertise]);
  
  const hasBriefContext = hasPartnerBriefContext(briefContext);

  const handleEpisodeClick = (episode: PartnerExpertEpisode) => {
    setSelectedEpisode(episode);
    setViewerOpen(true);
  };

  const handleLibrarySelect = (episode: PartnerExpertEpisode) => {
    setSelectedEpisode(episode);
    setLibraryOpen(false);
    setViewerOpen(true);
  };

  if (recommendations.length === 0) {
    return null;
  }
  
  // Dynamic title based on context
  const displayTitle = hasBriefContext 
    ? 'Recommended based on your projects'
    : 'Expert Corners';
  
  const displaySubtitle = hasBriefContext
    ? undefined // Hide subtitle when personalized
    : 'Synthetic explainers based on vendor documentation';

  return (
    <section>
      {/* Header with Browse All */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">{displayTitle}</h2>
          {displaySubtitle && (
            <p className="text-sm text-muted-foreground">{displaySubtitle}</p>
          )}
        </div>
        <button
          onClick={() => setLibraryOpen(true)}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Browse all
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      {/* Personalization CTA (if no brief context) */}
      {!hasBriefContext && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-muted/50 border border-border">
          <Sparkles className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Create a Customer Brief to personalize recommendations.
          </p>
        </div>
      )}

      {/* Horizontal scrolling rail */}
      <div 
        className={cn(
          "flex gap-4 overflow-x-auto pb-2 -mx-5 px-5",
          "scrollbar-none snap-x snap-mandatory",
          "lg:-mx-8 lg:px-8"
        )}
      >
        {recommendations.map((rec) => (
          <ExpertCornersTile
            key={rec.episode.id}
            episode={rec.episode}
            onClick={() => handleEpisodeClick(rec.episode)}
            reason={rec.reason}
            isCompleted={isCompleted(rec.episode.id)}
            progressPercent={getEpisodeProgress(rec.episode.id)?.progressPercent}
          />
        ))}
      </div>

      {/* Video Viewer */}
      <ExpertCornersViewer
        episode={selectedEpisode}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onProgressUpdate={updateProgress}
        recentlyCompletedTopic={recentlyCompletedTopic}
        onClearCompletedTopic={clearRecentlyCompletedTopic}
      />
      
      {/* Library Browser */}
      <ExpertCornersLibrary
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        onSelectEpisode={handleLibrarySelect}
        topicExpertise={topicExpertise}
      />
    </section>
  );
}

// Export helper function for other components to save brief context
export function savePartnerBriefContext(context: Partial<PartnerBriefInput>) {
  try {
    localStorage.setItem(PARTNER_BRIEF_CONTEXT_KEY, JSON.stringify(context));
  } catch (e) {
    console.warn('Failed to save brief context:', e);
  }
}
