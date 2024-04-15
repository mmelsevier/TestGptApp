export type Message = {
  // "user" - user, "system" - context, "tool" - function
  role: "user" | "assistant";
  content: string;
};

export type CompletionRequest = { messages: Message[] };
export type CompletionRequestResponse = { message: string };
