"use client";

import ReplyMaker from "./components/ReplyMaker";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="w-full max-w-4xl rounded-lg bg-white/90 p-8 shadow-md">
        <h1 className="mb-4 text-2xl font-semibold text-black">
          ReplyMate — generate reply buttons for tweets
        </h1>
        <p className="mb-6">
          Paste one or more Tweet URLs and the replies you want. The app will
          generate buttons that open Twitters reply intent with your text
          prefilled.
        </p>
        <ReplyMaker />
      </main>
    </div>
  );
}
