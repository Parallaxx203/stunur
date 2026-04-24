import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Sighting {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  intensity: number;
  count: number;
  type: string;
  color: string;
  ago: string;
}

const SIGHTINGS: Sighting[] = [
  { id:'1',  city:'Amsterdam',   country:'NL',  lat:52.37,  lng:4.89,    intensity:95, count:847, type:'CIRCLE',   color:'#00ff88', ago:'2m' },
  { id:'2',  city:'Los Angeles', country:'USA', lat:34.05,  lng:-118.24, intensity:88, count:623, type:'TRIANGLE', color:'#ffb700', ago:'3m' },
  { id:'3',  city:'Barcelona',   country:'ESP', lat:41.39,  lng:2.17,    intensity:82, count:512, type:'ORB',      color:'#ff4466', ago:'1m' },
  { id:'4',  city:'Toronto',     country:'CA',  lat:43.65,  lng:-79.38,  intensity:76, count:421, type:'DISK',     color:'#00d9ff', ago:'4m' },
  { id:'5',  city:'Berlin',      country:'DE',  lat:52.52,  lng:13.40,   intensity:71, count:356, type:'CLOUD',    color:'#cc44ff', ago:'2m' },
  { id:'6',  city:'Denver',      country:'USA', lat:39.74,  lng:-104.99, intensity:84, count:589, type:'CIRCLE',   color:'#ff4466', ago:'1m' },
  { id:'7',  city:'Vancouver',   country:'CA',  lat:49.28,  lng:-123.12, intensity:79, count:445, type:'TRIANGLE', color:'#00ff88', ago:'3m' },
  { id:'8',  city:'Tel Aviv',    country:'IL',  lat:32.09,  lng:34.78,   intensity:90, count:734, type:'ORB',      color:'#ffb700', ago:'2m' },
  { id:'9',  city:'Bangkok',     country:'TH',  lat:13.73,  lng:100.54,  intensity:65, count:267, type:'DISK',     color:'#00d9ff', ago:'5m' },
  { id:'10', city:'Oakland',     country:'USA', lat:37.80,  lng:-122.27, intensity:87, count:598, type:'CLOUD',    color:'#cc44ff', ago:'1m' },
  { id:'11', city:'Melbourne',   country:'AU',  lat:-37.81, lng:144.96,  intensity:74, count:389, type:'CIRCLE',   color:'#ff4466', ago:'2m' },
  { id:'12', city:'Paris',       country:'FR',  lat:48.86,  lng:2.35,    intensity:81, count:504, type:'TRIANGLE', color:'#00ff88', ago:'4m' },
  { id:'13', city:'Dubai',       country:'UAE', lat:25.20,  lng:55.27,   intensity:83, count:567, type:'ORB',      color:'#ffb700', ago:'2m' },
  { id:'14', city:'Portland',    country:'USA', lat:45.51,  lng:-122.68, intensity:81, count:504, type:'DISK',     color:'#00d9ff', ago:'4m' },
  { id:'15', city:'Dublin',      country:'IE',  lat:53.35,  lng:-6.26,   intensity:78, count:423, type:'CLOUD',    color:'#cc44ff', ago:'1m' },
  { id:'16', city:'Seattle',     country:'USA', lat:47.61,  lng:-122.33, intensity:86, count:612, type:'CIRCLE',   color:'#ff4466', ago:'2m' },
  { id:'17', city:'Tokyo',       country:'JP',  lat:35.68,  lng:139.69,  intensity:92, count:780, type:'ORB',      color:'#00ff88', ago:'1m' },
  { id:'18', city:'São Paulo',   country:'BR',  lat:-23.55, lng:-46.63,  intensity:69, count:310, type:'TRIANGLE', color:'#ffb700', ago:'6m' },
  { id:'19', city:'Lagos',       country:'NG',  lat:6.52,   lng:3.38,    intensity:73, count:398, type:'CIRCLE',   color:'#ff4466', ago:'3m' },
  { id:'20', city:'London',      country:'UK',  lat:51.51,  lng:-0.13,   intensity:88, count:643, type:'DISK',     color:'#00d9ff', ago:'2m' },
];

// Mercator projection
function project(lat: number, lng: number, w: number, h: number) {
  const x = (lng + 180) / 360 * w;
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = h / 2 - (mercN * h) / (2 * Math.PI);
  return { x, y };
}

export function StonerScanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Sighting>(SIGHTINGS[0]);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const [tick, setTick] = useState(0);
  const [pulseMap, setPulseMap] = useState<Record<string, number>>({});

  // Pulse animation ticker
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(iv);
  }, []);

  // Auto cycle selected
  useEffect(() => {
    const iv = setInterval(() => {
      const idx = Math.floor(Math.random() * SIGHTINGS.length);
      setSelected(SIGHTINGS[idx]);
      setPulseMap(p => ({ ...p, [SIGHTINGS[idx].id]: Date.now() }));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const drawMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // ── BACKGROUND ──
    const bg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/1.5);
    bg.addColorStop(0, '#0d1f0d');
    bg.addColorStop(0.5, '#080f08');
    bg.addColorStop(1, '#030803');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // ── GRID ──
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(zoom, zoom);

    const gridSize = 40;
    ctx.strokeStyle = 'rgba(0,255,80,0.06)';
    ctx.lineWidth = 0.5;
    for (let x = -gridSize; x < W / zoom + gridSize; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, -gridSize); ctx.lineTo(x, H / zoom + gridSize); ctx.stroke();
    }
    for (let y = -gridSize; y < H / zoom + gridSize; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(-gridSize, y); ctx.lineTo(W / zoom + gridSize, y); ctx.stroke();
    }

    // ── CONTINENTS (simplified polygons) ──
    const continents = [
      // North America
      [[0.04,0.12],[0.18,0.08],[0.26,0.12],[0.30,0.22],[0.28,0.38],[0.22,0.48],[0.18,0.52],[0.14,0.50],[0.10,0.42],[0.06,0.35],[0.04,0.25]],
      // South America
      [[0.20,0.52],[0.28,0.50],[0.32,0.58],[0.30,0.72],[0.24,0.82],[0.18,0.80],[0.16,0.68],[0.18,0.58]],
      // Europe
      [[0.44,0.12],[0.54,0.10],[0.58,0.16],[0.56,0.26],[0.50,0.30],[0.44,0.28],[0.42,0.20]],
      // Africa
      [[0.46,0.30],[0.56,0.28],[0.60,0.36],[0.58,0.54],[0.52,0.66],[0.46,0.64],[0.42,0.54],[0.42,0.38]],
      // Asia
      [[0.56,0.10],[0.80,0.06],[0.88,0.14],[0.90,0.28],[0.82,0.40],[0.72,0.44],[0.62,0.40],[0.56,0.30],[0.54,0.20]],
      // Australia
      [[0.78,0.60],[0.88,0.58],[0.92,0.66],[0.88,0.74],[0.78,0.74],[0.74,0.66]],
    ];

    continents.forEach(poly => {
      ctx.beginPath();
      ctx.moveTo(poly[0][0] * W / zoom, poly[0][1] * H / zoom);
      poly.slice(1).forEach(([px, py]) => ctx.lineTo(px * W / zoom, py * H / zoom));
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,80,30,0.35)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,200,70,0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // ── LATITUDE/LONGITUDE LINES ──
    ctx.strokeStyle = 'rgba(0,255,80,0.08)';
    ctx.lineWidth = 0.5;
    // Equator
    ctx.strokeStyle = 'rgba(0,255,80,0.18)';
    ctx.lineWidth = 1;
    const eq = project(0, -180, W/zoom, H/zoom);
    ctx.beginPath(); ctx.moveTo(0, eq.y); ctx.lineTo(W/zoom, eq.y); ctx.stroke();

    // Tropics
    ctx.strokeStyle = 'rgba(0,255,80,0.07)';
    ctx.lineWidth = 0.5;
    [23.5, -23.5, 66.5, -66.5].forEach(lat => {
      const p = project(lat, 0, W/zoom, H/zoom);
      ctx.beginPath(); ctx.moveTo(0, p.y); ctx.lineTo(W/zoom, p.y); ctx.stroke();
    });

    // Meridians
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = (lng + 180) / 360 * W / zoom;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H/zoom); ctx.stroke();
    }

    // ── SIGHTING DOTS ──
    SIGHTINGS.forEach(s => {
      const { x, y } = project(s.lat, s.lng, W/zoom, H/zoom);
      const isSelected = s.id === selected.id;
      const pulseSince = pulseMap[s.id];
      const pulseAge = pulseSince ? (Date.now() - pulseSince) / 1000 : 0;
      const pulseAlpha = pulseSince ? Math.max(0, 1 - pulseAge / 1.5) : 0;

      // Pulse ring on recent select
      if (pulseAlpha > 0) {
        const r = 8 + pulseAge * 24;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = s.color + Math.floor(pulseAlpha * 255).toString(16).padStart(2,'0');
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Outer halo
      const haloR = isSelected ? 14 + Math.sin(tick * 0.12) * 3 : 8;
      ctx.beginPath();
      ctx.arc(x, y, haloR, 0, Math.PI * 2);
      ctx.fillStyle = s.color + (isSelected ? '22' : '11');
      ctx.fill();
      ctx.strokeStyle = s.color + (isSelected ? 'aa' : '44');
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.stroke();

      // Core dot
      ctx.beginPath();
      ctx.arc(x, y, isSelected ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = isSelected ? 12 : 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      if (isSelected || s.intensity > 85) {
        ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255,255,255,0.55)';
        ctx.font = `bold ${isSelected ? 10 : 8}px "Share Tech Mono", monospace`;
        ctx.fillText(s.city, x + 8, y - 6);
        if (isSelected) {
          ctx.fillStyle = s.color;
          ctx.font = '8px "Share Tech Mono", monospace';
          ctx.fillText(`${s.intensity}% · ${s.count}`, x + 8, y + 4);
        }
      }
    });

    // ── SCAN LINE ──
    const scanY = (tick * 2) % (H / zoom);
    const scanGrad = ctx.createLinearGradient(0, scanY - 4, 0, scanY + 4);
    scanGrad.addColorStop(0, 'transparent');
    scanGrad.addColorStop(0.5, 'rgba(0,255,80,0.12)');
    scanGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(0, scanY - 4, W / zoom, 8);

    ctx.restore();

    // ── VIGNETTE ──
    const vig = ctx.createRadialGradient(W/2, H/2, H*0.3, W/2, H/2, W*0.8);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // ── HUD OVERLAY ──
    // Top-left: STUNUR SCANNER title
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(8, 8, 220, 36);
    ctx.strokeStyle = 'rgba(0,255,80,0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, 220, 36);
    ctx.fillStyle = '#00ff88';
    ctx.font = 'bold 13px "Share Tech Mono", monospace';
    ctx.fillText('◈ STUNUR SCANNER', 16, 22);
    ctx.fillStyle = 'rgba(0,255,80,0.5)';
    ctx.font = '9px "Share Tech Mono", monospace';
    ctx.fillText(`LIVE · ${SIGHTINGS.length} NODES ACTIVE`, 16, 36);

    // Top-right: clock + zoom
    const now = new Date();
    const timeStr = now.toUTCString().slice(17, 25) + ' UTC';
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(W - 180, 8, 172, 36);
    ctx.strokeStyle = 'rgba(0,255,80,0.3)';
    ctx.strokeRect(W - 180, 8, 172, 36);
    ctx.fillStyle = 'rgba(0,255,80,0.6)';
    ctx.font = '9px "Share Tech Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(timeStr, W - 12, 22);
    ctx.fillText(`ZOOM ${Math.round(zoom * 100)}%`, W - 12, 36);
    ctx.textAlign = 'left';

    // Bottom: selected sighting HUD
    if (selected) {
      const hudW = Math.min(W - 16, 500);
      const hudX = (W - hudW) / 2;
      const hudY = H - 80;
      ctx.fillStyle = 'rgba(0,5,0,0.85)';
      ctx.fillRect(hudX, hudY, hudW, 68);
      ctx.strokeStyle = selected.color + 'bb';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(hudX, hudY, hudW, 68);

      // Blinking dot
      if (Math.floor(tick / 8) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(hudX + 14, hudY + 14, 4, 0, Math.PI * 2);
        ctx.fillStyle = selected.color;
        ctx.shadowColor = selected.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Share Tech Mono", monospace';
      ctx.fillText(`${selected.city}, ${selected.country}`, hudX + 26, hudY + 18);

      ctx.fillStyle = selected.color;
      ctx.font = '9px "Share Tech Mono", monospace';
      ctx.fillText(`TYPE: ${selected.type}`, hudX + 12, hudY + 34);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(`INTENSITY: ${selected.intensity}%  ·  ACTIVE: ${selected.count}  ·  ${selected.ago} AGO`, hudX + 12, hudY + 48);

      // Intensity bar
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(hudX + 12, hudY + 56, hudW - 24, 5);
      const barGrad = ctx.createLinearGradient(hudX + 12, 0, hudX + 12 + (hudW - 24) * selected.intensity / 100, 0);
      barGrad.addColorStop(0, selected.color);
      barGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = barGrad;
      ctx.fillRect(hudX + 12, hudY + 56, (hudW - 24) * selected.intensity / 100, 5);
    }

  }, [tick, selected, offset, zoom, pulseMap]);

  useEffect(() => { drawMap(); }, [drawMap]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ro = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    });
    ro.observe(container);
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    return () => ro.disconnect();
  }, []);

  // Click to select sighting
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left - offset.x) / zoom;
    const my = (e.clientY - rect.top - offset.y) / zoom;
    const W = canvas.width / zoom;
    const H = canvas.height / zoom;

    let closest: Sighting | null = null;
    let minDist = 20;
    SIGHTINGS.forEach(s => {
      const { x, y } = project(s.lat, s.lng, W, H);
      const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
      if (dist < minDist) { minDist = dist; closest = s; }
    });
    if (closest) {
      setSelected(closest);
      setPulseMap(p => ({ ...p, [(closest as Sighting).id]: Date.now() }));
    }
  }, [offset, zoom]);

  // Drag to pan
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.x),
      y: dragStart.current.oy + (e.clientY - dragStart.current.y),
    });
  };
  const onMouseUp = () => setDragging(false);

  // Scroll to zoom
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.5, Math.min(4, z - e.deltaY * 0.001)));
  };

  return (
    <section id="stoner-scanner" style={{ padding: '48px 16px', background: '#080808' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
      `}</style>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ color: '#cc0000', fontSize: 18 }}>🛸</span>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '0.15em', color: '#fff' }}>
          GLOBAL STUNUR SCANNER
        </span>
      </div>
      <p style={{ textAlign: 'center', fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', marginBottom: 16 }}>
        CLICK SIGHTINGS TO ZOOM IN · SCROLL TO ZOOM · DRAG TO PAN
      </p>

      {/* Map container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          height: 520,
          margin: '0 auto',
          border: '1px solid rgba(0,255,80,0.2)',
          boxShadow: '0 0 40px rgba(0,255,80,0.05), inset 0 0 60px rgba(0,0,0,0.5)',
          cursor: dragging ? 'grabbing' : 'crosshair',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
          onClick={handleClick}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
        />

        {/* Corner decorations */}
        {[
          { top:0, left:0, borderTop:'2px solid rgba(0,255,80,0.5)', borderLeft:'2px solid rgba(0,255,80,0.5)', width:20, height:20 },
          { top:0, right:0, borderTop:'2px solid rgba(0,255,80,0.5)', borderRight:'2px solid rgba(0,255,80,0.5)', width:20, height:20 },
          { bottom:0, left:0, borderBottom:'2px solid rgba(0,255,80,0.5)', borderLeft:'2px solid rgba(0,255,80,0.5)', width:20, height:20 },
          { bottom:0, right:0, borderBottom:'2px solid rgba(0,255,80,0.5)', borderRight:'2px solid rgba(0,255,80,0.5)', width:20, height:20 },
        ].map((style, i) => (
          <div key={i} style={{ position: 'absolute', ...style }} />
        ))}

        {/* Zoom controls */}
        <div style={{ position: 'absolute', bottom: 90, right: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[{label:'+', delta:0.25}, {label:'−', delta:-0.25}].map(({label, delta}) => (
            <button
              key={label}
              onClick={() => setZoom(z => Math.max(0.5, Math.min(4, z + delta)))}
              style={{
                width: 28, height: 28, background: 'rgba(0,5,0,0.85)',
                border: '1px solid rgba(0,255,80,0.4)', color: '#00ff88',
                fontFamily: "'Share Tech Mono', monospace", fontSize: 16,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >{label}</button>
          ))}
          <button
            onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}
            style={{
              width: 28, height: 28, background: 'rgba(0,5,0,0.85)',
              border: '1px solid rgba(0,255,80,0.3)', color: 'rgba(0,255,80,0.5)',
              fontFamily: "'Share Tech Mono', monospace", fontSize: 8,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              letterSpacing: '0.05em',
            }}
          >RST</button>
        </div>
      </div>

      {/* Live feed strip */}
      <div style={{
        maxWidth: 900, margin: '0 auto', marginTop: 4,
        background: 'rgba(0,5,0,0.9)',
        border: '1px solid rgba(0,255,80,0.15)',
        borderTop: 'none',
        padding: '6px 12px',
        display: 'flex', alignItems: 'center', gap: 8,
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88', animation: 'pulse 1s infinite' }} />
          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: '#00ff88', letterSpacing: '0.2em' }}>LIVE</span>
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 20s linear infinite' }}>
            {[...SIGHTINGS, ...SIGHTINGS].map((s, i) => (
              <span key={i} style={{ marginRight: 32, fontFamily: "'Share Tech Mono', monospace", fontSize: 9, color: 'rgba(0,255,80,0.5)', letterSpacing: '0.1em' }}>
                ◆ {s.city}: <span style={{ color: s.color }}>{s.count} ACTIVE</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
