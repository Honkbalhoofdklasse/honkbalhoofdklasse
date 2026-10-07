# Agent rules for honkbalhoofdklasse

Short, direct, numbered. Follow in order. If a rule and the task conflict, ask once.

## 1. Workflow
1. Start on a branch: `git switch -c feat/<name>` or `fix/<name>`.
2. Spec first for anything touching more than two files (`/to-spec`).
3. Tests first for pure logic (`/tdd`). Vitest, file next to the code: `foo.test.ts`.
4. Implement the smallest change that passes.
5. Run `npm run check`. Fix every error. No `biome-ignore`, no `eslint-disable`.
6. Run `npm run lighthouse` and paste scores.
7. `/code-review` on your diff, fix findings.
8. Open a PR with the checklist item linked. CI must be green. Vercel preview must load.
9. Merge via PR only. `main` deploys to production.

## 2. Environments
| Env | Branch | Vercel | Supabase | URL |
|---|---|---|---|---|
| dev | local | `vercel dev` or `next dev` | dev project (see .env.example) | localhost:3000 |
| preview | any PR branch | automatic preview deploy | dev project | `*.vercel.app` |
| prod | `main` | production | prod project `qlowdrzergyuxzkzahqf` | honkbalhoofdklasse.com |

Never point a local or preview build at the prod Supabase project. Preview env vars in Vercel must use the dev project.
Crons (`vercel.json`) only run in production. Never add a cron without `CRON_SECRET` enforcement.

## 3. Code rules
1. Feature folders: `src/features/<feature>/{api,components,domain,hooks,test}`. Shared only when two features use it: `src/shared/`.
2. Server components by default. `'use client'` only on the leaf that needs state or browser APIs.
3. Files under 250 lines, functions under 40 lines, one component per file.
4. No comments, no commented-out code, no TODO. Name it instead.
5. Types: one `Game`, one `Team`, one `Player` in `src/shared/types/`. Do not redefine.
6. Reuse before writing: `TeamLogo`, `formatGameDate`, `KNBSB_NUMERIC_ID_MAP` in `src/lib/teams.ts`, `Modal`.
7. Data fetching: server pages use `fetch` with `next: { revalidate }` or `export const revalidate`. Never `force-dynamic` without a stated reason in the PR. Never fetch your own `/api` from a server component.
8. Client fetching: one hook per feature in `hooks/`, cleanup on unmount, pause on `document.hidden`.
9. Heavy or click-only components (modals, charts, search) load through `next/dynamic`.
10. Images: `next/image` with `sizes`, `priority` only on the LCP image, Cloudinary URLs include `f_auto,q_auto`.

## 4. Security rules
1. API route order: auth, validate (zod), act, respond. No exceptions.
2. Admin routes use the Supabase session plus `admin_users`. The `x-admin-password` header is legacy and must not be extended.
3. Cron routes: `if (!secret || auth !== \`Bearer ${secret}\`) return 401`.
4. Never return `String(err)` or `error.message` to the client. Log it, return a generic message.
5. Never render user content with `dangerouslySetInnerHTML` unless sanitized.
6. Every table touched by the browser needs an RLS policy committed in `supabase/migrations/`.
7. Secrets only in Vercel env and `.env.local`. `.env.example` lists names only.

## 5. Accessibility rules
1. Clickable things are `<button>` or `<a>`. Never `onClick` on a div.
2. Icon-only buttons have `aria-label`.
3. Modals use the shared `Modal` (role dialog, focus trap, Escape, focus restore).
4. Text contrast 4.5:1 minimum. Do not put white text on `#fe3d00`.
5. Respect `prefers-reduced-motion` for any animation that loops.
6. Every input has a `<label htmlFor>`. Every `<th>` has `scope`.

## 6. Testing in the browser
1. Unit: `npm test` (vitest).
2. Lighthouse: `npm run lighthouse` (uses `lighthouserc.json`, needs a running server or `LH_URL`).
3. Visual or flow check: Chrome DevTools MCP or claude-in-chrome against the preview URL. Report what you clicked and what you saw. Do not claim a UI works without opening it.
4. jev-qa: write `tests/qa/<feature>.qa` from the acceptance criteria and run `jev-qa run`.

## 7. What not to do
- Do not edit `public/franchise/**` generated assets by hand. Use `npm run franchise:*`.
- Do not change `vercel.json` cron schedules without discussing cost.
- Do not run migrations against prod from a laptop. Migrations go through the PR and the Supabase CLI in CI.
- Do not add dependencies over 50 KB gzipped without a reason in the PR.

## 8. Pull requests
1. Title: `type(scope): what changed`, under 70 chars.
2. Body follows `.github/pull_request_template.md`: why, what, checks, screenshot.
3. Screenshot is mandatory for any visible change. Take it from the Vercel preview with Chrome DevTools MCP or `npx playwright screenshot <url> shot.png`, then attach it with `gh pr create --body-file` and upload the image in the PR.
4. Paste the Lighthouse scores for the preview URL.
5. Open with `gh pr create --title "..." --body-file pr.md`. Never `--fill`.
