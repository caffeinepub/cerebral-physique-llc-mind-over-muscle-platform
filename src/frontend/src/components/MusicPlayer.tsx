import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Procedural upbeat gym electronic music using Web Audio API
class SpaElectronicMusic {
  private ctx: AudioContext;
  private masterGain: GainNode;
  private isRunning = false;
  private scheduleTimer: ReturnType<typeof setTimeout> | null = null;
  private nextNoteTime = 0;
  private beat = 0;

  // Pentatonic scale in A minor
  private readonly scale = [
    220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 784,
  ];
  // Arpeggiated 16th-note line: progressive house / EDM arp
  private readonly arpNotes = [220, 277, 330, 392, 440, 330, 277, 220];
  private readonly bassNotes = [110, 110, 98, 98, 87.31, 87.31, 98, 98];
  private readonly bpm = 152;
  private arpStep = 0;

  constructor() {
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(this.ctx.destination);
  }

  // Pumping sidechain: duck master on each kick
  private sidechain(time: number) {
    const sixteenth = 60 / this.bpm / 4;
    this.masterGain.gain.setValueAtTime(0.15, time);
    this.masterGain.gain.linearRampToValueAtTime(0.3, time + sixteenth);
  }

  // Chord stab for beats 1 & 3 of each bar
  private playChordStab(time: number) {
    const chordFreqs = [220, 277, 330];
    for (const freq of chordFreqs) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = "sawtooth";
      osc.frequency.value = freq * (1 + (Math.random() - 0.5) * 0.004);
      filter.type = "highpass";
      filter.frequency.value = 800;
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.06, time + 0.02);
      gain.gain.linearRampToValueAtTime(0, time + 0.12);
      osc.start(time);
      osc.stop(time + 0.14);
    }
  }

  private playArp(freq: number, time: number, duration: number) {
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc1.type = "sawtooth";
    osc2.type = "square";
    osc1.frequency.value = freq;
    osc2.frequency.value = freq * 0.998;
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    filter.Q.value = 2;
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.06, time + 0.01);
    gain.gain.linearRampToValueAtTime(0, time + duration);
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  private playBass(freq: number, time: number, duration: number) {
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    osc.type = "sawtooth";
    osc2.type = "sine";
    osc.frequency.value = freq;
    osc2.frequency.value = freq;
    filter.type = "lowpass";
    filter.frequency.value = 400;
    filter.Q.value = 1.5;
    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.25, time + 0.01);
    gain.gain.linearRampToValueAtTime(0.18, time + duration * 0.4);
    gain.gain.linearRampToValueAtTime(0, time + duration);
    osc.start(time);
    osc2.start(time);
    osc.stop(time + duration);
    osc2.stop(time + duration);
  }

  private playHihat(time: number, accent = false, open = false) {
    const dur = open ? 0.08 : 0.04;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = open ? 8000 : 10000;
    const gain = this.ctx.createGain();
    const peakGain = open ? 0.12 : accent ? 0.09 : 0.04;
    gain.gain.setValueAtTime(peakGain, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(time);
    source.stop(time + dur + 0.005);
  }

  private playSnare(time: number) {
    // Tighter noise burst
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 4000;
    noiseFilter.Q.value = 0.5;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start(time);
    noiseSource.stop(time + 0.09);
    // Tone layer
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);
    oscGain.gain.setValueAtTime(0.3, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.09);
  }

  private playKick(time: number) {
    // Main kick
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.1);
    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.22);
    // Sub-bass boost
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = "sine";
    sub.frequency.value = 55;
    subGain.gain.setValueAtTime(0.3, time);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(time);
    sub.stop(time + 0.16);
    // Click transient
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = "square";
    click.frequency.value = 1200;
    clickGain.gain.setValueAtTime(0.08, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.01);
    click.connect(clickGain);
    clickGain.connect(this.masterGain);
    click.start(time);
    click.stop(time + 0.01);
  }

  private scheduleAhead() {
    const scheduleWindow = 0.2;
    const beatDuration = 60 / this.bpm;
    const sixteenth = beatDuration / 4;

    while (this.nextNoteTime < this.ctx.currentTime + scheduleWindow) {
      const b = this.beat % 16;
      const t = this.nextNoteTime;

      // Kick on beats 1 and 3 (b=0, b=8) + syncopated extra
      if (b === 0 || b === 8) {
        this.playKick(t);
        this.sidechain(t);
        // Chord stab on beats 1 & 3
        this.playChordStab(t);
      }
      if (b === 12) this.playKick(t);

      // Snare on beats 2 and 4
      if (b === 4 || b === 12) this.playSnare(t);

      // Hi-hats: 16th notes with open hihat on offbeats (every other 8th note)
      const isOpenHat = b === 2 || b === 6 || b === 10 || b === 14;
      this.playHihat(t, b % 4 === 0, isOpenHat);

      // Bass every half-beat (8th note)
      if (b % 2 === 0) {
        const bassIdx = Math.floor(b / 2) % this.bassNotes.length;
        this.playBass(this.bassNotes[bassIdx], t, sixteenth * 1.8);
      }

      // Arpeggiated 16th-note synth line
      const arpFreq = this.arpNotes[this.arpStep % this.arpNotes.length];
      this.playArp(arpFreq * 2, t, sixteenth * 0.85);
      this.arpStep++;

      this.nextNoteTime += sixteenth;
      this.beat++;
    }

    if (this.isRunning) {
      this.scheduleTimer = setTimeout(() => this.scheduleAhead(), 100);
    }
  }

  async start() {
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.isRunning = true;
    this.nextNoteTime = this.ctx.currentTime + 0.1;
    this.beat = 0;
    this.arpStep = 0;
    this.scheduleAhead();
  }

  stop() {
    this.isRunning = false;
    if (this.scheduleTimer) clearTimeout(this.scheduleTimer);
  }

  setVolume(v: number) {
    this.masterGain.gain.setTargetAtTime(v * 0.3, this.ctx.currentTime, 0.1);
  }
}

let musicInstance: SpaElectronicMusic | null = null;

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const musicRef = useRef<SpaElectronicMusic | null>(null);
  const startedRef = useRef(false);

  const getMusic = useCallback(() => {
    if (!musicRef.current) {
      if (!musicInstance) musicInstance = new SpaElectronicMusic();
      musicRef.current = musicInstance;
    }
    return musicRef.current;
  }, []);

  useEffect(() => {
    if (startedRef.current) return;

    const tryStart = async () => {
      if (startedRef.current) return;
      startedRef.current = true;
      try {
        const music = getMusic();
        await music.start();
        setIsPlaying(true);
      } catch {
        startedRef.current = false;
      }
      document.removeEventListener("click", tryStart);
      document.removeEventListener("touchstart", tryStart);
    };

    document.addEventListener("click", tryStart);
    document.addEventListener("touchstart", tryStart);

    return () => {
      document.removeEventListener("click", tryStart);
      document.removeEventListener("touchstart", tryStart);
    };
  }, [getMusic]);

  const togglePlay = async () => {
    const music = getMusic();
    if (isPlaying) {
      music.stop();
      setIsPlaying(false);
      startedRef.current = false;
    } else {
      startedRef.current = true;
      await music.start();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const music = getMusic();
    if (isMuted) {
      music.setVolume(volume);
      setIsMuted(false);
    } else {
      music.setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number.parseFloat(e.target.value);
    setVolume(v);
    if (!isMuted) getMusic().setVolume(v);
    if (v === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
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

      {isPlaying && (
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-3 py-1 flex items-center gap-1.5">
          <div className="flex gap-0.5 items-end h-3">
            <span
              className="w-0.5 bg-primary rounded-full"
              style={{
                height: "40%",
                animation: "equalizer 0.5s ease-in-out infinite",
              }}
            />
            <span
              className="w-0.5 bg-primary rounded-full"
              style={{
                height: "100%",
                animation: "equalizer 0.5s ease-in-out 0.1s infinite",
              }}
            />
            <span
              className="w-0.5 bg-primary rounded-full"
              style={{
                height: "60%",
                animation: "equalizer 0.5s ease-in-out 0.2s infinite",
              }}
            />
            <span
              className="w-0.5 bg-primary rounded-full"
              style={{
                height: "80%",
                animation: "equalizer 0.5s ease-in-out 0.05s infinite",
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">Gym Vibes</span>
        </div>
      )}
    </div>
  );
}
