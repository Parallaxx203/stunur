import React from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

// TODO: replace with the direct audio file URL provided by the artist
const TRACK_URL = '/stunur-anthem.mp3';
const TRACK_TITLE = 'STUNUR ANTHEM';

export function AudioPlayer() {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    const a = new Audio(TRACK_URL);
    a.loop = true;
    a.volume = 0.7;
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (!TRACK_URL) {
      alert('Track URL not configured yet.');
      return;
    }
    try {
      if (isPlaying) {
        a.pause();
        setIsPlaying(false);
      } else {
        await a.play();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error('Audio play failed', e);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setIsMuted(a.muted);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex items-center gap-2">
      {isPlaying && (
        <div className="hidden md:flex items-center gap-2 px-4 h-14 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
          <span className="w-1.5 h-3 bg-red-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
          <span className="w-1.5 h-4 bg-red-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          <span className="w-1.5 h-2 bg-red-500 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
          <span className="font-pixel text-[8px] tracking-widest text-white/80 ml-1">{TRACK_TITLE}</span>
        </div>
      )}

      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/15 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-white/80" /> : <Volume2 className="w-5 h-5 text-white/80" />}
      </button>

      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause track' : 'Play track'}
        className="w-14 h-14 md:w-16 md:h-16 bg-red-600/80 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(255,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] hover:scale-110 hover:bg-red-500 active:scale-95 transition-all"
      >
        {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
      </button>
    </div>
  );
}
