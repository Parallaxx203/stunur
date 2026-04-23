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

export default function Index() {
  const [isMuted, setIsMuted] = React.useState(true);
  const [currentView, setCurrentView] = React.useState<'home' | 'generator'>('home');
  const [bannerUrl, setBannerUrl] = React.useState<string | null>(null);
  const [footerUrl, setFooterUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const footerInputRef = React.useRef<HTMLInputElement>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setBannerUrl(URL.createObjectURL(file));
  };

  const handleFooterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFooterUrl(URL.createObjectURL(file));
  };

  if (currentView === 'generator') {
    return <StonerGenerator onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-body pb-12">
      {/* Hero */}
      <div className="relative w-full overflow-hidden bg-black group">
        <input type="file" ref={fileInputRef} onChange={handleBannerUpload} className="hidden" accept="image/*" />

        <div className="relative w-full max-w-7xl mx-auto h-[45vh] md:h-[55vh] bg-zinc-950 overflow-hidden border-b border-white/10 group/banner transition-colors hover:bg-zinc-900">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt="Custom Banner"
              className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#0a0a0a] relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,0,0,0.05)_0%,_transparent_70%)]" />
              <div className="flex flex-col items-center gap-4 z-10">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-red-600/30 flex items-center justify-center group-hover/banner:border-red-600/60 transition-all">
                  <Plus className="w-8 h-8 text-red-600/40 group-hover/banner:text-red-600 transition-all" />
                </div>
                <span className="text-red-900/60 font-display font-black italic text-xl uppercase tracking-[0.3em] group-hover/banner:text-red-600 transition-all">
                  PLACE BANNER HERE
                </span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="bg-black/80 hover:bg-red-600 text-[10px] font-black px-6 py-2.5 border border-white/20 rounded-sm opacity-0 group-hover:opacity-100 transition-all uppercase tracking-[0.2em] text-white"
            >
              Update Image
            </button>
          </div>

          <div className="absolute inset-0 flex items-end justify-center pb-12 md:pb-16 text-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <h1 className="text-[6vw] md:text-[5rem] font-pixel mb-0 flex flex-col items-center leading-normal text-white">
                <span className="drop-shadow-[0_0_80px_rgba(255,255,255,0.4)] mix-blend-difference">S·T·O·N·E·R</span>
                <span className="text-[1.2vw] md:text-sm font-bold tracking-[1em] mt-10 uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] text-white/90">
                  STAY STONED EVERY DAY
                </span>
              </h1>
            </motion.div>
          </div>
        </div>
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

          <div className="w-full max-w-2xl flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <NavButtonSmall icon={<X className="w-4 h-4" />} label="X" className="border-white/20 bg-black" />
              <NavButtonSmall
                icon={<Send className="w-4 h-4 text-[#0088cc]" />}
                label="TG"
                className="border-[#0088cc]/30 bg-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <NavButtonSmall
                icon={<Radar className="w-4 h-4" />}
                label="SCANNER"
                className="border-purple-600/40 bg-black shadow-[0_0_15px_rgba(147,51,234,0.1)]"
                badge="LIVE"
                badgeColor="bg-purple-600"
                onClick={() => {
                  const el = document.getElementById('stoner-scanner');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
              <NavButtonSmall
                icon={<Plus className="w-4 h-4 text-emerald-500" />}
                label="GENERATE"
                className="border-emerald-600/40 bg-black shadow-[0_0_15px_rgba(5,150,105,0.1)]"
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
      <footer className="mt-20 relative bg-black border-t border-white/10 group/footer">
        <input type="file" ref={footerInputRef} onChange={handleFooterUpload} className="hidden" accept="image/*" />

        <div className="relative w-full h-[300px] md:h-[400px] bg-zinc-950 overflow-hidden border-b border-white/10">
          {footerUrl ? (
            <div className="relative w-full h-full">
              <img
                src={footerUrl}
                alt="Footer Banner"
                className="w-full h-full object-cover opacity-60 transition-all duration-700 group-hover/footer:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] transition-colors hover:bg-zinc-900/40">
              <div className="flex flex-col items-center gap-2 opacity-20 group-hover/footer:opacity-50 transition-opacity">
                <Plus className="w-6 h-6 text-white" />
                <span className="text-[10px] font-pixel uppercase tracking-widest text-white px-4 text-center">
                  Add Footer Banner
                </span>
              </div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              footerInputRef.current?.click();
            }}
            className="absolute bottom-4 right-4 bg-black/60 hover:bg-white hover:text-black text-[8px] font-pixel px-4 py-2 border border-white/20 rounded-sm opacity-0 group-hover/footer:opacity-100 transition-all uppercase z-30 shadow-lg pointer-events-auto text-white"
          >
            Update Footer Image
          </button>
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
            badgeColor || 'bg-red-600'
          )}
        >
          {badge}
        </div>
      )}
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3.5 px-2 rounded-sm border transition-all group relative overflow-hidden text-white',
          className
        )}
      >
        <span className="shrink-0 transition-transform group-hover:scale-110">{icon}</span>
        <span className="font-pixel text-[7px] md:text-[9px] tracking-widest uppercase whitespace-nowrap">{label}</span>
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </button>
    </div>
  );
}
