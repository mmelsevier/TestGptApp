import type { APIRoute } from "astro";
import OpenAI from "openai";

export const POST: APIRoute = async ({ request }) => {
  const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);

  return new Response(
    JSON.stringify({
      message: import.meta.env.OPENAI_API_KEY,
    }),
    { status: 200 }
  );
};
