import { format } from 'date-fns';
import { X, MapPin, Calendar, User, Bookmark, BookmarkCheck, Sparkles, CalendarPlus, ExternalLink, Users, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventData } from '@/data/mockEvents';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface EventDetailPanelProps {
  event: EventData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaved: boolean;
  onSave: () => void;
  onGeneratePrep: () => void;
  onAddToCalendar: () => void;
}

export function EventDetailPanel({
  event,
  open,
  onOpenChange,
  isSaved,
  onSave,
  onGeneratePrep,
  onAddToCalendar,
}: EventDetailPanelProps) {
  if (!event) return null;

  const startDate = new Date(event.startDateTime);
  const endDate = new Date(event.endDateTime);
  const formattedDate = format(startDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = `${format(startDate, 'h:mm a')} – ${format(endDate, 'h:mm a')}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl overflow-y-auto"
      >
        <SheetHeader className="text-left pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Topic pills */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {event.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {topic}
                  </span>
                ))}
              </div>
              <SheetTitle className="text-xl font-bold">{event.title}</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Key info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{formattedDate}</p>
                <p className="text-muted-foreground">{formattedTime}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{event.venue}</p>
                <p className="text-muted-foreground">{event.city}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <p className="text-foreground">{event.organizer}</p>
            </div>
          </div>

          {/* Relevance */}
          <div className="px-4 py-3 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Why this matches you: </span>
              {event.relevanceReason}
            </p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">About this event</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Agenda
              </h4>
              <ul className="space-y-2">
                {event.agenda.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Who should attend */}
          {event.whoShouldAttend && event.whoShouldAttend.length > 0 && (
            <div>
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Who should attend
              </h4>
              <div className="flex flex-wrap gap-2">
                {event.whoShouldAttend.map((role, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs bg-card border border-border text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* External link */}
          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              View event page
            </a>
          )}
        </div>

        {/* Sticky action buttons */}
        <div className="sticky bottom-0 pt-4 pb-2 bg-background border-t border-border -mx-6 px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className={cn(
                'flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-medium',
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

            <button
              onClick={onGeneratePrep}
              className={cn(
                'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-medium',
                'bg-primary text-primary-foreground shadow-soft',
                'hover:bg-primary/90 hover:shadow-card active:scale-[0.98] transition-all duration-200'
              )}
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate 60-sec Prep</span>
            </button>

            <button
              onClick={onAddToCalendar}
              className={cn(
                'flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-medium',
                'bg-card text-secondary-foreground border border-border',
                'hover:bg-secondary hover:shadow-card active:scale-[0.98] transition-all duration-200'
              )}
            >
              <CalendarPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add to calendar</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
