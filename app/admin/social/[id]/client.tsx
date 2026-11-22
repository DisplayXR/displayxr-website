"use client";

import { useState } from "react";
import { countFor } from "@/lib/social/count";
import { LIMITS, type Channel } from "@/lib/social/types";

export function CaptionField({
  channel,
  name,
  defaultValue,
  kind,
  readOnly,
  rows = 5,
}: {
  channel: Channel;
  name: string;
  defaultValue: string;
  kind: "text" | "title";
  readOnly?: boolean;
  rows?: number;
}) {
  const [v, setV] = useState(defaultValue);
  const limit = kind === "title" ? LIMITS[channel].title ?? 300 : LIMITS[channel].text;
  const n = kind === "title" ? [...v].length : countFor(channel, v);
  const over = n > limit;
  const id = `${name}-field`;
  return (
    <div>
      <label htmlFor={id} className="sr-only">{kind === "title" ? "Title" : "Text"}</label>
      {kind === "title" ? (
        <input
          id={id}
          name={name}
          value={v}
          onChange={(e) => setV(e.target.value)}
          readOnly={readOnly}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text-primary"
        />
      ) : (
        <textarea
          id={id}
          name={name}
          value={v}
          rows={rows}
          onChange={(e) => setV(e.target.value)}
          readOnly={readOnly}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed text-text-primary"
        />
      )}
      <div className={`mt-1 text-right text-xs tabular-nums ${over ? "text-red-400" : "text-text-secondary"}`}>
        {n} / {limit}
        {channel === "x" && kind === "text" ? " (links count as 23)" : ""}
      </div>
    </div>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="rounded-md border border-border px-3 py-1.5 text-sm text-text-primary hover:bg-surface-hover"
    >
      {done ? "Copied" : "Copy text"}
    </button>
  );
}
