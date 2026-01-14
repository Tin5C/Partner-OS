import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Users, Play, TrendingUp, ListMusic } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { AudioPlayer } from '@/components/AudioPlayer';
import { Button } from '@/components/ui/button';
import { playlists, allEpisodes } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'analytics' | 'library'>('analytics');

  // Mock analytics
  const analytics = {
    weeklyActiveListeners: 47,
    totalPlays: 1284,
    avgCompletion: 72,
    topEpisodes: allEpisodes
      .filter(e => e.plays)
      .sort((a, b) => (b.plays || 0) - (a.plays || 0))
      .slice(0, 5),
    topPlaylists: playlists
      .map(p => ({
        ...p,
        totalPlays: p.episodes.reduce((sum, e) => sum + (e.plays || 0), 0)
      }))
      .sort((a, b) => b.totalPlays - a.totalPlays)
      .slice(0, 5),
  };

  const tabs = [
    { key: 'analytics', label: 'Analytics' },
    { key: 'library', label: 'Library' },
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header title="Admin" />

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 bg-muted rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'analytics' | 'library')}
              className={cn(
                'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.key 
                  ? 'bg-background shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 space-y-6">
        {activeTab === 'analytics' && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Weekly Active</span>
                </div>
                <p className="text-2xl font-bold">{analytics.weeklyActiveListeners}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Play className="w-4 h-4" />
                  <span className="text-xs">Total Plays</span>
                </div>
                <p className="text-2xl font-bold">{analytics.totalPlays.toLocaleString()}</p>
              </div>
              <div className="bg-card rounded-xl p-4 shadow-card col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs">Avg. Completion Rate</span>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-bold">{analytics.avgCompletion}%</p>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-progress rounded-full"
                      style={{ width: `${analytics.avgCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Episodes */}
            <section>
              <h2 className="font-semibold mb-3">Top Episodes</h2>
              <div className="bg-card rounded-xl shadow-card divide-y divide-border">
                {analytics.topEpisodes.map((episode, i) => (
                  <div key={episode.id} className="flex items-center gap-3 p-3">
                    <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{episode.title}</p>
                      <p className="text-xs text-muted-foreground">{episode.speaker}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {episode.plays} plays
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Top Playlists */}
            <section>
              <h2 className="font-semibold mb-3">Top Playlists</h2>
              <div className="bg-card rounded-xl shadow-card divide-y divide-border">
                {analytics.topPlaylists.map((playlist, i) => (
                  <div key={playlist.id} className="flex items-center gap-3 p-3">
                    <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}</span>
                    <ListMusic className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{playlist.title}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {playlist.totalPlays} plays
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'library' && (
          <>
            {/* Upload button */}
            <Button 
              onClick={() => navigate('/admin/upload')}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Episode
            </Button>

            {/* Episode library */}
            <section>
              <h2 className="font-semibold mb-3">All Episodes</h2>
              <div className="bg-card rounded-xl shadow-card divide-y divide-border">
                {allEpisodes.slice(0, 10).map((episode) => (
                  <div key={episode.id} className="flex items-center gap-3 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{episode.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {episode.speaker} · {new Date(episode.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">{episode.plays || 0} plays</span>
                      <span className="px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                        Published
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <AudioPlayer />
      <BottomNav />
    </div>
  );
}
