// Partner Expert Corners Rail (Solution Deep Dives)
// Personalized recommendations with filter chips and sorting
// Partner-only feature - not shown in Internal space

import { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Sparkles, ChevronDown } from 'lucide-react';
import { ExpertCornersTile } from './ExpertCornersTile';
import { ExpertCornersViewer } from './ExpertCornersViewer';
import { ExpertCornersLibrary } from './ExpertCornersLibrary';
import { PartnerExpertEpisode, getAllPartnerExpertEpisodes } from '@/data/partnerExpertCorners';
import { usePartnerExpertise } from '@/hooks/usePartnerExpertise';
import { getRecommendedEpisodes, hasPartnerBriefContext, RecommendedEpisode } from '@/lib/partnerRecommendations';
import { PartnerBriefInput } from '@/data/partnerBriefData';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Storage key for partner brief context (to share across components)
const PARTNER_BRIEF_CONTEXT_KEY = 'partner_brief_last_context';
const DOWNRANKED_TOPICS_KEY = 'partner_downranked_topics';

export type FilterOption = 'all' | 'my-projects';
export type SortOption = 'recommended' | 'newest';

interface ExpertCornersRailProps {
  title?: string;
  subtitle?: string;
}

export function ExpertCornersRail({ 
  title = 'Solution deep dives tailored to you',
  subtitle = 'Synthetic explainers based on vendor documentation'
}: ExpertCornersRailProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<PartnerExpertEpisode | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [briefContext, setBriefContext] = useState<Partial<PartnerBriefInput> | null>(null);
  const [downrankedTopics, setDownrankedTopics] = useState<string[]>([]);
  
  // Filter and sort state
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('recommended');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const { progress, topicExpertise, updateProgress, recentlyCompletedTopic, clearRecentlyCompletedTopic, isCompleted, getEpisodeProgress } = usePartnerExpertise();
  
  // Load brief context and downranked topics from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PARTNER_BRIEF_CONTEXT_KEY);
      if (stored) {
        setBriefContext(JSON.parse(stored));
      }
      
      const storedDownranked = localStorage.getItem(DOWNRANKED_TOPICS_KEY);
      if (storedDownranked) {
        setDownrankedTopics(JSON.parse(storedDownranked));
      }
    } catch (e) {
      console.warn('Failed to load context:', e);
    }
  }, []);
  
  // Get all unique topic tags for filter chips
  const allTopics = useMemo(() => {
    const episodes = getAllPartnerExpertEpisodes();
    const topicSet = new Set<string>();
    episodes.forEach(ep => {
      ep.topicTags?.forEach(tag => topicSet.add(tag));
    });
    return Array.from(topicSet).sort();
  }, []);
  
  // Handle topic downranking
  const handleDownrankTopic = (topic: string) => {
    const updated = [...new Set([...downrankedTopics, topic])];
    setDownrankedTopics(updated);
    try {
      localStorage.setItem(DOWNRANKED_TOPICS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save downranked topics:', e);
    }
  };
  
  // Get recommendations with filtering and sorting
  const recommendations = useMemo(() => {
    let recs = getRecommendedEpisodes(briefContext, progress, topicExpertise, 20);
    
    // Apply downranking
    if (downrankedTopics.length > 0) {
      recs = recs.map(rec => {
        const hasDownrankedTopic = rec.episode.topicTags?.some(t => downrankedTopics.includes(t));
        if (hasDownrankedTopic) {
          return { ...rec, priority: rec.priority + 100 };
        }
        return rec;
      }).sort((a, b) => a.priority - b.priority);
    }
    
    // Apply filter
    if (filter === 'my-projects') {
      recs = recs.filter(rec => 
        rec.reason.includes('working on') || 
        rec.reason.includes('detected') ||
        rec.reason === 'Continue watching'
      );
    }
    
    // Apply topic filter
    if (selectedTopic) {
      recs = recs.filter(rec => rec.episode.topicTags?.includes(selectedTopic));
    }
    
    // Apply sorting
    if (sort === 'newest') {
      recs = [...recs].sort((a, b) => 
        new Date(b.episode.publishedAt).getTime() - new Date(a.episode.publishedAt).getTime()
      );
    }
    
    return recs.slice(0, 6);
  }, [briefContext, progress, topicExpertise, downrankedTopics, filter, selectedTopic, sort]);
  
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

  if (recommendations.length === 0 && filter === 'all' && !selectedTopic) {
    return null;
  }

  return (
    <section className="space-y-3">
      {/* Header with Browse All */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
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
      
      {/* Filter chips and sorting controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Main filters */}
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              filter === 'all' && !selectedTopic
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All
          </button>
          <button
            onClick={() => {
              setFilter('my-projects');
              setSelectedTopic(null);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              filter === 'my-projects'
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            My projects
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-5 bg-border" />
        
        {/* Topic chips (scrollable) */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          {allTopics.slice(0, 5).map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedTopic(selectedTopic === topic ? null : topic);
                if (selectedTopic !== topic) setFilter('all');
              }}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                selectedTopic === topic
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
              )}
            >
              {topic}
            </button>
          ))}
        </div>
        
        {/* Spacer */}
        <div className="flex-1" />
        
        {/* Sort dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
              {sort === 'recommended' ? 'Recommended' : 'Newest'}
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSort('recommended')}>
              Recommended
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSort('newest')}>
              Newest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Personalization CTA (if no brief context) */}
      {!hasBriefContext && filter === 'my-projects' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
          <Sparkles className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Create a Customer Brief to personalize recommendations.
          </p>
        </div>
      )}

      {/* Horizontal scrolling rail */}
      {recommendations.length > 0 ? (
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
              matchedSignals={rec.matchedSignals}
              matchedContext={rec.matchedContext}
              isCompleted={isCompleted(rec.episode.id)}
              progressPercent={getEpisodeProgress(rec.episode.id)?.progressPercent}
              onDownrank={handleDownrankTopic}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-muted-foreground text-sm">
          No deep dives match this filter.
        </div>
      )}

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
