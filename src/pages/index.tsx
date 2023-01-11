import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter } from "react-icons/ai";
import Image from "../components/Image";
import { PostMessage } from "../components/PostMessage";
import { useRef, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { motion, AnimatePresence, useInView } from "framer-motion";

const formatDiscordDate = (date: Date) => {
  const returnObj = {
    month: "",
    day: "",
    year: "",
    time: "",
  };
  const monthNum = date.getMonth() + 1;
  if (monthNum < 10) {
    returnObj.month = `0${monthNum}`;
  } else {
    returnObj.month = `${monthNum}`;
  }
  const dayNum = date.getDay() + 1;
  if (dayNum < 10) {
    returnObj.day = `0${dayNum}`;
  } else {
    returnObj.day = `${dayNum}`;
  }
  returnObj.year = `${date.getFullYear()}`;
  const isAm = date.getHours() < 12 || date.getHours() === 24;
  returnObj.time =
    (date.getHours() % 12) < 10 ? `0${date.getHours() % 12}` : `${date.getHours() % 12}` +
    ":" +
    (date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`) +
    " " +
    (isAm ? "AM" : "PM");
  return (
    returnObj.month +
    "/" +
    returnObj.day +
    "/" +
    returnObj.year +
    " " +
    returnObj.time
  );
};
const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data: messages } = api.guestbook.getAll.useQuery();
  const { data: messageCount } = api.guestbook.getCount.useQuery()
  const [messageValue, setMessageValue] = useState("");
  const ref = useRef(null)
  const isInView = useInView(ref)
  console.log(isInView)
  return (
    <>
      <Head>
        <title>Matt&apos;s Guestbook</title>
        <meta name="description" content="Matthew Hausman's Guestbook" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="mt-4 mb-2 flex h-14 items-center rounded-full bg-neutral-900 p-2">
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
      <AnimatePresence>
        {status !== "loading" && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4 mt-6 mb-6"
          >
            {!session && (
              <div className="my-2 flex justify-center gap-2">
                <>
                  <motion.button
                    layoutId="discord"
                    className="flex items-center gap-2 rounded-md bg-purple-600 p-3 transition-colors disabled:bg-neutral-700 disabled:text-neutral-500"
                    onClick={() => void signIn("discord")}
                  >
                    <FaDiscord className="text-xl" />
                    <p className="text-sm tracking-wide">
                      Sign in with Discord
                    </p>
                  </motion.button>
                  <motion.button
                    layoutId="twitter"
                    className="flex items-center gap-2 rounded-md bg-blue-500 p-3 transition-colors disabled:bg-neutral-700 disabled:text-neutral-500"
                    onClick={() => void signIn("discord")}
                  >
                    <AiOutlineTwitter className="text-xl" />
                    <p className="text-sm tracking-wide">
                      Sign in with Twitter
                    </p>
                  </motion.button>
                </>
              </div>
            )}
            <div className="flex items-start gap-2">
              <PostMessage
                messageValue={messageValue}
                setMessageValue={setMessageValue}
              />
              {session && (
                <button
                  className="mt-[1px] ml-auto w-fit rounded-md bg-purple-600 p-3"
                  onClick={() => void signOut()}
                >
                  {" "}
                  <p className="text-sm tracking-wide">Sign Out</p>
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <p className="text-lg">Messages</p>
              <div className="px-2 bg-neutral-800 flex items-center justify-center rounded-md">
                <span className="text-base text-neutral-300">{messageCount}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {messages?.map((msg) => {
                return (
                  <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: .2}}
                    className="flex gap-4 rounded-sm bg-zinc-800 p-2 hover:bg-zinc-900"
                    key={msg.id}
                    layoutId={msg.id}
                    layout
                  >
                    <div className="relative aspect-square h-10 overflow-hidden rounded-full">
                      <Image
                        src={msg.image}
                        alt={`${msg.name} message`}
                        fill={true}
                        priority={false}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden break-words">
                      <div className="flex items-end gap-3">
                        <p className="text-sm font-medium tracking-wide">
                          {msg.name}
                        </p>
                        <p className="relative -top-[2px] text-xs tracking-wide text-neutral-400">
                          {formatDiscordDate(msg.createdAt)}
                        </p>
                      </div>
                      <p className="mt-1 text-base text-neutral-300 white">
                        {msg.message}
                      </p>
                    </div>
                    <FaDiscord className="ml-auto mr-2 self-center text-4xl" />
                  </motion.div>
                );
              })}
              {messages && <div ref={ref} className="w-full h-[1px]"></div>}
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;
