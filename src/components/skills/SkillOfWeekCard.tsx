// Skill of the Week Card with personalization prompt
import { useState } from 'react';
import { Clock, BookOpen, Headphones, FileText, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useExperience } from '@/contexts/ExperienceContext';
import { useProfile } from '@/hooks/useProfile';
import { getSkillOfTheWeek, getSkillContent } from '@/lib/skillOfWeekLogic';
import { SkillExecSummaryPanel } from './SkillExecSummaryPanel';
import { ListenPlayer } from '@/components/shared';
import { formatLocalDate, useWeekSelection } from '@/hooks/useWeekSelection';

interface SkillOfWeekCardProps {
  onOpenProfile: () => void;
  className?: string;
}

export function SkillOfWeekCard({ onOpenProfile, className }: SkillOfWeekCardProps) {
  const { tenantSlug, audience, tenantConfig } = useExperience();
  const { profile, hasSkills } = useProfile();
  const { selectedWeekStart } = useWeekSelection();
  const weekKey = formatLocalDate(selectedWeekStart);

  const [execSummaryOpen, setExecSummaryOpen] = useState(false);
  const [listenPlayerOpen, setListenPlayerOpen] = useState(false);

  // Get the skill for this week
  const skillOfWeek = hasSkills && profile
    ? getSkillOfTheWeek(tenantSlug, audience, weekKey, profile.skillsToImprove)
    : null;

  const skillContent = skillOfWeek ? getSkillContent(skillOfWeek) : null;

  // If no skills selected, show prompt
  if (!hasSkills) {
    return (
      <div
        className={cn(
          'relative flex flex-col p-5 rounded-2xl text-left',
          'bg-card border border-border shadow-card',
          className
        )}
      >
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shadow-soft">
            <BookOpen className="w-5 h-5 text-foreground/70" />
          </div>
        </div>

        <h3 className="font-semibold text-body mb-1 text-foreground">Skill of the Week</h3>
        <p className="text-caption text-muted-foreground mb-4">
          Personalized to your skills
        </p>

        {/* Prompt to complete profile */}
        <div className="flex-1 flex flex-col items-center justify-center py-4 text-center">
          <User className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            Select skills in your profile to personalize this.
          </p>
          <button
            onClick={onOpenProfile}
            className={cn(
              'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium',
              'bg-primary text-primary-foreground shadow-soft',
              'hover:bg-primary/90 transition-all duration-200'
            )}
          >
            Update profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'relative flex flex-col p-5 rounded-2xl text-left',
          'bg-card border border-border shadow-card',
          'hover:shadow-card-hover transition-all duration-200',
          className
        )}
      >
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center shadow-soft">
            <BookOpen className="w-5 h-5 text-foreground/70" />
          </div>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-body mb-1 text-foreground">Skill of the Week</h3>

        {/* Current Skill */}
        <p className="text-sm font-medium text-primary mb-1 line-clamp-1">
          {skillOfWeek}
        </p>

        {/* Subtitle */}
        <p className="text-caption text-muted-foreground line-clamp-1 mb-4">
          Personalized to your skills
        </p>

        {/* Footer: Note */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            ~10–15 min
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-card text-caption text-muted-foreground border border-border shadow-chip">
            Learning
          </span>
        </div>

        {/* Small note about book source */}
        <p className="text-[10px] text-muted-foreground/70 mb-3 italic">
          Powered by curated book insights
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
          <button
            onClick={() => setListenPlayerOpen(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium',
              'bg-primary text-primary-foreground shadow-soft',
              'hover:bg-primary/90 hover:shadow-card active:scale-[0.98] transition-all duration-200'
            )}
          >
            <Headphones className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Listen Briefing</span>
          </button>
          <button
            onClick={() => setExecSummaryOpen(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium',
              'bg-card text-secondary-foreground border border-border shadow-chip',
              'hover:bg-secondary hover:shadow-card active:scale-[0.98] transition-all duration-200'
            )}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Exec Summary</span>
          </button>
        </div>
      </div>

      {/* Exec Summary Panel */}
      <SkillExecSummaryPanel
        open={execSummaryOpen}
        onOpenChange={setExecSummaryOpen}
        content={skillContent}
        onListenClick={() => {
          setExecSummaryOpen(false);
          setListenPlayerOpen(true);
        }}
      />

      {/* Listen Player - Generating state for MVP */}
      <ListenPlayer
        open={listenPlayerOpen}
        onOpenChange={setListenPlayerOpen}
        title={skillOfWeek || 'Skill of the Week'}
        subtitle={tenantConfig?.displayName || ''}
        audioUrl={undefined} // No actual audio for MVP
        onReadClick={() => {
          setListenPlayerOpen(false);
          setExecSummaryOpen(true);
        }}
      />
    </>
  );
}
