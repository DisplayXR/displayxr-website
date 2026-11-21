"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** One copyable command line. Without `copy`, the line is shown but not offered for copying. */
export function CopyLine({ command, copy = true }: { command: string; copy?: boolean }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the line stays selectable */
    }
  };
  return (
    <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-lg border border-border bg-[#050507] py-2.5 pl-4 pr-3">
      <code className="min-w-0 max-w-full overflow-x-auto whitespace-nowrap font-mono text-[13px] text-text-primary [scrollbar-width:none]">
        <span aria-hidden className="select-none text-text-secondary">
          &gt;{" "}
        </span>
        {command}
      </code>
      {copy && (
        <button
          type="button"
          onClick={onCopy}
          data-umami-event="snippet-copy"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border px-2 py-1 text-xs text-text-secondary transition-colors hover:text-text-primary"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
}
