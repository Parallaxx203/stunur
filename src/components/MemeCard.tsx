import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/lib/device-id';
import { cn } from '@/lib/utils';

interface Meme {
  id: string;
  image_url: string;
  author: string;
  created_at: string;
  view_count?: number;
}

export function MemeCard({ meme }: { meme: Meme }) {
  const [likes, setLikes] = React.useState(0);
  const [liked, setLiked] = React.useState(false);
  const [views, setViews] = React.useState(meme.view_count ?? 0);
  const [busy, setBusy] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const viewedRef = React.useRef(false);

  React.useEffect(() => {
    let mounted = true;
    const deviceId = getDeviceId();
    Promise.all([
      supabase.rpc('get_meme_stats', { _meme_id: meme.id }),
      supabase.from('meme_likes').select('id').eq('meme_id', meme.id).eq('device_id', deviceId).maybeSingle(),
    ]).then(([statsRes, likedRes]) => {
      if (!mounted) return;
      const stats = statsRes.data as { likes: number; views: number } | null;
      if (stats) { setLikes(stats.likes ?? 0); setViews(stats.views ?? 0); }
      setLiked(!!likedRes.data);
    });
    return () => { mounted = false; };
  }, [meme.id]);

  React.useEffect(() => {
    if (!cardRef.current) return;
    const sessionKey = `viewed_${meme.id}`;
    if (sessionStorage.getItem(sessionKey)) { viewedRef.current = true; return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !viewedRef.current) {
          viewedRef.current = true;
          sessionStorage.setItem(sessionKey, '1');
          supabase.rpc('increment_meme_view', { _meme_id: meme.id }).then(({ data }) => {
            if (typeof data === 'number') setViews(data);
          });
        }
      });
    }, { threshold: 0.5 });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [meme.id]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const pass = prompt('Enter admin password:');
    if (pass !== 'stunur2026') return;
    if (!confirm('Delete this image?')) return;
    await supabase.from('memes').delete().eq('id', meme.id);
    setDeleted(true);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const prevLiked = liked;
    const prevLikes = likes;
    setLiked(!prevLiked);
    setLikes(prevLikes + (prevLiked ? -1 : 1));
    const { data, error } = await supabase.rpc('toggle_meme_like', {
      _meme_id: meme.id,
      _device_id: getDeviceId(),
    });
    if (error) { setLiked(prevLiked); setLikes(prevLikes); }
    else if (data) {
      const res = data as { liked: boolean; total_likes: number };
      setLiked(res.liked);
      setLikes(res.total_likes);
    }
    setBusy(false);
  };

  if (deleted) return null;

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex-shrink-0 w-[280px] md:w-[320px] aspect-[4/5] bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden flex flex-col snap-center group/card"
    >
      <div className="flex-1 bg-zinc-900 relative overflow-hidden">
        <img src={meme.image_url} alt={`Meme by ${meme.author}`} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
        <button
          onClick={handleDelete}
          className="absolute top-3 left-3 flex items-center gap-1 px-2 py-2 rounded-full backdrop-blur-xl border border-white/10 bg-black/40 text-white/30 hover:text-red-500 hover:border-red-500/50 transition-all active:scale-90"
          aria-label="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleLike}
          disabled={busy}
          className={cn(
            'absolute top-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-xl border transition-all active:scale-90',
            liked ? 'bg-red-600/30 border-red-500/60 text-red-400 shadow-[0_0_20px_rgba(255,0,0,0.4)]' : 'bg-black/40 border-white/20 text-white hover:bg-white/10',
          )}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
          <span className="font-pixel text-[9px]">{likes}</span>
        </button>
      </div>
      <div className="p-4 border-t border-white/10 bg-[#050505] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-pixel text-red-600 truncate">{meme.author}</span>
          <span className="text-[9px] font-pixel text-white/40">{new Date(meme.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] font-pixel text-white/50">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{views}</span>
          <span className="flex items-center gap-1"><Heart className={cn('w-3 h-3', liked && 'fill-red-500 text-red-500')} />{likes}</span>
        </div>
      </div>
    </motion.div>
  );
}
