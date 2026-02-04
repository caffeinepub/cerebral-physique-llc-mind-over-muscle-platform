import { create } from 'zustand';
import { useEffect, useRef } from 'react';

interface MusicPlayerState {
  isPlaying: boolean;
  volume: number;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  toggle: () => void;
}

const useMusicPlayerStore = create<MusicPlayerState>((set) => ({
  isPlaying: false,
  volume: 0.3,
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));

export function useMusicPlayer() {
  const { isPlaying, volume, setIsPlaying, setVolume, toggle } = useMusicPlayerStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      // Create a simple ambient background music using Web Audio API
      // Since we don't have an actual audio file, we'll create a placeholder
      // In production, you would use: audioRef.current = new Audio('/assets/ambient-music.mp3');
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      
      // Try to load the audio file - it will fail silently if not present
      audioRef.current.src = '/assets/ambient-music.mp3';
      audioRef.current.load();
    }

    const audio = audioRef.current;

    // Handle play/pause
    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Audio playback prevented by browser:', error);
          // Browsers often block autoplay - this is expected behavior
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }

    // Update volume
    audio.volume = volume;

    return () => {
      // Cleanup on unmount
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [isPlaying, volume, setIsPlaying]);

  return {
    isPlaying,
    volume,
    setVolume,
    toggle,
  };
}
