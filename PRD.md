# PRD — DisplayXR Website

## 1. Overview

DisplayXR needs a public-facing website that acts as the canonical front door for the project.

The site should not be a generic marketing site. It should present DisplayXR as a serious open developer ecosystem for tracked glasses-free 3D displays, while making it easy for developers, engine teams, hardware vendors, and curious partners to understand what the project is, why it exists, and how to get started.

The website will live in a new public GitHub repository:

`DisplayXR/displayxr-website`

For now, only David will have write/admin access. Other developers do not need write access at this stage. The site should be easy to evolve later, but initially should remain tightly controlled to keep narrative, structure, and quality coherent.

## 2. Goals

The website should:

- establish DisplayXR as a credible open project and ecosystem
- explain the problem DisplayXR solves in a simple and convincing way
- connect the various GitHub repos into one legible whole
- give developers a clear path to try DisplayXR quickly
- provide a home for docs, roadmap, compatibility, demos, and ecosystem narrative
- create a stronger public identity than a set of GitHub READMEs alone
- support future expansion into standards, vendors, engines, shell, and demos

## 3. Non-goals

The initial website is not meant to:

- be a consumer-facing brand site
- be a flashy 3D-heavy experience with complicated frontend effects
- duplicate all technical docs from the repos
- expose confidential roadmap items or partner-specific material
- support broad team editing workflows yet
- act as a community contribution portal in v1

## 4. Repo / Ownership / Access

### Repo
Create a new public repository:

`DisplayXR/displayxr-website`

### Visibility
Public

### Access model
For now:
- David = only write/admin access
- no other DisplayXR developers need write access yet
- external contribution is not a priority in v1

### Reasoning
This repo is public because the site itself is public-facing and helps legitimize the org. But write access should remain narrow initially so the narrative and design stay consistent while the project is still taking shape.

## 5. Product Positioning

The website should position DisplayXR as:

**An open runtime and extension stack that brings OpenXR-style portability to glasses-free 3D displays and related spatial display systems.**

It should communicate that DisplayXR is not merely a single repo, plugin, or demo app. It is a developing stack that includes:
- runtime
- extension specs
- engine integrations
- demos
- projection math
- future shell / spatial windowing concepts

The tone should feel technical, confident, clean, and infrastructure-oriented.

## 6. Target Audiences

### Primary
#### 1. Graphics / XR developers
They want to understand:
- what DisplayXR is
- how it differs from existing OpenXR workflows
- how to build or test something quickly
- whether hardware is required

#### 2. Engine / platform developers
They want to understand:
- how Unity / Unreal fit in
- how the runtime is structured
- how compositors / APIs are handled
- how vendor-specific processing plugs in

#### 3. Hardware vendors / OEM-facing technical teams
They want to understand:
- how a vendor display processor integrates
- what part DisplayXR owns vs vendor SDKs
- whether this can act as a standard interface layer

### Secondary
#### 4. Partners / press / technically literate observers
They want a coherent explanation of the project and its ambition without having to reverse-engineer it from multiple repos.

## 7. Core Messaging

The website should communicate these key messages:

### Message 1
Spatial displays are becoming real, but today they lack a common software interface comparable to what OpenXR did for headsets.

### Message 2
DisplayXR provides that missing layer: a common runtime and extension path for tracked glasses-free 3D displays.

### Message 3
DisplayXR is designed to separate app-facing portability from vendor-specific display processing.

### Message 4
The project is practical, not theoretical: runtime, compositors, plugins, demos, and simulation already exist.

### Message 5
Developers can start experimenting even without physical hardware.

## 8. Site Strategy

The website should be a hybrid of:
- homepage
- docs gateway
- architecture explainer
- ecosystem map
- compatibility/status board
- demo gallery

It should feel more like the canonical site for an emerging open standard and developer stack than a startup landing page.

## 9. Information Architecture

Recommended top-level navigation:

- Home
- Docs
- Architecture
- Extensions
- Demos
- Compatibility
- Roadmap
- GitHub

Optional later:
- Vendors
- Community
- Blog / Notes

## 10. Recommended Pages

## 10.1 Home

### Purpose
Give a fast, clear explanation of what DisplayXR is and why it matters.

### Content sections
#### Hero
Headline example:

**OpenXR for glasses-free 3D displays**

Subheadline example:

**DisplayXR is an open runtime and extension stack for tracked spatial displays, enabling apps, engines, and vendor runtimes to interoperate through a common interface.**

Primary CTAs:
- Read the docs
- Explore the repos
- Try a demo

#### Problem section
Explain that:
- OpenXR standardized HMD-era XR workflows
- spatial displays are growing as a category
- today these displays are fragmented across vendor-specific SDKs
- developers need a cleaner, portable path

#### Solution section
Explain what DisplayXR provides:
- runtime
- extension specs
- native compositor architecture
- engine integrations
- vendor processor integration layer

#### Ecosystem section
Visually map the public repos:
- displayxr-runtime — core OpenXR runtime with native compositors
- displayxr-extensions — OpenXR extension specs and headers
- displayxr-unity — Unity engine plugin (UPM)
- displayxr-unreal — Unreal Engine plugin
- displayxr-demos — demo applications
- kooima-projection — off-axis frustum projection math library
- displayxr-shell-releases — spatial shell / 3D window manager (binaries + docs)

#### “Why now” section
Explain that spatial computing should not be headset-only. Displays matter too.

#### CTA section
Push users toward docs and demos.

## 10.2 Docs

### Purpose
Act as the structured entry point to technical content.

### v1 approach
Do not rewrite everything. Use the website as a curated docs front door that points into repo docs where appropriate.

### Suggested docs sections
- Getting Started
- Concepts
- App Developer Guide
- Engine Integrations
- Vendor Integration
- Specs / Extensions
- Architecture
- FAQ

## 10.3 Architecture

### Purpose
Explain how the stack works in a way more coherent than scattered README files.

### Content
- app → OpenXR → DisplayXR → vendor display processor → display
- native compositor model
- per-graphics-API design
- separation of concerns
- simulation driver path
- how hardware-specific weaving/interlacing remains vendor-owned

This should be one of the strongest pages on the site.

## 10.4 Extensions

### Purpose
Explain why standard OpenXR is insufficient for tracked 3D displays and what DisplayXR is proposing.

### Content
- current gaps
- extension philosophy
- spec status
- links to actual spec markdown in GitHub
- what is experimental vs more mature

## 10.5 Demos

### Purpose
Make the project feel tangible.

### Content
- sample apps
- Unity demo
- simulation mode
- screenshots / short videos / gifs
- “no hardware required” try-it path if possible

If no polished assets exist yet, start simple with static screenshots and short descriptions.

## 10.6 Compatibility

### Purpose
Communicate current status honestly.

### Current shipping status (populate table from this)

**Runtime — Native Compositors:**

| Platform | Graphics API | Status | Notes |
|----------|-------------|--------|-------|
| Windows | D3D11 | Shipping | LeiaSR weaver, window binding |
| Windows | D3D12 | Shipping | Window binding |
| Windows | OpenGL | Shipping | |
| Windows | Vulkan | Shipping | |
| macOS | Metal | Shipping | sim_display weaver, window binding |
| macOS | OpenGL | Shipping | |
| macOS | Vulkan | Shipping | MoltenVK; runtime error at launch (MoltenVK limitation) |

**Engine Plugins:**

| Engine | Status | Notes |
|--------|--------|-------|
| Unity | Active | UPM package, sample scene, CI |
| Unreal | Early | Placeholder — not production-ready |

**Hardware Backends:**

| Backend | Status | Notes |
|---------|--------|-------|
| Leia SR SDK (LeiaSR displays) | Shipping | D3D11 weaver, eye tracking |
| sim_display (no hardware) | Shipping | Simulation mode for development |

**App Classes:**
| Class | Description | Status |
|-------|-------------|--------|
| Handle | App provides window (HWND/NSView) | Shipping |
| Texture | App provides offscreen textures | Shipping |
| Hosted | Runtime hosts everything | Shipping |
| IPC | Out-of-process via service | Shipping (single-client) |

This page is important because it makes the project concrete. Keep it honest — mark things as "early" or "experimental" where appropriate.

## 10.7 Roadmap

### Purpose
Show where the project is headed without overcommitting.

### Suggested structure (reflects actual milestones)

**Done**
- Foundation: stripped to ~150 files, native compositors for every major API
- Native compositors shipping: D3D11, D3D12, Metal, OpenGL, Vulkan
- Custom OpenXR extensions: display_info, window bindings (Win32, Cocoa)
- Unity plugin with CI and sample scene

**Now**
- Test coverage and conformance (M3)
- Extension API stabilization (M4)
- Interface standardization — display processor, display spatial model (M5)
- Improve docs and developer onboarding

**Next**
- Spatial shell — multi-app 3D window management (M6)
- Multi-display compositing (single machine)
- Expand demos and engine integrations
- Unreal plugin maturity

**Later**
- Multi-display across networked machines
- 3D capture pipeline
- Broader ecosystem and standardization
- Cross-runtime spatial interoperability

Keep this page high-level and public-safe. Link to GitHub milestones for detailed tracking.

## 11. Homepage Content Recommendations

## 11.1 Hero copy suggestion

**OpenXR for glasses-free 3D displays**

DisplayXR is an open runtime and extension stack for tracked spatial displays. It helps developers build portable 3D display applications across engines, graphics APIs, and vendor-specific hardware runtimes.

## 11.2 Short explainer block

Spatial computing is still largely framed around headsets. But spatial displays are becoming a real category too, and they need a common interface. DisplayXR brings that missing layer to tracked glasses-free 3D monitors, laptops, and related display systems.

## 11.3 Ecosystem summary block

DisplayXR is developing as a stack:
- runtime
- extensions
- engine plugins
- demos
- projection utilities
- future shell concepts

## 11.4 “For who” block

- For app developers building on OpenXR
- For engine teams integrating tracked 3D display workflows
- For hardware vendors who want a standard app-facing layer
- For the broader spatial ecosystem exploring display-native XR

## 12. Content Style Guidelines

The site should:
- stay concise
- avoid hype language
- sound technically mature
- be clear about what exists today vs future vision
- avoid sounding like a consumer AR/VR startup
- avoid overclaiming “industry standard” before the ecosystem proves it

Preferred tone:
- calm
- precise
- slightly ambitious
- developer-first

## 13. Visual / Design Direction

### Overall feel
- minimal
- technical
- clean
- modern but restrained
- black/white/gray base with one accent color
- no gratuitous motion

### Visual references
Closer to:
- systems software / infra / devtools sites
Than to:
- gaming product sites
- flashy AI landing pages
- generic crypto/VR pages

### Important visuals
- a clean architecture diagram (adapt from runtime repo's CLAUDE.md stack diagram — the App → OpenXR → Core → Native Compositors → Display Processor → Display flow)
- an ecosystem map showing all public repos and how they relate
- a compatibility table (see Section 10.6 for concrete data)
- screenshots from demos (cube apps, gaussian splatting if available)
- possibly a subtle wireframe / display-inspired hero graphic
- diagram showing separation of concerns: app-facing portability vs vendor-specific display processing

## 14. Technical Stack

### Framework and Dependencies
- **Next.js 15** (App Router, TypeScript)
- **React 19**
- **Tailwind CSS v4** for styling
- **MDX** via `@next/mdx` for content pages (docs, architecture, extensions, roadmap)
- **lucide-react** for icons
- **next-mdx-remote** or `@next/mdx` for markdown content rendering
- No other UI libraries — keep dependencies minimal

### Deployment
- **Vercel** (connect repo, auto-deploy on push to `main`)

### Content Strategy
- Static content pages use MDX files in `content/` directory
- Data-driven pages (compatibility tables, ecosystem map) use TypeScript data files in `lib/data/`
- No CMS, no database, no API routes needed

## 14b. Design Tokens

### Colors
- **Background:** `#0a0a0a` (near-black)
- **Surface:** `#141414` (cards, code blocks)
- **Border:** `#262626` (subtle borders)
- **Text primary:** `#fafafa` (white)
- **Text secondary:** `#a1a1aa` (muted)
- **Accent:** `#3b82f6` (blue — links, CTAs, highlights)
- **Accent hover:** `#60a5fa`
- **Success/shipping:** `#22c55e` (green, for status badges)
- **Warning/early:** `#eab308` (yellow, for status badges)

### Typography
- **Font:** `Inter` (via `next/font/google`) for body text
- **Monospace:** `JetBrains Mono` or system monospace for code/technical content
- **Headings:** Semi-bold, tight letter-spacing
- **Body:** 16px base, 1.7 line-height

### Spacing
- Max content width: `1200px`
- Page padding: `24px` mobile, `48px` desktop
- Section spacing: `96px` between major sections on homepage, `48px` on inner pages

### Logo
- The white DisplayXR logo is already in the repo at `public/logos/displayxr-logo.png`
- This is the white "XR" icon — designed for dark backgrounds, matches the installer/service branding
- Use in the navbar (left side) and footer
- For favicon, convert to ICO or use a small PNG variant

## 14c. Component Architecture

### Layout Components
- `Navbar` — sticky top nav with logo + page links + GitHub icon link. Dark background. Mobile hamburger menu.
- `Footer` — logo, repo links organized by category, copyright. Minimal.
- `PageLayout` — wraps inner pages (not homepage) with consistent header + content area + sidebar nav where appropriate

### Reusable UI Components
- `Button` — primary (filled accent) and secondary (outlined) variants
- `Card` — surface-colored card with border, used for ecosystem repos, feature blocks
- `Badge` — small status indicator (Shipping/Active/Early/Experimental) with color coding
- `CodeBlock` — syntax-highlighted code snippets (use simple `<pre>` with Tailwind, no heavy syntax highlighter needed in v1)
- `DiagramBlock` — container for architecture diagrams (render as styled `<pre>` ASCII art or SVG in v1; no need for a diagramming library)
- `Table` — styled table component for compatibility data

### Page-Specific Components
- `Hero` — homepage hero with headline, subheadline, CTA buttons
- `EcosystemMap` — grid of repo cards with descriptions and GitHub links
- `CompatibilityTable` — data-driven table from `lib/data/compatibility.ts`
- `RoadmapTimeline` — Done/Now/Next/Later sections with items

## 14d. Domain and Hosting

### Domain
Acquire `displayxr.dev` or `displayxr.org` (developer-facing feel). Fallback: use `displayxr.vercel.app` until a custom domain is ready.

### Deployment
- Vercel connected to `DisplayXR/displayxr-website` repo
- Auto-deploy on push to `main`
- Preview deploys on PRs (useful even with single author)

### Analytics
- Vercel Analytics (built-in, privacy-friendly, no cookie banner needed)
- No third-party trackers in v1

### SEO
- OpenGraph meta tags on all pages (title, description, image)
- Canonical URLs
- `robots.txt` and `sitemap.xml` generated automatically by Next.js

## 15. Suggested Repo Structure

```text
displayxr-website/
  app/
    layout.tsx              # Root layout with Navbar + Footer
    page.tsx                # Homepage
    docs/
      page.tsx              # Docs landing page
    architecture/
      page.tsx              # Architecture deep-dive
    extensions/
      page.tsx              # Extension specs overview
    demos/
      page.tsx              # Demo gallery
    compatibility/
      page.tsx              # Compatibility tables
    roadmap/
      page.tsx              # Roadmap timeline
    globals.css             # Tailwind imports + custom styles
  components/
    layout/
      Navbar.tsx
      Footer.tsx
      PageLayout.tsx        # Inner page wrapper (title + content)
    home/
      Hero.tsx
      ProblemSection.tsx
      SolutionSection.tsx
      EcosystemMap.tsx
      WhyNowSection.tsx
      CTASection.tsx
    ui/
      Button.tsx
      Card.tsx
      Badge.tsx
      Table.tsx
      DiagramBlock.tsx
  lib/
    data/
      compatibility.ts     # Typed data for compatibility tables
      ecosystem.ts          # Repo metadata for ecosystem map
      roadmap.ts            # Roadmap items
    constants.ts            # Site-wide constants (URLs, nav items)
  content/
    docs.mdx                # Docs landing content
    architecture.mdx        # Architecture page content
    extensions.mdx           # Extensions page content
  public/
    logos/
      displayxr-logo.png
    diagrams/               # Architecture diagrams (SVG or PNG)
    screenshots/            # Demo screenshots
  PRD.md                    # This file — reference for the coding agent
  README.md
  next.config.ts
  tailwind.config.ts
  tsconfig.json
  package.json
```

## 16. MVP Scope

The initial public release should include:

- homepage
- docs landing page
- architecture page
- compatibility page
- demos page
- roadmap page
- GitHub repo links
- Vercel deployment on temporary domain, then custom domain

This is enough to make the org feel coherent and real.

## 17. Out of Scope for MVP

- complex auth
- search indexing across all repos
- blog system
- automatic sync of all repo docs
- live demo binaries hosted through the site
- contributor workflows
- community forum
- advanced animations
- localization

## 18. GitHub / Repo Integration Strategy

The site should link prominently to all public repos:
- DisplayXR/displayxr-runtime — core runtime
- DisplayXR/displayxr-extensions — extension specs
- DisplayXR/displayxr-unity — Unity plugin
- DisplayXR/displayxr-unreal — Unreal plugin
- DisplayXR/displayxr-demos — demo apps
- DisplayXR/kooima-projection — projection math library
- DisplayXR/displayxr-shell-releases — spatial shell (binaries, docs, issues)

Note: `displayxr-shell` (source) is private. The public-facing repo is `displayxr-shell-releases` which hosts installers via GitHub Releases.

Later, selected content may be pulled automatically from repo markdown or release metadata. But v1 does not need automation.

## 19. Governance / Publishing Model

For now:
- only David edits and publishes
- all narrative pages are curated manually
- use Vercel preview deployments before production publish
- public repo is fine, but maintain tight write permissions

Later:
- selected collaborators may get write access
- docs ownership may broaden
- some pages may be sourced directly from technical repos

## 20. Success Criteria

The website is successful if a technically literate visitor can answer these questions within a couple minutes:

- What is DisplayXR?
- Why does it exist?
- How is it different from a single vendor SDK?
- What parts of the stack already exist?
- Can I try it without hardware?
- Where do I start if I want to build something?

## 21. Risks

### Risk 1
The site becomes too abstract and strategic.  
Mitigation: keep practical developer paths front and center.

### Risk 2
The site becomes just a prettier wrapper around GitHub links.  
Mitigation: write strong original homepage and architecture content.

### Risk 3
The site overpromises maturity.  
Mitigation: use compatibility and roadmap pages to be explicit about status.

### Risk 4
The content becomes stale as repos evolve.  
Mitigation: keep initial scope curated and limited.

## 22. Implementation Guide for Coding Agent

This section provides step-by-step instructions for building the site.

### Step 1: Scaffold
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src=false --import-alias="@/*"
```
- Install additional deps: `npm install lucide-react @next/mdx @mdx-js/loader @mdx-js/react`
- Configure `next.config.ts` for MDX support
- Set up `Inter` and `JetBrains Mono` fonts via `next/font/google`
- Apply dark theme colors from Section 14b to `globals.css` and Tailwind config

### Step 2: Layout and Navigation
- Build `Navbar` with logo (left) + nav links (center) + GitHub icon (right)
- Build `Footer` with logo, categorized repo links, copyright
- Wire into `app/layout.tsx`

### Step 3: Homepage
Build all homepage sections from Section 10.1 and Section 11:
1. `Hero` — headline, subheadline, two CTA buttons (Docs, GitHub)
2. `ProblemSection` — "The problem" with 3-4 bullet points
3. `SolutionSection` — "What DisplayXR provides" with feature cards
4. `EcosystemMap` — grid of 7 repo cards from `lib/data/ecosystem.ts`
5. `WhyNowSection` — brief text block
6. `CTASection` — closing CTA

### Step 4: Inner Pages
Build each inner page using `PageLayout` wrapper:
1. **Architecture** — render `content/architecture.mdx`. Include the stack diagram as a styled ASCII/CSS diagram. This is the most important content page.
2. **Docs** — curated links organized by Section 10.2 categories. Each links to the relevant GitHub repo docs.
3. **Compatibility** — data-driven tables from `lib/data/compatibility.ts` using data from Section 10.6
4. **Demos** — placeholder cards for demo apps. Screenshots if available, otherwise descriptions.
5. **Extensions** — overview of custom OpenXR extensions with links to specs in `displayxr-extensions` repo
6. **Roadmap** — Done/Now/Next/Later timeline from Section 10.7

### Step 5: Polish
- Responsive design (mobile-first)
- OpenGraph meta tags on all pages
- `robots.txt` and `sitemap.xml` via Next.js config
- Favicon (use logo or derive from it)
- Verify all external links work

### Architecture Diagram Content
Use this as the primary architecture diagram on the Architecture page (render as styled CSS/HTML, not an image):

```
App (any graphics API)
        |
   OpenXR API Layer
        |
   DisplayXR Runtime
        |
   +----+-----+--------+--------+
   |    |     |        |        |
 D3D11 D3D12 Vulkan  Metal   OpenGL
   |    |     |        |        |
   Display Processor (vendor-specific)
        |
   3D Display
```

Key message: each graphics API gets its own native compositor — no interop, no Vulkan intermediary. The display processor is the vendor boundary.

## 23. Recommended Initial Copy Blocks

### Tagline options
- OpenXR for glasses-free 3D displays
- A common runtime for tracked spatial displays
- Build once for spatial displays
- Open infrastructure for tracked 3D displays

Best current choice:  
**OpenXR for glasses-free 3D displays**

### One-sentence summary
DisplayXR is an open runtime and extension stack that gives tracked spatial displays a common app-facing interface across graphics APIs, engines, and vendor hardware backends.

### Two-sentence summary
DisplayXR brings OpenXR-style portability to glasses-free 3D displays. It provides a practical stack of runtime components, extension specs, engine integrations, and demos so developers and hardware vendors can build against a more common interface rather than isolated vendor SDKs.

## 24. Final Recommendation

Create `DisplayXR/displayxr-website` as a **public repo**, keep **only David as write/admin** for now, build it as a **Next.js + Vercel** site, and make it the canonical front door for DisplayXR.

The site should emphasize:
- clarity over hype
- architecture over marketing
- practical developer onboarding over abstract vision
- ecosystem coherence over repo-by-repo fragmentation
