import { Header } from '@/components/Header';
import { PlaylistCard } from '@/components/PlaylistCard';
import { EpisodeRow } from '@/components/EpisodeRow';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Clock, Play } from 'lucide-react';
import { playlists, trendingEpisodes, continueListening } from '@/lib/data';
import { usePlayer } from '@/contexts/PlayerContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const { play, currentEpisode } = usePlayer();
  
  const thisWeeksEssentials = playlists.find(p => p.id === 'this-week');
  const otherPlaylists = playlists.filter(p => p.id !== 'this-week');

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header showGreeting showSearch />

      <main className="px-4 space-y-6 stagger-children">
        {/* This Week's Essentials */}
        {thisWeeksEssentials && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-lg">This Week's Essentials</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {thisWeeksEssentials.totalMinutes} minutes total
                </p>
              </div>
              <button
                onClick={() => navigate(`/playlist/${thisWeeksEssentials.id}`)}
                className="text-sm text-primary font-medium hover:underline"
              >
                View all
              </button>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 custom-scrollbar">
              {thisWeeksEssentials.episodes.slice(0, 5).map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => play(episode)}
                  className="flex-shrink-0 w-36 p-3 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <Play className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs line-clamp-2 mb-1">
                    {episode.title}
                  </h4>
                  <p className="text-2xs text-muted-foreground">
                    {Math.ceil(episode.duration / 60)} min
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Continue Listening */}
        {continueListening && !currentEpisode && (
          <section>
            <h2 className="font-semibold text-lg mb-3">Continue Listening</h2>
            <EpisodeRow 
              episode={continueListening} 
              showProgress 
              progress={continueListening.progress}
            />
          </section>
        )}

        {/* Playlist Grid */}
        <section>
          <h2 className="font-semibold text-lg mb-3">Browse</h2>
          <div className="grid grid-cols-2 gap-3">
            {otherPlaylists.slice(0, 8).map((playlist) => (
              <PlaylistCard 
                key={playlist.id} 
                playlist={playlist} 
              />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section>
          <h2 className="font-semibold text-lg mb-3">Trending Internally</h2>
          <div className="space-y-2">
            {trendingEpisodes.map((episode) => (
              <EpisodeRow 
                key={episode.id} 
                episode={episode} 
                variant="trending"
              />
            ))}
          </div>
        </section>
      </main>

      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
