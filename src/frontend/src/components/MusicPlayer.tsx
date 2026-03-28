import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Attempt autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;

    const tryAutoplay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
      } catch {
        // Autoplay blocked by browser policy
        setAutoplayBlocked(true);
        setIsPlaying(false);
      }
    };

    tryAutoplay();
  }, [volume]);

  // Play on first user interaction if autoplay was blocked
  useEffect(() => {
    if (!autoplayBlocked) return;

    const handleFirstInteraction = async () => {
      const audio = audioRef.current;
      if (!audio || isPlaying) return;
      try {
        await audio.play();
        setIsPlaying(true);
        setAutoplayBlocked(false);
        document.removeEventListener("click", handleFirstInteraction);
        document.removeEventListener("touchstart", handleFirstInteraction);
        document.removeEventListener("keydown", handleFirstInteraction);
      } catch {
        // Still blocked
      }
    };

    document.addEventListener("click", handleFirstInteraction);
    document.addEventListener("touchstart", handleFirstInteraction);
    document.addEventListener("keydown", handleFirstInteraction);

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("keydown", handleFirstInteraction);
    };
  }, [autoplayBlocked, isPlaying]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/assets/audio/background-music.mp3"
        loop
        preload="auto"
      >
        <track kind="captions" />
      </audio>

      {/* Floating player */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Expanded controls */}
        {isExpanded && (
          <div className="bg-background/95 backdrop-blur-md border border-border rounded-xl p-3 shadow-lg flex items-center gap-3 min-w-[180px]">
            <button
              type="button"
              onClick={toggleMute}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 accent-primary cursor-pointer"
              title="Volume"
            />
            <span className="text-xs text-muted-foreground">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        )}

        {/* Main player button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-background/95 backdrop-blur-md border border-border rounded-full p-2 shadow-lg text-muted-foreground hover:text-foreground transition-colors"
            title="Volume controls"
          >
            <Music className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
            title={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>

        {/* Now playing indicator */}
        {isPlaying && (
          <div className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-3 py-1 flex items-center gap-1.5">
            <div className="flex gap-0.5 items-end h-3">
              <span
                className="w-0.5 bg-primary rounded-full animate-[equalizer_0.8s_ease-in-out_infinite]"
                style={{ height: "40%" }}
              />
              <span
                className="w-0.5 bg-primary rounded-full animate-[equalizer_0.8s_ease-in-out_0.2s_infinite]"
                style={{ height: "100%" }}
              />
              <span
                className="w-0.5 bg-primary rounded-full animate-[equalizer_0.8s_ease-in-out_0.4s_infinite]"
                style={{ height: "60%" }}
              />
              <span
                className="w-0.5 bg-primary rounded-full animate-[equalizer_0.8s_ease-in-out_0.1s_infinite]"
                style={{ height: "80%" }}
              />
            </div>
            <span className="text-xs text-muted-foreground">Spa Vibes</span>
          </div>
        )}
      </div>
    </>
  );
}
