import type {
  CompletionRequest,
  CompletionRequestResponse,
} from "../../lib/types";

import type { APIRoute } from "astro";
import OpenAI from "openai";

export const POST: APIRoute = async ({ request }) => {
  const openai = new OpenAI({ apiKey: import.meta.env.OPENAI_API_KEY });

  const body = (await request.json()) as CompletionRequest;

  const openaiResponse = await openai.chat.completions.create({
    // Model options: https://platform.openai.com/docs/models/continuous-model-upgrades
    model: "gpt-4-turbo-preview",
    // messages sent
    messages: body.messages,
  });

  const message = openaiResponse.choices[0]?.message.content;

  if (!message) {
    return new Response("", { status: 500 });
  }

  const response: CompletionRequestResponse = { message };

  return new Response(JSON.stringify(response), { status: 200 });
};
