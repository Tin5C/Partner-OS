import { format } from 'date-fns';
import { MapPin, Calendar, User, Bookmark, BookmarkCheck, Sparkles, CalendarPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventData } from '@/data/mockEvents';

interface EventCardProps {
  event: EventData;
  isSaved: boolean;
  onSave: () => void;
  onGeneratePrep: () => void;
  onAddToCalendar: () => void;
  onClick?: () => void;
  className?: string;
}

export function EventCard({
  event,
  isSaved,
  onSave,
  onGeneratePrep,
  onAddToCalendar,
  onClick,
  className,
}: EventCardProps) {
  const startDate = new Date(event.startDateTime);
  const formattedDate = format(startDate, 'EEE, MMM d');
  const formattedTime = format(startDate, 'h:mm a');

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex flex-col p-5 rounded-2xl text-left',
        'bg-card border border-border shadow-card',
        'hover:shadow-card-hover transition-all duration-200',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {/* Topic pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {event.topics.map((topic) => (
          <span
            key={topic}
            className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-body mb-2 text-foreground line-clamp-2">
        {event.title}
      </h3>

      {/* Date & Time */}
      <div className="flex items-center gap-1.5 text-caption text-muted-foreground mb-1.5">
        <Calendar className="w-3.5 h-3.5" />
        <span>{formattedDate} · {formattedTime}</span>
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-caption text-muted-foreground mb-1.5">
        <MapPin className="w-3.5 h-3.5" />
        <span className="truncate">{event.city} · {event.venue}</span>
      </div>

      {/* Organizer */}
      <div className="flex items-center gap-1.5 text-caption text-muted-foreground mb-3">
        <User className="w-3.5 h-3.5" />
        <span className="truncate">{event.organizer}</span>
      </div>

      {/* Relevance reason */}
      <div className="px-3 py-2 rounded-lg bg-secondary/50 mb-4">
        <p className="text-xs text-muted-foreground italic line-clamp-2">
          ✨ {event.relevanceReason}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave();
          }}
          className={cn(
            'flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium',
            isSaved
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-secondary-foreground border border-border',
            'hover:shadow-card active:scale-[0.98] transition-all duration-200'
          )}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
          <span>{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        {/* Generate Prep button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onGeneratePrep();
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium',
            'bg-primary text-primary-foreground shadow-soft',
            'hover:bg-primary/90 hover:shadow-card active:scale-[0.98] transition-all duration-200'
          )}
        >
          <Sparkles className="w-4 h-4" />
          <span className="truncate">60-sec Prep</span>
        </button>

        {/* Add to calendar button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCalendar();
          }}
          className={cn(
            'flex items-center justify-center p-2 rounded-xl text-xs font-medium',
            'bg-card text-secondary-foreground border border-border',
            'hover:bg-secondary hover:shadow-card active:scale-[0.98] transition-all duration-200'
          )}
          title="Add to calendar"
        >
          <CalendarPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
