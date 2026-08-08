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

## Information architecture (persona-led — don't revert it)

The site is organized around three audiences. Keep it that way:

- Nav is **`NAV` in `lib/constants.ts`** — a grouped model (leaf | menu), **not**
  a flat list. Header = `Get Started` + three persona menus
  (**App Developers / Contributors / Display Vendors**) + a persistent
  **Download** button. Exactly one nav entry highlights as active (first match).
- `/platform-support` is the **merged** status + compatibility page (generated
  version dashboard on top, authored support matrix below). `/status` and
  `/compatibility` 308-redirect there (`next.config.ts`). Don't re-split them.
- `/contribute` is the **Contributor hub** (repo map renders `ecosystemRepos`;
  headline-ADR list is hand-curated). `/docs` is kept but intentionally out of
  the primary nav (footer only).
- The homepage `AudienceSection` ("Who is this for?") mirrors the same three
  personas. Keep nav, homepage, and footer telling one story.

## Content & positioning rules

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
