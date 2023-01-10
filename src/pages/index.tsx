import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter } from "react-icons/ai";
import Image from "../components/Image";
import { AiOutlineSend } from "react-icons/ai";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: messages, isLoading } = api.guestbook.getAll.useQuery();
  const utils = api.useContext();
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

  return (
    <>
      <Head>
        <title>Guestbook</title>
        <meta name="description" content="Matthew Hausman's Guestbook" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="my-2 flex h-14 items-center rounded-full bg-neutral-900 p-2">
        <div className="relative aspect-square h-full overflow-hidden rounded-full bg-neutral-800 p-2">
          <Image
            src="/pro-pic.jpg"
            alt={"Matt's pro pic"}
            fill={true}
            priority={true}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="ml-3 flex flex-col">
          <h1 className="text-sm font-medium tracking-wide text-neutral-300">
            {"MATT'S GUESTBOOK"}
          </h1>
          <p className="text-xs text-neutral-400">
            say wassup below. Be polite pls
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            className="aspect-square h-full w-fit rounded-full bg-neutral-800 p-2"
          >
            <AiFillGithub className="text-2xl" />
          </button>
          <button
            type="button"
            className="aspect-square h-full w-fit rounded-full bg-blue-600 p-2"
          >
            <AiFillLinkedin className="text-2xl" />
          </button>
          <button
            type="button"
            className="aspect-square h-full w-fit rounded-full bg-blue-500 p-2"
          >
            <AiOutlineTwitter className="text-2xl" />
          </button>
        </div>
      </header>
      <div className="flex items-center gap-2">
        <input
          placeholder="Start a new comment"
          className="flex min-h-[theme(height.12)] w-full items-center rounded-full bg-neutral-900 px-4 py-2 text-base outline-none"
        />
        <button className="flex aspect-square h-8 items-center justify-center rounded-full bg-green-500">
          <AiOutlineSend />
        </button>
      </div>
      <main className="">
        <div>
          {session ? (
            <>
              <p>hi {session.user?.name}</p>
              <button
                onClick={() => {
                  void signOut();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                void signIn("discord");
              }}
            >
              Login with Discord
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
