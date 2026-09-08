# Working on the NC Miata Parts Counter — for Fayiz

Welcome aboard the repo. This is how we work in it so we don't step on each
other or corrupt the project files. Read once, then it's second nature.

## 1. One-time setup

You need Git, the GitHub CLI, and Claude Code.

```bash
# GitHub CLI (macOS)
brew install gh
gh auth login          # GitHub.com → HTTPS → login with a browser
gh auth setup-git      # lets git push/pull without asking for a password
```

Clone the repo:

```bash
git clone https://github.com/abdulwahabsindi/MiataPartsApp.git
cd MiataPartsApp
```

Then open Claude Code in that folder (`claude` in the terminal, or the desktop
app pointed at the folder). It reads `CLAUDE.md` and the `project/` files on its
own — no extra setup.

## 2. The golden rule: never push to `main`

Everything lands on `main` through a Pull Request. No exceptions, even for a
one-line change.

```bash
git checkout main
git pull                                   # get the latest
git checkout -b feat/short-description     # your own branch
# ...make changes...
git add -A
git commit -m "feat: what you did"
git push -u origin feat/short-description
gh pr create --base main                   # open the PR
```

Then Abdulwahab reviews and merges. GitHub will auto-request his review on
anything touching `project/`, `data/`, `.claude/`, or `.github/`.

> Why: `main` is what's deployed. And the project files (`project/*.md`) are
> strict — two people editing them at once will collide. PRs give us one place
> to see and resolve that.

## 3. Ideas go in as proposals, not edits

Got an idea for the roadmap? Don't rewrite `project/pending.md` and push it.
Open a PR that **adds your idea to the `## Queued` or `## Open decisions`
section**, and let Abdulwahab place it in the order — the order of that file is
his call. Same for the roadmap generally.

If it's just a thought, not decided work, the fastest path is: open an issue, or
put one line in the PR description. Don't invent priorities in the file itself.

## 4. The `project/` files are datasheets, not diaries

These files (`system.md`, `data-contract.md`, `api-and-schema.md`,
`catalogue.md`, `pending.md`) follow hard rules:

- Every line is a fact: a number, date, name, path, field, or status.
- No sentences explaining *why*. No "was X", no "revised", no history.
- Each file has a size ceiling stated in its header. Don't blow past it.
- Read the header block at the top of a file before you write to it.
- `catalogue.md` is generated — never hand-edit it.

If a change needs explaining, explain it in the PR, not in the file.

## 5. Parts data is safety-critical

Part numbers, OEM numbers, fitments, and intervals come from `data/` or from
Abdulwahab — **never from a web search**. A wrong number here puts the wrong
part in someone's car. A part needs **both English and Arabic** before it ships,
and `scripts/validate.mjs` must pass.

## 6. Tools already in the repo

Four Claude Code skills live under `.claude/skills/` and load automatically:

- `skill-security-auditor` — scans a skill for malicious code before we trust it.
- `write-a-skill` — helps author new skills properly.
- `runbook-generator` — scaffolds ops runbooks.
- `changelog-generator` — release notes from Conventional Commits.

## Quick reference

| You want to... | Do this |
|---|---|
| Start work | `git checkout main && git pull && git checkout -b feat/...` |
| Ship it | commit → `git push -u origin <branch>` → `gh pr create` |
| Suggest a roadmap item | PR that appends to `pending.md`, let Abdulwahab order it |
| Change a datasheet | read its header first, keep it to facts, open a PR |
| Add/verify a part | edit `data/`, both languages, run `scripts/validate.mjs` |
