import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Meme {
  id: string;
  image_url: string;
  author: string;
  created_at: string;
}

export function StonerChronicles({ onGenerate }: { onGenerate: () => void }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [memes, setMemes] = React.useState<Meme[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data, error } = await supabase
        .from('memes')
        .select('id, image_url, author, created_at')
        .order('created_at', { ascending: false })
        .limit(24);
      if (!mounted) return;
      if (!error && data) setMemes(data as Meme[]);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel('memes-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'memes' },
        (payload) => {
          setMemes((prev) => [payload.new as Meme, ...prev].slice(0, 24));
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const placeholders = Array(6).fill(null).map((_, i) => ({
    id: `ph-${i}`,
    author: `STONER_${420 + i}`,
  }));

  return (
    <div id="stoner-chronicles" className="w-full px-4 py-16 relative">
      <div className="max-w-6xl mx-auto flex flex-col items-center mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-[0.2em] mb-4 italic uppercase">
          Community Feed
        </h2>
        <div className="w-24 h-1 bg-red-600 rounded-full" />
        <p className="mt-4 text-[10px] font-pixel text-white/30 tracking-widest uppercase">Latest Stoner Vibes</p>
      </div>

      <div className="relative group/feed">
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/60 border border-white/10 rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover/feed:opacity-100 hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 bg-black/60 border border-white/10 rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover/feed:opacity-100 hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 px-4 md:px-12 pb-8 no-scrollbar snap-x snap-mandatory"
        >
          {memes.map((meme) => (
            <motion.div
              key={meme.id}
              whileHover={{ y: -10 }}
              className="flex-shrink-0 w-[280px] md:w-[320px] aspect-[4/5] bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden flex flex-col snap-center group/card"
            >
              <div className="flex-1 bg-zinc-900 relative overflow-hidden">
                <img
                  src={meme.image_url}
                  alt={`Meme by ${meme.author}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
              </div>
              <div className="p-5 border-t border-white/10 bg-[#050505] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-pixel text-red-600 truncate">{meme.author}</span>
                  <span className="text-[9px] font-pixel text-white/40">
                    {new Date(meme.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Empty/loading placeholders */}
          {(loading || memes.length === 0) &&
            placeholders.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -10 }}
                onClick={onGenerate}
                className="flex-shrink-0 w-[280px] md:w-[320px] aspect-[4/5] bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden flex flex-col snap-center group/card cursor-pointer"
              >
                <div className="flex-1 bg-zinc-900 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 group-hover/card:opacity-30 transition-opacity">
                    <div className="w-16 h-16 border-2 border-dashed border-white rounded-full flex items-center justify-center mb-4">
                      <span className="font-pixel text-xl">S</span>
                    </div>
                    <span className="font-pixel text-[8px] tracking-widest">EMPTY SLOT</span>
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
                </div>
                <div className="p-5 border-t border-white/10 bg-[#050505] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-pixel text-red-600/40">{p.author}</span>
                    <span className="text-[9px] font-pixel text-white/20">— —</span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      <div className="mt-16 text-center border-t border-b border-red-900/40 py-10 bg-red-950/5">
        <div className="text-4xl md:text-5xl font-display font-black text-red-600 mb-1 tracking-tighter italic">
          {memes.length}
        </div>
        <div className="text-white/40 font-display font-bold tracking-[0.4em] text-[10px] uppercase">
          Stoners Vibe Checked
        </div>
      </div>
    </div>
  );
}
