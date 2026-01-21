import { Play, Clock, Building2, Radar, Newspaper, MessageCircle, UserCircle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusCard as FocusCardType } from '@/lib/focusCards';
import { usePlayer } from '@/contexts/PlayerContext';
import { focusEpisodes } from '@/lib/focusCards';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'building-2': Building2,
  'radar': Radar,
  'newspaper': Newspaper,
  'message-circle': MessageCircle,
  'user-circle': UserCircle,
  'book-open': BookOpen,
};

interface FocusCardProps {
  card: FocusCardType;
  onClick: () => void;
  className?: string;
}

export function FocusCardComponent({ card, onClick, className }: FocusCardProps) {
  const { currentEpisode, isPlaying } = usePlayer();
  const Icon = iconMap[card.icon] || Building2;
  
  const episode = focusEpisodes[card.id];
  const isCurrentCard = currentEpisode?.id === episode?.id;
  const isCardPlaying = isCurrentCard && isPlaying;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col p-4 rounded-2xl bg-card text-left',
        'shadow-card hover:shadow-card-hover transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98]',
        'group',
        className
      )}
    >
      {/* Play icon overlay - visible on hover */}
      <div className={cn(
        'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center',
        'bg-primary text-primary-foreground shadow-md',
        'opacity-0 group-hover:opacity-100 transition-opacity',
        isCardPlaying && 'opacity-100 animate-pulse'
      )}>
        <Play className="w-4 h-4 ml-0.5" />
      </div>

      {/* Icon with gradient */}
      <div className={cn(
        'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
        'bg-gradient-to-br',
        card.gradient
      )}>
        <Icon className="w-6 h-6 text-foreground/70" />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm mb-1 pr-10">{card.title}</h3>
      
      {/* Subtitle */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {card.subtitle}
      </p>

      {/* Tags row */}
      <div className="flex items-center gap-2 flex-wrap mt-auto">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {card.timeEstimate}
        </span>
        {card.tags.slice(0, 1).map((tag, idx) => (
          <span 
            key={idx}
            className="px-2 py-0.5 rounded-full bg-tag/50 text-tag-foreground text-xs"
          >
            {tag.value}
          </span>
        ))}
      </div>

      {/* Playing indicator */}
      {isCardPlaying && (
        <div className="absolute bottom-4 right-4 flex items-center gap-1">
          <span className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
          <span className="w-1 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>
      )}
    </button>
  );
}
