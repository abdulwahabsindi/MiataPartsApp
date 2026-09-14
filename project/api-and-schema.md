# api-and-schema.md

Holds: the Firebase side. Collections, fields, rules, auth, functions.
Write when: a collection, field, claim, rule or function changes.
Never goes in: catalogue schema, frontend code, anything planned, rule source
code longer than a line.
Ceiling: 6500 characters.

---

Status: designed, not provisioned. No Firebase project exists yet.

## Auth

| Item | Value |
|---|---|
| Provider | Firebase Auth |
| Sign-in methods | Google, Apple |
| Not enabled | Email/password, anonymous, phone |
| Write access | Signed in only |
| Read access | Everyone |
| Display name, photo | From the provider |

## Custom claims

| Claim | Values | Effect |
|---|---|---|
| trust | 0, 1 | 0 posts land pending. 1 posts land approved |
| admin | true, absent | Moderation. Two accounts: Abdulwahab Sindi, Fayiz Melibary |

- Set by Cloud Functions only. Never writable from a client.

## Collections

### `users/{uid}`

| Field | Type | Holds |
|---|---|---|
| displayName | string | From the provider |
| photoURL | string | From the provider |
| lang | string | `en` or `ar` |
| trust | number | 0 or 1, mirrors the claim, read-only to the client |
| postCount | number | Approved posts |
| createdAt | timestamp | |

### `posts/{postId}`

| Field | Type | Holds |
|---|---|---|
| target | map | `{ type: "faq" \| "part", id: string }` |
| uid | string | Author |
| authorName | string | Denormalised at write |
| lang | string | `en` or `ar` |
| body | string | 1 to 2000 characters |
| status | string | `pending`, `approved`, `rejected` |
| createdAt | timestamp | |
| moderatedAt | timestamp | Absent while pending |
| moderatedBy | string | Moderator uid, absent while pending |

- One collection serves both FAQ answers and group notes. They differ only by
  `target.type`.
- `target.id` is a part id for type `part`, or the FAQ question index for type
  `faq`.
- FAQ questions have no stable id. Adding one is an open decision.

## Security rules

| Path | Op | Allowed when |
|---|---|---|
| posts | read | `status == "approved"`, or own document, or admin |
| posts | create | Signed in, `uid` matches caller, body 1 to 2000, `lang` in {en, ar}, `status` not set by client |
| posts | update | Admin only |
| posts | delete | Admin only |
| users | read | Own document, or admin |
| users | write | Never from a client |

## Cloud Functions

| Function | Trigger | Does |
|---|---|---|
| onUserCreate | Auth create | Creates `users/{uid}`, sets trust 0 |
| onPostCreate | Firestore create | Stamps `status` from the author trust claim, stamps `createdAt` |
| onPostApprove | Firestore update | If author trust is 0, sets trust 1, increments postCount |
| setAdmin | Manual, one-off | Sets the admin claim on the two accounts |

## Admin surface

| Item | Value |
|---|---|
| Route | `/admin` on mx5ncksa |
| Gate | admin claim |
| Functions | List pending, approve, reject, edit body, delete, view poster history |
| Status | Not built |

## Quotas

| Item | Value |
|---|---|
| Plan | Firebase Spark |
| Billing account | None |
| Firestore reads | 50,000 per day |
| Firestore writes | 20,000 per day |
| Functions | Not available on Spark. Require Blaze |
