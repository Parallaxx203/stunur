import fs from 'fs';

const LLM_API_URL = "https://api.llmapi.ai/v1/chat/completions";
const API_KEYS = [
  "llmapi_56e1bcc7d325e1985199f29375d3e2295292fb263de6b678e2b9f8d2a1502eff",
  "llmapi_d461ba85ea25c8f0efc17febe4dcc4b49424aafe17d3e25d8bade9ede0915332"
];
const MODEL = "gemini-2.5-flash";
const REFERENCE_URL = "https://qwmtopylhkqcbezcnhws.supabase.co/storage/v1/object/public/stoner-memes/_character-reference.jpg";

const API_KEY = API_KEYS[0];

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

const testPrompt = "sitting at a computer desk, typing frantically, coffee cup nearby, looking stressed and determined";

console.log("🧪 Testing Gemini 2.5 Flash with reference image...");
console.log(`📷 Reference: ${REFERENCE_URL}`);
console.log(`💬 Prompt: ${testPrompt}`);
console.log("");

try {
  const response = await fetch(LLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{
        role: "user",
        content: [
          { type: "image_url", image_url: { url: REFERENCE_URL } },
          { type: "text", text: `${STYLE_LOCK}\n\nEDIT: ${testPrompt}` },
        ],
      }],
    }),
  });

  console.log(`📊 Response Status: ${response.status}`);
  
  if (!response.ok) {
    const error = await response.text();
    console.error("❌ API Error:", error);
    process.exit(1);
  }

  const data = await response.json();
  console.log(`✅ Response received`);
  
  const imageUrl = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  
  if (!imageUrl) {
    console.error("❌ No image in response. Full response:");
    console.log(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log("\n🎉 SUCCESS! Image generated:");
  console.log(`🖼️  Image URL: ${imageUrl}`);
  
  // Save the URL to a file
  fs.writeFileSync('/home/claude/stunur/GENERATED_IMAGE_TEST.txt', imageUrl, 'utf8');
  console.log("\n✅ Image URL saved to: GENERATED_IMAGE_TEST.txt");
  
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
