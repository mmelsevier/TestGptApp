import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Messages() {
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const sendMessages = async (messages: Message[]) => {
    setPreviousMessages(messages);
    setMessageInput("");
  };

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    await sendMessages(
      previousMessages.concat({ role: "user", content: messageInput })
    );
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
