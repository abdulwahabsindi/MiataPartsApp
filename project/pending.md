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
| Backend provider | Firebase Blaze, or Supabase | Firebase track (2-6) |
| Image hosting | Static files on Netlify, or object storage on the backend | Photo changes without a redeploy |

## In flight

- Nothing.

## Queued

| # | Track | Item |
|---|---|---|
| 1 | Standalone | Release/changelog process |
| 2 | Firebase | Create the Firebase project, enable Google and Apple sign-in |
| 3 | Firebase | Firestore collections, security rules, rules tests |
| 4 | Firebase | Cloud Functions: onUserCreate, onPostCreate, onPostApprove, setAdmin |
| 5 | Firebase | Sign-in UI and post submission on the FAQ and part drawer |
| 6 | Firebase | `/admin` route |

## Parked

- Custom domain.
- Arabic fitment strings. `fit` is English only.
- Rate limiting on post creation.
- Reporting and flagging by users.
- Club member badge and fast-track to trust 1.
