// Test script to check which edge function is reachable

const projectId = "qwmtopylhkqcbezcnhws";
const url = `https://${projectId}.supabase.co/functions/v1/generate-image`;

console.log("Testing edge function endpoint:", url);

try {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: "test", postToFeed: false }),
  });
  
  console.log("Status:", response.status);
  console.log("Response:", await response.text());
} catch (err) {
  console.error("Error:", err);
}
