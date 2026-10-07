# Honkbalhoofdklasse

Official website of the Honkbal Hoofdklasse, the top baseball league of the Netherlands.
Live scores, standings, statistics, news and the franchise game.

[![CI](https://github.com/Honkbalhoofdklasse/honkbalhoofdklasse/actions/workflows/ci.yml/badge.svg)](https://github.com/Honkbalhoofdklasse/honkbalhoofdklasse/actions/workflows/ci.yml)

**Production:** [honkbalhoofdklasse.com](https://honkbalhoofdklasse.com)

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Data | Supabase (Postgres, Auth, Storage) |
| Hosting | Vercel (production from `main`, cron jobs in `vercel.json`) |
| Email and push | Resend, Web Push |
| Franchise game | Swift compiled to WebAssembly (`game-runtime/`) |

## Getting started

1. Install dependencies.
   ```bash
   npm install
   ```
2. Create the env file and fill in the development values.
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server.
   ```bash
   npm run dev
   ```
4. Open <http://localhost:3000>.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run check` | Lint, typecheck, tests and build. Run before every commit |
| `npm run lint` | Biome lint |
| `npm run format` | Biome auto-fix |
| `npm run typecheck` | TypeScript check |
| `npm test` | Vitest |
| `npm run lighthouse` | Lighthouse against a running server |
| `npm run franchise:*` | Build and test the franchise game, see `game-runtime/README.md` |

## Project structure

```
src/app/              Thin route files only: page.tsx renders a feature screen, route.ts re-exports a feature handler
src/features/<name>/  One folder per feature: api/ (handlers, data access), domain/ (pure logic, types), components/, screens/, hooks/
src/shared/           Used by two or more features: ui/, supabase/, teams/, rosters/, knbsb/, email/, i18n/, media/, data/
public/franchise/     Built franchise game (WebAssembly and assets)
game-runtime/         Swift source of the franchise game
supabase/migrations/  SQL migrations and row level security policies
scripts/              Franchise build and test scripts
docs/                 Docs and improvement checklists
```

## Environments

| Environment | Source | Supabase project |
|---|---|---|
| Development | local | development |
| Preview | pull request branch | development |
| Production | `main` | production |

Development and preview never use the production database.

## Continuous integration

Every push to `main` runs lint, typecheck, tests and a production build in GitHub Actions.

## Working on the codebase

Rules for contributors and AI agents are in [AGENTS.md](AGENTS.md).
Folder map: [docs/structure.md](docs/structure.md). Open work is tracked in [docs/improvements](docs/improvements/).
