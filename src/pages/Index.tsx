import React from 'react';
import { motion } from 'framer-motion';
import { X, Send, BarChart3, Copy, Radar, Plus, Sparkles } from 'lucide-react';
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
  "$STUNUR IS NOT A TOKEN IT'S A CHARACTER",
  "STUNUR NEVER FOLDS",
  "$STUNUR TURNS LOSSES INTO MOTION",
  "STUNUR NEVER LEFT",
  "WE ARE STUNUR",
  "$STUNUR IS BUILT FROM THE TRENCHES",
  "STUNUR KEEPS MOVING",
  "BECOME STUNUR",
  "$STUNUR THE HIGH LIFE",
  "WE RUN IT BACK LIKE STUNUR",
];

function Ticker() {
  return (
    <div className="overflow-hidden bg-red-600 py-2 border-y border-red-900/50">
      <style>{`
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ticker-inner { animation: ticker 28s linear infinite; display: flex; white-space: nowrap; }
      `}</style>
      <div className="ticker-inner">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="mx-8 text-white font-mono text-[10px] tracking-widest uppercase">
            ◆ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [currentView, setCurrentView] = React.useState<'home' | 'generator'>('home');
  const [copied, setCopied] = React.useState(false);

  const copyCA = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (currentView === 'generator') {
    return <StonerGenerator onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white font-body pb-12 overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 border-2 border-red-600 flex items-center justify-center">
              <span className="text-red-600 text-[10px] font-pixel">S</span>
            </div>
            <span className="font-pixel text-sm tracking-[0.3em]">$STUNUR</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[10px] tracking-widest text-white/40 uppercase font-pixel">
            <button onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">About</button>
            <button onClick={() => { document.getElementById('tokenomics')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">Tokenomics</button>
            <button onClick={() => { document.getElementById('stoner-scanner')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors">Scanner</button>
            <button onClick={() => setCurrentView('generator')} className="hover:text-white transition-colors">Generate</button>
          </nav>

          <div className="flex items-center gap-3">
            <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-white/30 text-[10px] font-pixel tracking-widest uppercase transition-colors">
              <X className="w-3 h-3" /> TWITTER
            </a>
            <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-[10px] font-pixel tracking-widest uppercase transition-colors">
              BUY $STUNUR
            </a>
          </div>
        </div>
      </header>

      <Ticker />

      {/* ── HERO ── */}
      <section className="relative w-full">
        <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
          <img src={bannerImg} alt="STUNUR Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-transparent" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center px-4 pt-10 pb-2"
        >
          <div className="text-[10px] tracking-[0.5em] text-red-500 uppercase mb-4 font-pixel">— The One Who Never Left —</div>
          <h1 className="text-[14vw] md:text-[8rem] font-pixel leading-none tracking-widest drop-shadow-[0_0_60px_rgba(176,0,0,0.4)]">
            S·T·U·N·U·R
          </h1>
          <p className="text-xs md:text-sm font-pixel tracking-[0.5em] mt-6 uppercase text-white/40">
            STAY STUNURED EVERY DAY
          </p>
        </motion.div>
      </section>

      {/* ── CA BAR + BUTTONS ── */}
      <section className="bg-[#080808] pt-16 pb-10 px-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">

          {/* CA */}
          <div className="flex items-center gap-3 px-6 py-3 border border-white/10 bg-white/5 rounded-sm">
            <span className="font-pixel text-[9px] text-white/30 uppercase tracking-widest">CA:</span>
            <span className="font-pixel text-[9px] md:text-[11px] text-white/70 tracking-tight select-all">COMING SOON</span>
            <button onClick={copyCA} className="text-white/30 hover:text-white transition-colors">
              <Copy className="w-3.5 h-3.5" />
            </button>
            {copied && <span className="text-[8px] font-pixel text-green-400">COPIED!</span>}
          </div>

          {/* Action buttons */}
          <div className="w-full max-w-2xl grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 border border-white/15 bg-white/5 hover:bg-white/10 rounded-sm transition-all group">
              <X className="w-4 h-4" />
              <span className="font-pixel text-[9px] tracking-widest uppercase">TWITTER</span>
            </a>
            <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 border border-[#0088cc]/40 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 rounded-sm transition-all">
              <Send className="w-4 h-4 text-[#0088cc]" />
              <span className="font-pixel text-[9px] tracking-widest uppercase">TELEGRAM</span>
            </a>
            <button onClick={() => { document.getElementById('stoner-scanner')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="relative flex items-center justify-center gap-2 py-4 border border-purple-500/40 bg-purple-600/10 hover:bg-purple-600/20 rounded-sm transition-all">
              <span className="absolute -top-2 right-2 px-2 py-0.5 bg-purple-600 text-[7px] font-pixel text-white uppercase tracking-wider">LIVE</span>
              <Radar className="w-4 h-4 text-purple-400" />
              <span className="font-pixel text-[9px] tracking-widest uppercase">SCANNER</span>
            </button>
            <button onClick={() => setCurrentView('generator')}
              className="relative flex items-center justify-center gap-2 py-4 border border-emerald-500/40 bg-emerald-600/10 hover:bg-emerald-600/20 rounded-sm transition-all">
              <span className="absolute -top-2 right-2 px-2 py-0.5 bg-emerald-600 text-[7px] font-pixel text-white uppercase tracking-wider">HOT</span>
              <Plus className="w-4 h-4 text-emerald-400" />
              <span className="font-pixel text-[9px] tracking-widest uppercase">GENERATE</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="text-[9px] tracking-[0.5em] text-red-500 uppercase mb-4 font-pixel">— What Is $STUNUR —</div>
            <h2 className="font-pixel text-4xl md:text-5xl leading-tight mb-8 tracking-widest">THE ONE<br />WHO STAYED</h2>
            <div className="space-y-4 text-white/50 text-sm leading-relaxed font-body">
              <p>$STUNUR is not a token. It's a character. Built from the trenches. The one who took the loss, stayed in the grind, and kept moving when everyone else folded.</p>
              <p>Born from chaos. Forged from the dark. STUNUR is the story we live — the one who never left, never slowed, never stopped.</p>
              <p>When you hold $STUNUR, you don't just hold a token. You carry the character. You become the story.</p>
            </div>
            <div className="mt-8 p-5 border border-red-900/40 bg-red-950/10">
              <div className="font-pixel text-sm text-red-400 mb-1 tracking-widest">$STUNUR IS THE STORY WE LIVE</div>
              <div className="text-[9px] text-white/30 tracking-widest font-pixel">Trust STUNUR · Watch STUNUR · Become STUNUR</div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/10 blur-3xl rounded-full pointer-events-none" />
              <img src={referenceImg} alt="STUNUR Character" className="relative w-full max-w-sm mx-auto object-cover border border-red-900/40"
                style={{ filter: 'contrast(1.1) saturate(0.85)', boxShadow: '0 0 60px rgba(176,0,0,0.2)' }} />
              <div className="absolute bottom-0 left-0 right-0 max-w-sm mx-auto bg-gradient-to-t from-black via-black/60 to-transparent p-5">
                <div className="font-pixel text-xl tracking-widest">THE STUNUR</div>
                <div className="text-[9px] text-red-500 tracking-widest mt-1 font-pixel">$STUNUR · NEVER LEFT</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="py-20 bg-red-950/5 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
          <div className="text-[9px] tracking-[0.5em] text-red-500 uppercase mb-4 font-pixel">— The Manifesto —</div>
          <h2 className="font-pixel text-4xl md:text-6xl leading-none mb-14 tracking-widest">WE ARE STUNUR</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mb-14">
            {[
              ['THE HIGH LIFE', ['$STUNUR the high life', '$STUNUR never left the trenches', '$STUNUR is still here', "$STUNUR doesn't stop"]],
              ['THE MOTION', ['We are STUNUR', 'We move like STUNUR', 'We think like STUNUR', 'We stay like STUNUR']],
              ['THE CODE', ['STUNUR never folds', 'STUNUR never slows', 'STUNUR keeps moving', "We run it back like STUNUR"]],
            ].map(([title, lines]) => (
              <div key={title as string} className="bg-[#080808] p-8 hover:bg-red-950/10 transition-colors">
                <div className="font-pixel text-xs text-red-500 mb-6 tracking-widest">{title as string}</div>
                {(lines as string[]).map((line, i) => (
                  <div key={i} className="text-[11px] text-white/40 font-body leading-loose">{line}</div>
                ))}
              </div>
            ))}
          </div>
          <div className="space-y-1">
            {['TRUST STUNUR', 'WATCH STUNUR', 'BECOME STUNUR', 'WE ARE STUNUR', 'STUNUR NEVER LEFT'].map((line, i) => (
              <div key={i} className="font-pixel text-2xl md:text-4xl text-white/8 hover:text-red-600 transition-colors cursor-default tracking-widest"
                style={{ color: `rgba(255,255,255,${0.04 + i * 0.02})` }}>
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOKENOMICS ── */}
      <section id="tokenomics" className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <div className="text-[9px] tracking-[0.5em] text-red-500 uppercase mb-4 font-pixel">— Distribution —</div>
          <h2 className="font-pixel text-4xl md:text-6xl leading-none tracking-widest">TOKENOMICS</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
          {[
            { pct: '50%', title: 'INITIAL BUY', desc: 'Bought at launch with conviction.' },
            { pct: '20%', title: 'MARKET MAKING', desc: 'High-volume activity & liquidity.' },
            { pct: '20%', title: 'AIRDROPS', desc: 'Locked for future community rewards.' },
            { pct: '10%', title: '$UNT HOLDERS', desc: 'Airdropped to loyal $UNT holders.' },
          ].map(({ pct, title, desc }) => (
            <motion.div key={title} whileHover={{ y: -4 }} className="bg-[#080808] p-8 text-center border border-transparent hover:border-red-600/40 transition-all">
              <div className="font-pixel text-5xl md:text-6xl text-red-600 mb-4">{pct}</div>
              <div className="font-pixel text-xs tracking-widest mb-3">{title}</div>
              <div className="text-[10px] text-white/30 leading-relaxed">{desc}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 py-4 px-6 border border-white/5 text-center">
          <span className="text-[9px] text-white/20 tracking-widest font-pixel">
            CONTRACT · TO BE ANNOUNCED · FOLLOW{' '}
            <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400">@STUNURSTUDIOS</a>
            {' '}FOR LAUNCH
          </span>
        </div>
      </section>

      <Ticker />

      {/* ── FEATURES (existing components) ── */}
      <StonerChronicles onGenerate={() => setCurrentView('generator')} />
      <StonerScanner />
      <StunurFilm />

      {/* ── COMMUNITY CTA ── */}
      <section className="py-24 border-y border-white/5 bg-red-950/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-[9px] tracking-[0.5em] text-red-500 uppercase mb-4 font-pixel">— Join The Movement —</div>
          <h2 className="font-pixel text-4xl md:text-6xl leading-none mb-6 tracking-widest">RUN IT BACK</h2>
          <p className="text-white/40 text-sm mb-10 font-body max-w-md mx-auto leading-relaxed">
            We live for STUNUR. We die for STUNUR. Join the community that never folds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-pixel text-sm tracking-widest uppercase hover:scale-105 transition-transform">
              <X className="w-5 h-5" /> FOLLOW ON X
            </a>
            <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-10 py-5 bg-red-600 text-white font-pixel text-sm tracking-widest uppercase hover:bg-red-500 hover:scale-105 transition-all">
              <Send className="w-5 h-5" /> JOIN TELEGRAM
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative bg-black border-t border-white/5">
        <div className="relative w-full h-[280px] md:h-[380px] overflow-hidden">
          <img src={footerImg} alt="STUNUR Footer" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <div className="bg-black pt-12 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-pixel text-2xl md:text-4xl tracking-[0.5em] mb-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              S·T·U·N·U·R
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-white/10 bg-white/5 hover:bg-white hover:text-black rounded-full transition-all font-pixel text-[9px] tracking-widest uppercase">
                <X className="w-4 h-4" /> X / TWITTER
              </a>
              <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-white/10 bg-white/5 hover:bg-white hover:text-black rounded-full transition-all font-pixel text-[9px] tracking-widest uppercase">
                <Send className="w-4 h-4 text-[#0088cc]" /> TELEGRAM
              </a>
              <button className="flex items-center gap-2 px-6 py-3 border border-white/10 bg-white/5 hover:bg-white hover:text-black rounded-full transition-all font-pixel text-[9px] tracking-widest uppercase">
                <BarChart3 className="w-4 h-4 text-emerald-500" /> DEXTOOLS
              </button>
            </div>
            <button onClick={() => setCurrentView('generator')}
              className="px-12 py-5 border border-red-500/40 text-white font-pixel text-xs rounded-full hover:bg-red-600/20 hover:border-red-500 hover:scale-105 uppercase bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(255,0,0,0.2)] active:scale-95 transition-all mb-12 flex items-center gap-3 mx-auto">
              <Sparkles className="w-4 h-4 text-red-400" /> GENERATE NEW STUNUR
            </button>
            <div className="text-[8px] font-pixel text-white/20 tracking-[0.4em] uppercase space-y-2">
              <div>© 2026 STUNUR WORLDWIDE · WE SMOKE IN PEACE</div>
              <div className="text-red-500/40 mt-2">built by para1laxx</div>
            </div>
          </div>
        </div>
      </footer>

      <AudioPlayer />
    </div>
  );
}
