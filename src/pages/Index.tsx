import React, { Suspense, lazy } from 'react';
import { StonerChronicles } from '@/components/StonerChronicles';
import { StonerGenerator } from '@/components/StonerGenerator';
import { StunurFilm } from '@/components/StunurFilm';
import { AudioPlayer } from '@/components/AudioPlayer';
import bannerImg from '@/assets/stoner-banner.jpg';
import footerImg from '@/assets/stoner-footer.jpg';
import referenceImg from '@/assets/stoner-reference.jpg';
const StonerScanner = lazy(() => import('@/components/StonerScanner').then(m => ({ default: m.StonerScanner })));

export default function Index() {
  const [currentView, setCurrentView] = React.useState<'home' | 'generator'>('home');

  if (currentView === 'generator') {
    return <StonerGenerator onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; }
        .f-display { font-family: 'Bebas Neue', sans-serif; }
        .f-mono { font-family: 'Share Tech Mono', monospace; }

        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:.4} 94%{opacity:1} 96%{opacity:.3} 97%{opacity:1} }
        .flicker { animation: flicker 7s infinite; }
        @keyframes scanline { from{transform:translateY(-100%)} to{transform:translateY(100vh)} }
        .scanline { position:fixed;top:0;left:0;right:0;height:2px;background:rgba(255,255,255,0.02);animation:scanline 10s linear infinite;pointer-events:none;z-index:9999; }

        .nav-btn {
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 7px 14px; border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7);
          font-family: 'Share Tech Mono', monospace; font-size: 11px;
          text-transform: uppercase; letter-spacing: 0.1em;
          cursor: pointer; transition: all 0.2s; text-decoration: none;
          white-space: nowrap;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.12); color: #fff; border-color: rgba(255,255,255,0.35); }
        .nav-btn.red { background: #cc0000; border-color: #cc0000; color: #fff; }
        .nav-btn.red:hover { background: #e00000; }
        .nav-btn.blue { background: #0088cc; border-color: #0088cc; color: #fff; }
        .nav-btn.blue:hover { background: #009ae0; }
        .nav-btn.purple { background: #7c3aed; border-color: #7c3aed; color: #fff; }
        .nav-btn.purple:hover { background: #8b5cf6; }
        .nav-btn.green { background: #16a34a; border-color: #16a34a; color: #fff; }
        .nav-btn.green:hover { background: #22c55e; }

        .badge { 
          display: inline-block; padding: 2px 6px; font-size: 9px; 
          font-family: 'Share Tech Mono', monospace; letter-spacing: 0.1em;
          text-transform: uppercase; border-radius: 2px;
        }
        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.4rem, 3vw, 2rem);
          letter-spacing: 0.15em;
          color: #fff;
        }
        .red-icon { color: #cc0000; }
        .token-box {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          padding: 24px;
          text-align: center;
          transition: all 0.2s;
        }
        .token-box:hover { border-color: #cc0000; background: rgba(204,0,0,0.05); }
      `}</style>

      <div className="scanline" />

      {/* ── HERO BANNER ── */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#000' }}>
        {/* Full bleed cinematic banner - Image 1 */}
        <img
          src="/stunur-banner-wide.jpg"
          alt="STUNUR"
          style={{
            width: '100%',
            height: 'clamp(220px, 38vw, 420px)',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
            filter: 'contrast(1.05) saturate(0.9)',
          }}
        />
        {/* Subtle bottom fade into page */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }} />
        {/* Title overlay top-right exactly like MAGA site */}
        <div style={{ position: 'absolute', top: 0, right: 0, padding: 'clamp(12px, 3vw, 28px) clamp(16px, 4vw, 40px)', textAlign: 'right' }}>
          <div className="f-display flicker" style={{ fontSize: 'clamp(2.2rem, 7vw, 6rem)', letterSpacing: '0.12em', lineHeight: 1, textShadow: '0 0 30px rgba(255,0,0,0.5), 2px 2px 0 rgba(0,0,0,0.8)' }}>
            $·S·T·U·N·U·R
          </div>
          <div className="f-mono" style={{ fontSize: 'clamp(9px, 1.2vw, 13px)', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.7)', marginTop: 6, textShadow: '1px 1px 0 rgba(0,0,0,0.9)' }}>
            THE CHARACTER THAT NEVER LEFT
          </div>
        </div>
      </div>

      {/* ── CHARACTER ICON + CA ── exactly like MAGA site layout */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '0 16px 0', background: '#0a0a0a' }}>
        {/* Character pixel avatar centered, overlapping banner bottom */}
        <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid #cc0000', marginTop: -36, zIndex: 10, position: 'relative', background: '#0a0a0a', boxShadow: '0 0 20px rgba(204,0,0,0.4)' }}>
          <img src={referenceImg} alt="STUNUR" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* CA row - styled exactly like MAGA site */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <span className="f-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em' }}>CA:</span>
          <span className="f-mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em' }}>COMING SOON</span>
          <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 14, lineHeight: 1 }} onClick={() => {}}>⧉</span>
          <span className="f-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', marginLeft: 4 }}>👁 LIVE</span>
        </div>
      </div>

      {/* ── NAV BUTTONS ROW 1 ── */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', background: '#0a0a0a' }}>
        <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="nav-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          @STUNURSTUDIOS
        </a>
        <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer" className="nav-btn blue">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          TELEGRAM
        </a>
        <a href="#tokenomics" className="nav-btn">
          📄 TOKENOMICS
        </a>
      </div>

      {/* ── NAV BUTTONS ROW 2 ── */}
      <div style={{ padding: '6px 16px 16px', display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', background: '#0a0a0a' }}>
        <button onClick={() => document.getElementById('stoner-scanner')?.scrollIntoView({ behavior: 'smooth' })} className="nav-btn purple">
          🛸 STUNUR SCANNER
        </button>
        <button onClick={() => setCurrentView('generator')} className="nav-btn red">
          ✦ GENERATE STUNUR
        </button>
        <button onClick={() => document.getElementById('stunur-film')?.scrollIntoView({ behavior: 'smooth' })} className="nav-btn green">
          📈 LIVE CHART
          <span className="badge" style={{ background: '#ff6600', color: '#fff', marginLeft: 4 }}>HOT</span>
        </button>
        <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="nav-btn">
          🌐 STUNUR.IO
        </a>
      </div>

      {/* ── TICKER ── */}
      <div style={{ overflow: 'hidden', background: '#cc0000', borderTop: '1px solid #990000', borderBottom: '1px solid #990000', padding: '7px 0' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite' }}>
          {[...Array(2)].flatMap(() => [
            "$STUNUR THE HIGH LIFE", "STUNUR NEVER LEFT", "$STUNUR DOESN'T STOP", "WE ARE STUNUR",
            "STUNUR NEVER FOLDS", "$STUNUR TURNS LOSSES INTO MOTION", "BECOME STUNUR", "STUNUR KEEPS MOVING",
            "$STUNUR IS NOT A TOKEN IT'S A CHARACTER", "$STUNUR IS STILL HERE",
          ].map((item, i) => (
            <span key={i} className="f-mono" style={{ margin: '0 28px', color: '#fff', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              ◆ {item}
            </span>
          )))}
        </div>
      </div>

      {/* ── STUNUR CHRONICLES ── */}
      <div style={{ padding: '32px 16px 0' }}>
        <StonerChronicles onGenerate={() => setCurrentView('generator')} />
      </div>

      {/* ── SCANNER ── */}
      <Suspense fallback={<div style={{padding:"48px 16px",textAlign:"center",fontFamily:"monospace",color:"rgba(0,255,80,0.4)",fontSize:11,letterSpacing:"0.2em"}}>◈ LOADING STUNUR CITY...</div>}><StonerScanner /></Suspense>

      {/* ── TOKENOMICS ── */}
      <section id="tokenomics" style={{ padding: '48px 16px', maxWidth: 860, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
          <span style={{ color: '#cc0000', fontSize: 18 }}>◈</span>
          <span className="section-title">TOKENOMICS</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 2, background: 'rgba(255,255,255,0.05)' }}>
          {[
            { pct: '50%', title: 'INITIAL BUY', desc: '50% of the initial supply has been bought.' },
            { pct: '20%', title: 'MARKET MAKING', desc: 'Sold during high-volume activity and used for market making.' },
            { pct: '20%', title: 'AIRDROPS', desc: 'Locked for future airdrops.' },
            { pct: '10%', title: '$UNT HOLDERS', desc: 'Locked for one week — airdrop to $UNT holders.' },
          ].map(({ pct, title, desc }) => (
            <div key={title} className="token-box">
              <div className="f-display" style={{ fontSize: 52, color: '#cc0000', lineHeight: 1 }}>{pct}</div>
              <div className="f-mono" style={{ fontSize: 11, letterSpacing: '0.15em', color: '#fff', margin: '8px 0 6px', textTransform: 'uppercase' }}>{title}</div>
              <div className="f-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 4, padding: '10px 16px', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
          <span className="f-mono" style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>
            CONTRACT ADDRESS · COMING SOON · FOLLOW{' '}
            <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" style={{ color: '#cc0000', textDecoration: 'none' }}>@STUNURSTUDIOS</a>
            {' '}FOR LAUNCH
          </span>
        </div>
      </section>

      {/* ── FILM ── */}
      <StunurFilm />

      {/* ── FOOTER ── */}
      <footer style={{ background: '#000', borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 48 }}>
        {/* Footer image */}
        <div style={{ position: 'relative', width: '100%', height: 220, overflow: 'hidden' }}>
          <img src={footerImg} alt="STUNUR" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'saturate(0.6)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #000, transparent)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="f-display flicker" style={{ fontSize: 'clamp(2.5rem,8vw,6rem)', letterSpacing: '0.2em', textShadow: '0 0 40px rgba(255,0,0,0.5)' }}>STUNUR</div>
              <div className="f-mono" style={{ fontSize: 10, color: '#cc0000', letterSpacing: '0.4em', marginTop: 4 }}>NEVER LEFT</div>
            </div>
          </div>
        </div>

        {/* Footer nav */}
        <div style={{ padding: '24px 16px', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          <a href="https://t.me/stunurstudios" target="_blank" rel="noopener noreferrer" className="nav-btn blue">TELEGRAM</a>
          <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="nav-btn">X COMMUNITY</a>
          <a href="https://x.com/stunurstudios" target="_blank" rel="noopener noreferrer" className="nav-btn">@STUNURSTUDIOS</a>
        </div>
        <div style={{ padding: '0 16px 16px', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          <a href="#tokenomics" className="nav-btn">TOKENOMICS</a>
          <button onClick={() => document.getElementById('stoner-scanner')?.scrollIntoView({ behavior: 'smooth' })} className="nav-btn purple">STUNUR SCANNER</button>
        </div>

        <div style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => setCurrentView('generator')} className="nav-btn red" style={{ padding: '12px 32px', fontSize: 13 }}>
            ✦ GENERATE STUNUR
          </button>
        </div>

        {/* Ticker bottom */}
        <div style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '8px 0', marginTop: 16 }}>
          <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 35s linear infinite' }}>
            {[...Array(2)].flatMap(() => [
              "WE ARE STUNUR", "STUNUR NEVER LEFT", "BECOME STUNUR", "TRUST STUNUR", "WATCH STUNUR",
              "WE LIVE FOR STUNUR", "WE DIE FOR STUNUR", "STUNUR NEVER FOLDS", "built by para1laxx",
            ].map((item, i) => (
              <span key={i} className="f-mono" style={{ margin: '0 24px', color: 'rgba(255,255,255,0.15)', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                · {item}
              </span>
            )))}
          </div>
        </div>

        <div style={{ padding: '12px 16px', textAlign: 'center' }}>
          <span className="f-mono" style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em' }}>
            © 2026 STUNUR WORLDWIDE · $STUNUR IS A MEMECOIN · NOT FINANCIAL ADVICE
          </span>
        </div>
      </footer>

      <AudioPlayer />
    </div>
  );
}
