import { useState, useRef, useEffect } from "react";
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

  const ref = useRef<HTMLTextAreaElement>(null);

  const resizeTextArea = () => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + 1.5 + "px";
    }
  };

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

  useEffect(resizeTextArea, [messageInput]);

  return (
    <section className="flex justify-center py-10">
      <div className="max-w-screen-md w-full">
        <div>
          {previousMessages.map((message) => (
            <Message message={message} />
          ))}
        </div>
        {isPending && <div>...</div>}
        <form
          onSubmit={handleSendMessage}
          className="w-full flex items-end mt-4"
        >
          <textarea
            value={messageInput}
            onChange={(event) => {
              setMessageInput(event.target.value);
            }}
            rows={1}
            required
            className="mr-4 p-2 rounded-lg bg-[#1E282A] border border-gray-600 text-white flex-grow"
            ref={ref}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[#1E282A] border border-[#3B4B4F] text-white enabled:hover:bg-[#3B4B4F] transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
            disabled={isPending || messageInput.length == 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168L3.6 2.4A1 1 0 002 3.227v17.546a1 1 0 001.6.827l11.152-8.768a1 1 0 000-1.664zM21 12a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}

function Message({ message }: { message: Message }) {
  return (
    <div
      className={`${
        message.role === "user"
          ? "bg-green-950 text-white-100"
          : "bg-purple-950 text-gray-100"
      } p-3 my-2 rounded-md`}
    >
      {message.content}
    </div>
  );
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
