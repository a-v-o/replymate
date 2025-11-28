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
  const defaultPrompt =
    "Generate 50 bullish comments about project growth and potential. One on each line. Do not add any remarks. Just the comments";
  const [bulkRepliesText, setBulkRepliesText] = useState(defaultPrompt);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [parsedTweetUrls, setParsedTweetUrls] = useState<string[]>([]);
  const [parsedReplies, setParsedReplies] = useState<string[]>([]);
  const deficit = parsedTweetUrls.length - parsedReplies.length;

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

  function parseUrls() {
    const regex =
      /https?:\/\/(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/\d+/g;

    const urls = bulkTweetUrls.match(regex);

    setParsedTweetUrls(urls || []);
  }

  function parseReplies() {
    const replies = bulkRepliesText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line != "");
    setParsedReplies((prevReplies) => [...prevReplies, ...replies]);
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
            <label className="block">Tweet URLs</label>
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
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <button className="btn" onClick={parseUrls}>
            Parse urls
          </button>
          <button className="btn" onClick={parseReplies}>
            Parse replies
          </button>
          <button className="btn" onClick={createEntries}>
            Create entries
          </button>
          <button
            className="btn relative"
            onClick={async () => {
              await navigator.clipboard.writeText(defaultPrompt);
              setCopyStatus("Copied!");
              setTimeout(() => setCopyStatus(null), 2000);
            }}
          >
            Copy prompt
            {copyStatus && (
              <span className="text-sm text-zinc-600 absolute -bottom-8 left-1/2 -translate-x-1/2">
                {copyStatus}
              </span>
            )}
          </button>
        </div>

        {parsedTweetUrls.length > 0 && (
          <div className="w-full">
            <p>{parsedTweetUrls.length} urls parsed</p>
          </div>
        )}

        {parsedReplies.length > 0 && (
          <div className="w-full">
            <p>
              {parsedReplies.length} replies parsed.{" "}
              {deficit > 0 && `${deficit} more replies needed`}
            </p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2">Generated entries</h2>
        {entries.length === 0 && (
          <p className="text-sm">
            No tweets added yet — add a tweet and some replies to generate
            buttons.
          </p>
        )}

        <div className="flex flex-col gap-4 mt-4">
          {entries.map((entry, index) => {
            const reply = entry.reply;
            return (
              <div key={entry.url + index} className="rounded border p-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm">Tweet: {entry.url}</div>
                    <div className="text-sm">Reply: {entry.reply}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeEntry(entry.url)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {!reply && <div className="text-sm">No reply provided.</div>}
                  {reply && (
                    <button
                      className="btn"
                      onClick={() => openReply(entry.url, reply)}
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
