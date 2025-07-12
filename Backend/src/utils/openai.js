import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

  export async function getAISuggestedReply(ticketContent, comments = []) {
  const conversation = comments.map((c) =>
    `${c.byAdmin ? "Support" : "User"}: ${c.text}`
  ).join("\n");

  const messages = [
    {
      role: "system",
      content: "You are a helpful support agent. Generate a professional and friendly reply.",
    },
    {
      role: "user",
      content: `Ticket: ${ticketContent}\n\nConversation history:\n${conversation}`,
    },
  ];

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
model: "mistralai/mistral-7b-instruct",
        messages,
        temperature: 0.7,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://ticketingsystem1.netlify.app", 
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ AI Suggestion Error:", error.response?.data || error.message);
    throw new Error("AI service failed. Please try again later.");
  }
}
