# Portfolio update: implementation report

October 15, 2026 · branch `feat/portfolio-update` (on top of production commit `fed096e`) · not deployed to production

## Source identity

This checkout (`Downloads/source-review/dh-conversational-portfolio`) is the production source for portfolio.davishiggins.com: a local build of `fed096e` produced SHA-256-identical `index-BXAD9oIn.js` and `index-nk6h-yZs.css` to the live site, and `assistant.js`/`assistant.css` matched. The working tree was clean; no existing work was overwritten. Other local copies (`~/Portfolio`, `Downloads/portfolio-repo`, `Downloads/UTDPortfolio`) are older commits of the same project.

## What changed

| Area | Result |
|---|---|
| Routing | React Router 6 with real URLs: `/`, `/experience`, `/projects`, `/projects/:slug`, `/education`, `/writing`, `/writing/:slug`, `/contact`; true 404 page. `/impact` and `/skills-proof` → `/writing`, `/skills` → `/experience`, `/resume` and `/docs/davis-resume.pdf` → `/davis-resume.pdf` (308). Old `#proj-*`/`#exp-*` anchors map once to new routes. |
| Projects | Compact 3/2/1-column gallery, 16:9 covers, title below, status line, two-line summary; URL-backed filters (`?category=`) with `aria-pressed` and counts; Back restores filter and scroll. 24 case-study pages. |
| Writing | Replaces Impact. 16 notes, verbatim, in a scoped reproduction of the Curated Notes reader (back control, gold meta row, Syne title, divider, 680px Lora body, related-project block, reading progress, prev/next). Link to notes.davishiggins.com on the index. |
| Resume | Skills and Resume pages removed. Header folded-paper document link opens `/davis-resume.pdf` (byte-identical to the supplied file) in a new tab; also in the mobile menu. |
| Davis Intelligence | Server-owned prompt and generated public knowledge; client `system` ignored; validated, bounded requests; sanitized errors; React panel with dialog semantics, Escape/focus return, safe link rendering, retry, review date. Old `assistant.js` (with a 12 KB client prompt containing stale facts and prices) removed. |
| Facts | One Chaptr Group (Software Engineer, Aug 2026); Kewaunee title Data Analyst (internship context kept in the assistant); Higgins Digital "Software Development Company"; VP of Philanthropy shown as a former office; Lakeside dated "2026"; chaplain link to chaplain.davishiggins.com; Census paper credited to its five authors. |
| Performance | Prerendered HTML for 46 routes; entry JS 124.7 → 92.0 KB gz; LazyMotion; self-hosted fonts (no Google Fonts @import); AVIF/WebP derivatives; logos 100–270 KB → 2–32 KB; headshot 70 → 30 KB. |

Content registries: `content/projects/*.json` (24), `content/profile.json`, `content/notes/` (manifest, 16 bodies, related-project blocks), `content/media.json` (58 images). `npm run content` validates them and generates the pages' data, routes, sitemap, and `server/knowledge.generated.js`.

## Projects and evidence

All 15 original projects are kept (the old "Davis Intelligence" card is now **AI Workflow System**). Added: SecondChance, One Chaptr Storefront Platform, Y NOT?, Phi Delta Theta NC Epsilon, Chaplain Platform, Touch Up Solutions, wy_not_pics, Photos & Frames, DH Portfolio. Deferred, not published: Lattice, Clarity, the Higgins Digital lead-generation hub (no current evidence).

Fact checks against local sources:

- **Contender**: parity registry 68 preserved / 18 corrected (`docs/propify-status.md`); NBA backfill 433 jobs, 0 failures; 596 backend test functions (published as "580+"). The "23 prop markets" claim was not reused (registry shows 26 including deferred).
- **ProspectIQ**: local source `Downloads/prospectiq@fc8907f`: 8 scrapers, `pytest --collect-only` = 272, CI on 3.10/3.11/3.12. Public repo 404 (private or removed, not assumed deleted) → no GitHub link.
- **NYPD**: final notebook found locally; figures (36.0 / 36.6 / 49.9 per month, chi-square, 56% logistic accuracy) and the heatmap come from it. No SQL in the final notebook, so SQL was removed from the stack. Repo 404 → no link.
- **Census**: the repo's PDF is valid (17 pages) and identical to the live file; title page lists five authors.
- **SecondChance**: team and model metrics from the project README/model artifact.
- **Y NOT?**: links ynot.lifestyle; ynotbrand.co is mentioned only in assistant knowledge (502 on Oct 15).

Media: every project has a cover, a hero, and a distinct captioned secondary visual. 11 projects use Davis's supplied covers and individual images; 6 use the main site's own covers; Kewaunee and One Chaptr use labeled illustrative graphics (no company data); NYPD and Census use real figures from their reports; secondary visuals are dated public screenshots, source diagrams, or report figures (`media-src/screens/capture-log.json`).

## Checks

| Check | Result |
|---|---|
| `tsc` (client, strict) and `tsc` (server, checkJs) | Pass |
| ESLint, `--max-warnings=0` | Pass |
| Vitest unit tests | 36 passed |
| Playwright e2e, local prerendered build via `scripts/serve-dist.mjs` (desktop 1440 + mobile 390) | 67 passed, 7 skipped by design |
| Note parity on rendered output (`npm run verify:notes`) | PASS, 16/16; no link remaps |
| Handoff `verify_handoff.py` | PASS (asset mapping is validated by `npm run content` instead) |
| Vercel preview `testportfolio-4mncqmgky-…vercel.app` (not production) | Routes 200, unknown slugs 404, redirects 308, PDF SHA-256 match, `/api/chat` GET 405, route metadata in HTML |
| Real AI: 34 evaluation cases on the preview | 34/34 HTTP 200. First run: 30/34 met expectations; AI-04, AI-17, AI-22 fixed and re-verified. Transcripts: `.verify/ai-eval*.json` (local, untracked) |
| Real UI → endpoint → provider → link | Verified in Chrome on the preview; answer links navigate client-side |

Mocked tests cover 429, 502, 503, network failure, malformed response, duplicate sends, and timeouts (unit).

## Performance (Lighthouse 12, mobile defaults, local server, median of 3)

| Page | Perf | A11y | FCP | LCP | CLS | Transfer |
|---|---|---|---|---|---|---|
| Home, before | 77 | 95 | 2.90 s | 4.36 s | 0 | 554 KB |
| Home, after | 86 | 100 | 2.52 s | 3.42 s | 0.013 | 217 KB |
| /projects, after | 88 | 100 | 2.32 s | 3.14 s | 0 | 369 KB |
| /projects/flowcast, after | 91 | 100 | 2.40 s | 2.98 s | 0.001 | 285 KB |
| /writing, after | 93–100 | 100 | 1.2–2.2 s | 1.2–2.4 s | 0 | 174 KB |
| Note page, after | 88–99 | 100 | 1.3–2.6 s | 1.3–3.0 s | 0 (was 0.067 before font preload) | 262 KB |

The old Projects view had no URL, so it has no Lighthouse baseline. Ranges reflect machine load during the session (the untouched baseline re-measured within one point). These are lab numbers, not field data; INP is not claimed.

## Remaining limits

- Lighthouse mobile LCP on Home/Projects/case studies is 3.0–3.4 s, above the 2.5 s target; the main cost is the entry bundle (React, React Router, framer-motion) under simulated 4G. Performance ≥ 90 is met on the case study, Writing, and usually the note page, not on Home (86) or Projects (88).
- Rate limiting is per serverless instance (best effort), as documented in `server/chat-core.js`.
- The reader's muted metadata alpha was raised from 0.45 to 0.56 for WCAG AA; otherwise reader values match the source.
- Screenshots and designed visuals are regenerable masters and are not committed (`npm run media` uses committed derivatives).

## Run and review

```bash
npm ci
npm run dev            # Vite dev server with /api/chat (needs ANTHROPIC_API_KEY for real answers)
npm run build          # content → client → SSR → prerender into dist/
npm run preview        # Vercel-like local server on :4173
npm run check          # typecheck, lint, unit tests, build
npm run test:e2e       # Playwright against the build
npm run verify:notes   # rendered note parity
node scripts/eval-assistant.mjs --deployment <preview-url>
```
