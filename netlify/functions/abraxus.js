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

    const responseText =
      completion.data.choices &&
      completion.data.choices[0] &&
      completion.data.choices[0].message &&
      completion.data.choices[0].message.content
        ? completion.data.choices[0].message.content
        : "Abraxus could not find a response. Try again.";

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    console.error("Abraxus Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        response: "Abraxus crashed trying to channel the divine. Try again later.",
      }),
    };
  }
};