import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Calendar as CalendarIcon, Filter, Bookmark, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventData, mockEvents, filterEvents, ALL_TOPICS, CITIES, EventTopic } from '@/data/mockEvents';
import { trackEvent } from '@/lib/eventsAnalytics';
import { useSavedEvents } from '@/hooks/useSavedEvents';
import { EventCard } from './EventCard';
import { EventDetailPanel } from './EventDetailPanel';
import { EventPrepWizard } from './EventPrepWizard';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface EventsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug?: string;
}

const TIME_WINDOWS = [
  { value: '7', label: 'Next 7 days' },
  { value: '14', label: 'Next 14 days' },
  { value: '30', label: 'Next 30 days' },
];

export function EventsPanel({ open, onOpenChange, tenantSlug }: EventsPanelProps) {
  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('Zurich');
  const [selectedTopics, setSelectedTopics] = useState<EventTopic[]>([]);
  const [timeWindow, setTimeWindow] = useState<string>('14');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Saved events
  const { isSaved, toggleSaved } = useSavedEvents(tenantSlug);

  // Selected event for detail/prep
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [prepWizardOpen, setPrepWizardOpen] = useState(false);
  const [prepEvent, setPrepEvent] = useState<EventData | null>(null);

  // Track view on open
  useEffect(() => {
    if (open) {
      trackEvent('events_view');
    }
  }, [open]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = filterEvents(mockEvents, {
      city: selectedCity === 'All' ? undefined : selectedCity,
      topics: selectedTopics.length > 0 ? selectedTopics : undefined,
      daysAhead: parseInt(timeWindow),
    });

    if (showSavedOnly) {
      events = events.filter((e) => isSaved(e.id));
    }

    return events;
  }, [selectedCity, selectedTopics, timeWindow, showSavedOnly, isSaved]);

  // Handlers
  const handleFilterChange = (type: string, value: unknown) => {
    trackEvent('events_filter_change', { filterType: type, value });
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    handleFilterChange('city', value);
  };

  const handleTimeWindowChange = (value: string) => {
    setTimeWindow(value);
    handleFilterChange('timeWindow', value);
  };

  const handleTopicToggle = (topic: EventTopic) => {
    setSelectedTopics((prev) => {
      const newTopics = prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic];
      handleFilterChange('topics', newTopics);
      return newTopics;
    });
  };

  const handleEventClick = (event: EventData) => {
    trackEvent('event_open', { eventId: event.id, title: event.title });
    setSelectedEvent(event);
    setDetailOpen(true);
  };

  const handleSave = (event: EventData) => {
    const wasSaved = isSaved(event.id);
    const nowSaved = toggleSaved(event.id);
    trackEvent(nowSaved ? 'event_save' : 'event_unsave', { eventId: event.id, title: event.title });
    toast({
      title: nowSaved ? 'Event saved' : 'Event removed',
      description: nowSaved ? 'You can find it in your saved events' : 'Removed from saved events',
    });
  };

  const handleGeneratePrep = (event: EventData) => {
    trackEvent('event_generate_prep', { eventId: event.id, title: event.title });
    setPrepEvent(event);
    setPrepWizardOpen(true);
  };

  const handleAddToCalendar = (event: EventData) => {
    trackEvent('event_add_to_calendar', { eventId: event.id, title: event.title });
    
    // Generate ICS file
    const startDate = new Date(event.startDateTime);
    const endDate = new Date(event.endDateTime);
    
    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Events Module//EN
BEGIN:VEVENT
UID:${event.id}@events
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${event.title}
LOCATION:${event.venue}, ${event.city}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
ORGANIZER:${event.organizer}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: 'Calendar file downloaded',
      description: 'Open the .ics file to add to your calendar',
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="right" 
          className="w-full sm:max-w-2xl p-0 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b border-border bg-background">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Events
              </SheetTitle>
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  showSavedOnly
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                )}
              >
                <Bookmark className="w-4 h-4" />
                Saved
              </button>
            </div>
          </SheetHeader>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-border bg-secondary/30 space-y-3">
            {/* Location + Time row */}
            <div className="flex items-center gap-2">
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger className="w-[140px] bg-background">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All locations</SelectItem>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeWindow} onValueChange={handleTimeWindowChange}>
                <SelectTrigger className="w-[150px] bg-background">
                  <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_WINDOWS.map((tw) => (
                    <SelectItem key={tw.value} value={tw.value}>{tw.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topic chips */}
            <div className="flex flex-wrap gap-2">
              {ALL_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                    selectedTopics.includes(topic)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
                  )}
                >
                  {topic}
                </button>
              ))}
              {selectedTopics.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedTopics([]);
                    handleFilterChange('topics', []);
                  }}
                  className="px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Event list */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {showSavedOnly
                    ? 'No saved events yet'
                    : 'No events match your filters'}
                </p>
                <button
                  onClick={() => {
                    setSelectedTopics([]);
                    setSelectedCity('All');
                    setShowSavedOnly(false);
                  }}
                  className="mt-2 text-sm text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-start">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isSaved={isSaved(event.id)}
                    onSave={() => handleSave(event)}
                    onGeneratePrep={() => handleGeneratePrep(event)}
                    onAddToCalendar={() => handleAddToCalendar(event)}
                    onClick={() => handleEventClick(event)}
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="px-6 py-3 border-t border-border bg-secondary/30 text-center">
            <p className="text-xs text-muted-foreground">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </SheetContent>
      </Sheet>

      {/* Event detail panel */}
      <EventDetailPanel
        event={selectedEvent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        isSaved={selectedEvent ? isSaved(selectedEvent.id) : false}
        onSave={() => selectedEvent && handleSave(selectedEvent)}
        onGeneratePrep={() => {
          if (selectedEvent) {
            setDetailOpen(false);
            handleGeneratePrep(selectedEvent);
          }
        }}
        onAddToCalendar={() => selectedEvent && handleAddToCalendar(selectedEvent)}
      />

      {/* Prep wizard */}
      <EventPrepWizard
        event={prepEvent}
        open={prepWizardOpen}
        onOpenChange={setPrepWizardOpen}
      />
    </>
  );
}
