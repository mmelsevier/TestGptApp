export type MessagePayload = {
  // "user" - user, "system" - context, "tool" - function
  role: "user" | "assistant";
  content: string;
};

export type CompletionRequest = { messages: MessagePayload[] };
export type CompletionRequestResponse = { message: string };
