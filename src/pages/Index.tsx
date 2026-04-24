import React from 'react';
import { motion } from 'framer-motion';
import { X, Send, BarChart3, Copy, Radar, Plus } from 'lucide-react';
import { StonerChronicles } from '@/components/StonerChronicles';
import { StonerScanner } from '@/components/StonerScanner';
import { StonerGenerator } from '@/components/StonerGenerator';
import { StunurFilm } from '@/components/StunurFilm';
import { AudioPlayer } from '@/components/AudioPlayer';
import { cn } from '@/lib/utils';
import bannerImg from '@/assets/stoner-banner.jpg';
import footerImg from '@/assets/stoner-footer.jpg';

const TICKER_ITEMS = [
  "$STUNUR THE HIGH LIFE",
  "STUNUR NEVER LEFT",
  "$STUNUR DOESN'T STOP",
  "WE ARE STUNUR",
  "STUNUR NEVER FOLDS",
  "$STUNUR TURNS LOSSES INTO MOTION",
  "BECOME STUNUR",
  "STUNUR KEEPS MOVING",
];

function Ticker() {
  return (
    <div className="overflow-hidden bg-[#b00000] py-2 border-y border-red-900/50">
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite' }}>
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="mx-8 text-white font-mono text-[10px] tracking-[0.3em] uppercase">
            ◆ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [currentView, setCurrentView] = React.useState<'home' | 'generator'>('home');

  if (currentView === 'generator') {
    return <StonerGenerator onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white pb-12">
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.4} 94%{opacity:1} 96%{opacity:.3} 97%{opacity:1} }
        .flicker { animation: flicker 7s infinite; }
        @keyframes scanline { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
        .scanline { position:fixed;top:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.025);animation:scanline 10s linear infinite;pointer-events:none;z-index:9999; }
      `}</style>

      <div className="scanline" />

      {/* HEADER */}
      <header className="border-b border-white/5 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border-2 border-red-600 flex items-center justify-center">
              <span className="text-red-600 text-[10px] font-pixel">S</span>
            </div>
            <span className="font-pixel text-sm tracking-[0.4em] flicker">S·T·U·N·U·R</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[10px] tracking-widest text-white/40 uppercase font-pixel">
            <button onClick={() => { const el = document.getElementById('stoner-scanner'); el?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">Scanner</button>
            <button onClick={() => setCurrentView('generator')} className="hover:text-white transition-colors">Generate</button>
            <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
            <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
          </nav>

          <button
            onClick={() => setCurrentView('generator')}
            className="bg-red-600 hover:bg-red-500 text-white font-pixel text-[9px] tracking-widest px-4 py-2 uppercase transition-all active:scale-95"
          >
            GENERATE
          </button>
        </div>
      </header>

      <Ticker />

      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        {/* Banner image */}
        <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden">
          <img src={bannerImg} alt="STUNUR" className="w-full h-full object-cover" style={{ filter: 'contrast(1.1) saturate(0.85)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/60 via-transparent to-[#070707]/60" />

          {/* Overlay text on image */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="text-[10px] tracking-[0.5em] text-red-500 uppercase mb-3 font-pixel">The Character That Never Left</div>
              <h1 className="font-pixel text-[clamp(3rem,10vw,8rem)] leading-none tracking-widest text-white drop-shadow-[0_0_60px_rgba(255,0,0,0.3)] flicker">
                S·T·U·N·U·R
              </h1>
              <p className="text-white/50 text-xs md:text-sm tracking-[0.4em] mt-4 font-pixel uppercase">
                $STUNUR IS NOT A TOKEN. IT'S A CHARACTER.
              </p>
            </motion.div>
          </div>
        </div>

        {/* CA Bar */}
        <div className="bg-[#070707] pt-10 pb-6 px-4 border-b border-white/5">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 text-white/30 font-mono text-[10px] border border-white/10 px-6 py-3">
              <span className="text-white/20 tracking-widest uppercase font-pixel">CA:</span>
              <span className="text-white/60 font-pixel text-[9px] tracking-widest">COMING SOON</span>
              <button onClick={() => alert('Coming soon bro!')} className="hover:text-white transition-colors ml-2">
                <Copy className="w-3 h-3" />
              </button>
            </div>

            {/* Nav grid */}
            <div className="w-full max-w-2xl flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer">
                  <NavBtn icon={<X className="w-4 h-4" />} label="X / TWITTER" accent="white" />
                </a>
                <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer">
                  <NavBtn icon={<Send className="w-4 h-4 text-[#0088cc]" />} label="TELEGRAM" accent="blue" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <NavBtn
                  icon={<Radar className="w-4 h-4" />}
                  label="SCANNER"
                  accent="purple"
                  badge="LIVE"
                  badgeColor="bg-purple-600"
                  onClick={() => document.getElementById('stoner-scanner')?.scrollIntoView({ behavior: 'smooth' })}
                />
                <NavBtn
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
      </section>

      {/* MANIFESTO STRIP */}
      <section className="py-16 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {[
            ['STUNUR\nNEVER FOLDS', 'The character that took every loss and kept moving.'],
            ['BUILT FROM\nTHE TRENCHES', '$STUNUR is the one who stayed when everyone left.'],
            ['LOSSES INTO\nMOTION', 'Every setback becomes fuel. Every fold becomes a run-back.'],
            ['WE ARE\nSTUNUR', 'Not just a token. A story. A character. A way of life.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-[#070707] p-6 md:p-8 hover:bg-red-950/10 transition-colors group">
              <div className="font-pixel text-[11px] md:text-sm text-red-500 tracking-widest mb-3 leading-relaxed whitespace-pre-line group-hover:text-red-400 transition-colors">{title}</div>
              <div className="text-[10px] text-white/30 leading-relaxed font-mono">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <StonerChronicles onGenerate={() => setCurrentView('generator')} />
      <StonerScanner />
      <StunurFilm />

      {/* TOKENOMICS */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[9px] tracking-[0.5em] text-red-500 uppercase mb-3 font-pixel">— Distribution —</div>
            <h2 className="font-pixel text-2xl md:text-4xl tracking-[0.3em]">TOKENOMICS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {[
              { pct: '50%', title: 'INITIAL BUY', desc: 'Bought at launch with conviction.' },
              { pct: '20%', title: 'MARKET MAKING', desc: 'High-volume activity & liquidity.' },
              { pct: '20%', title: 'AIRDROPS', desc: 'Locked for future community rewards.' },
              { pct: '10%', title: '$UNT HOLDERS', desc: 'Airdropped to $UNT holders.' },
            ].map(({ pct, title, desc }) => (
              <div key={title} className="bg-[#070707] p-8 text-center hover:bg-red-950/10 transition-colors border border-transparent hover:border-red-900/30">
                <div className="font-pixel text-4xl md:text-5xl text-red-600 mb-3">{pct}</div>
                <div className="font-pixel text-[10px] tracking-widest text-white/80 mb-2">{title}</div>
                <div className="text-[9px] text-white/30 font-mono leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 border border-white/5 text-center">
            <span className="text-[9px] text-white/20 font-pixel tracking-widest">
              CONTRACT ADDRESS · COMING SOON · FOLLOW{' '}
              <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400">@STUNURSTUDIOS</a>
              {' '}FOR LAUNCH
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 relative bg-black border-t border-white/10">
        <div className="relative w-full h-[280px] md:h-[380px] overflow-hidden">
          <img src={footerImg} alt="STUNUR" className="w-full h-full object-cover opacity-60" style={{ filter: 'contrast(1.1) saturate(0.7)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-pixel text-[clamp(2rem,8vw,6rem)] tracking-[0.3em] text-white/90 flicker drop-shadow-[0_0_40px_rgba(255,0,0,0.4)]">STUNUR</div>
              <div className="text-[9px] font-pixel tracking-[0.5em] text-red-500 mt-2">NEVER LEFT</div>
            </div>
          </div>
        </div>

        <div className="bg-black pt-10 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all font-pixel text-[9px] tracking-widest uppercase">
                <X className="w-3.5 h-3.5" /> X / TWITTER
              </a>
              <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-[#0088cc]/50 hover:bg-[#0088cc]/10 transition-all font-pixel text-[9px] tracking-widest uppercase">
                <Send className="w-3.5 h-3.5 text-[#0088cc]" /> TELEGRAM
              </a>
              <button onClick={() => alert('Coming soon!')} className="flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all font-pixel text-[9px] tracking-widest uppercase">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-500" /> DEXTOOLS
              </button>
            </div>

            <button
              onClick={() => setCurrentView('generator')}
              className="px-10 py-4 border border-red-500/40 text-white font-pixel text-[10px] transition-all hover:bg-red-600/20 hover:border-red-500 hover:scale-105 uppercase tracking-widest bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(255,0,0,0.2)] active:scale-95 mb-10"
            >
              GENERATE NEW STUNUR
            </button>

            <div className="space-y-2 text-[8px] font-pixel text-white/20 tracking-[0.3em] uppercase">
              <div>© 2026 STUNUR WORLDWIDE · WE SMOKE IN PEACE</div>
              <div className="text-red-600/40">built by para1laxx</div>
            </div>
          </div>
        </div>
      </footer>

      <AudioPlayer />
    </div>
  );
}

const ACCENT_STYLES: Record<string, string> = {
  white: 'border-white/20 bg-white/5 hover:bg-white/10',
  blue: 'border-[#0088cc]/40 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 shadow-[0_0_20px_rgba(0,136,204,0.1)]',
  purple: 'border-purple-500/40 bg-purple-600/10 hover:bg-purple-600/20 shadow-[0_0_20px_rgba(147,51,234,0.15)]',
  emerald: 'border-emerald-500/40 bg-emerald-600/10 hover:bg-emerald-600/20 shadow-[0_0_20px_rgba(5,150,105,0.15)]',
};

function NavBtn({ icon, label, accent = 'white', badge, badgeColor, onClick }: {
  icon: React.ReactNode; label: string; accent?: string;
  badge?: string; badgeColor?: string; onClick?: () => void;
}) {
  return (
    <div className="relative pt-2 w-full">
      {badge && (
        <div className={cn('absolute -top-1 right-3 z-10 px-2 py-0.5 text-[7px] font-black italic tracking-wider text-white uppercase border border-white/20', badgeColor)}>
          {badge}
        </div>
      )}
      <button
        onClick={onClick}
        className={cn('w-full flex items-center justify-center gap-2 py-4 px-3 border backdrop-blur-xl transition-all group text-white hover:scale-[1.02] active:scale-95 font-pixel text-[8px] tracking-widest uppercase', ACCENT_STYLES[accent])}
      >
        <span className="shrink-0 group-hover:scale-110 transition-transform">{icon}</span>
        {label}
      </button>
    </div>
  );
}
