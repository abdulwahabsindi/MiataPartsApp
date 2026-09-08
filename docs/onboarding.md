# Using Claude Code on the NC Miata Parts Counter

For Fayiz. You're set up and connected — here's how to actually work with Claude
Code in this repo. Short version: just talk to it.

## The basics

Open Claude Code inside the `MiataPartsApp` folder and tell it what you want in
plain English. It already reads the project's own rules (`CLAUDE.md` and the
`project/` files), so it knows how this codebase works — you don't have to.

- **Building something?** Just describe it. "Add a filter for engine parts,"
  "fix the Arabic text overflowing in the drawer," whatever. Claude writes the
  code; you review and steer.
- **Not sure how something works?** Ask. "How does the catalogue data load?"
  "What's in pending?" It'll explain.
- **Got an idea for later?** Tell Claude "log this as an idea" and it files it as
  a GitHub issue so it's captured without you building it now.

## The one shared convention

Everything reaches the live site through a **Pull Request**, not by pushing
straight to `main`. Claude handles this for you — it'll work on a branch and open
a PR when you're happy. Just don't tell it to push directly to `main`. That's the
only hard rule, and it's so we can both see each other's changes before they go
live.

We each review and merge our own PRs — you don't need my sign-off. On the shared
project files (`project/`, `data/`) GitHub will ping the other one of us for a
look, but that's a heads-up, not a gate.

## A couple of things worth knowing

- **The `project/*.md` files are strict.** They're terse datasheets with rules
  and size limits baked in. Let Claude edit them — it knows the format. Don't
  hand-edit them yourself unless you've read the header block at the top.
- **Part numbers are safety-critical.** Fitments, OEM numbers, and intervals come
  from the repo's `data/` or from real sources — never from a guess or a web
  lookup. Claude knows this rule too.
- **Roadmap order:** `pending.md` is the shared to-do list. Loosely, I keep the
  ordering coherent so we're not pulling in ten directions — but the project is
  ours, build what you think matters and we'll sort priorities together.

## Handy asks for Claude

- "Start a branch and help me build X."
- "Open a PR for this."
- "Log this as an idea for later."
- "Show me what's in pending / what ideas are open."
- "Explain how X works in this repo."

That's it. Ask Claude anything — it's read the whole project.
