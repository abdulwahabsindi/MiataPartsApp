---
name: miata-parts-project
description: >
  Manages part changes and datasheet writes for the NC Miata Parts Counter — a
  bilingual static parts catalogue in data/ with a Firebase community layer — and
  maps where each datasheet lives. Use when adding or changing a part, editing
  catalogue data under data/, writing to the project/ datasheets, or touching the
  Firestore/rules/functions layer. Triggers: "add a part", "change a part", "edit
  the catalogue", "update pending", "the datasheets", "data-contract", "validate
  the catalogue".
---

# NC Miata Parts Counter — working rules

The authoritative version of these rules is `project/project-instructions.md`.
This skill is the short operational form plus the map of where things live. When
a rule here and that file disagree, that file wins.

## Where things live

| Need | File |
|---|---|
| Running system state (hosts, deploy, deps) | `project/system.md` |
| Shape of every catalogue record | `project/data-contract.md` |
| Auth, Firestore collections, rules, functions | `project/api-and-schema.md` |
| Generated coverage counts (never hand-edit) | `project/catalogue.md` |
| Planned work and open decisions | `project/pending.md` |
| Catalogue data (the master) | `data/*.json` |

Read a datasheet's header block before writing to it. Route a write by the
header, not by guessing.

## Adding or changing a part

1. Edit `data/` — never the rendered `index.html`.
2. A part needs **both** English and Arabic before it ships. English alone does
   not ship.
3. Run `node scripts/validate.mjs`. It must pass.
4. Update `project/pending.md` if the part was listed there.
5. `project/catalogue.md` regenerates from the validator. Do not hand-edit it.

## Hard rules

- **Never look up a part number, OEM number, fitment, or interval on the web.**
  Part data comes from `data/` or from the maintainers. A wrong number puts the
  wrong part in someone's car.
- **Catalogue in git, community in Firestore.** Parts, notes, vendors, sources,
  categories, FAQ questions and UI strings live in `data/` and ship with the
  build. FAQ answers and group notes live in Firestore, written by users.
  Nothing crosses.
- **Moderation:** a client that can write `status`, `trust` or `admin` is a bug.
- **Never** remove the footer line stating that failure notes and intervals are
  drafted, not manufacturer-issued.

## Datasheet discipline

- Datasheets state what is true now — numbers, dates, names, paths, fields,
  statuses. No prose paragraphs, no history, no "was X" / "revised" notes.
- Each file has a character ceiling in its header. `validate.mjs` fails the run
  if a datasheet exceeds it.
- Edit the existing line; never add a note beside it.

## Working conventions

- Changes reach `main` through a pull request, never a direct push.
- `project-instructions.md` is edited only in admin mode (entered when the
  maintainer says "admin mode").
