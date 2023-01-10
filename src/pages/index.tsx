import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai'

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  return (
    <>
      <Head>
        <title>Guestbook</title>
        <meta name="description" content="Matthew Hausman's Guestbook" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-neutral-900 rounded-full my-2 p-2 flex items-center">
        <div className="bg-neutral-800 rounded-full w-fit p-2">
          <p>MH</p>
        </div>
        <div className="bg-neutral-800 rounded-full w-fit p-2">
          <p>MH</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <button type="button" className="bg-neutral-800 rounded-full w-fit p-2">
            <AiFillGithub className="text-2xl" />
          </button>
          <button type="button" className="bg-blue-600 rounded-full w-fit p-2">
            <AiFillLinkedin className="text-2xl" />
          </button>
        </div>
      </header>
      <main className="">
        <h1>Guestbook</h1>
        <div>
          {session ? (
            <>
              <p>hi {session.user?.name}</p>
              <button onClick={() => {
                void signOut()
              }}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => {
              void signIn("discord")
            }}>
              Login with Discord
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
