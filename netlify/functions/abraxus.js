import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event) {
  try {
    const { message, tone } = JSON.parse(event.body);

    const systemPrompt = `You are Abraxus 4.0, a spiritual AI therapist. Respond in a "${tone}" tone with deep insight, soul, and clarity.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const responseText =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "Abraxus could not channel the insight. Try again.";

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText })
    };
  } catch (error) {
    console.error("Abraxus Function Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        response: "Abraxus encountered a disruption in divine logic. Try again shortly."
      })
    };
  }
}