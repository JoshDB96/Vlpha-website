import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async (req, res) => {
  try {
    const { message, tone } = req.body;

    const systemPrompt = `You are Abraxus 4.0, a spiritual AI therapist. Respond in a "${tone}" tone with deep insight, soul, and clarity.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const response = completion.choices?.[0]?.message?.content?.trim() || "Abraxus encountered a divine disruption. Try again later.";

    return res.status(200).json({ response });
  } catch (error) {
    console.error("Abraxus Error:", error.message);
    return res.status(500).json({ response: "A spiritual void occurred. Try again shortly." });
  }
};