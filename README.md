# displayxr-website

Source for the [displayxr.org](https://displayxr.org) project website — a Next.js 15 / React 19 / Tailwind 4 / MDX site that documents the DisplayXR open OpenXR runtime for 3D displays.

## Develop locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## Site structure

- `app/page.tsx` — homepage (Hero / Problem / Solution / Ecosystem / WhyNow / CTA sections under `components/home/`)
- `app/architecture/` — runtime architecture, native compositors, workspace controllers
- `app/extensions/` — `XR_DXR_*` extension specs (display info, window bindings, spatial workspace, app launcher)
- `app/demos/` — demo apps and engine sample scenes
- `app/compatibility/` — device and platform support matrix
- `app/roadmap/` — release timeline (data in `lib/data/roadmap.ts`)
- `app/docs/` — entry point to repo-based docs
- `lib/data/` — typed content for ecosystem, roadmap, devices, compatibility
- `lib/constants.ts` — repo URLs and nav

## Editing content

Most content is plain TSX or typed data in `lib/data/`. No CMS — edit, commit, deploy.

## Issues / contributions

Issues and PRs welcome on [DisplayXR/displayxr-website](https://github.com/DisplayXR/displayxr-website).
