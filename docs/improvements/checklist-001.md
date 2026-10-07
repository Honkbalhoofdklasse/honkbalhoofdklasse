# Improvements 001: audit checklist (2026-10-07)

Site is live. Every item: branch, fix, run `npm run check`, preview deploy, Lighthouse, then merge.
Mark `[x]` only after the verify command no longer reproduces the issue.

Production Lighthouse baseline (2026-10-07): `/` 85/84/100/100, `/stand` 90/95/100/100, `/uitslagen` 60/95/100/92 (CLS 0.60).

## P0 security (do first, 2 hours)

- [ ] **Delete unauthenticated test push endpoint**
  File: `src/app/api/push/test/route.ts`
  Verify: `sed -n 7,12p src/app/api/push/test/route.ts` shows `GET` with no auth check before `supabaseAdmin`.
  Fix: delete the file.

- [ ] **Pick-em leaderboard leaks user tokens**
  File: `src/app/api/pick-em/leaderboard/route.ts:48`
  Verify: `grep -n "token," src/app/api/pick-em/leaderboard/route.ts` shows `token` returned in the JSON map.
  Fix: return rank and nickname only. Validate `pickedTeamId` against the game's two teams in `src/app/api/pick-em/route.ts`.

- [ ] **Partner-contact HTML injection and open mail relay**
  File: `src/app/api/partner-contact/route.ts:40-43, 68, 75, 183-187, 195-202`
  Verify: `sed -n 183,187p src/app/api/partner-contact/route.ts` shows raw `${company}`, `${name}`, `${message}` in HTML.
  Fix: escape every value, validate with zod (email format, max lengths), add rate limit, stop returning `errors` to the caller.

- [ ] **Cron routes fail open when CRON_SECRET is unset**
  Files: `src/app/api/sync/route.ts:39`, `src/app/api/push/live-monitor/route.ts:80`, `src/app/api/notify-games/route.ts:6`
  Verify: `grep -n "if (secret" src/app/api/sync/route.ts src/app/api/push/live-monitor/route.ts src/app/api/notify-games/route.ts`
  Fix: `if (!secret || auth !== \`Bearer ${secret}\`) return 401`. Confirm `CRON_SECRET` is set in Vercel prod and preview.

- [ ] **Upgrade Next.js (16.2.6 has middleware bypass and ImageResponse RCE advisories)**
  Verify: `npm audit --omit=dev --package-lock-only | head -40`
  Fix: `npm install next@latest`, then `npm audit fix`, also bump `sharp` and remove unused `maplibre-gl`.

## P1 security (1 day)

- [ ] **Shared admin password in localStorage, no rate limit**
  Files: `src/app/api/admin/photos/route.ts:5`, `upload-photo/route.ts:32`, `compress-photo/route.ts:20`, `src/app/api/gsc/route.ts:5`, `streams/route.ts:7`, `src/components/AdminGate.tsx:95`, `src/app/analytics/page.tsx:218`
  Verify: `grep -rn "x-admin-password\|admin-pw" src | wc -l` (expect 15+).
  Fix: move these routes to the Supabase session + `admin_users` check used by `import-series`; delete the password path.

- [ ] **Push subscribe accepts any endpoint URL (blind SSRF) and anyone can unsubscribe anyone**
  File: `src/app/api/push/subscribe/route.ts:5-25`
  Verify: `grep -n "https\|allow" src/app/api/push/subscribe/route.ts` returns nothing.
  Fix: require https and allowlist push hosts (fcm.googleapis.com, push.apple.com, mozilla, notify.windows.com).

- [ ] **Streams PATCH mass assignment, no ownership check**
  File: `src/app/api/admin/streams/route.ts:81-83`
  Verify: `grep -n "...patch" src/app/api/admin/streams/route.ts`
  Fix: allowlist columns, scope PATCH and DELETE by `stream_team`, require `https://` for `stream_url`.

- [ ] **No CSP or HSTS**
  File: `next.config.ts:3-9`
  Verify: `curl -sI https://honkbalhoofdklasse.com | grep -i "content-security\|strict-transport"`
  Fix: add `Strict-Transport-Security` and a report-only CSP, then enforce.

- [ ] **RLS unverified for all tables except franchise_saves**
  Verify: in Supabase dashboard, Authentication > Policies. Tables: predictions, subscribers, push_subscriptions, admin_users, pickem_picks, streams, news_articles.
  Note: `src/components/PredictionWidget.tsx:56` writes `predictions` with the anon key from the browser. Repo is public, anon key is in `public/HonkbalWidget.js:12`.
  Fix: export policies into `supabase/migrations/` so they are versioned.

- [ ] **Unsubscribe is a state-changing GET, subscribe has no double opt-in**
  File: `src/app/api/subscribe/route.ts:28-57`
  Fix: confirm page with POST, double opt-in email.

- [ ] **Stored XSS sink in news articles**
  File: `src/app/nieuws/[slug]/page.tsx:67` (`dangerouslySetInnerHTML` on `article.content`)
  Fix: sanitize with `sanitize-html` on render.

- [ ] **supabaseAdmin falls back to the anon key and is imported by client components**
  File: `src/lib/supabase.ts:9-10`; importers `src/app/uitslagen/page.tsx`, `src/components/PredictionWidget.tsx`
  Fix: split into `supabase-browser.ts` and `supabase-admin.ts` with `import 'server-only'`, throw if the key is missing.

- [ ] **Small items**: validate `gameId` as `/^\d+$/` in `win-probability` and `knbsb-scraper.ts:82`; stop returning `String(err)` in `sync`, `career-stats`, `gsc`; allowlist keys in `admin/api/users/route.ts:58`; pin `images.remotePatterns` to your Supabase host; check magic bytes in `upload-photo`.

## P2 performance (2 days)

- [ ] **robots.txt conflict**
  Verify: `ls public/robots.txt src/app/robots.ts` both exist; dev server logs "conflicting public file and page file".
  Fix: delete `public/robots.txt`.

- [ ] **/uitslagen CLS 0.60 and perf 60**
  File: `src/app/uitslagen/page.tsx:107-132` (client page, fetches in useEffect, renders "Loading…").
  Verify: production Lighthouse `/uitslagen` CLS.
  Fix: server component with `revalidate = 120`, reserve layout height for the results list. Fix empty title in `src/app/uitslagen/layout.tsx:3-12`.

- [ ] **NavBar bundles SearchModal + PlayerStatsModal + full roster data on every page**
  File: `src/components/NavBar.tsx:8`, `src/components/SearchModal.tsx:6-8`
  Verify: `grep -rn "dynamic(" src | wc -l` returns 1.
  Fix: `next/dynamic` for SearchModal, BoxscoreModal, PlayerStatsModal. Mount `PushNotifications` once (lines 239 and 262).

- [ ] **Pages self-fetch their own production API**
  Files: `src/app/rosters/[teamId]/page.tsx:9-14` (`force-dynamic` + fetch to `NEXT_PUBLIC_SITE_URL`), `src/app/rosters/[teamId]/[playerSlug]/page.tsx:59-62`
  Fix: call the lib function directly, `next: { revalidate: 300 }`, drop `force-dynamic`.

- [ ] **Livescores poll is uncached**
  Files: `src/app/livescores/page.tsx:186-204`, `src/app/api/livescores/route.ts`
  Fix: `Cache-Control: public, s-maxage=15, stale-while-revalidate=30`, pause the poll when `document.hidden`.

- [ ] **Schedule fetched no-store in 6 places**
  Verify: `grep -rn "fetchschedule.php" src | wc -l`
  Fix: one `getSchedule()` in `src/lib` with `next: { revalidate: 15 }`.

- [ ] **Leaders page waterfall and force-dynamic**
  File: `src/app/leaders/page.tsx:73, 291-301`
  Fix: `Promise.all` all three, `revalidate = 300`.

- [ ] **Postseason leaders fetch boxscores sequentially**
  File: `src/app/api/leaders/postseason/route.ts:46-48`
  Fix: `Promise.all`.

- [ ] **live-monitor cron reads the whole subscriptions table per notification**
  File: `src/app/api/push/live-monitor/route.ts:48-77, 94`
  Fix: load subscriptions once per run, filter in SQL, `Promise.all` over games.

- [ ] **sync cron writes 7 standings rows every 2 minutes unchanged**
  File: `src/app/api/sync/route.ts:145-162`
  Fix: diff before write, single upsert, `revalidatePath('/stand')` on change.

- [ ] **public/franchise is 291 MB, 166 MB of fallback JPEG originals**
  Verify: `du -sh public/franchise/Assets/Photos`
  Fix: add `public/franchise/Assets/Photos/` to `.vercelignore` if the fallback is never hit; long-cache header for `franchise.wasm.gz`.

- [ ] **Images**: footer sponsor `<img>` without lazy loading or Cloudinary `f_auto,q_auto,w_320` (`src/app/layout.tsx:112-137`); `fill` without `sizes` (7x); `priority` on decorative banners (`players/[slug]/page.tsx:112`).

## P3 accessibility (1 day)

- [ ] **Hero dots: no label, 8 px targets** `src/components/HeroSlideshow.tsx:88-92`. Fails Lighthouse `button-name` and `target-size` on `/`.
- [ ] **Contrast 3.57:1 white on #fe3d00** nav CTA on every page, news-bar links. Fails `color-contrast` on all three audited pages. Darken the accent for text or use dark text on orange.
- [ ] **Clickable divs without keyboard path** `src/app/livescores/page.tsx:84`, `src/components/HomeRecentResults.tsx:56`, `src/app/rosters/RosterTabs.tsx:136`, `src/app/compare/page.tsx:170`, `src/app/immaculate-grid/page.tsx:252`.
- [ ] **Modals without role=dialog or focus trap**: all except `PlayerStatsModal`. Extract one `Modal` component.
- [ ] **Icon-only close buttons without aria-label** `BoxscoreModal.tsx:272`, `immaculate-grid/page.tsx:193`, `pickle/page.tsx:287`.
- [ ] **No prefers-reduced-motion** for marquee (`globals.css:54-60`) and hero autoplay.
- [ ] **Forms**: `partner-up/page.tsx:105-133` labels without `htmlFor`; 8 placeholder-only inputs.
- [ ] **Tables**: 48 `<th>` with no `scope`.
- [ ] **Language toggle never sets `document.documentElement.lang`** `src/lib/language.tsx:40-52`.
- [ ] **SEO**: `nieuws/[slug]` has no metadata so it inherits the homepage canonical; sitemap misses postseason, win-the-series, holland-series, media, notificaties.

## P4 clean code and structure (ongoing, one feature per PR)

- [ ] **Add unit tests** (currently 0 for `src/`). Start with pure logic: IP math, `parseKnbsbName`, pickle day math, `simSeries`.
- [ ] **Dead components** (0 importers): `NetherlandsClubMap`, `ResultCards`, `ScorecardButton`, `ScoresTicker`, `SupplementalRoster`. Verify: `grep -rl ScoresTicker src | grep -v components/ScoresTicker.tsx`.
- [ ] **TeamLogo copied 8x**. Verify: `grep -rln "function TeamLogo" src | wc -l`. Extract to `src/features/teams/components/TeamLogo.tsx`.
- [ ] **Date formatter copied 15x**. Verify: `grep -rn "T12:00:00" src | wc -l`.
- [ ] **KNBSB id map copied 6x** while `lib/teams.ts` exports it. Verify: `grep -rn "39583: 'pirates'" src | wc -l`.
- [ ] **`Game` type defined 11x**. Verify: `grep -rn "type Game = {" src | wc -l`.
- [ ] **IP-to-outs math in 3 places with different integer semantics** (`import-series/route.ts:77`, `leaders/page.tsx:45`, `leaders/month/route.ts:6`). This is a latent bug.
- [ ] **God files over 300 lines** (17). Worst: `LeadersTabs.tsx` 591, `admin/photos/page.tsx` 550, `pickle/page.tsx` 549, `live-monitor/route.ts` single 312-line GET.
- [ ] **Two admin auth systems** (Supabase session vs header password). Keep one.
- [ ] **Minified-style one-line code** in `src/app/franchise/auth/route.ts`, `api/franchise/**`, `lib/franchise/*`. Run Biome format.
- [ ] **Move to feature folders** `src/features/<name>/{api,components,domain,hooks}`. Do one feature per PR, livescores first.
- [ ] **Dutch and English mixed in routes** (`/uitslagen`, `/stand` vs `/leaders`). Decide once, add redirects if renaming.
