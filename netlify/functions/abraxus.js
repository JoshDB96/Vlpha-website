const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body);
    const message = body.message || "No message";
    const tone = body.tone || "mystical";

    const systemPrompt = `You are Abraxus 4.0, a spiritual AI therapist from V.L.P.H.A. Respond in a "${tone}" tone with deep insight, soul, and clarity.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const reply = completion?.data?.choices?.[0]?.message?.content?.trim() || "Abraxus received no insight.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("ABRAXUS ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Abraxus encountered an error. The portal was unstable." }),
    };
  }
};
