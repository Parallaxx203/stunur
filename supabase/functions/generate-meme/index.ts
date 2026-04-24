import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LLMAPI_BASE = "https://api.llmapi.ai/v1";
const IMAGE_MODEL = "google-ai-studio/gemini-2.5-flash-image";

// Load the locked character reference image (base64) — bundled with the function
let REFERENCE_DATA_URL: string | null = null;
try {
  const b64 = await Deno.readTextFile(
    new URL("./_reference.b64.txt", import.meta.url),
  );
  REFERENCE_DATA_URL = `data:image/jpeg;base64,${b64.trim()}`;
} catch (e) {
  console.error("Failed to load reference image", e);
}

const STYLE_LOCK = `
You MUST generate the SAME character shown in the attached reference image.
Do NOT invent a new face. Do NOT make it photo-realistic. Do NOT change the character.

CHARACTER (FIXED — never deviate):
- Stylized illustrated bust of a fatigued male figure ("Wojak" + Junji Ito blend).
- Hair: SHOCKING DISHEVELED WHITE, spiky, erratic, frayed points.
- Skin: pale, sallow, heavy stippling and cross-hatched distress lines.
- Eyes: deeply BLOODSHOT, heavy bags, sunken sockets, dark empty pupils, thousand-yard stare.
- Facial hair: scruffy dark five-o'clock shadow stubble.
- Expression: profoundly exhausted, somber, world-weary.
- Apparel: BLACK textured blazer over a muted dark CRIMSON RED crew-neck t-shirt.
- A LIT CIGARETTE hangs from the right corner of his mouth, glowing orange tip, thin wispy smoke trailing up-right.

STYLE (FIXED):
- Dark graphic novel ink illustration, intricate pen-and-ink line work.
- Heavy stippling, dot-work, cross-hatching, gritty texture.
- Muted somber palette: black, dark crimson, off-white, grey, sallow skin. High contrast.
- Mood: melancholic, depleted, underground.

The user concept below ONLY changes the SCENE/SETTING/ACTION around this exact character.
Keep the character identical to the reference at all times.
`.trim();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LLMAPI_KEY = Deno.env.get("LLMAPI_KEY");
    if (!LLMAPI_KEY) {
      return new Response(
        JSON.stringify({ error: "LLMAPI_KEY is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { prompt, postToFeed } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (prompt.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Prompt too long (max 2000 chars)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const sceneInstruction =
      `SCENE / CONCEPT (only this changes — character stays identical to reference): ${prompt}`;

    const userContent: any[] = [
      { type: "text", text: `${STYLE_LOCK}\n\n${sceneInstruction}` },
    ];
    if (REFERENCE_DATA_URL) {
      userContent.push({
        type: "image_url",
        image_url: { url: REFERENCE_DATA_URL },
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const llmResp = await fetch(`${LLMAPI_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LLMAPI_KEY}`,
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        messages: [{ role: "user", content: userContent }],
        modalities: ["image", "text"],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!llmResp.ok) {
      const txt = await llmResp.text();
      console.error("LLMAPI error", llmResp.status, txt);
      const status = llmResp.status === 429 ? 429 : 502;
      const message =
        llmResp.status === 401
          ? "Invalid LLMAPI key"
          : llmResp.status === 429
          ? "Rate limited. Please wait and try again."
          : `Image API error (${llmResp.status})`;
      return new Response(JSON.stringify({ error: message }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await llmResp.json();
    const imageUrl: string | undefined =
      data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "No image in API response" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
      if (!match) {
        return new Response(JSON.stringify({ error: "Bad data URL" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      contentType = match[1];
      const b64 = match[2];
      const bin = atob(b64);
      bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    } else {
      const r = await fetch(imageUrl);
      if (!r.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch generated image" }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      contentType = r.headers.get("content-type") || "image/png";
      bytes = new Uint8Array(await r.arrayBuffer());
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ext = contentType.includes("jpeg") ? "jpg" : contentType.split("/")[1] || "png";
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("stoner-memes")
      .upload(fileName, bytes, { contentType, upsert: false });

    if (upErr) {
      console.error("Storage upload failed", upErr);
      return new Response(JSON.stringify({ error: "Failed to save image" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: pub } = supabase.storage
      .from("stoner-memes")
      .getPublicUrl(fileName);

    const publicUrl = pub.publicUrl;

    const { error: dbErr } = await supabase.from("memes").insert({
      image_url: publicUrl,
      prompt,
      author: `STONER_${Math.floor(Math.random() * 9000) + 1000}`,
    });

    if (dbErr) {
      console.error("DB insert failed", dbErr);
    }

    return new Response(
      JSON.stringify({ imageUrl: publicUrl, persisted: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("generate-meme error", err);
    const isAbort = err?.name === "AbortError";
    return new Response(
      JSON.stringify({
        error: isAbort ? "Request timed out. Try a simpler prompt." : "Internal error",
      }),
      {
        status: isAbort ? 504 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
