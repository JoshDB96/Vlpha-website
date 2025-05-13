const openai = require("openai");

openai.apiKey = process.env.OPENAI_API_KEY;

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const message = body.message || "No message";
    const tone = body.tone || "mystical";

    const systemPrompt = `You are Abraxus 4.0, a spiritual AI therapist from V.L.P.H.A. Respond in a "${tone}" tone with deep insight, soul, and clarity.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const result = await response.json();

    const reply = result?.choices?.[0]?.message?.content?.trim() || "Abraxus received no insight.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("ABRAXUS ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Abraxus encountered a disruption in the current." }),
    };
  }
};