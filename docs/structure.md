# Code structure

```
src/app/                 Next.js routes. Thin files only.
  <route>/page.tsx       keeps metadata, revalidate, generateStaticParams; renders a screen
  api/<route>/route.ts   keeps runtime, dynamic, revalidate; re-exports a handler
  layout.tsx             root html, fonts, NavBar, footer
  middleware.ts          Supabase session + admin_users check for /admin/*

src/features/<feature>/  One folder per feature. No imports between features.
  api/                   route handlers and server data access
  domain/                pure functions and types, no React
  components/            feature UI
  screens/               the page bodies rendered by src/app
  hooks/                 client hooks

src/shared/              Used by two or more features.
  ui/                    NavBar, BoxscoreModal, PlayerStatsModal, PlayerSplits, NotifyButton, SearchModal
  supabase/              client.ts (browser), server.ts (server), legacy.ts (anon + service role)
  teams/                 team ids, names, logos, team stats
  rosters/               roster data and player stat helpers
  knbsb/                 KNBSB stats scraper
  email/ i18n/ media/    Resend, language toggle, Cloudinary
  data/                  static datasets (awards)

docs/                    this file, knbsb-backend.md, improvements/
game-runtime/            Swift source of the franchise game
public/franchise/        built game, deployed as static files
scripts/                 franchise build and test scripts
supabase/migrations/     SQL migrations
```

## Features

| Feature | Routes | Crons |
|---|---|---|
| livescores | /livescores, /api/livescores, /api/boxscore, /api/win-probability | |
| results | /uitslagen | |
| standings | /stand, /api/sync | sync every 2 min |
| schedule | /schema | |
| home | / | |
| postseason | /postseason, /holland-series, /hs2026, /api/holland-series | |
| leaders | /leaders, /api/leaders/* | |
| rosters | /rosters, /players, /api/player-*, /api/scorecard, /api/all-players, /api/career-stats, /api/roster-supplement | |
| teams | /teams | |
| compare | /compare, /api/compare | |
| games | /pick-em, /pickle, /immaculate-grid, /higher-lower, /win-the-series and their APIs | |
| news | /nieuws | |
| push | /notificaties, /api/push/*, /api/subscribe, /api/notify-games, /api/notification-icon | live-monitor every 1 min, notify-games Thu/Fri/Sat 07:00 |
| partners | /partner-up, /api/partner-contact | |
| social | /social, /media, /livestream | |
| awards | /awards | |
| offline | /offline | |
| admin | /admin/*, /analytics, /api/admin/*, /api/gsc | |
| franchise | /franchise, /franchise/auth, /api/franchise/* | |

## Adding a feature

1. `src/features/<name>/screens/<Name>Screen.tsx` with the UI.
2. `src/app/<route>/page.tsx` that exports metadata and renders the screen.
3. Handlers in `src/features/<name>/api/`, re-exported from `src/app/api/<route>/route.ts`.
4. Anything a second feature needs moves to `src/shared/`.
