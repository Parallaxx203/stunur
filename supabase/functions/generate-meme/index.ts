import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LLMAPI_BASE = "https://api.llmapi.ai/v1";
const IMAGE_MODEL = "google-ai-studio/gemini-2.5-flash-image";

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

    const fullPrompt =
      `Generate a high-quality stoner-themed meme image. Concept: ${prompt}. ` +
      `Style: vibrant, slightly gritty, meme-ready, artistic, cinematic. ` +
      `Ensure the character has red, bloodshot eyes and a chill expression.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    const llmResp = await fetch(`${LLMAPI_BASE}/chat/completions`, {
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

    // If posting to feed, persist to storage + DB; otherwise return raw URL/data
    if (!postToFeed) {
      return new Response(JSON.stringify({ imageUrl, persisted: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Convert data URL or http URL to bytes
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
      // Image is saved; still return the URL
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
