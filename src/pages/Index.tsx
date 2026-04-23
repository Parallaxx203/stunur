import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Send,
  BarChart3,
  Copy,
  Volume2,
  VolumeX,
  Radar,
  Plus,
} from 'lucide-react';
import { StonerChronicles } from '@/components/StonerChronicles';
import { StonerScanner } from '@/components/StonerScanner';
import { StonerGenerator } from '@/components/StonerGenerator';
import { cn } from '@/lib/utils';
import bannerImg from '@/assets/stoner-banner.jpg';
import footerImg from '@/assets/stoner-footer.jpg';

export default function Index() {
  const [isMuted, setIsMuted] = React.useState(true);
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
            alt="STONER — Dubai night skyline meme banner"
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
            S·T·O·N·E·R
          </h1>
          <p className="text-[2.4vw] md:text-sm font-bold tracking-[0.6em] md:tracking-[1em] mt-6 uppercase text-white/70">
            STAY STONED EVERY DAY
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

      {/* Footer */}
      <footer className="mt-20 relative bg-black border-t border-white/10">
        <div className="relative w-full h-[300px] md:h-[400px] bg-zinc-950 overflow-hidden border-b border-white/10">
          <img
            src={footerImg}
            alt="STONER crew alley scene"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        <div className="bg-black pt-12 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h2 className="font-pixel text-[14px] md:text-[24px] text-white tracking-[0.5em] mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                S·T·O·N·E·R
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
                className="px-12 py-5 border border-red-600 text-white font-pixel transition-all rounded-sm hover:bg-red-600 hover:text-white uppercase text-[12px] md:text-[14px] bg-black/5 shadow-[0_0_50px_rgba(255,0,0,0.2)] active:scale-95"
              >
                GENERATE NEW STONER
              </button>
            </div>

            <div className="text-[8px] md:text-[10px] font-pixel text-white/40 tracking-[0.4em] uppercase space-y-2">
              <div>© 2026 STONER WORLDWIDE · WE SMOKE IN PEACE</div>
              <div className="text-[7px] md:text-[8px] text-red-500/60 font-pixel mt-4">BUILT BY AUDIFYX</div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating audio toggle */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="fixed bottom-8 right-8 w-14 h-14 md:w-16 md:h-16 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.5)] hover:scale-110 active:scale-95 transition-all z-[9999]"
      >
        {isMuted ? <VolumeX className="w-8 h-8 text-white" /> : <Volume2 className="w-8 h-8 text-white" />}
      </button>
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
      className="flex items-center gap-3 px-6 py-3 border border-white/10 bg-black/40 backdrop-blur-md rounded-sm transition-all hover:bg-white hover:text-black group active:scale-95"
    >
      <span className="shrink-0 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-pixel text-[8px] tracking-tight uppercase">{label}</span>
    </button>
  );
}

function NavButtonSmall({
  icon,
  label,
  className,
  badge,
  badgeColor,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  className?: string;
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
            'absolute -top-1 right-2 z-10 px-1.5 py-0.5 rounded-[1px] text-[7px] md:text-[8px] font-black italic tracking-wider text-white uppercase shadow-sm',
            badgeColor || 'bg-red-600',
          )}
        >
          {badge}
        </div>
      )}
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 px-2 rounded-sm border transition-all group relative overflow-hidden text-white',
          className,
        )}
      >
        <span className="shrink-0 transition-transform group-hover:scale-110">{icon}</span>
        <span className="font-pixel text-[7px] md:text-[9px] tracking-widest uppercase whitespace-nowrap">{label}</span>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </button>
    </div>
  );
}
