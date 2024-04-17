import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Markdown from "react-markdown";

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
      {message.role == "user" ? (
        message.content
      ) : (
        <Markdown
          components={{
            code: CodeMarkdownReplacement,
            p: ParagraphMarkdownReplacement,
          }}
        >
          {message.content}
        </Markdown>
      )}
    </div>
  );
}

type CodeMarkdownReplacementProps = {
  children?: React.ReactNode;
  className?: string | undefined;
};

const CodeMarkdownReplacement = (props: CodeMarkdownReplacementProps) => {
  const match = /language-(\w+)/.exec(props.className || "");
  return match ? (
    <SyntaxHighlighter
      children={String(props.children).replace(/\n$/, "")}
      language={match[1]}
      style={darcula}
    />
  ) : (
    <code className="bg-gray-700 text-orange-400 font-mono text-sm px-[4px] py-[1px] rounded-md">
      {props.children}
    </code>
  );
};

const ParagraphMarkdownReplacement = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  return <p className="mb-2 whitespace-pre-wrap">{children}</p>;
};
