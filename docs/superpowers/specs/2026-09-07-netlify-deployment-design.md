# Netlify Deployment Design

**Date:** 2026-09-07  
**Status:** Approved  
**Scope:** Production deploy of Crusade Tracker: Next.js on Netlify at `https://crusade.rob-stow.dev`, Express on Render, Clerk-verified API, replace `LOCALHOST` with `SITE_URL`.

---

## Summary

Ship the existing two-app architecture to production. The public site is the Next.js app on Netlify, served at subdomain `crusade.rob-stow.dev` (apex `rob-stow.dev` stays on the existing Netlify site). The Express API remains a long-lived Node process on Render and continues to own MongoDB Atlas access. The browser never calls Render. Next.js BFF routes forward the Clerk session token; Express verifies that JWT and authorizes by `clerkID`. `process.env.LOCALHOST` is renamed/replaced by `SITE_URL` set to `https://crusade.rob-stow.dev`.

---

## Decisions

| Decision | Choice |
|----------|--------|
| Frontend host | Netlify (Next.js runtime / `@netlify/plugin-nextjs`) |
| API host | Render Node web service (`npm start`, `PORT` from host) |
| Public origin | `https://crusade.rob-stow.dev` |
| Apex domain | Unchanged; not this app |
| API on Netlify Functions | No |
| Collapse BFF hop | No this pass (Server Components/Actions still call Next `/api/*`) |
| API auth | Clerk JWT on Express (`@clerk/backend`); no shared-secret-only mode |
| Browser → Render | Not allowed; CORS origin is the crusade subdomain only |
| Custom API hostname | Not this pass (Render default URL is fine) |
| Preview deploy Clerk | Out of scope |
| CI | Out of scope |

---

## Architecture

```
Browser
  → https://crusade.rob-stow.dev   (Netlify, Clerk)
      → SITE_URL/api/*            (Next BFF, Authorization: Bearer <Clerk token>)
          → API_URL/*             (Render Express)
              → MongoDB Atlas db "crusade"
```

| Service | Directory | Host | Role |
|---------|-----------|------|------|
| `crusade-tracker` | `crusade-tracker/` | Netlify | UI, Clerk, BFF |
| `crusade-tracker-api` | `crusade-tracker-api/` | Render | REST + Atlas |

The workspace is two Git repositories, not a monorepo. Connect **Netlify** to `crusade-tracker` (repo root = app root). Connect **Render** to `crusade-tracker-api` (repo root = API root). The parent `crusade/` folder is not a git repo.

Out of scope: Docker/Fly, serverless Express, dropping Next `/api` proxies.

---

## Components and config

### Netlify (`crusade-tracker`)

- Add `netlify.toml` (or dashboard equivalent) for the Next runtime so App Router, Server Actions, and Route Handlers work.
- Node 20+ for the build.
- DNS: attach subdomain `crusade.rob-stow.dev` to this Netlify site (CNAME). Do not move apex `rob-stow.dev`.

### Render (`crusade-tracker-api`)

- Web service: install + `npm start` (`node index.mjs`).
- Bind `process.env.PORT` (already defaulted to 5050 locally).
- Optional `GET /health` that does not require Mongo or Clerk, for Render health checks.

### Clerk

- Production application URLs and allowed origins include `https://crusade.rob-stow.dev` (sign-in/sign-up redirects as used by the app).
- Use the Clerk **production** instance for `crusade.rob-stow.dev`. Put production keys only in Netlify and Render dashboards, never in git. Local development keeps using development keys and `SITE_URL=http://localhost:3000`.

### Express auth

- Middleware on `/forces`, `/users`, `/units` (not on `/health`).
- Verify Clerk session/JWT with `@clerk/backend`. Missing or invalid token → 401 `{ error: "Unauthorized" }`.
- Attach authenticated `clerkID` to the request. Handlers must not trust a client-supplied user id when it would expose another user’s data. Valid token but wrong owner → 403.
- CORS: `CORS_ORIGIN=https://crusade.rob-stow.dev` only (no wildcard).

### Next BFF

- Shared helper: read Clerk token on the server; send `Authorization: Bearer <token>` on every `fetch` to `API_URL`.
- Server Actions and Server Components keep calling `${SITE_URL}/api/...` (today’s `LOCALHOST` pattern).
- Proxy routes map Express 401/403/5xx to JSON `{ error: ... }` without turning auth failures into opaque 500s.

---

## Data flow

**Unauthenticated visitor**  
Clerk sign-in on `https://crusade.rob-stow.dev`. No Express access without a session.

**Authenticated page load** (e.g. Orders of Battle)

1. Netlify runs the Server Component with a Clerk session.
2. `fetch(`${SITE_URL}/api/...`)`.
3. Next Route Handler attaches the Clerk token and calls `${API_URL}/...`.
4. Express verifies JWT; loads/writes Atlas as today.
5. Layout user auto-provision POST stays, still through the BFF, still must not block rendering if it fails once.

**Mutations**  
Server Action → Next `/api` → Render with bearer token. Zod remains on the Next/action side.

---

## Error handling

| Case | Behavior |
|------|----------|
| No/invalid Clerk token on Express | 401 `{ error: "Unauthorized" }`; Next maps to 401 / sign-in, not a generic 500 |
| Authenticated but not resource owner | 403 |
| Missing `API_URL`, `SITE_URL`, or Clerk keys | Fail loudly (log + 500); never silently fetch `http://localhost:3000` |
| Render down / Atlas timeout | Next proxy 502/503; UI “could not load” rather than crashing layout |
| User auto-provision POST fails | Log; still render the page |

Secrets stay in Netlify and Render dashboards. Never commit `.env`. `ATLAS_URI` lives on Render. `CLERK_SECRET_KEY` is required on both Netlify (Next) and Render (JWT verify).

---

## Environment variables

Names only (values are secrets / dashboard config).

| Location | Variable | Purpose |
|----------|----------|---------|
| Netlify | `API_URL` | Render origin, no trailing slash |
| Netlify | `SITE_URL` | `https://crusade.rob-stow.dev` — replaces `LOCALHOST` |
| Netlify | Clerk publishable + secret keys (and any Clerk URL vars the SDK requires) | Auth on Next |
| Render | `ATLAS_URI` | MongoDB Atlas |
| Render | `CLERK_SECRET_KEY` | Verify JWTs |
| Render | `CORS_ORIGIN` | `https://crusade.rob-stow.dev` |
| Render | `PORT` | Provided by Render |

Code change: every `process.env.LOCALHOST` becomes `process.env.SITE_URL`. Local `.env` sets `SITE_URL=http://localhost:3000` so development stays the same.

---

## Code touchpoints (implementation later)

- Replace `LOCALHOST` in Server Components, `layout.tsx`, `actions.ts`, and utils with `SITE_URL`.
- Next `src/app/api/**` route handlers: forward `Authorization`.
- Express: Clerk middleware, CORS from `CORS_ORIGIN`, optional `/health`.
- `netlify.toml` in the `crusade-tracker` repo root (site root; no Netlify base directory).
- Do not add Next.js direct MongoDB access.

---

## Verification

Before calling production live:

1. Sign in at `https://crusade.rob-stow.dev`.
2. Create and list an Order of Battle; confirm Atlas writes.
3. Open the Render URL with no token → 401.
4. Create/edit via Server Actions still works (token forwarded).
5. Lint both packages (`npm run lint` in each).

Browser verification of sign-in, list, and create/edit on the live subdomain is required; a single screenshot is not enough.

---

## Out of scope

- Express as Netlify Functions
- Removing the BFF hop (direct `API_URL` from Server Components)
- `api.rob-stow.dev` or other API custom domain
- Clerk on Netlify deploy previews
- CI pipelines
- Shared-secret header in addition to Clerk
