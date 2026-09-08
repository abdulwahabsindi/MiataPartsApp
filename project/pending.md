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
| Catalogue master | xlsx becomes a one-time import, or the pipeline inverts and xlsx stays master | Data extraction |
| FAQ question ids | Add stable ids, or keep array positions | Posts targeting a question |
| Verified flag | Add a per-record flag, or leave all records draft | Verification workflow |

## In flight

- Nothing.

## Queued

| # | Item |
|---|---|
| 1 | Extract inline data from `index.html` into `data/*.json` |
| 2 | Write `scripts/validate.mjs`, generate `catalogue.md` from it, lint `project/*.md` for paragraphs, ceilings and stray headings |
| 3 | Move images out of base64 into files, WebP, build-time thumbnails |
| 4 | Split `index.html` into modules under `src/` |
| 5 | Create the Firebase project, enable Google and Apple sign-in |
| 6 | Firestore collections, security rules, rules tests |
| 7 | Cloud Functions: onUserCreate, onPostCreate, onPostApprove, setAdmin |
| 8 | Sign-in UI and post submission on the FAQ and part drawer |
| 9 | `/admin` route |
| 10 | Move the repo to git, Netlify continuous deploy |
| 11 | Install skill-security-auditor |
| 12 | Audit and install write-a-skill, convert `project/` into a loadable skill |
| 13 | Install runbook-generator, after 9 |
| 14 | Install changelog-generator, after 10 |

## Parked

- Custom domain.
- Arabic fitment strings. `fit` is English only.
- Rate limiting on post creation.
- Reporting and flagging by users.
- Club member badge and fast-track to trust 1.
