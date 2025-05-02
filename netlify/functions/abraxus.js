const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event) {
  try {
    const { message, tone } = JSON.parse(event.body);

    const systemPrompt = `You are Abraxus 4.0, a spiritual AI therapist. Respond in a "${tone}" tone with deep insight, soul, and clarity.`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    const responseText = completion?.data?.choices?.[0]?.message?.content?.trim() ||
      "Abraxus couldn’t channel the insight. Try again.";

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    console.error("Abraxus Function Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        response: "Abraxus encountered a divine disruption. Try again later.",
      }),
    };
  }
};