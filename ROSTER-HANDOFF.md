# ROSTER HANDOFF — for Folder — 2026-11-03

Written by the build session that shipped the eight roster games as v1.0.0 drafts. Companion to each shell's own HANDOFF.md, which stays the living log for that game. This file is the roster view: what exists, what was verified, what Tj decided, what is open, and what we learned. Read it before touching any of the eight repos.

## 1. State of the roster

All eight games from the 2026-11-02 Google Play niche research are built, tested, merged to `main`, and deployed by GitHub Pages. Every `main` serves the real game (no placeholder). Verified 2026-11-03 via the Actions API and `index.html` titles on `origin/main`.

| # | Game | Repo | `main` | Model (Play) | Price | Pages |
|---|---|---|---|---|---|---|
| 4.4 | Keep the Light | project-shell-04 | 59fab03 | free to 1930 + `full_unlock` | $4.99 | live |
| 4.1 | Open Stall | project-shell-01 | 714ac80 | free Village Green season + `full_unlock` | $4.99 | live |
| 4.2 | The Night Apothecary | project-shell-02 | 56d5c2e | free nights 1–5 + `full_unlock` | $3.99 | live |
| 4.5 | Mended | project-shell-03 | 78541c1 | free year one + `full_unlock` | $4.99 | live |
| 4.3 | Lost Property Office | project-shell-05 | 100675c | paid upfront, no IAP | $2.99 | live |
| 4.6 | The 9:15 to Blackpool | project-shell-06 | b250688 | paid upfront, no IAP | $3.99 | live |
| 4.7 | Night Shift: Laundromat | project-shell-07 | 18bbde2 | free nights 1–3 + `full_unlock` | $4.99 | live |
| 4.8 | Cartographer's Apprentice | project-shell-08 | c4c9079 | free + `full_unlock` | $2.99 | live |

URLs: `https://taugustincst.github.io/project-shell-NN/` (repo rename at ship time is Tj's call; manifests use relative `./` scope so renames are safe). Landing page `taugustincst.github.io` lists all eight under "New games, in development" (no prices, per the roster rule).

## 2. What every game has (common pattern)

Built to one pattern so Folder can review any repo the same way:

- Vanilla HTML/CSS/JS, no build step, no runtime dependencies. `index.html`, `style.css`, `js/data.js` (all content as data), `js/engine.js` (pure, seeded, deterministic; runs in Node and the browser), `js/game.js` (UI, save, loop), `js/billing.js` where there is an unlock (Digital Goods API, product id `full_unlock`, acknowledges by completing the PaymentRequest).
- Save: versioned `localStorage` key, full sanitizer on load (clamps, drops unknown ids), fail-soft (corrupt save is backed up and the game starts fresh, never crashes), elapsed-time clamping against clock changes.
- Test API on `window.__<game>` (seed state, jump, give, force event, fast-forward, unlock) and `?dev=1` for a free unlock in test builds.
- Headless Node verification: engine unit tests; a sim, harness or validator specific to the game; a Playwright smoke test that drives the real page over `file://` (no server needed). All run in `.github/workflows/ci.yml` on every non-main push. Folder's `pages.yml` deploys `main`.
- PWA: `manifest.webmanifest` (relative scope), `sw.js` app-shell cache, icons and a staged screenshot rendered by `tools/make-icons.js` with headless Chromium.
- `privacy.html` (no data collected; purchases via Play Billing where applicable; contact elderon@augustinnovations.io), `store/listing.md` (draft copy following the rules: features only in the short description, captions state content not price), `README.md`, `tasks/todo.md` (plan with a Review section), `tasks/lessons.md` (corrections), and a dated HANDOFF log entry with FOR TJ items.
- Portrait, one-handed, large-text, high-contrast and reduce-motion options; meaning never carried by colour alone; no twitch input.

## 3. Per-game detail and verification

**Keep the Light (shell-04).** Three eras, 63 upgrades, 41 events (7 scheduled story beats including the 1979 automation letter that sets the ending), 58 logbook entries across four generations, three endings (Legend / The Light Keeps Itself / The Last Keeper), prestige with heirlooms and three headlands, offline earning with the calendar frozen (8 h cap). Engine tests 11/11, smoke 19/19, sims: greedy play reaches the 1930 gate in ~3.2 h and finishes in ~5.5 h; neglect ~15 h in the dark. Known: late-era surplus is generous.

**Open Stall (shell-01).** 15-space stall with 8-neighbour adjacency and 15 rule kinds; 120 items in 6 families with one plain-language rule on tap; 80 charms; 5 weathers; 30 day-events; 3 markets with published 12-week fee schedules; combo journal; pool tiers earned by play; Free Market endless. Engine tests 10/10, smoke 24/24, harness over 1,200 seasons: 19 of 22 archetypes viable, 15 distinct signature combos (kill rule of 15 met). Known: Harbour 7 and Square 0 viable with simple heuristics, week-4 balance work.

**The Night Apothecary (shell-02).** 40 ingredients as trait records with lookalikes, 30 authored nights, 40 authored customers (including refuse-cases), 3 endings, procedural customers from shared clue tables, endless "long winter". Validator: 40 authored + 1,200 generated cases, 0 failures (first draft had 26 ambiguous cases, fixed in clue text, not in the validator). Engine tests 13/13, smoke 20/20.

**Mended (shell-03).** 8 trades, 79 faults diagnosed by symptom plus up to three tests, 42 parts, 3 suppliers on lead times, 4 staff roles with per-trade skills, 5 street blocks, 13 story arcs, 156-week campaign, three endings plus endless. Engine tests 12/12 including a diagnosability validator, smoke 21/21, sims: careful play busts 1/20 in year one and reaches an ending 18/20; undercharging and neglect bust 20/20. Known: cash snowballs in years 2–3; "beloved" ending dominates "FixEmpire".

**Lost Property Office (shell-05).** 30-day season, ~200 generated objects per season from 28 types × 12 colours × 30 marks, four claimant profiles, three-way claim/log/object check with the log wrong 1 in 5, 8 Standing Orders, escalation layers on days 3/5/8/15/22/29, ring arc plus 24 authored claimants, 8 office upgrades, 3 endings. Engine tests 9/9 including a fairness checker over 300 seasons (~44k claimants: every stamp provable, no honest claimant flaggable). Smoke 21/21.

**The 9:15 to Blackpool (shell-06).** Six cases, 55 figures, 97 evidence items, 165 casebook entries, a connecting thread resolved in the finale. Constraint-propagation solver validates and confirms play; confirmation only in threes. Validator: all six cases unique and solvable by pure deduction. Engine tests 7/7, smoke 21/21.

**Night Shift: Laundromat (shell-07).** 14 turn-based nights, 8 machines, 14 mechanically enforced rules (one per night), 10 regulars with arcs, 43 spine beats, 20 table events, 6 endings; dread through restraint, no jump-scares. Engine tests 12/12, smoke 20/20, sims over 200 fortnights: diligent 100% survive, greedy 0% (fails ~night 9).

**Cartographer's Apprentice (shell-08).** 151 hand-authored lands (stylised polygons plus facts, sources in CREDITS.md, uncertain fields omitted), 8 evidence generators × 3 tiers, unique-answer commission builder, career with 5 ranks, 8 layers, 8 tools, 40 prestige commissions, 3 rivals, spaced repetition as returning clients, expeditions under budget. Validator: 3,096 generated + 40 prestige commissions, 0 failures. Engine tests 13/13, smoke 18/18.

## 4. Decisions taken (by Tj, this session)

- Merge every game to `main` so Pages deploys; done for all eight and the landing page.
- **Mended** is the shipping title for shell-03 ("Fix-It Felix" is a Disney mark and never ships).
- Build guidelines adopted roster-wide: plan in `tasks/todo.md`, verify before done, record corrections in `tasks/lessons.md`, simplicity and minimal impact, stop and re-plan when things go sideways.

## 5. Open items FOR TJ (also logged in each shell's HANDOFF)

1. **Play Console, per game:** create the app; package name (suggested: `com.taugustincst.keepthelight`, `.openstall`, `.apothecary`, `.mended`, `.lostproperty`, `.blackpool`, `.nightshift`, `.cartographer`); the `full_unlock` non-consumable at the price above where applicable; upload keystore (Elderon pattern, Tj only).
2. **Web gating:** every unlock game is gated in the browser exactly like Play (`?dev=1` unlocks test builds). Decide whether web builds open fully like Ironhold and Bubble Pop, or stay gated.
3. **Blind playtests required by the briefs before any store work:** Blackpool (three non-authors on logic), Apothecary (nights 1–10, kill/pivot rule), Laundromat (night-1 tone gate on strangers).
4. **Fact review** of `js/world.js` in Cartographer's Apprentice before submission.
5. **Contact email** elderon@augustinnovations.io is used in all privacy pages; confirm.
6. **Repo renames** at ship time.

## 6. Next, agent-owned (Folder to schedule)

- Android TWA wrappers for all eight (copy `android/` from Ironhold; swap package, name, host; no `Application` class; add `assetlinks.json` entries on taugustincst.github.io once Play signing fingerprints exist).
- Balance passes the sims flagged: Open Stall Harbour/Square markets; Mended late-game cash and the FixEmpire pull; Keep the Light late surplus.
- Phone playtests of the first session of each game; staged store screenshots 2–4 via each test API; feature graphics.
- Folder expert review per the process; submission only on Tj's explicit approval. Keep the Light ships first as the funnel test; its Play numbers gate the free+unlock decision for the others.

## 7. Lessons (roster-wide; details in each repo's tasks/lessons.md)

- **Concurrent pushes.** Folder's "Enable GitHub Pages" and "placeholder index.html" commits landed on every shell's `main` while games were being built; on shell-04 the placeholder overwrote the finished game until restored. Rule: fetch `origin/main` before merging, merge (never force-push or reset, both are denied in the sandbox), keep Folder's `pages.yml` and HANDOFF line, and make sure the game's `index.html` wins. Coordinate before pushing to a repo another agent is building in.
- **Pages enablement** cannot be done by the workflow token or through the session's GitHub proxy; it is a repo setting. Folder's workflow route worked.
- **Cloud sandbox limits:** no local ports (use `file://` for Playwright), no outbound fetch of github.io, `gh` only for search. Shallow single-branch clones do not track feature branches on fetch.
- **Balance from sims, not vibes.** Every game's first economy pass was wrong in some direction (converging endings, everything-bought-by-1960, all strategies busting, bench starvation); the headless sims found it in seconds. Keep the sims in CI.
- **Validators protect the writing.** Apothecary's first draft had 26 unfair cases; Blackpool and Cartographer's would have shipped ambiguous puzzles without theirs. Fix the content, never loosen the validator.
- **Offline progress must not skip story.** Freeze the calendar; let only the economy run (Keep the Light).
- **CSS transform animations override SVG `transform` attributes**; wrap in a `<g>`. **`pagehide` saves overwrite planted test saves**; plant with `addInitScript`.
