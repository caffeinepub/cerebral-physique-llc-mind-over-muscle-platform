import { create } from "zustand";
import { persist } from "zustand/middleware";

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
      volume: 0.3,
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
        if (!audio) {
          throw new Error("Audio element not initialized");
        }

        try {
          // Ensure volume is set before playing
          audio.volume = get().volume;

          // Attempt to play
          await audio.play();

          // Only update state if play was successful
          set({ isPlaying: true, userMuted: false });
        } catch (error: any) {
          // Log the error for debugging
          console.log("Audio playback error:", error.name, error.message);

          // Update state to reflect failed playback
          set({ isPlaying: false });

          // Re-throw with more context for the caller to handle
          const enhancedError = new Error(error.message);
          enhancedError.name = error.name;
          throw enhancedError;
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
      name: "music-player-storage",
      partialize: (state) => ({
        volume: state.volume,
        userMuted: state.userMuted,
      }),
    },
  ),
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
    audioElement,
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
