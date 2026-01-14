import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, ListMusic, Play } from 'lucide-react';
import { Header } from '@/components/Header';
import { EpisodeRow } from '@/components/EpisodeRow';
import { Tag } from '@/components/Tag';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { playlists } from '@/lib/data';
import { usePlayer } from '@/contexts/PlayerContext';
import { cn } from '@/lib/utils';

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play } = usePlayer();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const playlist = playlists.find(p => p.id === id);

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <EmptyState
          icon={<ListMusic className="w-8 h-8 text-muted-foreground" />}
          title="Playlist not found"
          description="This playlist doesn't exist or has been removed."
          action={
            <Button onClick={() => navigate('/')}>
              Go home
            </Button>
          }
        />
      </div>
    );
  }

  // Get all unique tags from episodes
  const allTags = Array.from(
    new Set(playlist.episodes.flatMap(e => e.tags))
  ).sort();

  // Filter episodes by tag
  const filteredEpisodes = activeTag
    ? playlist.episodes.filter(e => e.tags.includes(activeTag))
    : playlist.episodes;

  const handlePlayAll = () => {
    if (filteredEpisodes.length > 0) {
      play(filteredEpisodes[0]);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Custom header with back button */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm safe-top px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold truncate flex-1">{playlist.title}</h1>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Playlist hero */}
        <section className="bg-card rounded-2xl p-5 shadow-card">
          <p className="text-sm text-muted-foreground mb-3">
            {playlist.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <ListMusic className="w-4 h-4" />
              {playlist.episodeCount} episodes
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {playlist.totalMinutes} min
            </span>
          </div>
          <Button onClick={handlePlayAll} className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Play all
          </Button>
        </section>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <section className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 custom-scrollbar">
            <Tag
              variant={activeTag === null ? 'active' : 'outline'}
              size="md"
              onClick={() => setActiveTag(null)}
            >
              All
            </Tag>
            {allTags.map((tag) => (
              <Tag
                key={tag}
                variant={activeTag === tag ? 'active' : 'outline'}
                size="md"
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Tag>
            ))}
          </section>
        )}

        {/* Episodes list */}
        <section className="space-y-3">
          {filteredEpisodes.length === 0 ? (
            <EmptyState
              title="No episodes match"
              description="No episodes match these tags. Try removing a filter."
              action={
                <Button variant="outline" onClick={() => setActiveTag(null)}>
                  Clear filter
                </Button>
              }
            />
          ) : (
            filteredEpisodes.map((episode) => (
              <EpisodeRow key={episode.id} episode={episode} />
            ))
          )}
        </section>
      </main>

      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
