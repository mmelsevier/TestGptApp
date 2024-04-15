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
  const { mutateAsync: sendMessages } = useSendMessages();

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    const messagesToSend = previousMessages.concat({
      role: "user",
      content: messageInput,
    });

    const response = await sendMessages(messagesToSend);

    const messagesToDisplay = messagesToSend.concat({
      role: "assistant",
      content: response.message,
    });

    setPreviousMessages(messagesToDisplay);
    setMessageInput("");
  };

  return (
    <section>
      <div>
        {previousMessages.map((message) => (
          <Message message={message} />
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={messageInput}
          onChange={(event) => {
            setMessageInput(event.target.value);
          }}
        />
        <button type="submit">Send</button>
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
