"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** A copyable code block. `label` names the language or file. */
export function CodeSnippet({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked (permissions / insecure context): leave it selectable */
    }
  };
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-mono text-text-secondary">{label}</span>
        <button
          type="button"
          onClick={copy}
          data-umami-event="snippet-copy"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed font-mono text-text-primary">
        <code>{code}</code>
      </pre>
    </div>
  );
}
