import React, { createContext, useContext, useState, useCallback } from 'react';
import { Episode } from '@/lib/data';

type PlaybackSpeed = 1 | 1.25 | 1.5;

interface PlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  progress: number;
  playbackSpeed: PlaybackSpeed;
  play: (episode: Episode) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (progress: number) => void;
  skip: (seconds: number) => void;
  setSpeed: (speed: PlaybackSpeed) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);

  const play = useCallback((episode: Episode) => {
    if (currentEpisode?.id !== episode.id) {
      setProgress(0);
    }
    setCurrentEpisode(episode);
    setIsPlaying(true);
  }, [currentEpisode]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const seek = useCallback((newProgress: number) => {
    setProgress(Math.max(0, Math.min(100, newProgress)));
  }, []);

  const skip = useCallback((seconds: number) => {
    if (!currentEpisode) return;
    const progressPerSecond = 100 / currentEpisode.duration;
    setProgress(prev => Math.max(0, Math.min(100, prev + seconds * progressPerSecond)));
  }, [currentEpisode]);

  const setSpeed = useCallback((speed: PlaybackSpeed) => {
    setPlaybackSpeed(speed);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        progress,
        playbackSpeed,
        play,
        pause,
        togglePlay,
        seek,
        skip,
        setSpeed,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}
