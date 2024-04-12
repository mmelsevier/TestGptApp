import type { CompletionRequest } from "../../lib/types";

import type { APIRoute } from "astro";
import OpenAI from "openai";

export const POST: APIRoute = async ({ request }) => {
  const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

  const body = (await request.json()) as CompletionRequest;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: body.message }],
    model: "gpt-3.5-turbo",
  });

  return new Response(
    JSON.stringify({
      message: completion.choices[0],
    }),
    { status: 200 }
  );
};
