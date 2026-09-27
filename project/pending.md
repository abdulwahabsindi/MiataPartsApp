# pending.md

Holds: decided work not yet done, and open decisions waiting on us.
Write when: a decision is asked for, an item starts, an item ships, or we park
something.
Never goes in: completed work (delete the line), reasons, estimates, priorities
we did not set, ideas we did not ask for.
Ceiling: 4500 characters.

---

## Open decisions

| Decision | Options | Blocks |
|---|---|---|
| FAQ question ids | Add stable ids, or keep array positions | Posts targeting a question |
| Verified flag | Add a per-record flag, or leave all records draft | Verification workflow |
| Backend provider | Firebase Blaze, or Supabase | Firebase track (3-7) |
| Image hosting | Static files on Netlify, or object storage on the backend | Photo changes without a redeploy |

## In flight

- Nothing.

## Queued

| # | Track | Item |
|---|---|---|
| 1 | Standalone | Link Netlify to the repo for continuous deploy (Fayiz — has access; `netlify.toml` ready) |
| 2 | Standalone | Release/changelog process |
| 3 | Firebase | Create the Firebase project, enable Google and Apple sign-in |
| 4 | Firebase | Firestore collections, security rules, rules tests |
| 5 | Firebase | Cloud Functions: onUserCreate, onPostCreate, onPostApprove, setAdmin |
| 6 | Firebase | Sign-in UI and post submission on the FAQ and part drawer |
| 7 | Firebase | `/admin` route |

## Parked

- Custom domain.
- Arabic fitment strings. `fit` is English only.
- Rate limiting on post creation.
- Reporting and flagging by users.
- Club member badge and fast-track to trust 1.
