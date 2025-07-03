import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAISuggestedReply(ticketContent, comments = []) {
  const messages = [
    {
      role: "system",
      content: "You are a helpful support agent. Generate a professional and friendly reply.",
    },
    {
      role: "user",
      content: `Ticket: ${ticketContent}`,
    },
    ...comments.map((c) => ({
      role: c.byAdmin ? "assistant" : "user",
      content: c.text,
    })),
  ];

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.6,
    max_tokens: 250,
  });

  return res.choices[0].message.content;
}
