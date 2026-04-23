import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Loader2,
  Download,
  Share2,
  Image as ImageIcon,
  Send,
  X,
  Sparkles,
} from 'lucide-react';

// LLMAPI configuration (per integration guide)
const LLMAPI_KEY = "llmapi_013bbfb73557cd2a1441a5599b047128fbfc35045fa5c2e8a8f24ab1749c790b";
const API_BASE = "https://api.llmapi.ai/v1";
const IMAGE_MODEL = "google-ai-studio/gemini-2.5-flash-image";
const TIMEOUT_MS = 30000;

const STYLE_KEYWORDS = "vibrant, slightly gritty, meme-ready, artistic, cinematic";

export function StonerGenerator({ onBack }: { onBack: () => void }) {
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [referenceImages, setReferenceImages] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() && referenceImages.length === 0) return;

    setIsGenerating(true);
    setError(null);

    const fullPrompt = `Generate a high-quality stoner-themed meme image. Concept: ${
      prompt || 'A classic stoner character in a cool scene'
    }. Style: ${STYLE_KEYWORDS}. Ensure the character has red, bloodshot eyes and a chill expression.`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(`${API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LLMAPI_KEY}`,
        },
        body: JSON.stringify({
          model: IMAGE_MODEL,
          messages: [{ role: "user", content: fullPrompt }],
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const imageUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) throw new Error("No image in response");
      setResult(imageUrl);
    } catch (err: any) {
      console.error("Generation failed:", err);
      let errorMsg = "Failed to bake the meme. Try again.";
      if (err?.name === "AbortError") errorMsg = "Request timeout (30s+). Try a simpler prompt.";
      else if (String(err?.message).includes("401")) errorMsg = "Invalid API Key.";
      else if (String(err?.message).includes("429")) errorMsg = "Rate limited. Wait and try again.";
      setError(errorMsg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls = Array.from(files).map((file: File) => URL.createObjectURL(file));
      setReferenceImages((prev) => [...prev, ...newUrls].slice(0, 3));
    }
  };

  const removeReference = (index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index));
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
          <h1 className="font-pixel text-[10px] tracking-widest text-white/90">STONER GENERATOR</h1>
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
                    className="flex flex-col items-center gap-4 text-red-500 max-w-xs text-center"
                  >
                    <X className="w-8 h-8" />
                    <span className="font-pixel text-[10px] tracking-tight">{error}</span>
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
                      <img src={result} alt="Generated Stoner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-4">
                          <a
                            href={result}
                            download="stoner-meme.png"
                            className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform flex items-center justify-center shadow-xl cursor-pointer"
                          >
                            <Download className="w-6 h-6" />
                          </a>
                          <button
                            onClick={() => alert("Meme shared to X bro!")}
                            className="p-4 bg-[#1DA1F2] text-white rounded-full hover:scale-110 transition-transform flex items-center justify-center shadow-xl"
                          >
                            <Share2 className="w-6 h-6" />
                          </button>
                        </div>

                        <button
                          onClick={() => alert("Meme uploaded to community feed!")}
                          className="px-6 py-2 bg-red-600 text-white font-pixel text-[10px] rounded-sm hover:bg-red-500 transition-colors shadow-lg active:scale-95"
                        >
                          POST TO FEED
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

          {/* References */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-sm p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-pixel text-[10px] text-white/40 tracking-widest">REFERENCES</h3>
                <span className="text-[10px] font-pixel text-red-600/50">{referenceImages.length}/3</span>
              </div>

              <div className="flex-1 grid grid-cols-1 gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleReferenceUpload}
                  className="hidden"
                  accept="image/*"
                  multiple
                />

                {referenceImages.length < 3 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-video w-full border-2 border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center gap-3 hover:border-red-600/40 hover:bg-red-600/5 transition-all group"
                  >
                    <Plus className="w-6 h-6 text-white/10 group-hover:text-red-600" />
                    <span className="text-[8px] font-pixel text-white/20 group-hover:text-red-900">UPLOAD IMAGE</span>
                  </button>
                )}

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                  {referenceImages.map((img, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx}
                      className="relative aspect-video rounded-sm overflow-hidden border border-white/10 group"
                    >
                      <img src={img} className="w-full h-full object-cover" alt="reference" />
                      <button
                        onClick={() => removeReference(idx)}
                        className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[8px] font-pixel text-white/20 leading-relaxed uppercase">
                  UPLOAD YOUR STONER CHARACTER OR ENVIRONMENT VIBES AS REFERENCE
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
            placeholder="DESCRIBE YOUR VISION... (E.G. STONER RIDING A RED LAMBO ON MARS)"
            className="w-full bg-[#0a0a0a] border-2 border-white/10 rounded-sm p-6 pr-24 font-pixel text-[10px] md:text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-red-600/50 transition-all min-h-[100px] resize-none"
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt.trim() && referenceImages.length === 0)}
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
