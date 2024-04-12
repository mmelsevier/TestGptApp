import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  return new Response(
    JSON.stringify({
      message: "Success!",
    }),
    { status: 200 }
  );
};
