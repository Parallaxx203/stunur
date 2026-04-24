export function StunurFilm() {
  return (
    <div id="stunur-film" className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-4xl md:text-6xl font-display font-black text-red-600 tracking-tighter italic uppercase mb-2">
          STUNUR ANTHEM
        </h2>
        <p className="text-white/40 font-display font-bold uppercase tracking-[0.3em] text-xs text-center">
          Official Cinematic Drop · Press Play
        </p>

        <div className="w-full mt-6 overflow-hidden border-y border-red-900/20 py-2 bg-red-950/5">
          <div className="flex animate-marquee whitespace-nowrap gap-12">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex gap-12 text-[9px] font-display font-black text-red-600 tracking-[0.3em] uppercase italic"
              >
                <span>NOW PLAYING</span>
                <span>STUNUR CINEMATIC UNIVERSE</span>
                <span>WORLD PREMIERE</span>
                <span>STAY STUNURED</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-video bg-black border-2 border-red-900/40 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.2)]">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          controls
          preload="metadata"
          poster=""
          playsInline
        >
          <source src="/stunur-film.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 pointer-events-none border border-red-600/10 z-10" />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-6 text-[10px] font-display font-bold tracking-widest text-red-600/40 uppercase">
        <span>OFFICIAL DROP</span>
        <span>·</span>
        <span>STUNUR STUDIOS</span>
        <span>·</span>
        <span>MMXXVI</span>
      </div>
    </div>
  );
}
