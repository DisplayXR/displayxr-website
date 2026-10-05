# CLAUDE.md

Guidance for Claude Code (and any agent) working in **displayxr-website** — the
Next.js 15 / React 19 / Tailwind 4 / MDX marketing + docs site for DisplayXR
(deploys to displayxr.org on Vercel). Basic dev/build commands and the page list
are in `README.md`; this file is the **non-obvious invariants** — the things that
are easy to break and aren't discoverable from the code.

## The one rule that bites: generated vs authored data

`lib/data/generated/*.json` and `public/{demos,engines}/*` are **machine-written**
by `scripts/sync-org.mjs` and **direct-committed to `main` by CI**
(`.github/workflows/sync-org.yml`). **Never hand-edit them** — the next sync
silently overwrites your change.

- Mechanically-derivable facts (component versions, demo cards, engine versions,
  extension *names*, the repo list) come from the org via that generator. To
  change them, change the source (the org / `versions.json`), not the JSON.
- Authored TSX **merges editorial fields onto the generated data by `id`** — e.g.
  a demo card's status/tags overlay in `app/demos/page.tsx`, or the version
  dashboard's framing. Edit those; they survive regeneration.
- Demo cards are driven by each demo repo's `*.displayxr.json` launcher manifest
  (the same file the Shell reads). Adding a demo repo *is* adding it to the site —
  don't hand-author demo cards.
- The **"What's New" feed is the inverse case**: `lib/data/news.ts` is *authored*
  and must stay outside `generated/`. The generator only detects that a release
  happened (`generated/news-candidates.json`); `/sync-website` decides what is
  news and writes the entry. Never auto-fill the feed from release tags — a
  homepage banner reading "v2.4.1 released" is worse than no banner.

Full design + the two-layer model: **`docs/org-sync.md`**. Read it before
touching anything under `lib/data/generated/` or `scripts/sync-org.mjs`.

## The sync system (so you know what runs itself)

- **Mechanical layer** — `sync-org.yml` (daily cron + `org-changed` dispatch from
  the runtime's release flow) regenerates the JSON and **commits straight to
  `main`** (no PR — same "released = tested" contract as the org's
  `versions.json`). Needs only `contents: write`.
- **Editorial layer** — the prose that needs judgment (roadmap phrasing, ADR
  summaries, ecosystem blurbs) is **never auto-written**. It's handled by the
  **`/sync-website` skill, which lives in and is run from the `displayxr-runtime`
  hub** — not from this repo. As an in-repo agent you mostly need to know it
  exists so you (a) don't hand-edit generated data and (b) leave prose drift for
  that skill (or a human) rather than guessing.

## Information architecture (hub-led — don't revert it)

Since the 2026-10 overhaul the site is organized as **one-click hubs**, one per
audience, each opening on that audience's recommended next step:

- Nav is **`NAV` in `lib/constants.ts`**: leaves only, **About · Developers ·
  Contribute · Display Vendors · Browser**, plus a persistent **Download** button and a
  small **Docs ↗** link to the runtime repo's docs (`DOCS_URL`). The model still
  supports menus, but the header deliberately uses none.
- Each leaf's `match` lists the other routes that belong to its hub
  (`/extensions`, `/demos`, `/platform-support`, `/getting-started` →
  Developers; `/architecture`, `/roadmap`, `/governance` → Contribute). Exactly
  one entry highlights as active (first match).
- `/developers` opens on the web path (recommended) with the inline3d snippet,
  then native, then engines. `/web` is the DisplayXR Browser's home (it absorbed
  `/webxr`). `/getting-started` stays live until `/developers/native` replaces it.
- `/download` is OS-detected client-side over a server render of every
  platform, and shows **two ordered installs**: DisplayXR (the bundle), then the
  DisplayXR Browser. Order matters: the browser chains the runtime but not a
  display plug-in, so the browser alone shows 2D only.
- Retired routes 308-redirect in `next.config.ts` (`/webxr`, `/docs`, guessed
  `/display-vendors/*`). Redirect source matching is case-insensitive.
- `/platform-support` is the **merged** status + compatibility page (generated
  version dashboard on top, authored support matrix below). `/status` and
  `/compatibility` 308-redirect there. Don't re-split them.
- `/contribute` is the Contributor hub (repo map renders `ecosystemRepos`;
  headline-ADR list is hand-curated).
- The homepage tells the project's story in five sections: Hero → Why it
  exists → Pick your path (one card per hub) → Browser teaser band → Proof.
  The browser gets its own tab and page; on the homepage it is one band. Keep nav, homepage and footer
  telling one story. `EcosystemMap` now renders on `/about`.

## Content & positioning rules

- **Terminology:** "spatial display(s)" is canonical (the H1 is "OpenXR for
  Spatial Displays"); "3D display" is fine in casual body text. DisplayXR is
  for any spatial display **with or without glasses**: never use
  "glasses-free" as a scope claim, only where it is literally true of a
  specific product or demo.
- **DisplayXR extends OpenXR.** Never "replaces", "alternative to" or "instead
  of OpenXR". Never call the runtime "conformant": no Khronos submission has
  been made. Say it "runs the official Khronos conformance suite".
- Browser and SDK claims follow the platform and feature guardrails in
  `lib/data/web.ts` (macOS browser coming soon; model / player / call / splat
  are preview tier; call depth needs a stereo-camera sender).

- **Vendor-neutral on the home page.** DisplayXR is vendor-agnostic; the home
  page must not single out a hardware vendor as "the first integration" or a
  "privileged path." **Leia** mentions are fine — and expected — on `/download`
  (you download the actual Leia SR installer), `/vendors` (the reference plug-in
  to fork), and `/architecture` (technical detail); keep them off the homepage.
- **The Shell source is private.** Shell source lives in `displayxr-shell-pvt`
  (private); only **binaries / the installer** ship in the public
  `displayxr-shell-releases`. Never imply the shell *source* is open or shared —
  describe it as "ships as a standalone installer," "distributed separately,"
  "register your binary," etc. (The runtime, extensions, MCP framework, engine
  plugins, and demos *are* open source — only the shell is the carve-out.)
- **Depth lives in the runtime repo.** This site **summarizes and routes**; deep
  docs, ADRs, and guides stay in `displayxr-runtime` and are linked, not
  re-hosted. A new ADR is usually internal — don't surface it on the marketing
  site unless it's genuinely user/contributor facing.

## Conventions

- Reuse the primitives: `Card`, `Badge`, `Table`, `PageLayout`,
  `components/home/*`. Match the surrounding voice and Tailwind token usage
  (`text-primary`, `text-secondary`, `surface`, `border`, `accent`).
- Content is plain TSX + typed data in `lib/data/` (authored) — no CMS.
- **Before pushing**, run `npx tsc --noEmit && npm run lint && npm run build`
  (don't push a red build — Vercel auto-deploys `main`). For visual changes,
  `npm run start` and click through; redirects and dropdowns need a real browser.

## Repos this site points at

Org: `https://github.com/DisplayXR`. Source repos (runtime, extensions, unity,
unreal, mcp, displayxr-common, demos) are public; **`displayxr-shell-pvt` is
private** (see above) and the site only links the public `displayxr-shell-releases`.
Repo URLs are centralized in `lib/constants.ts` (`REPO_URLS`).
