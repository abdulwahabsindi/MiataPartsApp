# Hotfix Procedures

Severity, SLA, approval, and rollback triggers: see the tables in `SKILL.md`.
This file covers the git mechanics per branching model.

## Git Flow

```
main (v1.2.3) ← hotfix/name → main (v1.2.4) → develop
```

```bash
git checkout main && git pull origin main
git checkout -b hotfix/name
# fix, then bump version
git commit -am "fix: describe the fix"
git checkout main && git merge --no-ff hotfix/name
git tag -a v1.2.4 -m "Hotfix: describe the fix"
git push origin main --tags
git checkout develop && git merge --no-ff hotfix/name && git push origin develop
git branch -d hotfix/name && git push origin --delete hotfix/name
```

## GitHub Flow

```bash
git checkout -b hotfix/name
git commit -am "fix: describe the fix"
git push origin hotfix/name
gh pr create --title "HOTFIX: describe the fix" --label hotfix
gh pr merge --squash   # deploy triggers on merge to main
```

## Trunk-based

```bash
git checkout main && git pull origin main
git commit -am "fix: describe the fix"
git push origin main   # deploy triggers automatically
```

For a feature-flagged regression, disable the flag first; ship the real fix in
the next regular release.

## Rollback

```bash
git revert HEAD && git push origin main
```

Roll back when the fix doesn't resolve the issue, introduces a new problem, or
data corruption is detected. Prefer a feature-flag disable over a code
rollback; only roll back a database migration if it was forward-only and
non-destructive.
