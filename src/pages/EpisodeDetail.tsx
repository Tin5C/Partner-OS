import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, MessageCircle, Check, Headphones, User, Calendar } from 'lucide-react';
import { Tag } from '@/components/Tag';
import { EpisodeRow } from '@/components/EpisodeRow';
import { AudioPlayer } from '@/components/AudioPlayer';
import { BottomNav } from '@/components/BottomNav';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { allEpisodes, playlists, formatDuration } from '@/lib/data';
import { usePlayer } from '@/contexts/PlayerContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function EpisodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play, currentEpisode } = usePlayer();
  const [copied, setCopied] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [question, setQuestion] = useState('');

  const episode = allEpisodes.find(e => e.id === id);
  const playlist = episode ? playlists.find(p => p.id === episode.playlistId) : null;

  if (!episode || !playlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon={<Headphones className="w-8 h-8 text-muted-foreground" />}
          title="Episode not found"
          description="This episode doesn't exist or has been removed."
          action={
            <Button onClick={() => navigate('/')}>
              Go home
            </Button>
          }
        />
      </div>
    );
  }

  // Get "next up" episodes from same playlist
  const episodeIndex = playlist.episodes.findIndex(e => e.id === episode.id);
  const nextUpEpisodes = playlist.episodes
    .slice(episodeIndex + 1)
    .concat(playlist.episodes.slice(0, episodeIndex))
    .slice(0, 3);

  const isObjectionOrWin = episode.tags.includes('objection') || 
                           episode.tags.includes('win') || 
                           episode.tags.includes('talk-track');

  const handleCopyTalkTrack = () => {
    const talkTrack = episode.takeaways.join('\n• ');
    navigator.clipboard.writeText(`Talk track: ${episode.title}\n\n• ${talkTrack}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendQuestion = () => {
    // In real app, this would submit the question
    setQuestionOpen(false);
    setQuestion('');
  };

  // Auto-play if not already playing
  if (currentEpisode?.id !== episode.id) {
    // We don't auto-play to avoid unexpected audio
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm safe-top px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{playlist.title}</p>
          </div>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Episode header */}
        <section className="space-y-4">
          <h1 className="text-xl font-bold">{episode.title}</h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {episode.speaker}
              {episode.speakerRole && (
                <span className="text-xs">· {episode.speakerRole}</span>
              )}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(episode.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span>{formatDuration(episode.duration)}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {episode.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </section>

        {/* Audio player */}
        <section>
          <AudioPlayer variant="full" />
          <Button 
            onClick={() => play(episode)} 
            variant="outline" 
            className="w-full mt-3"
          >
            <Headphones className="w-4 h-4 mr-2" />
            Listen Briefing
          </Button>
        </section>

        {/* Takeaways */}
        <section className="bg-card rounded-2xl p-5 shadow-card">
          <h2 className="font-semibold mb-3">Key Takeaways</h2>
          <ul className="space-y-2">
            {episode.takeaways.map((takeaway, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-primary font-medium flex-shrink-0">•</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Actions */}
        <section className="flex gap-3">
          {isObjectionOrWin && (
            <Button
              variant="outline"
              onClick={handleCopyTalkTrack}
              className="flex-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy talk track
                </>
              )}
            </Button>
          )}
          
          <Sheet open={questionOpen} onOpenChange={setQuestionOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send a question
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl">
              <SheetHeader>
                <SheetTitle className="text-left">Ask a question</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Your question will be sent to the content team for follow-up.
                </p>
                <Textarea
                  placeholder="What would you like to know more about?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                />
                <Button 
                  onClick={handleSendQuestion} 
                  className="w-full"
                  disabled={!question.trim()}
                >
                  Send question
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </section>

        {/* Next up */}
        {nextUpEpisodes.length > 0 && (
          <section>
            <h2 className="font-semibold mb-3">Next Up</h2>
            <div className="space-y-2">
              {nextUpEpisodes.map((ep) => (
                <EpisodeRow key={ep.id} episode={ep} variant="compact" />
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
