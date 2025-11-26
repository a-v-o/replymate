"use client";

import { useState } from "react";

type TweetEntry = {
  url: string;
  reply: string;
};

function extractTweetId(url: string) {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return undefined;
  const m = trimmedUrl.match(/status\/(\d+)/i);
  if (m && m[1]) return m[1];
}

function makeIntentUrl(tweetId: string, text: string) {
  const base = "https://twitter.com/intent/tweet";
  const params = new URLSearchParams();
  params.set("in_reply_to", tweetId);
  params.set("text", text);
  return `${base}?${params.toString()}`;
}

export default function ReplyMaker() {
  const [entries, setEntries] = useState<TweetEntry[]>([]);
  const [bulkTweetUrls, setBulkTweetUrls] = useState("");
  const [bulkRepliesText, setBulkRepliesText] = useState("");
  const [parsedTweetUrls, setParsedTweetUrls] = useState<string[]>([]);
  const [parsedReplies, setParsedReplies] = useState<string[]>([]);

  function removeEntry(url: string) {
    setEntries((entries) => entries.filter((entry) => entry.url !== url));
  }

  function openReply(url: string, reply: string) {
    let text = reply;
    if (text.length > 260) text = text.slice(0, 260 - 1) + "…";
    const tweetId = extractTweetId(url);
    const intentUrl = makeIntentUrl(tweetId!, text);
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  }

  function parseBulk() {
    const regex =
      /https?:\/\/(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+/g;

    const urls = bulkTweetUrls.match(regex);
    const replies = bulkRepliesText.split(/\r?\n/).map((line) => line.trim());

    setParsedTweetUrls(urls || []);
    setParsedReplies(replies);
  }

  function createEntries() {
    const entries: TweetEntry[] = [];
    parsedTweetUrls.forEach((parsedUrl, index) => {
      const entry = {
        url: parsedUrl,
        reply: parsedReplies[index] || "",
      };
      entries.push(entry);
    });

    setEntries((oldEntries) => [...entries, ...oldEntries]);
    setBulkTweetUrls("");
    setBulkRepliesText("");
    setParsedTweetUrls([]);
    setParsedReplies([]);
  }

  return (
    <div>
      <section className="flex flex-col gap-4 mb-6 border-t pt-6">
        <div className="w-full flex flex-col gap-4">
          <div>
            <label className="block">Tweet URLs (one per line)</label>
            <textarea
              value={bulkTweetUrls}
              onChange={(e) => setBulkTweetUrls(e.target.value)}
              rows={6}
              className="mt-1 block w-full rounded-md p-3 shadow-sm focus:outline-none"
              placeholder={
                "https://twitter.com/user/status/123\nhttps://twitter.com/other/status/456"
              }
            />
          </div>
          <div>
            <label className="block">Replies (one per line)</label>
            <textarea
              value={bulkRepliesText}
              onChange={(e) => setBulkRepliesText(e.target.value)}
              rows={6}
              className="mt-1 block w-full rounded-md p-3 shadow-sm focus:outline-none"
              placeholder={"Nice!\nTotally agree"}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <button onClick={parseBulk} className="bg-emerald-600">
            Parse posts
          </button>
          <button
            onClick={() => {
              setParsedTweetUrls([]);
              setParsedReplies([]);
            }}
            className="bg-amber-600"
          >
            Reset mapping
          </button>
          <button onClick={createEntries} className="bg-blue-600">
            Create entries
          </button>
        </div>

        {parsedTweetUrls.length > 0 && (
          <div className="w-full">
            <div>
              <div className="mb-2">Tweets</div>
              <div className="flex flex-col gap-4">
                {parsedTweetUrls.map((url) => (
                  <div key={url} className="rounded-lg border p-3 bg-white">
                    <p>{url}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2">Generated posts</h2>
        {entries.length === 0 && (
          <p className="text-sm">
            No tweets added yet — add a tweet and some replies to generate
            buttons.
          </p>
        )}

        <div className="flex flex-col gap-4 mt-4">
          {entries.map((entry) => {
            const reply = entry.reply;
            return (
              <div key={entry.url} className="rounded border p-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm break-all">
                      <strong>Tweet:</strong> {entry.url}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeEntry(entry.url)}
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {!reply && <div className="text-sm">No reply provided.</div>}
                  <button
                    onClick={() => openReply(entry.url, reply)}
                    className="border bg-black"
                    title={reply}
                    disabled={reply == ""}
                  >
                    Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
