import { AiOutlineSend } from "react-icons/ai";
import { motion } from "framer-motion";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
export const PostMessage = ({
  messageValue,
  setMessageValue,
}: {
  messageValue: string;
  setMessageValue: (v: string) => void;
}) => {
  const utils = api.useContext();
  const { data: session, status } = useSession();
  const { data: userData } = api.users.getUser.useQuery(
    {
      id: session?.user?.id as string,
    },
    {
      enabled: !!session?.user?.id,
    }
  );

  const { mutate } = api.guestbook.postMessage.useMutation({
    onMutate: (variables) => {
      void utils.guestbook.getAll.cancel();
      const prevData = utils.guestbook.getAll.getData();
      utils.guestbook.getAll.setData(undefined, (input) => [
        ...(input || []),
        variables,
      ]);
      return {
        prevData,
      };
    },
    onError: (err, newTodo, context) => {
      if (context) {
        utils.guestbook.getAll.setData(undefined, () => context.prevData);
      }
    },
    onSuccess: () => {
      void utils.guestbook.getAll.invalidate();
    },
  });

  const usersName = session?.user?.name || "";

  let currentProvider = "";
  if (userData && userData.accounts.length > 0) {
    currentProvider = userData.accounts[0]?.provider || "";
  }

  console.log(userData)

  return (
    <div className="flex h-12 flex-1 items-center gap-2 rounded-full bg-neutral-900 pl-6 pr-3">
      <input
        value={messageValue}
        placeholder="Post a new comment"
        className="flex w-full items-center bg-transparent py-2 text-base outline-none"
        onChange={(v) => setMessageValue(v.target.value)}
      />
      <button
        disabled={!messageValue.trim()}
        className="flex aspect-square h-8 items-center justify-center rounded-full bg-green-500 transition-colors disabled:bg-neutral-700 disabled:text-neutral-400"
        onClick={() =>
          mutate({
            name: usersName,
            message: messageValue,
            provider: currentProvider,
          })
        }
      >
        <AiOutlineSend />
      </button>
    </div>
  );
};
