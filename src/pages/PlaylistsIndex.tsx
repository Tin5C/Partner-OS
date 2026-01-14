import { Header } from '@/components/Header';
import { PlaylistCard } from '@/components/PlaylistCard';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { playlists } from '@/lib/data';

export default function PlaylistsIndex() {
  const categories = [
    { key: 'essentials', label: 'Essentials' },
    { key: 'accounts', label: 'Accounts' },
    { key: 'competitive', label: 'Competitive' },
    { key: 'skills', label: 'Skills' },
    { key: 'wins', label: 'Wins' },
    { key: 'news', label: 'News' },
    { key: 'team', label: 'Team' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header title="Playlists" showSearch />

      <main className="px-4 space-y-6">
        {categories.map((category) => {
          const categoryPlaylists = playlists.filter(p => p.category === category.key);
          if (categoryPlaylists.length === 0) return null;

          return (
            <section key={category.key}>
              <h2 className="font-semibold text-lg mb-3">{category.label}</h2>
              <div className="space-y-2">
                {categoryPlaylists.map((playlist) => (
                  <PlaylistCard 
                    key={playlist.id} 
                    playlist={playlist} 
                    variant="compact"
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
