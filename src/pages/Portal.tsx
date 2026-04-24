import React, { useEffect, useRef, useState } from 'react';

const TICKER_ITEMS = [
  "$STUNUR IS NOT A TOKEN IT'S A CHARACTER",
  "STUNUR NEVER FOLDS",
  "$STUNUR TURNS LOSSES INTO MOTION",
  "STUNUR NEVER LEFT",
  "WE ARE STUNUR",
  "$STUNUR IS BUILT FROM THE TRENCHES",
  "STUNUR KEEPS MOVING",
  "BECOME STUNUR",
];

function Ticker() {
  return (
    <div className="overflow-hidden bg-[#b00000] py-2 border-y border-red-900">
      <div className="flex whitespace-nowrap animate-ticker">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span key={i} className="mx-8 text-white font-mono text-xs tracking-widest uppercase">
            ◆ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Portal() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-mono overflow-x-hidden">
      <audio ref={audioRef} src="/stunur-anthem.mp3" loop muted={muted} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap');

        * { box-sizing: border-box; }

        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .font-mono-custom { font-family: 'Share Tech Mono', monospace; }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: ticker 30s linear infinite; }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.4; }
          94% { opacity: 1; }
          96% { opacity: 0.3; }
          97% { opacity: 1; }
        }
        .flicker { animation: flicker 6s infinite; }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: rgba(255,255,255,0.03);
          animation: scanline 8s linear infinite;
          pointer-events: none;
          z-index: 9999;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-delay-1 { animation: fadeUp 0.8s 0.2s ease both; }
        .fade-up-delay-2 { animation: fadeUp 0.8s 0.4s ease both; }
        .fade-up-delay-3 { animation: fadeUp 0.8s 0.6s ease both; }
        .fade-up-delay-4 { animation: fadeUp 0.8s 0.8s ease both; }

        .grain::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9998;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.15;
        }

        .red-glow { box-shadow: 0 0 40px rgba(176,0,0,0.3), 0 0 80px rgba(176,0,0,0.1); }
        .text-red-glow { text-shadow: 0 0 20px rgba(255,0,0,0.5); }

        .border-brutal { border: 2px solid rgba(255,255,255,0.1); }

        .token-card:hover { border-color: #b00000; transform: translateY(-4px); transition: all 0.3s; }
        .token-card { transition: all 0.3s; }

        .cta-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.1);
          transform: translateX(-100%);
          transition: transform 0.3s;
        }
        .cta-btn:hover::before { transform: translateX(0); }
        .cta-btn:hover { transform: scale(1.03); }
      `}</style>

      <div className="scanline" />
      <div className="grain" />

      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-red-600 flex items-center justify-center">
              <span className="text-red-600 text-xs font-display">S</span>
            </div>
            <span className="font-display text-2xl tracking-widest flicker">$STUNUR</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest text-white/50 uppercase">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#tokenomics" className="hover:text-white transition-colors">Tokenomics</a>
            <a href="#manifesto" className="hover:text-white transition-colors">Manifesto</a>
            <a href="#community" className="hover:text-white transition-colors">Community</a>
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleMute} className="text-xs text-white/30 hover:text-white border border-white/10 px-3 py-1 transition-colors">
              {muted ? '♪ ON' : '♪ OFF'}
            </button>
            <a
              href="https://x.com/stunurstudios"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn bg-red-600 text-white text-xs tracking-widest px-4 py-2 uppercase"
            >
              BUY $STUNUR
            </a>
          </div>
        </div>
      </header>

      <Ticker />

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(176,0,0,0.15)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 51px)'}} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
          <div className="fade-up">
            <div className="text-xs tracking-[0.4em] text-red-500 uppercase mb-4 font-mono-custom">— The Character That Never Left —</div>
            <h1 className="font-display text-[clamp(5rem,12vw,10rem)] leading-none tracking-wide text-red-glow mb-6">
              STUNUR
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-md mb-8 font-mono-custom">
              $STUNUR is not a token. It's a character. Built from the trenches. Turns losses into motion. The one who stayed when everyone left.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://x.com/stunurstudios"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn bg-red-600 text-white font-display text-xl tracking-widest px-8 py-4 uppercase"
              >
                BUY $STUNUR
              </a>
              <a
                href="https://t.me/stunurstudios"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn border border-white/20 text-white font-display text-xl tracking-widest px-8 py-4 uppercase hover:border-red-600"
              >
                JOIN TELEGRAM
              </a>
            </div>

            <div className="mt-10 flex gap-8 text-center">
              {[['50%', 'INITIAL BUY'], ['20%', 'MARKET MAKING'], ['20%', 'AIRDROPS'], ['10%', '$UNT HOLDERS']].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display text-2xl text-red-500">{val}</div>
                  <div className="text-[10px] text-white/30 tracking-widest mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="fade-up-delay-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-red-600/10 blur-3xl rounded-full" />
              <img
                src="/src/assets/stoner-reference.jpg"
                alt="STUNUR Character"
                className="relative w-full max-w-sm object-cover red-glow border border-red-900/50"
                style={{ filter: 'contrast(1.1) saturate(0.9)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6">
                <div className="font-display text-3xl tracking-widest">THE STUNUR</div>
                <div className="text-xs text-red-500 tracking-widest mt-1">$STUNUR · NEVER LEFT</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* ABOUT */}
      <section id="about" className="py-32 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="grid grid-cols-2 gap-4">
              {['/src/assets/meme-1.jpg', '/src/assets/meme-2.jpg', '/src/assets/meme-3.jpg', '/src/assets/meme-4.jpg'].map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden border border-white/10 hover:border-red-600/50 transition-colors">
                  <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" style={{ filter: 'contrast(1.1) saturate(0.8)' }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs tracking-[0.4em] text-red-500 uppercase mb-4">— What Is $STUNUR —</div>
            <h2 className="font-display text-6xl leading-none mb-8">THE ONE<br />WHO STAYED</h2>
            <div className="space-y-4 text-white/60 text-sm leading-relaxed font-mono-custom">
              <p>$STUNUR is not a token. It's a character. It represents everyone who took the loss, stayed in the trenches, and kept moving when everyone else folded.</p>
              <p>Born from the grind. Forged from the chaos. STUNUR is the story we live — the one who never left, never slowed, never stopped.</p>
              <p>When you hold $STUNUR, you don't just hold a token. You carry the character. You become the story.</p>
            </div>
            <div className="mt-8 p-6 border border-red-900/50 bg-red-950/10">
              <div className="font-display text-2xl text-red-400 mb-2">$STUNUR IS THE STORY WE LIVE</div>
              <div className="text-xs text-white/40 tracking-widest font-mono-custom">Trust STUNUR · Watch STUNUR · Become STUNUR</div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section id="manifesto" className="py-32 bg-red-950/5 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs tracking-[0.4em] text-red-500 uppercase mb-4">— The Manifesto —</div>
          <h2 className="font-display text-7xl leading-none mb-16">WE ARE<br />STUNUR</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              ['THE HIGH LIFE', '$STUNUR the high life\n$STUNUR never left the trenches\n$STUNUR is still here\n$STUNUR doesn\'t stop'],
              ['THE MOTION', 'We are STUNUR\nWe move like STUNUR\nWe think like STUNUR\nWe stay like STUNUR'],
              ['THE CODE', 'STUNUR never folds\nSTUNUR never slows\nSTUNUR keeps moving\n$STUNUR is not a token it\'s a character'],
            ].map(([title, text]) => (
              <div key={title} className="bg-[#080808] p-8 hover:bg-red-950/10 transition-colors">
                <div className="font-display text-xl text-red-500 mb-6 tracking-widest">{title}</div>
                {text.split('\n').map((line, i) => (
                  <div key={i} className="text-sm text-white/50 font-mono-custom leading-loose">{line}</div>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-16 space-y-2">
            {['Trust STUNUR', 'Watch STUNUR', 'Become STUNUR', 'We are STUNUR', 'STUNUR never left', 'Become STUNUR'].map((line, i) => (
              <div key={i} className="font-display text-3xl md:text-5xl text-white/10 hover:text-red-600 transition-colors cursor-default tracking-widest">
                {line.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOKENOMICS */}
      <section id="tokenomics" className="py-32 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-xs tracking-[0.4em] text-red-500 uppercase mb-4">— Distribution —</div>
          <h2 className="font-display text-7xl leading-none">TOKEN<br />OMICS</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {[
            { pct: '50%', title: 'INITIAL SUPPLY', desc: 'Bought at launch. STUNUR entered the market with conviction.' },
            { pct: '20%', title: 'MARKET MAKING', desc: 'Allocated for high-volume activity and liquidity. Keeps the engine running.' },
            { pct: '20%', title: 'FUTURE AIRDROPS', desc: 'Locked and reserved. The community gets rewarded for staying.' },
            { pct: '10%', title: '$UNT HOLDERS', desc: 'Airdropped to $UNT holders. Loyalty recognized, always.' },
          ].map(({ pct, title, desc }) => (
            <div key={title} className="token-card border-brutal bg-[#080808] p-8 text-center">
              <div className="font-display text-7xl text-red-600 mb-4">{pct}</div>
              <div className="font-display text-lg tracking-widest mb-4">{title}</div>
              <div className="text-xs text-white/40 leading-relaxed font-mono-custom">{desc}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 border border-white/5 bg-white/2 text-center">
          <div className="text-xs text-white/30 tracking-widest font-mono-custom">
            CONTRACT ADDRESS · TO BE ANNOUNCED · FOLLOW <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400">@STUNURSTUDIOS</a> FOR LAUNCH DETAILS
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="py-32 bg-red-950/5 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-xs tracking-[0.4em] text-red-500 uppercase mb-4">— Join The Movement —</div>
          <h2 className="font-display text-7xl leading-none mb-8">RUN IT<br />BACK</h2>
          <p className="text-white/50 text-sm mb-12 font-mono-custom max-w-md mx-auto">
            We run it back like STUNUR. We live for STUNUR. We die for STUNUR. Join the community that never folds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://x.com/stunurstudios"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn bg-white text-black font-display text-2xl tracking-widest px-10 py-5 uppercase flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              FOLLOW ON X
            </a>
            <a
              href="https://t.me/stunurstudios"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn bg-red-600 text-white font-display text-2xl tracking-widest px-10 py-5 uppercase flex items-center justify-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              JOIN TELEGRAM
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-red-600 flex items-center justify-center">
                <span className="text-red-600 text-xs font-display">S</span>
              </div>
              <span className="font-display text-2xl tracking-widest">$STUNUR</span>
            </div>
            <div className="flex gap-8 text-xs text-white/30 tracking-widest uppercase font-mono-custom">
              <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter / X</a>
              <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
            </div>
            <div className="text-xs text-white/20 font-mono-custom text-center">
              $STUNUR is a memecoin. Not financial advice.<br />STUNUR never left.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
