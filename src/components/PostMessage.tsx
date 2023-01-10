import { AiOutlineSend } from "react-icons/ai";

export const PostMessage = ({
  messageValue,
  setMessageValue,
}: {
  messageValue: string;
  setMessageValue: (v: string) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        value={messageValue}
        placeholder="Post a new comment"
        className="flex min-h-[theme(height.12)] w-full items-center rounded-full bg-neutral-900 px-4 py-2 text-base outline-none"
        onChange={(v) => setMessageValue(v.target.value)}
      />
      <button className="flex aspect-square h-8 items-center justify-center rounded-full bg-green-500">
        <AiOutlineSend />
      </button>
    </div>
  );
};
