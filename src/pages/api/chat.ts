import type { CompletionRequest } from "../../lib/types";

import type { APIRoute } from "astro";
import OpenAI from "openai";

export const POST: APIRoute = async ({ request }) => {
  const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

  const body = (await request.json()) as CompletionRequest;

  const completion = await openai.chat.completions.create({
    // Model options: https://platform.openai.com/docs/models/continuous-model-upgrades
    model: "gpt-4-turbo-preview",
    // messages sent
    messages: [
      {
        // "user" - user, "system" - context, "tool" - function
        role: "user",
        content: body.message,
      },
    ],
  });

  return new Response(
    JSON.stringify({
      message: completion.choices[0],
    }),
    { status: 200 }
  );
};
