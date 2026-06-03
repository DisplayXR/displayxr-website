# Admin dashboard (`/admin`)

A GitHub-login-gated dashboard combining **site analytics** (Umami Cloud) and a
**live DisplayXR org GitHub dashboard** (releases, commits, open PRs, forks/stars).

It is **authored application code with live data** — deliberately *outside* the
`lib/data/generated/*` sync pipeline (which is static marketing JSON). Nothing
here is touched by `scripts/sync-org.mjs`.

## How access works

Anyone can authenticate with GitHub, but only **allowlisted GitHub usernames**
(`ADMIN_LOGINS`) ever get a session — checked in the `signIn` **and** `authorized`
callbacks (`lib/auth.ts`). `middleware.ts` guards `/admin/*`; `/admin/signin` is
the only public route. This is why the dashboard costs nothing per user: admins
log into *our* site, not a paid Vercel team seat.

## Files

| File | Role |
|------|------|
| `lib/auth.ts` | Auth.js v5 config + GitHub provider + allowlist callbacks |
| `app/api/auth/[...nextauth]/route.ts` | Auth.js route handlers |
| `middleware.ts` | Guards `/admin/*` |
| `app/admin/signin/page.tsx` | Public sign-in page |
| `app/admin/page.tsx` | The dashboard (server component, 5-min ISR) |
| `lib/github.ts` | Org GraphQL query (releases/PRs/forks/commits) |
| `lib/umami.ts` | Umami Cloud Stats API |
| `app/layout.tsx` | Loads the Umami tracking script (when configured) |
| `types/next-auth.d.ts` | Session/JWT type augmentation |

## Environment variables

Set these in Vercel (Project → Settings → Environment Variables) and in a local
`.env.local` for dev.

| Var | What |
|-----|------|
| `AUTH_SECRET` | Random secret. Generate with `npx auth secret`. |
| `AUTH_GITHUB_ID` | GitHub OAuth App client ID. |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App client secret. |
| `ADMIN_LOGINS` | Comma-separated GitHub usernames allowed in, e.g. `dfattal,someone`. |
| `GITHUB_DASHBOARD_TOKEN` | Read-only fine-grained PAT (org repos: Contents/Metadata/Pull requests read). Falls back to `GITHUB_TOKEN` locally. |
| `UMAMI_API_KEY` | Umami Cloud API key (Settings → API keys). |
| `UMAMI_WEBSITE_ID` | Umami website id — used server-side for the Stats API. |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | Same website id — used client-side to load the tracking script. |

`AUTH_URL` is auto-detected on Vercel. For local dev it defaults to
`http://localhost:3000`.

## One-time setup

### 1. GitHub OAuth App
GitHub → Settings → Developer settings → **OAuth Apps** → New.
- Homepage URL: `https://displayxr.org`
- Authorization callback URL: `https://displayxr.org/api/auth/callback/github`
- Add a second OAuth App (or callback) for local dev:
  `http://localhost:3000/api/auth/callback/github`

Copy the client ID/secret into `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`.

### 2. GitHub data token
Create a **fine-grained PAT** scoped to the DisplayXR org with read-only access to
Contents, Metadata, and Pull requests → `GITHUB_DASHBOARD_TOKEN`. (Used only for
the dashboard's GraphQL query; never written anywhere.)

### 3. Umami Cloud
- Create an account at https://cloud.umami.is, add the `displayxr.org` website.
- Copy the **Website ID** → `UMAMI_WEBSITE_ID` + `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.
- Create an **API key** (Settings → API) → `UMAMI_API_KEY`.

Until Umami/GitHub env vars are set, each section renders a graceful
"unavailable / not configured" note instead of erroring.

## Notes

- `/admin` is `noindex` (layout metadata) and disallowed in `robots.ts`.
- Data refreshes on a 5-minute ISR window; both upstreams are cached server-side.
- The marketing `Navbar`/`Footer` still wrap `/admin` (they live in the root
  layout). Acceptable for v1; can be split later with a route group if desired.
