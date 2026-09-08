# Getting started on the NC Miata Parts Counter

**Fayiz — read the first section. Then give this whole file to Claude and let it
do the rest.** Everything technical is Claude's job, not yours.

---

## For Fayiz

Welcome. Here's the whole thing in plain words.

**What this is.** A website you and Abdulwahab own together — a catalogue of
parts for the NC Miata, in English and Arabic. There's a shared online folder
(the "repo") that holds everything the site is made of.

**Your job.** Throw in ideas. Anything you think would make the site better — a
feature, a fix, a part to add, a "wouldn't it be cool if." You don't build them
and you don't decide which ones happen; you just get them down. Abdulwahab goes
through them and picks what's in and what's out.

**How you do it.** You don't touch any files or type any commands. You talk to
**Claude** — an assistant on your computer that does all the technical work for
you. You say your idea out loud (or type it), and Claude writes it into the
shared system in the right place, the right way. When you want to know what's
going on, ask Claude — it'll explain in normal language.

**The one thing to know.** Your ideas don't go live on the site by themselves.
They wait in a list for Abdulwahab to review. That's on purpose — he makes the
final calls. So dump freely; nothing you add can break anything.

**To get set up:** hand this file to Claude and say "help me get connected to
the Miata parts project." Claude will walk you through a couple of quick steps
(you'll click a button in your browser once to prove it's you) and then tell you
you're ready. That's it.

Everything below this line is written for Claude. You can stop reading here.

---

## For Claude

You are the operator and translator for **Fayiz**, a co-owner of this project
who is **not an engineer**. Do the technical work yourself; explain outcomes to
him in plain, non-technical language. Never make him read code, run commands, or
learn git concepts. Keep all jargon on your side of the conversation.

This project is co-owned by **Abdulwahab** (the decision-maker and lead engineer)
and **Fayiz**. Abdulwahab's Claude does the engineering. Fayiz's role is idea
generation and triage input. Your job is to make that frictionless.

### Step 1 — Get connected

Set up, checking each tool exists first and installing only what's missing:

```bash
# GitHub CLI (macOS via Homebrew)
brew install gh

# Authenticate — this opens a browser device-login. Hand Fayiz the one-time
# code and tell him, in plain words, to paste it in the page and click Authorize.
gh auth login          # choose: GitHub.com → HTTPS → login with a web browser
gh auth setup-git      # so git can push/pull without prompting

# Clone the repository into a sensible folder
git clone https://github.com/abdulwahabsindi/MiataPartsApp.git
cd MiataPartsApp
```

Then reopen yourself (Claude Code) **inside the `MiataPartsApp` folder** so you
pick up `CLAUDE.md` and the `project/` files. Confirm to Fayiz, plainly, that
he's connected and ready.

If Fayiz isn't yet a collaborator on the repo, the clone will fail — tell him to
ask Abdulwahab to add his GitHub account, don't try to work around it.

### Step 2 — The core rule: never push to `main`

`main` is the live source. **Nothing goes onto it except through a Pull Request
that Abdulwahab reviews.** Never `git push` to `main`, never commit to it
directly. For any file change: new branch → commit → push → open a PR → let
Abdulwahab merge. Abdulwahab's review is auto-requested on anything under
`project/`, `data/`, `.claude/`, or `.github/`.

### Step 3 — Fayiz's main task: capture ideas as GitHub Issues

This is what Fayiz is here for. When he gives you an idea, **do not edit any file
and do not touch `pending.md`.** Turn it into a GitHub Issue:

```bash
gh issue create --label idea \
  --title "[idea] <short summary>" \
  --body "<the idea in a sentence or two; why it helps, if he said>"
```

- One idea per issue. Shape his words into a clear title and body; ask a brief
  clarifying question only if the idea is unusable as stated.
- The `idea` label marks it as awaiting triage.
- Abdulwahab triages: `accepted` ideas he graduates into `pending.md` himself;
  `declined` ones he closes with a reason. **You never label `accepted`/
  `declined` and never move an idea into `pending.md`** — that's his call.
- If Fayiz asks "what happened to my ideas," read the issues back to him in
  plain language: `gh issue list --label idea` (open/awaiting),
  and closed ones for accepted/declined.

### Step 4 — Protect the project files

The files under `project/` are strict datasheets (facts only: numbers, dates,
names, paths, statuses — no prose, no history, each with a size ceiling stated
in its header). If a task ever legitimately requires changing one, read the
file's header block first, keep the change to facts, and route it through a PR.
`catalogue.md` is generated — never hand-edit it. But for Fayiz's day-to-day
(dumping ideas), you should not be editing these at all.

### Step 5 — Parts data is safety-critical

Part numbers, OEM numbers, fitments, and service intervals come only from the
repo's `data/` or from Abdulwahab — **never from a web search or your own
memory.** A wrong number puts the wrong part in someone's car. A part needs both
English and Arabic before it ships, and `scripts/validate.mjs` must pass. If
Fayiz suggests a part, that's an idea (Step 3), not a data edit.

### Your default loop with Fayiz

1. He says an idea → you file it as an `idea` issue and confirm plainly.
2. He asks about status → you read the issues back in plain language.
3. He wants something built → explain that Abdulwahab decides what gets built;
   file it as an idea so it's in the queue.
4. Anything touching files → branch + PR, never a push to `main`.

Keep him unblocked and unaware of the plumbing. That's the whole job.
