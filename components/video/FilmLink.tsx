"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { LAUNCH_FILM } from "@/lib/constants";
import { FilmPlayer } from "@/components/video/FilmPlayer";

// A link to the launch film that opens it in a pop-up player on the page.
// It is a real link to YouTube, so it still works without JavaScript, and a
// modified click (new tab, new window) keeps the browser's default. The
// player mounts only while the dialog is open, so closing it stops playback.
export function FilmLink({ className, children }: { className?: string; children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a href={LAUNCH_FILM.url} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
        {children}
      </a>
      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // A click on the backdrop (the dialog element itself) closes it.
          if (e.target === e.currentTarget) setOpen(false);
        }}
        aria-label={LAUNCH_FILM.title}
        className="m-auto w-[min(92vw,1100px,calc((100dvh-6rem)*16/9))] overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white"
            aria-label="Close the film"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {open && <FilmPlayer autoplay />}
      </dialog>
    </>
  );
}
