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
import referenceImg from '@/assets/stoner-reference.jpg';

const TICKER_ITEMS = [
  "$STUNUR THE HIGH LIFE",
  "STUNUR NEVER LEFT",
  "$STUNUR DOESN'T STOP",
  "WE ARE STUNUR",
  "STUNUR NEVER FOLDS",
  "$STUNUR TURNS LOSSES INTO MOTION",
  "BECOME STUNUR",
  "STUNUR KEEPS MOVING",
  "$STUNUR IS NOT A TOKEN IT'S A CHARACTER",
  "STUNUR IS STILL HERE",
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
    <div className="min-h-screen bg-[#070707] text-white pb-12 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.4} 94%{opacity:1} 96%{opacity:.3} 97%{opacity:1} }
        .flicker { animation: flicker 7s infinite; }
        @keyframes scanline { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
        .scanline { position:fixed;top:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.025);animation:scanline 10s linear infinite;pointer-events:none;z-index:9999; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.8s ease both; }
        .fade-up-2 { animation: fadeUp 0.8s 0.15s ease both; }
        .fade-up-3 { animation: fadeUp 0.8s 0.3s ease both; }
        .grain-overlay::after {
          content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity:0.12;
        }
        .token-card { transition: all 0.25s; border: 1px solid rgba(255,255,255,0.07); }
        .token-card:hover { border-color: #b00000; transform: translateY(-3px); box-shadow: 0 8px 30px rgba(176,0,0,0.2); }
        .manifesto-line { transition: color 0.2s; }
        .manifesto-line:hover { color: #ef4444; }
        .slide-btn { transition: all 0.25s; }
        .slide-btn:hover { transform: scale(1.03); }
        .red-glow-text { text-shadow: 0 0 40px rgba(255,0,0,0.35); }
      `}</style>

      <div className="scanline" />
      <div className="grain-overlay" />

      {/* HEADER */}
      <header className="border-b border-white/5 bg-black/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border-2 border-red-600 flex items-center justify-center">
              <span className="text-red-600 text-[10px] font-pixel">S</span>
            </div>
            <span className="font-display text-3xl tracking-[0.3em] flicker">$STUNUR</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[10px] tracking-widest text-white/40 uppercase font-pixel">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#tokenomics" className="hover:text-white transition-colors">Tokenomics</a>
            <button onClick={() => document.getElementById('stoner-scanner')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Scanner</button>
            <button onClick={() => setCurrentView('generator')} className="hover:text-white transition-colors">Generate</button>
            <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
            <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
          </nav>

          <a
            href="https://x.com/stunurstudios"
            target="_blank"
            rel="noopener noreferrer"
            className="slide-btn bg-red-600 hover:bg-red-500 text-white font-pixel text-[9px] tracking-widest px-5 py-2 uppercase"
          >
            BUY $STUNUR
          </a>
        </div>
      </header>

      <Ticker />

      {/* HERO */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
          <img src={bannerImg} alt="STUNUR" className="w-full h-full object-cover" style={{ filter: 'contrast(1.15) saturate(0.8)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/70 via-transparent to-[#070707]/70" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="fade-up">
              <div className="text-[10px] tracking-[0.5em] text-red-500 uppercase mb-3 font-pixel">— The Character That Never Left —</div>
              <h1 className="font-display text-[clamp(4rem,14vw,11rem)] leading-none tracking-wide text-white red-glow-text flicker">
                STUNUR
              </h1>
              <p className="text-white/50 text-xs md:text-sm tracking-[0.3em] mt-4 font-pixel uppercase max-w-xl">
                $STUNUR is not a token. It's a character. Built from the trenches. Turns losses into motion.
              </p>
            </div>
          </div>
        </div>

        {/* CTA + CA Bar */}
        <div className="bg-[#070707] pt-10 pb-8 px-4 border-b border-white/5 fade-up-2">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">

            {/* Social CTAs */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://x.com/stunurstudios"
                target="_blank"
                rel="noopener noreferrer"
                className="slide-btn flex items-center gap-2 bg-white text-black font-display text-xl tracking-widest px-8 py-4 uppercase"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                FOLLOW ON X
              </a>
              <a
                href="https://t.me/stunurstudios"
                target="_blank"
                rel="noopener noreferrer"
                className="slide-btn flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-display text-xl tracking-widest px-8 py-4 uppercase"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                JOIN TELEGRAM
              </a>
              <button
                onClick={() => setCurrentView('generator')}
                className="slide-btn flex items-center gap-2 border border-red-600/50 text-red-400 hover:bg-red-600/10 font-display text-xl tracking-widest px-8 py-4 uppercase"
              >
                <Plus className="w-5 h-5" />
                GENERATE
              </button>
            </div>

            {/* CA */}
            <div className="flex items-center gap-3 text-white/30 font-mono border border-white/10 px-6 py-3">
              <span className="text-white/20 tracking-widest uppercase font-pixel text-[10px]">CA:</span>
              <span className="text-white/50 font-pixel text-[9px] tracking-widest">COMING SOON</span>
              <Copy className="w-3 h-3 hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[10px] tracking-[0.5em] text-red-500 uppercase mb-4 font-pixel">— What Is $STUNUR —</div>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none mb-8 tracking-wide">THE ONE<br />WHO STAYED</h2>
            <div className="space-y-4 text-white/50 text-sm leading-relaxed font-mono max-w-lg">
              <p>$STUNUR is not a token. It's a character. It represents everyone who took the loss, stayed in the trenches, and kept moving when everyone else folded.</p>
              <p>Born from the grind. Forged in chaos. STUNUR is the story we live — the one who never left, never slowed, never stopped.</p>
              <p>When you hold $STUNUR, you don't just hold a token. You carry the character. You become the story.</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[['STUNUR NEVER FOLDS', 'The character that took every loss and kept moving.'],
                ['BUILT FROM THE TRENCHES', '$STUNUR is the one who stayed when everyone left.'],
                ['LOSSES INTO MOTION', 'Every setback becomes fuel. Every fold becomes a run-back.'],
                ['WE ARE STUNUR', 'Not just a token. A story. A character. A way of life.'],
              ].map(([title, desc]) => (
                <div key={title} className="token-card p-5 bg-[#0a0a0a]">
                  <div className="font-pixel text-[10px] text-red-500 tracking-widest mb-2 leading-relaxed">{title}</div>
                  <div className="text-[9px] text-white/30 leading-relaxed font-mono">{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 bg-red-600/5 blur-3xl rounded-full" />
            <img
              src={referenceImg}
              alt="STUNUR Character"
              className="relative w-full max-w-md mx-auto object-cover border border-red-900/30"
              style={{ filter: 'contrast(1.1) saturate(0.85)', boxShadow: '0 0 60px rgba(176,0,0,0.2)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#070707] p-6">
              <div className="font-display text-4xl tracking-widest">THE STUNUR</div>
              <div className="text-xs text-red-500 tracking-widest mt-1 font-pixel">$STUNUR · NEVER LEFT</div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="py-24 border-b border-white/5 bg-red-950/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-[10px] tracking-[0.5em] text-red-500 uppercase mb-4 font-pixel">— The Manifesto —</div>
          <h2 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none mb-16">WE ARE<br />STUNUR</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mb-16">
            {[
              ['THE HIGH LIFE', ['$STUNUR the high life', '$STUNUR never left the trenches', '$STUNUR is still here', "$STUNUR doesn't stop"]],
              ['THE MOTION', ['We are STUNUR', 'We move like STUNUR', 'We think like STUNUR', 'We stay like STUNUR', 'We run it back like STUNUR']],
              ['THE CODE', ['STUNUR never folds', 'STUNUR never slows', 'STUNUR keeps moving', "$STUNUR is not a token it's a character", '$STUNUR is built from the trenches']],
            ].map(([title, lines]) => (
              <div key={title as string} className="bg-[#070707] p-8 hover:bg-red-950/10 transition-colors">
                <div className="font-display text-2xl text-red-500 mb-6 tracking-widest">{title as string}</div>
                {(lines as string[]).map((line, i) => (
                  <div key={i} className="text-xs text-white/40 font-mono leading-loose">{line}</div>
                ))}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {['TRUST STUNUR', 'WATCH STUNUR', 'BECOME STUNUR', 'WE ARE STUNUR', 'STUNUR NEVER LEFT', 'BECOME STUNUR'].map((line, i) => (
              <div key={i} className="manifesto-line font-display text-[clamp(2rem,6vw,5rem)] text-white/10 tracking-widest cursor-default leading-tight">
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOKENOMICS */}
      <section id="tokenomics" className="py-24 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[9px] tracking-[0.5em] text-red-500 uppercase mb-3 font-pixel">— Distribution —</div>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none tracking-wide">TOKEN<br />OMICS</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { pct: '50%', title: 'INITIAL BUY', desc: 'Bought at launch with conviction. STUNUR entered with intent.' },
              { pct: '20%', title: 'MARKET MAKING', desc: 'Allocated for high-volume activity and liquidity. Keeps the engine running.' },
              { pct: '20%', title: 'AIRDROPS', desc: 'Locked for future community rewards. The holders get taken care of.' },
              { pct: '10%', title: '$UNT HOLDERS', desc: 'Airdropped to $UNT holders. Loyalty always gets recognized.' },
            ].map(({ pct, title, desc }) => (
              <div key={title} className="token-card bg-[#0a0a0a] p-8 text-center">
                <div className="font-display text-6xl md:text-7xl text-red-600 mb-4">{pct}</div>
                <div className="font-pixel text-[10px] tracking-widest text-white/80 mb-3">{title}</div>
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

      {/* FEATURES */}
      <StonerChronicles onGenerate={() => setCurrentView('generator')} />
      <StonerScanner />
      <StunurFilm />

      {/* COMMUNITY */}
      <section className="py-24 bg-red-950/5 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-[10px] tracking-[0.5em] text-red-500 uppercase mb-4 font-pixel">— Join The Movement —</div>
          <h2 className="font-display text-[clamp(3rem,10vw,8rem)] leading-none mb-8">RUN IT<br />BACK</h2>
          <p className="text-white/40 text-sm mb-12 font-mono max-w-md mx-auto">
            We run it back like STUNUR. We live for STUNUR. We die for STUNUR. Join the community that never folds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://x.com/stunurstudios"
              target="_blank"
              rel="noopener noreferrer"
              className="slide-btn flex items-center justify-center gap-3 bg-white text-black font-display text-2xl tracking-widest px-10 py-5 uppercase"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              FOLLOW ON X
            </a>
            <a
              href="https://t.me/stunurstudios"
              target="_blank"
              rel="noopener noreferrer"
              className="slide-btn flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-display text-2xl tracking-widest px-10 py-5 uppercase"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              JOIN TELEGRAM
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-black border-t border-white/10">
        <div className="relative w-full h-[280px] md:h-[380px] overflow-hidden">
          <img src={footerImg} alt="STUNUR" className="w-full h-full object-cover opacity-60" style={{ filter: 'contrast(1.1) saturate(0.7)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-display text-[clamp(3rem,10vw,8rem)] tracking-[0.2em] text-white/90 flicker red-glow-text">STUNUR</div>
              <div className="text-[9px] font-pixel tracking-[0.5em] text-red-500 mt-2">NEVER LEFT</div>
            </div>
          </div>
        </div>

        <div className="bg-black pt-10 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="slide-btn flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all font-pixel text-[9px] tracking-widest uppercase">
                <X className="w-3.5 h-3.5" /> X / TWITTER
              </a>
              <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer" className="slide-btn flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-[#0088cc]/50 hover:bg-[#0088cc]/10 transition-all font-pixel text-[9px] tracking-widest uppercase">
                <Send className="w-3.5 h-3.5 text-[#0088cc]" /> TELEGRAM
              </a>
              <button className="slide-btn flex items-center gap-2 px-5 py-3 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all font-pixel text-[9px] tracking-widest uppercase">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-500" /> DEXTOOLS
              </button>
            </div>

            <button
              onClick={() => setCurrentView('generator')}
              className="slide-btn px-10 py-4 border border-red-500/40 text-white font-pixel text-[10px] transition-all hover:bg-red-600/20 hover:border-red-500 uppercase tracking-widest bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(255,0,0,0.2)] active:scale-95 mb-10"
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
  blue: 'border-[#0088cc]/40 bg-[#0088cc]/10 hover:bg-[#0088cc]/20',
  purple: 'border-purple-500/40 bg-purple-600/10 hover:bg-purple-600/20',
  emerald: 'border-emerald-500/40 bg-emerald-600/10 hover:bg-emerald-600/20',
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
