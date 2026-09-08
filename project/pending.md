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

## In flight

- Nothing.

## Queued

| # | Item |
|---|---|
| 1 | Write `scripts/validate.mjs`, generate `catalogue.md` from it, lint `project/*.md` for paragraphs, ceilings and stray headings |
| 2 | Move images out of base64 into files, WebP, build-time thumbnails |
| 3 | Split `index.html` into modules under `src/` |
| 4 | Create the Firebase project, enable Google and Apple sign-in |
| 5 | Firestore collections, security rules, rules tests |
| 6 | Cloud Functions: onUserCreate, onPostCreate, onPostApprove, setAdmin |
| 7 | Sign-in UI and post submission on the FAQ and part drawer |
| 8 | `/admin` route |
| 9 | Netlify continuous deploy |
| 10 | Convert `project/` into a loadable skill |

## Parked

- Custom domain.
- Arabic fitment strings. `fit` is English only.
- Rate limiting on post creation.
- Reporting and flagging by users.
- Club member badge and fast-track to trust 1.
