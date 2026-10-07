# Honkbalhoofdklasse

Live scores, standings, stats and a franchise game for the Dutch Honkbal Hoofdklasse. Live at [honkbalhoofdklasse.com](https://honkbalhoofdklasse.com).

[![CI](https://github.com/Honkbalhoofdklasse/honkbalhoofdklasse/actions/workflows/ci.yml/badge.svg)](https://github.com/Honkbalhoofdklasse/honkbalhoofdklasse/actions/workflows/ci.yml)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black)
![React 19](https://img.shields.io/badge/React-19-149eca)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Quick start

1. Clone the repo.
   ```bash
   git clone https://github.com/Honkbalhoofdklasse/honkbalhoofdklasse.git
   cd honkbalhoofdklasse
   ```
2. Install dependencies.
   ```bash
   npm install
   ```
3. Create your env file. Fill in the values for the **dev** Supabase project.
   ```bash
   cp .env.example .env.local
   ```
4. Start the dev server.
   ```bash
   npm run dev
   ```
5. Open <http://localhost:3000>.

Never use the prod Supabase project locally.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run check` | Biome, typecheck, tests, build. Run before every PR |
| `npm run lint` | Biome lint and format check |
| `npm run format` | Biome auto-fix |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (watch mode) |
| `npm run lighthouse` | Lighthouse CI against `http://localhost:3000` or `LH_URL` |
| `npm run franchise:generate` | Generate Swift sources for the game |
| `npm run franchise:build` | Build the game WebAssembly binary |
| `npm run franchise:photos` | Optimize franchise photos |
| `npm run franchise:test:native` | Native and UI tests |
| `npm run franchise:test:browser` | Browser and cloud tests |
| `npm run franchise:test:images` | Image tests |
| `npm run franchise:test:update` | Update tests |
| `npm run franchise:test:growth` | Growth tests |

## Project structure

```
src/
  app/            Next.js routes and API routes
  components/     Shared React components
  lib/            Shared helpers, Supabase clients, data
  features/       Planned home for new code: src/features/<feature>/
public/franchise/ Built game: WebAssembly, assets, game.html
game-runtime/     Swift source of the franchise game
supabase/
  migrations/     SQL migrations and RLS policies
scripts/          Franchise build and test scripts
to-be-improved/   Audit checklist and open work
```

## Environments

| Env | Branch | Vercel | Supabase | URL |
|---|---|---|---|---|
| dev | local | `vercel dev` or `next dev` | dev project (see `.env.example`) | localhost:3000 |
| preview | any PR branch | automatic preview deploy | dev project | `*.vercel.app` |
| prod | `main` | production | prod project | honkbalhoofdklasse.com |

Preview env vars in Vercel must use the dev Supabase project.

## Deployment

1. Vercel deploys `main` to production.
2. Every PR gets a preview deploy.
3. Crons are in `vercel.json` and run only in production.

| Path | Schedule |
|---|---|
| `/api/sync` | every 2 minutes (`*/2 * * * *`) |
| `/api/push/live-monitor` | every minute (`*/1 * * * *`) |
| `/api/notify-games` | 07:00 on Thu, Fri, Sat (`0 7 * * 4,5,6`) |

Every cron route must check `CRON_SECRET`.
