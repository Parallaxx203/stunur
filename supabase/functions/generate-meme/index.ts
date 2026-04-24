import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
// Nano Banana 2 — fast, high-quality image editing/generation that respects reference images
const IMAGE_MODEL = "google/gemini-3.1-flash-image-preview";

// Load the locked character reference image — fetched at cold start from Storage
const REFERENCE_URL =
  "https://qwmtopylhkqcbezcnhws.supabase.co/storage/v1/object/public/stoner-memes/_character-reference.jpg";

let REFERENCE_DATA_URL: string | null = null;
try {
  const r = await fetch(REFERENCE_URL);
  if (r.ok) {
    const buf = new Uint8Array(await r.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
    REFERENCE_DATA_URL = `data:image/jpeg;base64,${btoa(bin)}`;
  } else {
    console.error("Failed to fetch reference image", r.status);
  }
} catch (e) {
  console.error("Failed to load reference image", e);
}

const STYLE_LOCK = `
CRITICAL INSTRUCTION: You are EDITING the attached reference image. The character in the reference image MUST appear in the output EXACTLY as shown — same face, same hair, same clothes, same style. DO NOT invent a new character. DO NOT make it photo-realistic. DO NOT change the art style.

THE CHARACTER (copy exactly from reference, NEVER deviate):
- Stylized illustrated bust of a fatigued male figure ("Wojak" + Junji Ito blend)
- Hair: SHOCKING DISHEVELED WHITE, spiky, erratic, frayed jagged points
- Skin: pale, sallow, heavy stippling and cross-hatched distress lines
- Eyes: deeply BLOODSHOT, heavy bags, sunken sockets, dark empty pupils, thousand-yard stare
- Facial hair: scruffy dark five-o'clock shadow stubble
- Expression: profoundly exhausted, somber, world-weary
- Apparel base: BLACK textured blazer over a dark CRIMSON RED crew-neck t-shirt (may swap for scene-appropriate clothing while keeping body proportions and face IDENTICAL)
- A LIT CIGARETTE in the corner of his mouth, glowing orange tip, thin wispy smoke trailing up

ART STYLE (FIXED — never change):
- Dark graphic novel ink illustration with intricate pen-and-ink line work
- Heavy stippling, dot-work, cross-hatching, gritty texture
- Muted somber palette: black, dark crimson, off-white, grey, sallow skin
- High contrast, melancholic, depleted, underground mood
- NEVER photo-realistic, NEVER 3D render, NEVER anime, NEVER cartoon

YOUR TASK: Place this EXACT character (from the reference image) into the new scene described below. Only the SCENE, BACKGROUND, and SECONDARY ELEMENTS change. The character's face, hair, eyes, expression, and overall illustrated style remain IDENTICAL to the reference.
`.trim();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
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

    if (!REFERENCE_DATA_URL) {
      return new Response(
        JSON.stringify({ error: "Reference character image is missing on server" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const sceneInstruction =
      `NEW SCENE / SETTING (only this changes — character must remain IDENTICAL to the attached reference image): ${prompt}`;

    // Reference image FIRST so the model anchors on it, then the instruction
    const userContent: any[] = [
      { type: "image_url", image_url: { url: REFERENCE_DATA_URL } },
      { type: "text", text: `${STYLE_LOCK}\n\n${sceneInstruction}` },
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    const llmResp = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
      console.error("AI gateway error", llmResp.status, txt);
      const status = llmResp.status === 429 ? 429 : llmResp.status === 402 ? 402 : 502;
      const message =
        llmResp.status === 401
          ? "Invalid AI key"
          : llmResp.status === 429
          ? "Rate limited. Please wait and try again."
          : llmResp.status === 402
          ? "AI credits exhausted. Top up your Lovable AI workspace."
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
      author: `STUNUR_${Math.floor(Math.random() * 9000) + 1000}`,
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
