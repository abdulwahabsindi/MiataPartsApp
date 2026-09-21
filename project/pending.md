# pending.md

Holds: decided work not yet done, and open decisions waiting on me.
Write when: a decision is asked for, an item starts, an item ships, or I park
something.
Never goes in: completed work (delete the line), reasons, estimates, priorities
I did not set, ideas I did not ask for.
Ceiling: 4500 characters.

---

## Open decisions

| Decision | Options | Blocks |
|---|---|---|
| Build tooling | Vite, or stay dependency-free | Module split |
| FAQ question ids | Add stable ids, or keep array positions | Posts targeting a question |
| Verified flag | Add a per-record flag, or leave all records draft | Verification workflow |
| Backend provider | Firebase Blaze, or Supabase | Firebase track (5-9) |
| Image hosting | Static files on Netlify, or object storage on the backend | Photo changes without a redeploy |

## In flight

- Continuous deploy: GitHub Actions runs `netlify-cli deploy --build --prod`
  on push to `main` (Fayiz). Needs `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`
  as repo secrets before merge.

## Queued

| # | Track | Item |
|---|---|---|
| 1 | Process | Tune Claude's response contract in `project-instructions.md` (admin mode) |
| 2 | Standalone | Split `index.html` into modules under `src/`, and generate it from `data/` — no hand-pasted data blocks, CI fails on a stale committed file |
| 3 | Standalone | Release/changelog process |
| 4 | Firebase | Create the Firebase project, enable Google and Apple sign-in |
| 5 | Firebase | Firestore collections, security rules, rules tests |
| 6 | Firebase | Cloud Functions: onUserCreate, onPostCreate, onPostApprove, setAdmin |
| 7 | Firebase | Sign-in UI and post submission on the FAQ and part drawer |
| 8 | Firebase | `/admin` route |

## Parked

- Custom domain.
- Arabic fitment strings. `fit` is English only.
- Rate limiting on post creation.
- Reporting and flagging by users.
- Club member badge and fast-track to trust 1.
