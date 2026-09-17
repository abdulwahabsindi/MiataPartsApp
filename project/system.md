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
| Deploy | Manual upload of `dist/` |
| Live build | 354 KB, base64 images. Behind `main` |
| CI | GitHub Actions: `validate.mjs` then `build.mjs`, on PR and push to main |
| Git remote | github.com/abdulwahabsindi/MiataPartsApp (private) |
| Custom domain | None |

## Build

- `scripts/build.mjs` assembles `dist/` from `src/` and `data/`. No
  dependencies.
- Output: one self-contained `dist/index.html`, plus `data/images` copied to
  `dist/data/images`.
- `index.html` is generated, never committed. `dist/` is git-ignored.
- `src/js/` is concatenated into one classic script in the order set by
  `JS_FILES` in `build.mjs`. Not ES modules: no `import`, no `export`.
- Node 26.8.1, pinned in `netlify.toml` and `.github/workflows/validate.yml`.
- `netlify.toml`: command `node scripts/build.mjs`, publish `dist`. Not linked
  to the repo yet.
- `/data/images/*` served `public, max-age=31536000, immutable`.

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
| Files | `src/`: `page.html`, 2 `.css`, 6 `.js`. `data/images/`: 28 `.webp`, 228 KB |
| Size | `dist/index.html` 74 KB, 461 lines |
| Inline blocks | KSA, INTL, VENDORS, VMAP, PARTS, IMG, N, CAT_AR, FAQ, T. Generated |
| IMG | One line, 1.6 KB, paths into `data/images/` |
| Render logic | `src/js/`: sources, format, state, render, drawer, main |
| Catalogue master | `data/*.json`, in repo. `archive/nc_miata_catalogue.xlsx` retired |

## Environment

- No environment variables.
- No secrets.
- No API keys.

## Known limits

- No write path. FAQ answers render "No answer yet." Group notes render an
  empty-state string. Neither accepts input.
- No authentication.
- No versioning of catalogue data.
