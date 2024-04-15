import { useState } from "react";
import {
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type {
  CompletionRequest,
  CompletionRequestResponse,
  Message,
} from "../lib/types";

export default function MessagesContainer() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Messages />
    </QueryClientProvider>
  );
}

function Messages() {
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const { isPending, mutateAsync: sendMessages } = useSendMessages();

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessageInput("");

    const messagesToSend = previousMessages.concat({
      role: "user",
      content: messageInput,
    });
    setPreviousMessages(messagesToSend);

    const response = await sendMessages(messagesToSend);

    const messagesToDisplay = messagesToSend.concat({
      role: "assistant",
      content: response.message,
    });

    setPreviousMessages(messagesToDisplay);
  };

  return (
    <section className="p-10">
      <div>
        {previousMessages.map((message) => (
          <Message message={message} />
        ))}
      </div>
      {isPending && <div>...</div>}
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={messageInput}
          onChange={(event) => {
            setMessageInput(event.target.value);
          }}
          required
          className="mr-4 p-2 rounded-lg bg-[#1E282A] border border-gray-600 text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-[#1E282A] border border-[#3B4B4F] text-white hover:bg-[#3B4B4F] transition-colors duration-200"
        >
          Send
        </button>
      </form>
    </section>
  );
}

function Message({ message }: { message: Message }) {
  return <div>{message.content}</div>;
}

const useSendMessages = () => {
  return useMutation({
    mutationFn: sendMessage,
  });
};

const sendMessage = async (messages: Message[]) => {
  const body: CompletionRequest = { messages };

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json() as Promise<CompletionRequestResponse>;
};
