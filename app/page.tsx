"use client";

import ReplyMaker from "./components/ReplyMaker";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="w-full max-w-4xl rounded-lg bg-white/90 p-8 shadow-md flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-black">
          ReplyMate — generate reply buttons for tweets
        </h1>
        <p>
          Paste one or more Tweet URLs and the replies you want. The app will
          generate entries that open Twitters reply intent with your text
          prefilled.
        </p>

        <div>
          <button
            type="button"
            className="btn"
            onClick={() =>
              (
                document.getElementById(
                  "help-dialog"
                ) as HTMLDialogElement | null
              )?.showModal()
            }
          >
            How to use
          </button>

          <dialog
            id="help-dialog"
            className="rounded-lg p-6 max-w-lg w-[90%] md:w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-justify"
          >
            <div className="flex flex-col gap-4">
              <p>
                How to use: Copy all the post links and paste them in the first
                textbox. Then either copy the prompt and edit it depending on
                the number of replies you want to generate or create your own
                replies and paste in the second textbox. Make sure each reply is
                on a separate line. Then click on parse urls to clean up and
                parse the urls correctly, then click on parse replies and add
                extra replies depending on the amount of tweets. Once you have
                parsed enough replies, click on create entries. This will
                generate entries with reply buttons that will take you to
                twitter directly with the replies prefilled. Enjoy!
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    (
                      document.getElementById(
                        "help-dialog"
                      ) as HTMLDialogElement | null
                    )?.close()
                  }
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        </div>
        <ReplyMaker />
      </main>
    </div>
  );
}
