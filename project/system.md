# system.md

Holds: what is true of the running system right now.
Write when: a host, build step, dependency, route, env var or deploy path
changes.
Never goes in: anything planned, the data schema, Firestore collections,
reasons, alternatives considered.
Ceiling: 4500 characters.

---

## Hosts and deploy

| Item | Value |
|---|---|
| Site host | Netlify |
| URL | https://mx5ncksa.netlify.app |
| Backend | Firebase (Auth, Firestore, Functions), not provisioned |
| Deploy | Manual upload of `index.html` |
| CI | None |
| Git remote | github.com/abdulwahabsindi/MiataPartsApp (private) |
| Custom domain | None |

## Build

- None. `index.html` is hand-edited and uploaded.

## Runtime dependencies

| Item | Value |
|---|---|
| Google Fonts | IBM Plex Sans, Sans Condensed, Sans Arabic, Mono |
| Font load | Blocking stylesheet from fonts.googleapis.com |
| JS libraries | None |
| Package manager | None |
| Bundler | None |

## Boundary

| Item | Value |
|---|---|
| Files | One: `index.html` |
| Size | 354 KB, 525 lines |
| Inline blocks | KSA, INTL, VENDORS, VMAP, PARTS, IMG, N, CAT_AR, FAQ, T |
| IMG | One line, 280 KB, base64 data URIs, 79% of the file |
| Render logic | ~120 lines, end of file |
| Catalogue master | `nc_miata_catalogue.xlsx`, off-repo |

## Environment

- No environment variables.
- No secrets.
- No API keys.

## Known limits

- No write path. FAQ answers render "No answer yet." Group notes render an
  empty-state string. Neither accepts input.
- No authentication.
- No versioning of catalogue data.
- No validation. PARTS, N and IMG can disagree on ids without failing.
- Two masters for catalogue data: the xlsx and the inline blocks.
