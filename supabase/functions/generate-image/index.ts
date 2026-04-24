import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LLM_API_URL = "https://api.llmapi.ai/v1/chat/completions";
const LLM_API_KEY = "llmapi_56e1bcc7d325e1985199f29375d3e2295292fb263de6b678e2b9f8d2a1502eff";
const MODEL = "gemini-3.1-flash-image-preview";

const REFERENCE_URL = "https://qwmtopylhkqcbezcnhws.supabase.co/storage/v1/object/public/stoner-memes/_character-reference.jpg";

let REFERENCE_DATA_URL: string | null = null;
try {
  const r = await fetch(REFERENCE_URL);
  if (r.ok) {
    const buf = new Uint8Array(await r.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
    REFERENCE_DATA_URL = `data:image/jpeg;base64,${btoa(bin)}`;
  }
} catch (e) {
  console.error("Failed to load reference image", e);
}

const STYLE_LOCK = `You are EDITING the attached reference image. Keep the EXACT SAME CHARACTER (same face, identity, art style) and re-render in a new scene/pose/outfit.

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
- High contrast, melancholic mood`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, postToFeed } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!REFERENCE_DATA_URL) {
      return new Response(
        JSON.stringify({ error: "Reference image missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userContent = [
      { type: "image_url", image_url: { url: REFERENCE_DATA_URL } },
      { type: "text", text: `${STYLE_LOCK}\n\nEDIT: ${prompt}` },
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const response = await fetch(LLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: userContent }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.text();
      console.error("LLM API error", response.status, error);
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response", JSON.stringify(data).slice(0, 500));
      throw new Error("No image returned from API");
    }

    if (!postToFeed) {
      return new Response(JSON.stringify({ imageUrl, persisted: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let bytes: Uint8Array;
    let contentType = "image/png";

    if (imageUrl.startsWith("data:")) {
      const match = imageUrl.match(/^data:([^;]+);base64,(.*)$/);
      if (!match) throw new Error("Bad data URL");
      contentType = match[1];
      const bin = atob(match[2]);
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    } else {
      const r = await fetch(imageUrl);
      if (!r.ok) throw new Error("Failed to fetch image");
      contentType = r.headers.get("content-type") || "image/png";
      bytes = new Uint8Array(await r.arrayBuffer());
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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
      prompt,
      author: `STUNUR_${Math.floor(Math.random() * 9000) + 1000}`,
    });

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, persisted: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
