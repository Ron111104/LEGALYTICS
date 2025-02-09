import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid request. Message is required." });
  }

  try {
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are Legalytics AI, an expert in legal research and assistance. 
                      Your focus is on:
                      - Legal document summarization
                      - Named Entity Recognition (L-NER)
                      - Case similarity detection
                      - Legal case retrieval
                      - Multilingual legal text processing
                      - AI-driven legal consumer assistance

                      Respond concisely and only within these topics. 
                      If a question is outside this scope, politely redirect the user.`
          },
          { role: "user", content: message }
        ],
        temperature: 0.6,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
      }
    );

    const botResponse =
      openaiResponse.data.choices?.[0]?.message?.content ||
      "I'm sorry, I couldn't process that.";

    return res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Chatbot API Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
}
