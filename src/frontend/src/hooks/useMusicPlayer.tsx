import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MusicPlayerState {
  isPlaying: boolean;
  volume: number;
  userMuted: boolean;
  audioElement: HTMLAudioElement | null;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (volume: number) => void;
  setUserMuted: (muted: boolean) => void;
  setAudioElement: (audio: HTMLAudioElement | null) => void;
  toggle: () => void;
  play: () => Promise<void>;
  pause: () => void;
}

export const useMusicPlayerStore = create<MusicPlayerState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      volume: 0.15, // Low volume for subtle background music
      userMuted: false,
      audioElement: null,
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setVolume: (volume) => {
        set({ volume });
        const audio = get().audioElement;
        if (audio) {
          audio.volume = volume;
        }
      },
      setUserMuted: (muted) => set({ userMuted: muted }),
      setAudioElement: (audio) => set({ audioElement: audio }),
      toggle: () => {
        const state = get();
        const newPlayingState = !state.isPlaying;
        set({ isPlaying: newPlayingState, userMuted: !newPlayingState });
        
        if (newPlayingState) {
          state.play();
        } else {
          state.pause();
        }
      },
      play: async () => {
        const audio = get().audioElement;
        if (audio) {
          try {
            await audio.play();
            set({ isPlaying: true });
          } catch (error) {
            console.log('Audio playback prevented by browser:', error);
            set({ isPlaying: false });
          }
        }
      },
      pause: () => {
        const audio = get().audioElement;
        if (audio) {
          audio.pause();
          set({ isPlaying: false });
        }
      },
    }),
    {
      name: 'music-player-storage',
      partialize: (state) => ({ 
        volume: state.volume, 
        userMuted: state.userMuted 
      }),
    }
  )
);

export function useMusicPlayer() {
  const { 
    isPlaying, 
    volume, 
    userMuted,
    setVolume, 
    toggle, 
    play, 
    pause,
    setAudioElement,
    audioElement
  } = useMusicPlayerStore();

  return {
    isPlaying,
    volume,
    userMuted,
    audioElement,
    setVolume,
    toggle,
    play,
    pause,
    setAudioElement,
  };
}
