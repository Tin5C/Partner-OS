// Partner Expert Corners Library (Browse All view)
// Full-screen drawer showing all episodes with filters

import { useState, useMemo } from 'react';
import { X, Search, Filter, Clock, Check, Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PartnerExpertEpisode, getAllPartnerExpertEpisodes, isSyntheticExplainer } from '@/data/partnerExpertCorners';
import { usePartnerExpertise, TopicExpertise } from '@/hooks/usePartnerExpertise';
import { ExpertiseLevelPill } from './ExpertiseBadge';
import { cn } from '@/lib/utils';

interface ExpertCornersLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectEpisode: (episode: PartnerExpertEpisode) => void;
  topicExpertise: TopicExpertise[];
}

type FilterOption = 'all' | 'in-progress' | 'completed' | 'not-started';

export function ExpertCornersLibrary({
  open,
  onOpenChange,
  onSelectEpisode,
  topicExpertise,
}: ExpertCornersLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterOption>('all');
  const { getEpisodeProgress, isCompleted } = usePartnerExpertise();
  
  const allEpisodes = useMemo(() => getAllPartnerExpertEpisodes(), []);
  
  // Get all unique topics
  const allTopics = useMemo(() => {
    const topics = new Set<string>();
    allEpisodes.forEach(ep => {
      ep.topicTags?.forEach(t => topics.add(t));
    });
    return Array.from(topics).sort();
  }, [allEpisodes]);
  
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // Filter and search episodes
  const filteredEpisodes = useMemo(() => {
    let result = allEpisodes;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ep => 
        ep.title.toLowerCase().includes(query) ||
        ep.topicTags?.some(t => t.toLowerCase().includes(query)) ||
        ep.vendorTag.toLowerCase().includes(query)
      );
    }
    
    // Topic filter
    if (selectedTopic) {
      result = result.filter(ep => ep.topicTags?.includes(selectedTopic));
    }
    
    // Progress filter
    if (filter !== 'all') {
      result = result.filter(ep => {
        const progress = getEpisodeProgress(ep.id);
        const completed = isCompleted(ep.id);
        
        switch (filter) {
          case 'completed':
            return completed;
          case 'in-progress':
            return progress && progress.progressPercent > 0 && !completed;
          case 'not-started':
            return !progress || progress.progressPercent === 0;
          default:
            return true;
        }
      });
    }
    
    return result;
  }, [allEpisodes, searchQuery, selectedTopic, filter, getEpisodeProgress, isCompleted]);
  
  const handleSelectEpisode = (episode: PartnerExpertEpisode) => {
    onSelectEpisode(episode);
    onOpenChange(false);
  };
  
  // Get expertise level for a topic
  const getTopicExpertise = (topic: string) => {
    return topicExpertise.find(te => te.topic === topic)?.level || 'none';
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Expert Corners Library</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search explainers..."
              className="pl-9 h-9"
            />
          </div>
          
          {/* Filter pills */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {(['all', 'in-progress', 'completed', 'not-started'] as FilterOption[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f === 'completed' ? 'Completed' : 'Not Started'}
              </button>
            ))}
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">
            {/* Topic sections */}
            {allTopics.map((topic) => {
              const topicEpisodes = filteredEpisodes.filter(ep => ep.topicTags?.includes(topic));
              if (topicEpisodes.length === 0) return null;
              
              const expertiseLevel = getTopicExpertise(topic);
              
              return (
                <div key={topic} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{topic}</h3>
                    <ExpertiseLevelPill level={expertiseLevel} />
                    <span className="text-xs text-muted-foreground">
                      {topicEpisodes.length} {topicEpisodes.length === 1 ? 'episode' : 'episodes'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {topicEpisodes.map((episode) => {
                      const progress = getEpisodeProgress(episode.id);
                      const completed = isCompleted(episode.id);
                      const isSynthetic = isSyntheticExplainer(episode);
                      
                      return (
                        <button
                          key={episode.id}
                          onClick={() => handleSelectEpisode(episode)}
                          className={cn(
                            "w-full flex items-start gap-3 p-3 rounded-xl border border-border",
                            "bg-card hover:bg-muted/50 transition-colors text-left"
                          )}
                        >
                          {/* Thumbnail */}
                          <div className="relative flex-shrink-0 w-20 aspect-video rounded-lg overflow-hidden bg-muted">
                            <img
                              src={episode.coverImageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            {/* Duration */}
                            <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/70 rounded text-[9px] text-white font-medium">
                              {episode.durationMinutes}m
                            </span>
                            {/* Progress overlay */}
                            {progress && progress.progressPercent > 0 && (
                              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/30">
                                <div 
                                  className="h-full bg-primary"
                                  style={{ width: `${progress.progressPercent}%` }}
                                />
                              </div>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-1.5">
                              <p className="text-sm font-medium line-clamp-2">{episode.title}</p>
                              {completed && (
                                <Check className="flex-shrink-0 w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {isSynthetic && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                  <Sparkles className="w-3 h-3" />
                                  Explainer
                                </span>
                              )}
                              <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-secondary-foreground">
                                {episode.vendorTag}
                              </span>
                              {progress && !completed && (
                                <span className="text-[10px] text-muted-foreground">
                                  {Math.round(progress.progressPercent)}% watched
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {filteredEpisodes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No episodes match your filters.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
