export async function getAdvisoryText(promptText) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/gpt2",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputs: promptText,
        parameters: { max_new_tokens: 120 }
      })
    }
  );

  const data = await response.json();
  return data[0]?.generated_text || "Advisory ain't generated.";
}
