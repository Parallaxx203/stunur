import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  Download,
  Share2,
  Image as ImageIcon,
  Send,
  X,
  Sparkles,
  Lock,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import referenceImg from '@/assets/stoner-reference.jpg';

export function StonerGenerator({ onBack }: { onBack: () => void }) {
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isPosting, setIsPosting] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [resultPersisted, setResultPersisted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const callGenerate = async (postToFeed: boolean) => {
    const { data, error: fnError } = await supabase.functions.invoke('generate-meme', {
      body: { prompt: prompt.trim(), postToFeed },
    });
    if (fnError) throw new Error(fnError.message || 'Generation failed');
    if (data?.error) throw new Error(data.error);
    if (!data?.imageUrl) throw new Error('No image returned');
    return data as { imageUrl: string; persisted: boolean };
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setResultPersisted(false);
    try {
      const data = await callGenerate(false);
      setResult(data.imageUrl);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err?.message || 'Failed to bake the meme. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePostToFeed = async () => {
    if (!prompt.trim() || isPosting) return;
    setIsPosting(true);
    try {
      const data = await callGenerate(true);
      setResult(data.imageUrl);
      setResultPersisted(true);
      toast.success('Posted to community feed!');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to post to feed');
    } finally {
      setIsPosting(false);
    }
  };



  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-body">
      <header className="px-4 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-all group">
          <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-red-600" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-red-600 rounded-sm flex items-center justify-center">
            <span className="text-[10px] font-pixel text-red-600">S</span>
          </div>
          <h1 className="font-pixel text-[10px] tracking-widest text-white/90">STUNUR GENERATOR</h1>
        </div>

        <div className="w-10" />
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto w-full">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Display */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="aspect-square md:aspect-video w-full bg-zinc-950 border-2 border-dashed border-white/10 rounded-sm relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-6 z-10"
                  >
                    <div className="relative">
                      <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
                      <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-red-400 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-pixel text-[10px] text-red-600 animate-pulse">BAKING MEMES...</span>
                      <span className="text-[8px] font-pixel text-white/20 uppercase">stay stoned bro</span>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 text-red-500 max-w-xs text-center px-4"
                  >
                    <X className="w-8 h-8" />
                    <span className="font-pixel text-[10px] tracking-tight leading-relaxed">{error}</span>
                    <button
                      onClick={handleGenerate}
                      className="text-[8px] font-pixel text-white/40 hover:text-white underline mt-2"
                    >
                      TRY AGAIN
                    </button>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full p-4"
                  >
                    <div className="w-full h-full relative group/image rounded-sm overflow-hidden border border-white/10">
                      <img src={result} alt="Generated STUNUR" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-4">
                          <a
                            href={result}
                            download="stunur-meme.png"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform flex items-center justify-center shadow-xl cursor-pointer"
                          >
                            <Download className="w-6 h-6" />
                          </a>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(result);
                              toast.success('Image URL copied!');
                            }}
                            className="p-4 bg-[#1DA1F2] text-white rounded-full hover:scale-110 transition-transform flex items-center justify-center shadow-xl"
                          >
                            <Share2 className="w-6 h-6" />
                          </button>
                        </div>

                        <button
                          onClick={handlePostToFeed}
                          disabled={isPosting || resultPersisted}
                          className="px-6 py-2 bg-red-600 text-white font-pixel text-[10px] rounded-sm hover:bg-red-500 transition-colors shadow-lg active:scale-95 disabled:bg-white/10 disabled:text-white/40"
                        >
                          {resultPersisted ? 'POSTED ✓' : isPosting ? 'POSTING...' : 'POST TO FEED'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 text-white/20"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <span className="font-pixel text-[10px] tracking-widest">DISPLAY BOX</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,_transparent_100%)]" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>
          </div>

          {/* Locked Character Reference */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-sm p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-pixel text-[10px] text-white/40 tracking-widest">CHARACTER LOCK</h3>
                <span className="flex items-center gap-1 text-[9px] font-pixel text-emerald-500/80">
                  <Lock className="w-3 h-3" /> LOCKED
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="relative aspect-square w-full rounded-sm overflow-hidden border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  <img
                    src={referenceImg}
                    alt="Locked STUNUR character reference"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-md rounded-sm border border-emerald-500/30">
                    <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-[8px] font-pixel text-emerald-300 tracking-wider uppercase truncate">
                      THE ONLY STUNUR
                    </span>
                  </div>
                </div>

                <div className="text-[9px] font-pixel text-white/50 leading-relaxed uppercase tracking-wide">
                  EVERY GENERATION USES THIS EXACT CHARACTER. YOU JUST DESCRIBE THE SCENE.
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[8px] font-pixel text-emerald-500/60 leading-relaxed uppercase">
                  ✓ STYLE LOCKED · ✓ CHARACTER LOCKED · DESCRIBE THE VIBE
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Prompt bar */}
      <div className="p-4 md:p-8 border-t border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="DESCRIBE THE SCENE... (E.G. STUNUR RIDING A RED LAMBO THROUGH DUBAI AT NIGHT)"
            className="w-full bg-[#0a0a0a] border-2 border-white/10 rounded-sm p-6 pr-24 font-pixel text-[10px] md:text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-red-600/50 transition-all min-h-[100px] resize-none"
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-red-600 hover:bg-red-500 disabled:bg-white/5 disabled:text-white/20 p-4 rounded-sm transition-all shadow-[0_0_20px_rgba(255,0,0,0.2)] active:scale-95 group/btn text-white"
            >
              {isGenerating ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              )}
            </button>
          </div>

          <div className="absolute -top-3 left-4 px-2 bg-black border border-white/10 rounded-sm">
            <span className="text-[8px] font-pixel text-white/40 uppercase">PROMPT TERMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
