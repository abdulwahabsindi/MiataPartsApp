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

- Nothing.

## Queued

| # | Track | Item |
|---|---|---|
| 1 | Process | Tune Claude's response contract in `project-instructions.md` (admin mode) |
| 2 | Standalone | Split `index.html` into modules under `src/`, and generate it from `data/` — no hand-pasted data blocks, CI fails on a stale committed file |
| 3 | Standalone | Link Netlify to the repo for continuous deploy (Fayiz — has access; `netlify.toml` ready) |
| 4 | Standalone | Release/changelog process |
| 5 | Firebase | Create the Firebase project, enable Google and Apple sign-in |
| 6 | Firebase | Firestore collections, security rules, rules tests |
| 7 | Firebase | Cloud Functions: onUserCreate, onPostCreate, onPostApprove, setAdmin |
| 8 | Firebase | Sign-in UI and post submission on the FAQ and part drawer |
| 9 | Firebase | `/admin` route |

## Parked

- Custom domain.
- Arabic fitment strings. `fit` is English only.
- Rate limiting on post creation.
- Reporting and flagging by users.
- Club member badge and fast-track to trust 1.
