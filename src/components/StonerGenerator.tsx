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
  Upload,
  RefreshCw,
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
  const [uploadedImage, setUploadedImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const DEFAULT_REFERENCE_URL = "https://qwmtopylhkqcbezcnhws.supabase.co/storage/v1/object/public/stoner-memes/_character-reference.jpg";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const callGenerate = async (postToFeed: boolean) => {
    const apiKeys = [
      "llmapi_56e1bcc7d325e1985199f29375d3e2295292fb263de6b678e2b9f8d2a1502eff",
      "llmapi_d461ba85ea25c8f0efc17febe4dcc4b49424aafe17d3e25d8bade9ede0915332"
    ];
    const LLM_API_KEY = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const LLM_API_URL = "https://api.llmapi.ai/v1/chat/completions";
    const MODEL = "gemini-3.1-flash-image-preview";

    const imageSource = uploadedImage ? uploadedImage : DEFAULT_REFERENCE_URL;

    const STYLE_LOCK = uploadedImage
      ? `You are EDITING the attached image. Keep the EXACT SAME CHARACTER, face, and art style. Re-render them in a new scene based on the prompt. Keep their identity locked - same face, same style, same person. Only change the scene, pose, outfit, and background.\n\nEDIT: ${prompt.trim()}`
      : `You are EDITING the attached reference image. Keep the EXACT SAME CHARACTER (same face, identity, art style) and re-render in a new scene/pose/outfit.

CHARACTER LOCK:
- Stylized illustrated male figure ("Wojak" + Junji Ito blend)
- Hair: shocking disheveled WHITE, spiky, erratic, jagged frayed points
- Skin: pale, sallow, heavy stippling and cross-hatched distress lines
- Eyes: deeply BLOODSHOT, heavy bags, sunken sockets, dark pupils
- Facial hair: scruffy dark five-o'clock shadow stubble

WHAT CAN CHANGE:
- Pose, body position, framing, camera angle
- Clothing and outfit
- Facial expression (subtle variation OK)
- Background, setting, lighting, props

ART STYLE:
- Dark graphic novel ink illustration
- Heavy stippling, dot-work, cross-hatching
- Muted palette: black, dark crimson, off-white, grey
- High contrast, melancholic mood

EDIT: ${prompt.trim()}`;

    // Try both keys, retry once on failure
    let data: any = null;
    let lastError = '';
    for (const key of apiKeys) {
      try {
        const response = await fetch(LLM_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [{
              role: "user",
              content: [
                { type: "image_url", image_url: { url: imageSource } },
                { type: "text", text: STYLE_LOCK },
              ],
            }],
          }),
        });
        if (!response.ok) {
          lastError = `API ${response.status}`;
          continue;
        }
        data = await response.json();
        if (data?.choices?.[0]) break;
      } catch (e: any) {
        lastError = e.message;
        continue;
      }
    }

    if (!data) throw new Error(`Generation failed: ${lastError}`);

    // Handle multiple possible response formats
    const msg = data?.choices?.[0]?.message;
    const imageUrl =
      msg?.images?.[0]?.image_url?.url ||
      msg?.images?.[0]?.url ||
      msg?.content?.find?.((c: any) => c.type === 'image_url')?.image_url?.url ||
      (typeof msg?.content === 'string' && msg.content.startsWith('data:') ? msg.content : null);

    if (!imageUrl) {
      console.error("API response:", JSON.stringify(data).slice(0, 300));
      throw new Error("No image returned from API");
    }

    if (postToFeed) {
      try {
        const imgResp = await fetch(imageUrl);
        if (!imgResp.ok) throw new Error("Failed to fetch image");
        const contentType = imgResp.headers.get("content-type") || "image/png";
        const bytes = new Uint8Array(await imgResp.arrayBuffer());

        const ext = contentType.includes("jpeg") ? "jpg" : contentType.split("/")[1] || "png";
        const fileName = `${crypto.randomUUID()}.${ext}`;

        const { error: upErr } = await supabase.storage
          .from("stoner-memes")
          .upload(fileName, bytes, { contentType, upsert: false });

        if (upErr) throw new Error("Storage upload failed");

        const { data: pub } = supabase.storage
          .from("stoner-memes")
          .getPublicUrl(fileName);

        const publicUrl = pub.publicUrl;

        await supabase.from("memes").insert({
          image_url: publicUrl,
          prompt: prompt.trim(),
          author: `STUNUR_${Math.floor(Math.random() * 9000) + 1000}`,
        });

        return { imageUrl: publicUrl, persisted: true };
      } catch (err) {
        console.error("Error saving to feed:", err);
        return { imageUrl, persisted: false };
      }
    }

    return { imageUrl, persisted: false };
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
      setError(err?.message || 'Failed to generate. Try again.');
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

          {/* Output display */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="aspect-square md:aspect-video w-full bg-zinc-950 border-2 border-dashed border-white/10 rounded-sm relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6 z-10">
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
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 text-red-500 max-w-xs text-center px-4">
                    <X className="w-8 h-8" />
                    <span className="font-pixel text-[10px] tracking-tight leading-relaxed">{error}</span>
                    <button onClick={handleGenerate} className="text-[8px] font-pixel text-white/40 hover:text-white underline mt-2">TRY AGAIN</button>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full p-4">
                    <div className="w-full h-full relative group/image rounded-sm overflow-hidden border border-white/10">
                      <img src={result} alt="Generated" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-4">
                          <a href={result} download="stunur.png" target="_blank" rel="noopener noreferrer" className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform flex items-center justify-center shadow-xl cursor-pointer">
                            <Download className="w-6 h-6" />
                          </a>
                          <button onClick={() => { navigator.clipboard.writeText(result); toast.success('Image URL copied!'); }} className="p-4 bg-[#1DA1F2] text-white rounded-full hover:scale-110 transition-transform flex items-center justify-center shadow-xl">
                            <Share2 className="w-6 h-6" />
                          </button>
                        </div>
                        <button onClick={handlePostToFeed} disabled={isPosting || resultPersisted} className="px-6 py-2 bg-red-600 text-white font-pixel text-[10px] rounded-sm hover:bg-red-500 transition-colors shadow-lg active:scale-95 disabled:bg-white/10 disabled:text-white/40">
                          {resultPersisted ? 'POSTED ✓' : isPosting ? 'POSTING...' : 'POST TO FEED'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 text-white/20">
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

          {/* Reference image panel - upload or default */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-sm p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-[10px] text-white/40 tracking-widest">REFERENCE IMAGE</h3>
                {uploadedImage && (
                  <button onClick={() => setUploadedImage(null)} className="text-[9px] font-pixel text-red-500/70 hover:text-red-400 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> RESET
                  </button>
                )}
              </div>

              {/* Image preview */}
              <div
                className="relative aspect-square w-full rounded-sm overflow-hidden border border-white/10 cursor-pointer group/upload mb-4"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={uploadedImage || referenceImg}
                  alt="Reference"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/upload:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Upload className="w-8 h-8 text-white" />
                  <span className="font-pixel text-[9px] text-white tracking-wider">UPLOAD IMAGE</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-md rounded-sm border border-white/20">
                  <span className="text-[8px] font-pixel text-white/60 tracking-wider uppercase truncate">
                    {uploadedImage ? '✓ CUSTOM IMAGE' : 'DEFAULT · CLICK TO CHANGE'}
                  </span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              <div className="text-[9px] font-pixel text-white/40 leading-relaxed uppercase tracking-wide">
                {uploadedImage
                  ? 'YOUR IMAGE IS THE REFERENCE. DESCRIBE THE SCENE TO REMIX IT.'
                  : 'USING DEFAULT STUNUR CHARACTER. UPLOAD YOUR OWN IMAGE TO USE IT INSTEAD.'}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 border border-white/10 hover:border-red-600/50 text-white/40 hover:text-white font-pixel text-[9px] tracking-widest rounded-sm transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-3 h-3" /> UPLOAD REFERENCE
                </button>
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
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
            placeholder="DESCRIBE THE SCENE... (E.G. STUNUR RIDING A RED LAMBO THROUGH DUBAI AT NIGHT)"
            className="w-full bg-[#0a0a0a] border-2 border-white/10 rounded-sm p-6 pr-24 font-pixel text-[10px] md:text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-red-600/50 transition-all min-h-[100px] resize-none"
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-red-600 hover:bg-red-500 disabled:bg-white/5 disabled:text-white/20 p-4 rounded-sm transition-all shadow-[0_0_20px_rgba(255,0,0,0.2)] active:scale-95 group/btn text-white"
            >
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />}
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

