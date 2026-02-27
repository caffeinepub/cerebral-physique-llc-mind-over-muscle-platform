import { useEffect, useRef, useState } from 'react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { 
    isPlaying, 
    volume, 
    userMuted,
    setVolume, 
    toggle, 
    setAudioElement 
  } = useMusicPlayer();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);
      audioRef.current.volume = volume;
    }
  }, [setAudioElement, volume]);

  const handleTogglePlay = async () => {
    try {
      toggle();
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        toast.error('Please interact with the page first to enable audio playback');
      } else {
        toast.error('Failed to play audio: ' + error.message);
      }
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (userMuted || volume === 0) {
        setVolume(0.3);
      } else {
        setVolume(0);
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-card/95 p-3 shadow-lg backdrop-blur-sm border border-border/40">
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        {/* Note: No audio source provided in assets, placeholder for future audio file */}
        <source src="/assets/background-music.mp3" type="audio/mpeg" />
      </audio>

      <Button
        size="icon"
        variant="ghost"
        onClick={handleTogglePlay}
        className="h-10 w-10 rounded-full hover:bg-neon-purple/20"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 text-neon-purple" />
        ) : (
          <Play className="h-5 w-5 text-neon-purple" />
        )}
      </Button>

      <div className="relative flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleMute}
          onMouseEnter={() => setShowVolumeSlider(true)}
          className="h-10 w-10 rounded-full hover:bg-neon-purple/20"
          aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        >
          {volume === 0 || userMuted ? (
            <VolumeX className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Volume2 className="h-5 w-5 text-neon-purple" />
          )}
        </Button>

        {showVolumeSlider && (
          <div
            className="absolute bottom-full right-0 mb-2 rounded-lg bg-card/95 p-3 shadow-lg backdrop-blur-sm border border-border/40"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <div className="flex h-24 items-center">
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.01}
                orientation="vertical"
                className="h-full"
                aria-label="Volume"
              />
            </div>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              {Math.round(volume * 100)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
