"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { LAUNCH_FILM } from "@/lib/constants";

// Click-to-load YouTube embed. Until someone presses play this is a local
// poster image and a button: no request reaches YouTube, so the page stays
// as fast and as private as it was. On play it swaps in the privacy-enhanced
// (youtube-nocookie.com) player with autoplay. See /privacy#embedded-video.
export function FilmPlayer({ autoplay = false }: { autoplay?: boolean }) {
  const [playing, setPlaying] = useState(autoplay);

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${LAUNCH_FILM.id}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=0`}
          title={LAUNCH_FILM.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-border bg-black"
      aria-label={`Play the film: ${LAUNCH_FILM.title} (${LAUNCH_FILM.length})`}
    >
      <Image
        src={LAUNCH_FILM.poster}
        alt=""
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-transform group-hover:scale-105">
        <Play className="ml-1 h-7 w-7" aria-hidden="true" fill="currentColor" />
      </span>
      <span className="absolute bottom-4 left-4 text-left text-sm text-white/90">
        {LAUNCH_FILM.title} · {LAUNCH_FILM.length}
      </span>
    </button>
  );
}
