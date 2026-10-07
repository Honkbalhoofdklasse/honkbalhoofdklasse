# honkbalhoofdklasse

Next.js 16 App Router, React 19, Tailwind 4, Supabase, Vercel. Live site: https://honkbalhoofdklasse.com. Do not break it.

Full rules: AGENTS.md. Folder map: docs/structure.md. Open work: docs/improvements/checklist-001.md.

## Before you touch code
1. Read AGENTS.md.
2. Pick one checklist item or one feature. One PR per item.
3. Never commit to `main`. Branch from `main`, open a PR, let CI pass.

## Before you say done
```
npm run check        # biome lint + format check + tsc + build
npm run lighthouse   # against the preview URL or http://localhost:3000
```
Paste the Lighthouse scores in the PR. Perf, a11y, best practices, SEO must not drop below the baseline in the checklist.

## Hard rules
- No new `'use client'` page. Server component by default, client islands only.
- No new file over 250 lines. Split instead.
- No comments. Rename until the code explains itself.
- No `any`. No `as unknown as`.
- No secret in `NEXT_PUBLIC_*`. No new env var without adding it to `.env.example`.
- Every API route: auth check first line, validate body with zod, never return raw error text.
- New code goes in `src/features/<feature>/`, not in flat `components/` or `lib/`.

## Skills in this repo (.claude/skills)
grill-with-docs, to-spec, implement, implement-spec, tdd, code-review, diagnosing-bugs, pr. Use `/to-spec` before any multi-file change and `/code-review` before opening a PR.
