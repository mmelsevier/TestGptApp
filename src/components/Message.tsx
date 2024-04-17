import type { MessagePayload } from "../lib/types";

export default function Message({ message }: { message: MessagePayload }) {
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
