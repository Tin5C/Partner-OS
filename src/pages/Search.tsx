import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { EpisodeRow } from '@/components/EpisodeRow';
import { PlaylistCard } from '@/components/PlaylistCard';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { EmptyState } from '@/components/EmptyState';
import { allEpisodes, playlists } from '@/lib/data';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredEpisodes = query.trim()
    ? allEpisodes.filter(e => 
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.speaker.toLowerCase().includes(query.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const filteredPlaylists = query.trim()
    ? playlists.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const recentSearches = ['objection handling', 'first national', 'competitive'];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Search header */}
      <header className="sticky top-0 z-30 bg-background safe-top px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search episodes, playlists, tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-12"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-primary font-medium"
          >
            Cancel
          </button>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {!query.trim() ? (
          <>
            {/* Recent searches */}
            <section>
              <h2 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h2>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <SearchIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Trending */}
            <section>
              <h2 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {['manufacturing', 'pricing', 'objection', 'techcorp', 'discovery'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setQuery(topic)}
                    className="px-3 py-1.5 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Results */}
            {filteredEpisodes.length === 0 && filteredPlaylists.length === 0 ? (
              <EmptyState
                icon={<SearchIcon className="w-8 h-8 text-muted-foreground" />}
                title="No results found"
                description={`We couldn't find anything for "${query}". Try a different search.`}
              />
            ) : (
              <>
                {/* Playlists */}
                {filteredPlaylists.length > 0 && (
                  <section>
                    <h2 className="font-semibold mb-3">
                      Playlists ({filteredPlaylists.length})
                    </h2>
                    <div className="space-y-2">
                      {filteredPlaylists.map((playlist) => (
                        <PlaylistCard 
                          key={playlist.id} 
                          playlist={playlist}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Episodes */}
                {filteredEpisodes.length > 0 && (
                  <section>
                    <h2 className="font-semibold mb-3">
                      Episodes ({filteredEpisodes.length})
                    </h2>
                    <div className="space-y-2">
                      {filteredEpisodes.map((episode) => (
                        <EpisodeRow 
                          key={episode.id} 
                          episode={episode}
                          variant="compact"
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}
      </main>

      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
