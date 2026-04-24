import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Send,
  BarChart3,
  Copy,
  Radar,
  Plus,
} from 'lucide-react';
import { StonerChronicles } from '@/components/StonerChronicles';
import { StonerScanner } from '@/components/StonerScanner';
import { StonerGenerator } from '@/components/StonerGenerator';
import { StunurFilm } from '@/components/StunurFilm';
import { AudioPlayer } from '@/components/AudioPlayer';
import { cn } from '@/lib/utils';
import bannerImg from '@/assets/stoner-banner.jpg';
import footerImg from '@/assets/stoner-footer.jpg';

export default function Index() {
  const [currentView, setCurrentView] = React.useState<'home' | 'generator'>('home');

  if (currentView === 'generator') {
    return <StonerGenerator onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-body pb-12">
      {/* Hero */}
      <div className="relative w-full overflow-hidden bg-black">
        <div className="relative w-full max-w-7xl mx-auto h-[45vh] md:h-[55vh] bg-zinc-950 overflow-hidden border-b border-white/10">
          <img
            src={bannerImg}
            alt="STUNUR — Dubai night skyline meme banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        {/* Title BELOW the image so it does not overlap */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center text-center px-4 pt-10 md:pt-14 pb-2"
        >
          <h1 className="text-[8vw] md:text-[5rem] font-pixel leading-none text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.25)]">
            S·T·U·N·U·R
          </h1>
          <p className="text-[2.4vw] md:text-sm font-bold tracking-[0.6em] md:tracking-[1em] mt-6 uppercase text-white/70">
            STAY STUNURED EVERY DAY
          </p>
        </motion.div>
      </div>

      {/* CA Bar + Buttons */}
      <div className="bg-black pt-20 pb-8 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex flex-wrap items-center justify-center gap-4 text-white/40 font-mono text-[10px] md:text-sm mb-10">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-widest text-white/20">CA:</span>
              <span className="text-white/80 font-pixel text-[8px] md:text-xs tracking-tight cursor-default select-all">
                COMING SOON
              </span>
              <button onClick={() => alert('Coming soon bro!')} className="hover:text-white transition-colors">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full max-w-2xl flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <NavButtonSmall icon={<X className="w-4 h-4" />} label="X" accent="white" />
              <NavButtonSmall
                icon={<Send className="w-4 h-4 text-[#0088cc]" />}
                label="TG"
                accent="blue"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <NavButtonSmall
                icon={<Radar className="w-4 h-4" />}
                label="SCANNER"
                accent="purple"
                badge="LIVE"
                badgeColor="bg-purple-600"
                onClick={() => {
                  const el = document.getElementById('stoner-scanner');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <NavButtonSmall
                icon={<Plus className="w-4 h-4 text-emerald-400" />}
                label="GENERATE"
                accent="emerald"
                badge="HOT"
                badgeColor="bg-emerald-600"
                onClick={() => setCurrentView('generator')}
              />
            </div>
          </div>
        </div>
      </div>

      <StonerChronicles onGenerate={() => setCurrentView('generator')} />
      <StonerScanner />
      <StunurFilm />

      {/* Footer */}
      <footer className="mt-20 relative bg-black border-t border-white/10">
        <div className="relative w-full h-[300px] md:h-[400px] bg-zinc-950 overflow-hidden border-b border-white/10">
          <img
            src={footerImg}
            alt="STUNUR crew alley scene"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        <div className="bg-black pt-12 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h2 className="font-pixel text-[14px] md:text-[24px] text-white tracking-[0.5em] mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                S·T·U·N·U·R
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <NavButtonFooter icon={<X className="w-4 h-4" />} label="X / TWITTER" />
              <NavButtonFooter icon={<Send className="w-4 h-4 text-[#0088cc]" />} label="TELEGRAM" />
              <NavButtonFooter icon={<BarChart3 className="w-4 h-4 text-emerald-500" />} label="DEXTOOLS" />
            </div>

            <div className="mb-12">
              <button
                onClick={() => setCurrentView('generator')}
                className="px-12 py-5 border border-red-500/40 text-white font-pixel transition-all rounded-full hover:bg-red-600/20 hover:border-red-500 hover:scale-105 uppercase text-[12px] md:text-[14px] bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(255,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] active:scale-95"
              >
                GENERATE NEW STUNUR
              </button>
            </div>

            <div className="text-[8px] md:text-[10px] font-pixel text-white/40 tracking-[0.4em] uppercase space-y-2">
              <div>© 2026 STUNUR WORLDWIDE · WE SMOKE IN PEACE</div>
              <div className="text-[7px] md:text-[8px] text-red-500/60 font-pixel mt-4">built by para1laxx</div>
            </div>
          </div>
        </div>
      </footer>

      <AudioPlayer />
    </div>
  );
}

function NavButtonFooter({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick || (() => alert('Coming soon bro!'))}
      className="flex items-center gap-3 px-6 py-3 border border-white/15 bg-white/5 backdrop-blur-xl rounded-full transition-all hover:bg-white hover:text-black hover:scale-105 group active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      <span className="shrink-0 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-pixel text-[8px] tracking-tight uppercase">{label}</span>
    </button>
  );
}

const ACCENT_STYLES: Record<string, string> = {
  white: 'border-white/20 bg-white/5 hover:bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
  blue: 'border-[#0088cc]/40 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 shadow-[0_0_20px_rgba(0,136,204,0.15),inset_0_1px_0_rgba(255,255,255,0.08)]',
  purple: 'border-purple-500/50 bg-purple-600/10 hover:bg-purple-600/20 shadow-[0_0_20px_rgba(147,51,234,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]',
  emerald: 'border-emerald-500/50 bg-emerald-600/10 hover:bg-emerald-600/20 shadow-[0_0_20px_rgba(5,150,105,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]',
};

function NavButtonSmall({
  icon,
  label,
  accent = 'white',
  badge,
  badgeColor,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: 'white' | 'blue' | 'purple' | 'emerald';
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}) {
  const handleClick = () => {
    if (onClick) onClick();
    else alert('Coming soon bro!');
  };

  return (
    <div className="relative pt-2">
      {badge && (
        <div
          className={cn(
            'absolute -top-1 right-3 z-10 px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-black italic tracking-wider text-white uppercase shadow-md backdrop-blur-md border border-white/20',
            badgeColor || 'bg-red-600',
          )}
        >
          {badge}
        </div>
      )}
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-4 px-3 rounded-full border backdrop-blur-xl transition-all group relative overflow-hidden text-white hover:scale-[1.03] active:scale-95',
          ACCENT_STYLES[accent],
        )}
      >
        <span className="shrink-0 transition-transform group-hover:scale-110">{icon}</span>
        <span className="font-pixel text-[7px] md:text-[9px] tracking-widest uppercase whitespace-nowrap">{label}</span>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-full" />
      </button>
    </div>
  );
}
