// Partner-only recommendation logic for Expert Corners
// Ranks episodes based on: continue > project match > learning goals > fallback

import { PartnerExpertEpisode, getAllPartnerExpertEpisodes } from '@/data/partnerExpertCorners';
import { EpisodeProgress, TopicExpertise } from '@/hooks/usePartnerExpertise';
import { PartnerBriefInput } from '@/data/partnerBriefData';

export interface RecommendedEpisode {
  episode: PartnerExpertEpisode;
  reason: string;
  priority: number; // Lower = higher priority
}

// Get recommendation reason as a short string
function getRecommendationReason(
  episode: PartnerExpertEpisode,
  context: {
    isInProgress: boolean;
    matchedDealMotion?: string;
    matchedSpecificArea?: string;
    matchedSignals?: string[];
    matchedExpertise?: string;
  }
): string {
  if (context.isInProgress) {
    return 'Continue watching';
  }
  if (context.matchedSpecificArea) {
    return `Because you're working on: ${context.matchedSpecificArea}`;
  }
  if (context.matchedSignals && context.matchedSignals.length > 0) {
    return `Because we detected: ${context.matchedSignals.slice(0, 2).join(' + ')}`;
  }
  if (context.matchedDealMotion) {
    return `Relevant to ${context.matchedDealMotion} motion`;
  }
  if (context.matchedExpertise) {
    return `Next step in ${context.matchedExpertise}`;
  }
  return 'Trending for partners';
}

// Check if episode matches deal motion
function matchesDealMotion(episode: PartnerExpertEpisode, dealMotion: string): boolean {
  if (!dealMotion || !episode.topicTags) return false;
  
  const motionKeywords: Record<string, string[]> = {
    'ai-copilot': ['copilot', 'ai', 'azure ai', 'responsible ai'],
    'migration': ['migration', 'modernization', 'data readiness'],
    'security': ['security', 'governance', 'compliance'],
    'data-platform': ['data', 'analytics', 'fabric', 'synapse'],
  };
  
  const keywords = motionKeywords[dealMotion] || [];
  return episode.topicTags.some(tag => 
    keywords.some(kw => tag.toLowerCase().includes(kw))
  );
}

// Check if episode matches specific area text
function matchesSpecificArea(episode: PartnerExpertEpisode, specificArea: string): boolean {
  if (!specificArea || !episode.topicTags) return false;
  
  const areaLower = specificArea.toLowerCase();
  return episode.topicTags.some(tag => 
    tag.toLowerCase().includes(areaLower) || areaLower.includes(tag.toLowerCase())
  ) || episode.title.toLowerCase().includes(areaLower);
}

// Check if episode matches extracted signals
function matchesSignals(episode: PartnerExpertEpisode, signals: string[]): string[] {
  if (!signals.length || !episode.topicTags) return [];
  
  const matched: string[] = [];
  const episodeText = [
    ...episode.topicTags,
    episode.title,
    episode.vendorTag,
  ].join(' ').toLowerCase();
  
  for (const signal of signals) {
    if (episodeText.includes(signal.toLowerCase())) {
      matched.push(signal);
    }
  }
  
  return matched;
}

// Get recommended episodes based on context
export function getRecommendedEpisodes(
  briefContext: Partial<PartnerBriefInput> | null,
  progress: Record<string, EpisodeProgress>,
  topicExpertise: TopicExpertise[],
  maxCount: number = 6
): RecommendedEpisode[] {
  const allEpisodes = getAllPartnerExpertEpisodes();
  const recommendations: RecommendedEpisode[] = [];
  
  // Extract signals from brief context
  const extractedSignals: string[] = [];
  if (briefContext?.evidence?.extractedSignals) {
    const { applications, architecture, licenses } = briefContext.evidence.extractedSignals;
    extractedSignals.push(
      ...applications.map(s => s.label),
      ...architecture.map(s => s.label),
      ...licenses.map(s => s.label)
    );
  }
  
  for (const episode of allEpisodes) {
    const episodeProgress = progress[episode.id];
    const isInProgress = episodeProgress && episodeProgress.progressPercent > 0 && !episodeProgress.completed;
    const isCompleted = episodeProgress?.completed ?? false;
    
    let priority = 100; // Default priority (fallback)
    let matchedDealMotion: string | undefined;
    let matchedSpecificArea: string | undefined;
    let matchedSignals: string[] = [];
    let matchedExpertise: string | undefined;
    
    // Priority 1: Continue watching (in progress)
    if (isInProgress) {
      priority = 1;
    } 
    // Skip completed unless we have no other recommendations
    else if (!isCompleted) {
      // Priority 2: Specific area match
      if (briefContext?.specificArea && matchesSpecificArea(episode, briefContext.specificArea)) {
        priority = Math.min(priority, 10);
        matchedSpecificArea = briefContext.specificArea;
      }
      
      // Priority 3: Extracted signals match
      matchedSignals = matchesSignals(episode, extractedSignals);
      if (matchedSignals.length > 0) {
        priority = Math.min(priority, 20);
      }
      
      // Priority 4: Deal motion match
      if (briefContext?.dealMotion && matchesDealMotion(episode, briefContext.dealMotion)) {
        priority = Math.min(priority, 30);
        matchedDealMotion = briefContext.dealMotion;
      }
      
      // Priority 5: Next step based on expertise (not already recognized)
      const relevantExpertise = topicExpertise.find(te => 
        te.level !== 'recognized' && 
        episode.topicTags?.some(t => t === te.topic)
      );
      if (relevantExpertise) {
        priority = Math.min(priority, 40);
        matchedExpertise = relevantExpertise.topic;
      }
      
      // Priority 6: Skip beginner content for recognized topics
      const recognizedTopics = topicExpertise
        .filter(te => te.level === 'recognized')
        .map(te => te.topic);
      if (recognizedTopics.some(t => episode.topicTags?.includes(t))) {
        priority = Math.max(priority, 80); // Push down
      }
    } else {
      // Completed episodes go to the end
      priority = 200;
    }
    
    const reason = getRecommendationReason(episode, {
      isInProgress,
      matchedDealMotion,
      matchedSpecificArea,
      matchedSignals,
      matchedExpertise,
    });
    
    recommendations.push({
      episode,
      reason,
      priority,
    });
  }
  
  // Sort by priority, then by date
  recommendations.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return new Date(b.episode.publishedAt).getTime() - new Date(a.episode.publishedAt).getTime();
  });
  
  return recommendations.slice(0, maxCount);
}

// Check if user has any brief context
export function hasPartnerBriefContext(briefContext: Partial<PartnerBriefInput> | null): boolean {
  if (!briefContext) return false;
  return !!(
    briefContext.dealMotion ||
    briefContext.specificArea ||
    briefContext.evidence?.extractedSignals?.applications?.length ||
    briefContext.evidence?.extractedSignals?.architecture?.length
  );
}
