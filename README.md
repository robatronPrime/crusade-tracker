# Crusade Tracker (frontend)

Next.js app for managing Warhammer 40,000 Crusade Orders of Battle. This package is the UI and BFF: it authenticates with Clerk and proxies data through `/api/*` to the Express API.

Pair with [`crusade-tracker-api`](../crusade-tracker-api/).

## Tech stack

- Next.js 15 (App Router, Server Components, Server Actions, Turbopack)
- React 19, TypeScript
- Tailwind CSS 4
- Clerk (`@clerk/nextjs`)
- Zod, Headless UI
- Netlify (`@netlify/plugin-nextjs`)

Requests: **Browser → this app (`SITE_URL`) → Express (`API_URL`) → MongoDB**.

## Getting started

```bash
npm i
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The API should already be running on port 5050.

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

Environment variables (`.env`; do not commit): `SITE_URL`, `API_URL`, and Clerk keys.
