import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, Radio } from 'lucide-react';

interface StunurLocation {
  id: string;
  location: string;
  country: string;
  intensity: number;
  count: number;
  timestamp: string;
}

const mockLocations: StunurLocation[] = [
  { id: '1', location: 'Amsterdam', country: 'Netherlands', intensity: 95, count: 847, timestamp: '2m ago' },
  { id: '2', location: 'Los Angeles', country: 'USA', intensity: 88, count: 623, timestamp: '3m ago' },
  { id: '3', location: 'Barcelona', country: 'Spain', intensity: 82, count: 512, timestamp: '1m ago' },
  { id: '4', location: 'Toronto', country: 'Canada', intensity: 76, count: 421, timestamp: '4m ago' },
  { id: '5', location: 'Berlin', country: 'Germany', intensity: 71, count: 356, timestamp: '2m ago' },
  { id: '6', location: 'Denver', country: 'USA', intensity: 84, count: 589, timestamp: '1m ago' },
  { id: '7', location: 'Vancouver', country: 'Canada', intensity: 79, count: 445, timestamp: '3m ago' },
  { id: '8', location: 'Tel Aviv', country: 'Israel', intensity: 90, count: 734, timestamp: '2m ago' },
  { id: '9', location: 'Bangkok', country: 'Thailand', intensity: 65, count: 267, timestamp: '5m ago' },
  { id: '10', location: 'Oakland', country: 'USA', intensity: 87, count: 598, timestamp: '1m ago' },
  { id: '11', location: 'Melbourne', country: 'Australia', intensity: 74, count: 389, timestamp: '2m ago' },
  { id: '12', location: 'Portland', country: 'USA', intensity: 81, count: 504, timestamp: '4m ago' },
];

const globalCoords = [
  { lat: 52.37, lng: 4.89, name: 'Amsterdam', intensity: 95 },
  { lat: 34.05, lng: -118.24, name: 'LA', intensity: 88 },
  { lat: 41.39, lng: 2.17, name: 'Barcelona', intensity: 82 },
  { lat: 43.65, lng: -79.38, name: 'Toronto', intensity: 76 },
  { lat: 52.52, lng: 13.40, name: 'Berlin', intensity: 71 },
  { lat: 39.74, lng: -104.99, name: 'Denver', intensity: 84 },
  { lat: 49.28, lng: -123.12, name: 'Vancouver', intensity: 79 },
  { lat: 32.09, lng: 34.78, name: 'Tel Aviv', intensity: 90 },
  { lat: 13.73, lng: 100.54, name: 'Bangkok', intensity: 65 },
  { lat: 37.80, lng: -122.27, name: 'Oakland', intensity: 87 },
];

export function StonerScanner() {
  const [activeLocation, setActiveLocation] = React.useState<StunurLocation | null>(mockLocations[0]);
  const [scanning, setScanning] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mockLocations.length);
      setActiveLocation(mockLocations[randomIndex]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="stoner-scanner" className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <h2 className="text-4xl md:text-6xl font-display font-black text-red-600 tracking-tighter italic uppercase">
            STUNUR Live Scanner
          </h2>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
        </div>
        <p className="text-white/40 font-display font-bold uppercase tracking-[0.3em] text-xs">
          Global Vibes Detected · Real-Time Network Monitoring
        </p>

        <div className="w-full mt-6 overflow-hidden border-y border-red-900/20 py-2 bg-red-950/5">
          <div className="flex animate-marquee whitespace-nowrap gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-12 text-[9px] font-display font-black text-red-600 tracking-[0.3em] uppercase italic">
                <span>🌍 GLOBAL SCANNING ACTIVE</span>
                <span>📡 SIGNAL DETECTED</span>
                <span>⚡ NETWORK ONLINE</span>
                <span>✓ SYSTEM STABLE</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Scan Display */}
        <div className="lg:col-span-2">
          <div className="relative w-full h-[500px] md:h-[600px] bg-black border-2 border-red-900/40 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.2)]">
            {/* Animated background grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, .05) 25%, rgba(255, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, .05) 75%, rgba(255, 0, 0, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, .05) 25%, rgba(255, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, .05) 75%, rgba(255, 0, 0, .05) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px'
              }} />
            </div>

            {/* Global map points - SVG representation */}
            <svg className="absolute inset-0 w-full h-full" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 0, 0, 0.3))' }}>
              {/* Simple world map outline */}
              <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255, 0, 0, 0.1)" strokeWidth="1" />
              
              {/* Location points with intensity glow */}
              {globalCoords.map((coord, i) => {
                const x = (coord.lng + 180) / 360 * 100;
                const y = (90 - coord.lat) / 180 * 100;
                const isActive = activeLocation?.location === coord.name;
                return (
                  <g key={i}>
                    {/* Glow pulse */}
                    <circle 
                      cx={`${x}%`} 
                      cy={`${y}%`} 
                      r={coord.intensity / 30}
                      fill={isActive ? 'rgba(255, 0, 0, 0.4)' : 'rgba(255, 0, 0, 0.2)'}
                      style={{
                        animation: isActive ? 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                      }}
                    />
                    {/* Center point */}
                    <circle 
                      cx={`${x}%`} 
                      cy={`${y}%`} 
                      r={isActive ? '2.5' : '1.5'}
                      fill={isActive ? '#ff0000' : 'rgba(255, 0, 0, 0.8)'}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Active location info overlay */}
            {activeLocation && (
              <motion.div
                key={activeLocation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-black/80 backdrop-blur-xl border border-red-900/40 rounded-sm p-4 shadow-[0_0_30px_rgba(255,0,0,0.3)]"
              >
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-black text-red-600 text-sm uppercase tracking-wider">
                      {activeLocation.location}, {activeLocation.country}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-red-950/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
                          style={{ width: `${activeLocation.intensity}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-pixel text-red-600 font-bold">{activeLocation.intensity}%</span>
                    </div>
                    <p className="text-[11px] text-white/60 font-pixel mt-1.5">
                      {activeLocation.count.toLocaleString()} active · {activeLocation.timestamp}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Scan line animation */}
            <div 
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-b from-transparent via-red-500 to-transparent pointer-events-none"
              style={{
                top: '50%',
                animation: 'scanline 6s linear infinite',
              }}
            />

            <div className="absolute inset-0 pointer-events-none border border-red-600/10" />
          </div>
        </div>

        {/* Live Feed Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-black border-2 border-red-900/40 rounded-sm overflow-hidden h-[500px] md:h-[600px] flex flex-col shadow-[0_0_50px_rgba(255,0,0,0.2)]">
            {/* Header */}
            <div className="border-b border-red-900/40 p-4 bg-red-950/20">
              <div className="flex items-center gap-2 mb-2">
                <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                <h3 className="font-display font-black text-red-600 text-xs uppercase tracking-wider">Live Feed</h3>
              </div>
              <p className="text-[10px] text-white/40 font-pixel">Detected locations worldwide</p>
            </div>

            {/* Locations list */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {mockLocations.map((loc) => (
                <motion.button
                  key={loc.id}
                  onClick={() => setActiveLocation(loc)}
                  whileHover={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}
                  className={`w-full text-left p-3 border-b border-red-900/20 transition-colors ${
                    activeLocation?.id === loc.id ? 'bg-red-900/30' : 'hover:bg-red-900/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-red-600 text-xs uppercase tracking-wider">
                        {loc.location}
                      </p>
                      <p className="text-[9px] text-white/50 font-pixel mt-1">{loc.country}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center">
                        <div 
                          className="w-1.5 h-1.5 rounded-full bg-red-600 transition-all"
                          style={{ opacity: loc.intensity / 100 }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex-1 h-0.5 bg-red-950/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 transition-all duration-300"
                        style={{ width: `${loc.intensity}%` }}
                      />
                    </div>
                    <span className="text-[8px] text-red-600 font-pixel font-bold">{loc.intensity}%</span>
                  </div>
                  <p className="text-[8px] text-white/40 font-pixel mt-1">{loc.count} active · {loc.timestamp}</p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] font-display font-bold tracking-widest text-red-600/40 uppercase">
        <span>GLOBAL NETWORK</span>
        <span>·</span>
        <span>REAL-TIME DETECTION</span>
        <span>·</span>
        <span>LIVE MONITORING</span>
      </div>

      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
