import { AiOutlineSend } from "react-icons/ai";
import { api } from "../utils/api";
import { useSession } from "next-auth/react";
import Filter from 'bad-words'

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const filter = new Filter()
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
      setMessageValue("");
      void utils.guestbook.getAll.cancel();
      const prevData = utils.guestbook.getAll.getData();
      utils.guestbook.getAll.setData(undefined, (pastVals) => [
        {
          ...variables,
          createdAt: new Date(),
          id: makeid(8),
        },
        ...(pastVals || []),
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
      void utils.guestbook.getCount.invalidate();
    },
  });

  const usersName = session?.user?.name || "";
  const usersImage = session?.user?.image || "";
  let currentProvider = "";
  if (userData && userData.accounts.length > 0) {
    currentProvider = userData.accounts[0]?.provider || "";
  }

  return (
    <div className="flex flex-1 flex-col gap-1">
      <div className="flex h-12 items-center gap-2 rounded-full bg-neutral-900 pl-6 pr-3">
        <input
          disabled={!session}
          value={messageValue}
          placeholder={
            !session ? "Must sign in to comment" : "Post a new comment"
          }
          className="flex w-full items-center bg-transparent py-2 text-base outline-none"
          onChange={(v) => setMessageValue(v.target.value)}
          onKeyDown={(event) => {
            if (!session) return;
            console.log(event.key);
            if (event.key !== "Enter" || event.metaKey || event.shiftKey)
              return;
            if (messageValue.length > 100) return
            mutate({
              name: usersName,
              message: filter.clean(messageValue),
              provider: currentProvider,
              image: usersImage,
            });
          }}
        />
        <button
          disabled={!messageValue.trim() || !session || messageValue.length > 100}
          className="flex aspect-square h-8 items-center justify-center rounded-full bg-green-500 transition-colors disabled:bg-neutral-700 disabled:text-neutral-400"
          onClick={() =>
            mutate({
              name: usersName,
              message: filter.clean(messageValue),
              provider: currentProvider,
              image: usersImage,
            })
          }
        >
          <AiOutlineSend />
        </button>
      </div>
      <div className="flex justify-start ml-6">
        <p className={`${messageValue.length > 100 ? 'text-red-400' : 'text-neutral-400'} text-sm transition-colors`}>{messageValue.length} / 100 characters used</p>
      </div>
    </div>
  );
};
