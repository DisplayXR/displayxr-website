# Keeping displayxr-website in sync with the DisplayXR org

How the website stays current with the rest of the org — new releases, new
demos, new extensions, new repos — without anyone hand-editing data files and
without each source repo needing to know the website exists.

## The problem

The site is a static Next.js app. Historically every fact — the demo list, the
ecosystem repo grid, the extension catalog, the compatibility matrix — was
hand-typed in `lib/data/*.ts`. That drifts the moment anything ships. Concrete
example that motivated this system: the `displayxr-demo-modelviewer` demo
shipped `v0.4.0` and the website still said *"currently just Gaussian Splat"*
for days, because adding a demo meant remembering to also edit three TSX files.

## The core principle: two classes of data, opposite treatment

Everything the website shows about the org falls into one of two buckets, and
they need **opposite** handling. Conflating them is the mistake.

| Class | Examples | Strategy |
|---|---|---|
| **A — mechanically derivable** | repo list, demo list + icons, extension headers, latest-release tag/date/URL per component, the version matrix | **Generate** from the org. Zero judgment. Machine-written, PR-gated. |
| **B — editorial narrative** | roadmap phrasing, device marketing blurbs, ADR / architecture prose, "why now" | **Detect & prompt**, never auto-write. A human (or `/sync-website`) authors the prose. |

A system that mechanically rewrites prose produces garbage; a system that leaves
facts stale is the status quo. So we split the data model along this line and
run two layers over it.

## Source-of-truth map

The website **pulls**; it is not **pushed** individual facts. It discovers
everything from sources the org already maintains for its own reasons. No source
repo takes on a new obligation just to feed the website.

| Website surface | Source of truth | Mechanism |
|---|---|---|
| Version matrix (core components) | `displayxr-runtime/versions.json` | raw fetch — already auto-bumped on every release |
| Component releases (tag, date, assets, URL) | GitHub Releases API per repo | `gh api` / REST |
| **Demo cards** (name, description, 2D icon, **3D SBS icon**, category) | each demo repo's **`*.displayxr.json`** launcher manifest + its `icon` / `icon_3d` PNGs | the *same* contract the Shell's `XR_EXT_app_launcher` reads |
| Engine plugins (Unity / Unreal) | GitHub latest-release tag + repo description; icon from plugin `Resources/` or `*-test` `*_logo_2d` PNG | REST (engines are **not** in `versions.json` — intentionally) |
| Engine sample scenes (`*-test` repos) | GitHub latest-release tag + `*_logo_2d` / `*_logo_3d` PNGs | REST |
| Extension catalog | `displayxr-extensions` directory listing of `XR_EXT_*` | Git tree API |
| Repo / ecosystem grid | org repo list (name, description, topics, archived) | `gh repo list` |
| ADRs / milestones (editorial signal) | `docs/adr/**` across repos (runtime **and** `displayxr-unreal/Docs/DisplayXR/adr/`), GitHub Milestones | Git tree + Issues API — **detected, not rendered** |

### Why `versions.json` is the anchor — and why engines aren't in it

`versions.json` is already the org's canonical "tested-together" version matrix,
auto-bumped on every component release via the `versions-bump.yml` dispatch
flow. Reusing it means **no second source of truth to drift**. But it
deliberately tracks only the bundle-installer components
(`runtime`, `shell`, `leia_plugin`, `mcp_tools`, and the demos). Unity and
Unreal are intentionally **out** of the bundle, so the website's "current
version" is a **union**: `versions.json` ∪ GitHub-latest-release for the
engine plugins. The generator normalizes both into one shape.

### The demo manifest is a real contract — reuse it, don't re-derive it

Every `displayxr-demo-*` repo ships a `*.displayxr.json` next to its icons:

```json
{
  "schema_version": 1,
  "name": "3D Model Viewer",
  "type": "3d",
  "category": "demo",
  "display_mode": "auto",
  "description": "Interactive PBR viewer for 3D models (.glb / .gltf) …",
  "icon": "model_viewer_icon.png",
  "icon_3d": "model_viewer_icon_sbs.png",
  "icon_3d_layout": "sbs-lr"
}
```

This is the file the **Shell already reads** to render the app-launcher tile. By
having the website consume the identical file:

- Demo cards stop being hand-authored. Adding a demo repo with a manifest **is**
  adding it to the website — the modelviewer drift becomes structurally
  impossible.
- The site is a **flat (non-stereo) website**, so only the manifest's 2D `icon`
  is pulled; `icon_3d` (`sbs-lr` side-by-side stereo) is intentionally left
  alone — a side-by-side pair shown flat reads as a doubled image. The
  generator reads the field but does not download the asset.
- `category` / `type` drive placement and badging without curation, and the same
  scan picks up any future first-party app that registers a launcher tile.

**Engine repos differ.** Unity and Unreal generate their launcher manifest at
build time (via `DisplayXRManifestSettings`) rather than checking one into the
tree, so there's no `*.displayxr.json` to read. Their cards are assembled from
the GitHub release + repo description, with the logo taken from the `*-test`
sibling's `*_logo_2d_*.png` (Unity ships PNG; Unreal's `*-test` logos are
`.uasset` and not web-usable, so Unreal falls back to the plugin's
`Resources/Icon128.png`). The generator uses **per-source-type adapters**, not
one uniform scan.

## Architecture

### Layer 1 — mechanical sync (automated, this repo)

```
┌─────────────────────────────────────────────────────────────┐
│  displayxr-website                                           │
│                                                             │
│  .github/workflows/sync-org.yml                             │
│    triggers: schedule (daily) · workflow_dispatch ·         │
│              repository_dispatch{org-changed}               │
│        │                                                    │
│        ▼                                                    │
│  scripts/sync-org.mjs   (GitHub API + versions.json)        │
│        │  per-source-type adapters                          │
│        ▼                                                    │
│  lib/data/generated/*.json   (machine-written)              │
│  public/demos/<repo>/*.png   (committed icons)              │
│        │                                                    │
│        ▼                                                    │
│  if git diff → open/update PR "chore(sync): org data"       │
└─────────────────────────────────────────────────────────────┘
```

- **Pull, PR-gated.** The generator writes `lib/data/generated/*.json` and
  commits demo icons into `public/`. If nothing changed, it's a no-op. If
  something changed, it opens (or updates) a single PR. We PR rather than commit
  to `main` because this is a public marketing site: a 10-second glance before
  new content goes live, plus git history of every change, plus safety against a
  malformed API response nuking content. Merge → Vercel auto-deploys.
- **Generated vs authored split.** `lib/data/generated/*.json` is machine-owned
  and never hand-edited. The authored TSX keeps editorial fields (status
  narrative, marketing copy) and **merges by `id`**. A demo's
  `{tag, releaseUrl, releaseDate, icon, icon3d}` is generated; any extra prose
  stays authored and survives regeneration. A missing blurb falls back to the
  manifest/repo description rather than blanking the card.

### Layer 2 — release-latency hook (one wire, runtime repo)

The daily cron catches everything, but releases deserve sub-minute latency.
`versions-bump.yml` in `displayxr-runtime` is **already** the org-wide "something
released" funnel — every component (runtime, shell, leia, mcp, every demo)
dispatches into it. We add **one step** at its tail: after committing the bump,
`repository_dispatch` an `org-changed` event to `displayxr-website`, using the
`displayxr-publish-bot` App token that's already wired for cross-repo writes.

```
shell / leia / mcp / demo  ── tag v* ──► versions-bump.yml (runtime)
                                              │ commit versions.json
                                              └─► dispatch org-changed ──► sync-org.yml (website)
```

One wire covers every component's releases, forever, with no per-repo work —
exactly the property that makes the existing versions-bump design trustworthy.

### Layer 3 — editorial assist (on demand, `/sync-website` skill)

Class-B content needs judgment. The generator can't write a roadmap entry, but
it **can** notice that the inputs changed and say so. The sync PR body lists
editorial-adjacent signals it detected but did not render:

- new `docs/adr/ADR-*.md` (across runtime **and** unreal) not yet referenced on
  `/architecture`,
- newly-closed milestones,
- a brand-new demo / repo whose card now exists but whose roadmap mention does
  not.

A `/sync-website` Claude skill (hub-homed in `displayxr-runtime/.claude/skills/`
alongside `/dxr-release`, so it's invocable from the runtime hub like every
other release flow) does the prose pass on demand: reads the new
ADRs / milestones / demo READMEs and writes the roadmap / device / architecture
updates into the authored TSX, opening its own PR. Mechanical PR = facts;
skill PR = narrative. They never touch the same fields.

## Data contract (generated files)

`scripts/sync-org.mjs` writes these. Shapes are stable; the authored TSX imports
and merges them.

| File | Shape (per entry) | Adapter |
|---|---|---|
| `generated/components.json` | `{ id, name, version, releaseUrl, releaseDate, platforms }` | versions.json ∪ GitHub releases |
| `generated/demos.json` | `{ id, repo, name, description, category, type, icon, repoUrl, releaseUrl, tag }` | `*.displayxr.json` + 2D icon PNG |
| `generated/engines.json` | `{ id, name, version, engineVersion, description, repoUrl, testRepoUrl, releaseUrl, logo }` | `.uplugin` / `package.json` + releases |
| `generated/extensions.json` | `{ name, group }` | `displayxr-extensions` tree |
| `generated/repos.json` | `{ name, description, url, topics, archived }` | org repo list |
| `generated/_meta.json` | `{ generatedAt, signals: { newAdrs[], newRepos[], closedMilestones[] } }` | editorial-drift detector |

`_meta.signals` is what the workflow renders into the PR body for Layer 3.

## Rollout

1. **Phase 0 (manual, immediate)** — add modelviewer by hand to fix today's
   drift; refactor `lib/data` into the generated/authored split. *(folded into
   Phase 1)*
2. **Phase 1 (this PR)** — `scripts/sync-org.mjs` + `sync-org.yml`
   (cron + dispatch + manual) → first auto-PR. Demo cards, ecosystem grid, and
   extension catalog become generated.
3. **Phase 2** — one `repository_dispatch` step on runtime's `versions-bump.yml`
   for release-latency.
4. **Phase 3** — `/sync-website` skill for editorial passes, driven by
   `_meta.signals`.

## Future: manifest `schema_version: 2`

The launcher manifest has no `homepage` / `tags` field, so a demo card's link is
always its repo. If a demo ever needs to link elsewhere, adding an optional
`homepage` (and free-form `tags`) to `schema_version: 2` is the clean place —
the website would prefer it and fall back to the repo URL. Proposed upstream,
not required for Phase 1.
