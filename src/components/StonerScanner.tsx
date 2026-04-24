import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Radio, TrendingUp, Filter, ZoomIn, ZoomOut } from 'lucide-react';

interface StunurSighting {
  id: string;
  location: string;
  country: string;
  type: 'circle' | 'triangle' | 'disk' | 'orb' | 'cloud';
  intensity: number;
  count: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  color: string;
}

const mockSightings: StunurSighting[] = [
  { id: '1', location: 'Amsterdam', country: 'Netherlands', type: 'circle', intensity: 95, count: 847, timestamp: '2m', latitude: 52.37, longitude: 4.89, color: '#00ff41' },
  { id: '2', location: 'Los Angeles', country: 'USA', type: 'triangle', intensity: 88, count: 623, timestamp: '3m', latitude: 34.05, longitude: -118.24, color: '#ffb700' },
  { id: '3', location: 'Barcelona', country: 'Spain', type: 'orb', intensity: 82, count: 512, timestamp: '1m', latitude: 41.39, longitude: 2.17, color: '#ff006e' },
  { id: '4', location: 'Toronto', country: 'Canada', type: 'disk', intensity: 76, count: 421, timestamp: '4m', latitude: 43.65, longitude: -79.38, color: '#00d9ff' },
  { id: '5', location: 'Berlin', country: 'Germany', type: 'cloud', intensity: 71, count: 356, timestamp: '2m', latitude: 52.52, longitude: 13.40, color: '#a100f2' },
  { id: '6', location: 'Denver', country: 'USA', type: 'circle', intensity: 84, count: 589, timestamp: '1m', latitude: 39.74, longitude: -104.99, color: '#ff006e' },
  { id: '7', location: 'Vancouver', country: 'Canada', type: 'triangle', intensity: 79, count: 445, timestamp: '3m', latitude: 49.28, longitude: -123.12, color: '#00ff41' },
  { id: '8', location: 'Tel Aviv', country: 'Israel', type: 'orb', intensity: 90, count: 734, timestamp: '2m', latitude: 32.09, longitude: 34.78, color: '#ffb700' },
  { id: '9', location: 'Bangkok', country: 'Thailand', type: 'disk', intensity: 65, count: 267, timestamp: '5m', latitude: 13.73, longitude: 100.54, color: '#00d9ff' },
  { id: '10', location: 'Oakland', country: 'USA', type: 'cloud', intensity: 87, count: 598, timestamp: '1m', latitude: 37.80, longitude: -122.27, color: '#a100f2' },
  { id: '11', location: 'Melbourne', country: 'Australia', type: 'circle', intensity: 74, count: 389, timestamp: '2m', latitude: -37.81, longitude: 144.96, color: '#ff006e' },
  { id: '12', location: 'Paris', country: 'France', type: 'triangle', intensity: 81, count: 504, timestamp: '4m', latitude: 48.86, longitude: 2.35, color: '#00ff41' },
  { id: '13', location: 'Berlin', country: 'Germany', type: 'orb', intensity: 83, count: 567, timestamp: '2m', latitude: 52.52, longitude: 13.40, color: '#ffb700' },
  { id: '14', location: 'Portland', country: 'USA', type: 'disk', intensity: 81, count: 504, timestamp: '4m', latitude: 45.51, longitude: -122.68, color: '#00d9ff' },
  { id: '15', location: 'Dublin', country: 'Ireland', type: 'cloud', intensity: 78, count: 423, timestamp: '1m', latitude: 53.35, longitude: -6.26, color: '#a100f2' },
  { id: '16', location: 'Seattle', country: 'USA', type: 'circle', intensity: 86, count: 612, timestamp: '2m', latitude: 47.61, longitude: -122.33, color: '#ff006e' },
];

const typeEmojis = {
  circle: '⭕',
  triangle: '🔺',
  disk: '💿',
  orb: '🔮',
  cloud: '☁️',
};

export function StonerScanner() {
  const [activeTab, setActiveTab] = React.useState<'feed' | 'map' | 'stats'>('map');
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [activeSighting, setActiveSighting] = React.useState<StunurSighting>(mockSightings[0]);
  const [zoom, setZoom] = React.useState(100);
  const [stats, setStats] = React.useState({ today: 0, countries: 0, highAlerts: 0, total: 0 });

  React.useEffect(() => {
    const filtered = selectedType ? mockSightings.filter(s => s.type === selectedType) : mockSightings;
    setStats({
      today: Math.floor(Math.random() * 30) + 15,
      countries: filtered.length > 0 ? [...new Set(filtered.map(s => s.country))].length : 0,
      highAlerts: filtered.filter(s => s.intensity > 80).length,
      total: filtered.reduce((sum, s) => sum + s.count, 0),
    });
  }, [selectedType]);

  const filteredSightings = selectedType ? mockSightings.filter(s => s.type === selectedType) : mockSightings;

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (filteredSightings.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredSightings.length);
        setActiveSighting(filteredSightings[randomIndex]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [filteredSightings]);

  const ShapeIcon = ({ type }: { type: string }) => {
    const shapes = {
      circle: <div className="w-4 h-4 border-2 border-current rounded-full" />,
      triangle: <div className="w-0 h-0 border-l-2 border-r-2 border-b-2 border-l-transparent border-r-transparent" style={{ borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: 'currentColor' }} />,
      disk: <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-current rounded-full" /></div>,
      orb: <div className="relative w-4 h-4"><div className="absolute inset-0 border-2 border-current rounded-full" /><div className="absolute inset-1 border border-current/50 rounded-full" /></div>,
      cloud: <div className="w-4 h-3 border border-current rounded-full relative"><div className="absolute -left-1 -top-0.5 w-3 h-2 border border-current rounded-full" /></div>,
    };
    return shapes[type as keyof typeof shapes] || shapes.circle;
  };

  return (
    <div id="stoner-scanner" className="min-h-screen bg-black text-white p-4 md:p-8 font-mono relative overflow-hidden">
      {/* Ambient background effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #00ff41 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ff006e 0%, transparent 50%)',
          filter: 'blur(120px)',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 border-4 border-cyan-400 rounded-full flex items-center justify-center relative">
              <div className="w-8 h-8 border-2 border-cyan-400 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 border-2 border-transparent border-t-red-500 border-r-red-500 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-red-500 tracking-widest" style={{ textShadow: '0 0 20px rgba(255,0,0,0.5)' }}>
                STUNUR SCANNER
              </h1>
              <p className="text-cyan-400 text-sm tracking-[0.2em] mt-1">GLOBAL NETWORK SURVEILLANCE · ACTIVE DETECTION</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-2 border-red-500/40 bg-red-950/20 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="border border-green-400/50 bg-green-950/30 p-3">
              <div className="text-green-400 font-black text-2xl">{stats.today}</div>
              <div className="text-green-400/60 text-[10px] tracking-widest uppercase">TODAY</div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="border border-cyan-400/50 bg-cyan-950/30 p-3">
              <div className="text-cyan-400 font-black text-2xl">{stats.countries}</div>
              <div className="text-cyan-400/60 text-[10px] tracking-widest uppercase">COUNTRIES</div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="border border-yellow-400/50 bg-yellow-950/30 p-3">
              <div className="text-yellow-400 font-black text-2xl">⚡ {stats.highAlerts}</div>
              <div className="text-yellow-400/60 text-[10px] tracking-widest uppercase">HIGH ALERT</div>
            </motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="border border-magenta-400/50 bg-magenta-950/30 p-3">
              <div className="text-magenta-400 font-black text-2xl">{stats.total}</div>
              <div className="text-magenta-400/60 text-[10px] tracking-widest uppercase">TOTAL COUNT</div>
            </motion.div>
          </div>

          {/* Live Feed Ticker */}
          <div className="mt-4 border-2 border-green-400/40 bg-black/60 p-2 overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-[10px] font-black tracking-widest">LIVE FEED ACTIVE</span>
              <span className="text-green-400/40 text-[10px]">SCANNING NUFORG · MUFON · AARO</span>
            </div>
            <div className="overflow-hidden">
              <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, linear: true }} className="whitespace-nowrap text-green-400/60 text-[9px]">
                {[...Array(3)].map((_, i) => (
                  <span key={i}>
                    🌍 AMSTERDAM: 847 ACTIVE · BARCELONA: 512 ACTIVE · DENVER: 589 ACTIVE · TEL AVIV: 734 ACTIVE · PORTLAND: 504 ACTIVE · DUBLIN: 423 ACTIVE · &nbsp;&nbsp;&nbsp;
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main Scanner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Display */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4 border-b-2 border-red-500/40 pb-4">
              {(['feed', 'map', 'stats'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 font-black text-xs uppercase tracking-widest transition-all ${
                    activeTab === tab
                      ? 'text-white bg-red-600/80 border-2 border-red-400'
                      : 'text-red-400/60 border-2 border-red-900/40 hover:border-red-600/60'
                  }`}
                >
                  {tab === 'feed' && '📡'} {tab === 'map' && '🗺️'} {tab === 'stats' && '📊'}
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              {activeTab === 'map' && (
                <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative w-full h-[500px] md:h-[600px] bg-black border-4 border-red-500/60 overflow-hidden">
                  {/* Map background grid */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(76,175,80,.1) 25%, rgba(76,175,80,.1) 26%, transparent 27%, transparent 74%, rgba(76,175,80,.1) 75%, rgba(76,175,80,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(76,175,80,.1) 25%, rgba(76,175,80,.1) 26%, transparent 27%, transparent 74%, rgba(76,175,80,.1) 75%, rgba(76,175,80,.1) 76%, transparent 77%, transparent)',
                    backgroundSize: `${50 * (zoom / 100)}px ${50 * (zoom / 100)}px`,
                  }} />

                  {/* SVG Map with sightings */}
                  <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 0, 0, 0.3))' }}>
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255, 0, 0, 0.2)" strokeWidth="2" />
                    
                    {filteredSightings.map((sighting) => {
                      const x = (sighting.longitude + 180) / 360 * 100;
                      const y = (90 - sighting.latitude) / 180 * 100;
                      const isActive = activeSighting.id === sighting.id;
                      return (
                        <g key={sighting.id} onClick={() => setActiveSighting(sighting)} style={{ cursor: 'pointer' }}>
                          <circle cx={`${x}%`} cy={`${y}%`} r={isActive ? 8 : 5} fill={sighting.color} opacity={isActive ? 0.8 : 0.5} style={{ filter: 'drop-shadow(0 0 8px ' + sighting.color + ')' }} />
                          <circle cx={`${x}%`} cy={`${y}%`} r={isActive ? 12 : 8} fill="none" stroke={sighting.color} strokeWidth={1} opacity={isActive ? 0.6 : 0.2} style={{ animation: isActive ? 'pulse 1.5s infinite' : 'none' }} />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Scan line */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-red-500 to-transparent pointer-events-none" style={{ top: '50%', animation: 'scanline 4s linear infinite' }} />

                  {/* Active sighting info */}
                  {activeSighting && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-6 left-6 right-6 bg-black/90 border-2 border-green-400 p-4" style={{ boxShadow: '0 0 20px rgba(0,255,65,0.3)' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Radio className="w-4 h-4 text-green-400" />
                            <h3 className="font-black text-green-400 text-sm uppercase tracking-wider">{typeEmojis[activeSighting.type as keyof typeof typeEmojis]} {activeSighting.location}, {activeSighting.country}</h3>
                          </div>
                          <div className="flex gap-4 text-[11px]">
                            <div><span className="text-cyan-400 font-black">{activeSighting.intensity}%</span> <span className="text-white/50">INTENSITY</span></div>
                            <div><span className="text-yellow-400 font-black">{activeSighting.count}</span> <span className="text-white/50">ACTIVE</span></div>
                            <div><span className="text-magenta-400 font-black">{activeSighting.timestamp}</span> <span className="text-white/50">AGO</span></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-12 h-12 border-2 border-green-400 rounded-sm flex items-center justify-center text-green-400 font-black text-lg" style={{ boxShadow: '0 0 10px rgba(0,255,65,0.5)' }}>
                            {activeSighting.intensity > 85 ? '🔴' : activeSighting.intensity > 75 ? '🟡' : '🟢'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Zoom controls */}
                  <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
                    <button onClick={() => setZoom(Math.min(200, zoom + 20))} className="w-8 h-8 border-2 border-green-400 flex items-center justify-center text-green-400 hover:bg-green-400/20 transition-all">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button onClick={() => setZoom(Math.max(50, zoom - 20))} className="w-8 h-8 border-2 border-green-400 flex items-center justify-center text-green-400 hover:bg-green-400/20 transition-all">
                      <ZoomOut className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'feed' && (
                <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-4 border-red-500/60 bg-black max-h-[600px] overflow-y-auto">
                  {filteredSightings.map((sight, i) => (
                    <motion.div key={sight.id} initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.05 }} onClick={() => setActiveSighting(sight)} className={`p-4 border-b-2 border-red-900/40 cursor-pointer transition-all ${activeSighting.id === sight.id ? 'bg-red-600/30 border-l-4 border-l-green-400' : 'hover:bg-red-950/20'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl">{typeEmojis[sight.type as keyof typeof typeEmojis]}</span>
                            <h4 className="font-black text-white text-sm uppercase tracking-wider">{sight.location}</h4>
                            <span className="text-white/40 text-xs">{sight.country}</span>
                          </div>
                          <div className="flex gap-4 text-[10px]">
                            <span className="text-green-400">🟢 {sight.count} ACTIVE</span>
                            <span className="text-cyan-400">📡 {sight.intensity}% SIGNAL</span>
                            <span className="text-yellow-400">⏱️ {sight.timestamp}</span>
                          </div>
                        </div>
                        <div className="w-16 h-1 bg-red-950 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400" style={{ width: `${sight.intensity}%` }} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'stats' && (
                <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-4 border-red-500/60 bg-black p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="border-2 border-cyan-400/60 bg-cyan-950/30 p-4">
                      <TrendingUp className="w-6 h-6 text-cyan-400 mb-2" />
                      <div className="text-3xl font-black text-cyan-400 mb-1">{filteredSightings.length}</div>
                      <div className="text-cyan-400/60 text-xs uppercase tracking-widest">SIGHTINGS</div>
                    </div>
                    <div className="border-2 border-green-400/60 bg-green-950/30 p-4">
                      <MapPin className="w-6 h-6 text-green-400 mb-2" />
                      <div className="text-3xl font-black text-green-400 mb-1">{new Set(filteredSightings.map(s => s.country)).size}</div>
                      <div className="text-green-400/60 text-xs uppercase tracking-widest">LOCATIONS</div>
                    </div>
                  </div>
                  <div className="border-2 border-white/20 p-4 bg-white/5">
                    <h4 className="font-black text-white mb-4 uppercase tracking-wider">SIGHTING TYPES</h4>
                    {Object.entries(typeEmojis).map(([type, emoji]) => {
                      const count = filteredSightings.filter(s => s.type === type).length;
                      return (
                        <div key={type} className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white/80 text-sm">{emoji} {type.toUpperCase()}</span>
                            <span className="font-black text-yellow-400">{count}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500" style={{ width: `${(count / filteredSightings.length) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Sidebar */}
          <div className="border-4 border-red-500/60 bg-black p-4">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-400" />
              <h3 className="font-black text-red-400 uppercase tracking-wider text-sm">FILTER</h3>
            </div>

            <button onClick={() => setSelectedType(null)} className={`w-full mb-3 py-3 font-black text-xs uppercase tracking-widest transition-all border-2 ${!selectedType ? 'border-green-400 bg-green-400/20 text-green-400' : 'border-green-400/30 text-green-400/60 hover:border-green-400/60'}`}>
              ALL
            </button>

            <div className="space-y-2 mb-6">
              {Object.entries(typeEmojis).map(([type, emoji]) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`w-full py-2 px-3 font-black text-xs uppercase tracking-widest transition-all border-2 flex items-center gap-2 ${
                    selectedType === type
                      ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400'
                      : 'border-cyan-400/30 text-cyan-400/60 hover:border-cyan-400/60'
                  }`}
                >
                  {emoji} {type}
                </button>
              ))}
            </div>

            <div className="border-t-2 border-red-900/40 pt-4">
              <h4 className="font-black text-white/60 text-[10px] uppercase tracking-widest mb-3">TOP LOCATIONS</h4>
              <div className="space-y-2">
                {filteredSightings.slice(0, 5).map((sight) => (
                  <button
                    key={sight.id}
                    onClick={() => setActiveSighting(sight)}
                    className={`w-full text-left p-2 text-[11px] border-l-2 transition-all ${activeSighting.id === sight.id ? 'border-green-400 bg-green-400/10 text-green-400' : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white/80'}`}
                  >
                    <div className="font-black">{sight.location}</div>
                    <div className="text-[9px] opacity-60">{sight.count} active</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t-2 border-red-500/40 pt-4 flex flex-wrap justify-center gap-6 text-[10px] font-black text-red-500/60 uppercase tracking-widest">
          <span>SYSTEM ONLINE</span>
          <span>·</span>
          <span>NETWORK ACTIVE</span>
          <span>·</span>
          <span>MONITORING ENABLED</span>
          <span>·</span>
          <span>UTC TIME 17:34:56</span>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
