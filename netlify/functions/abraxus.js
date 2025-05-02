const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async function (event, context) {
  try {
    const { message, tone } = JSON.parse(event.body);

    const prompt = `You are Abraxus 4.0, a spiritual AI therapist. Speak in a ${tone} tone. Respond to this prompt with wisdom and soul:\n\n"${message}"`;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Abraxus 4.0, an AI philosopher who answers with spiritual truth and powerful insight." },
        { role: "user", content: prompt }
      ]
    });

    const responseText = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    console.error("Abraxus AI Error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({ response: "Abraxus is momentarily unavailable. Please try again soon." }),
    };
  }
};
