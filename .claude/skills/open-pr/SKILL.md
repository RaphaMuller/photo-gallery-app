---
name: open-pr
description: Create a GitHub pull request with the current changes for the photo-gallery-app repo, using the project's PR template
disable-model-invocation: true
allowed-tools: Bash, Read, Glob, Grep
argument-hint: "[--draft] [base-branch]"
---

# Open Pull Request

Create a GitHub pull request for the current branch in **photo-gallery-app**
(Next.js + Feature-Sliced Design), using the PR template below.

The PR **body is written in pt-BR** (normal prose, not caveman). The **title**
stays in Conventional-Commits style (keep the English type keyword: `feat`,
`fix`, `chore`, `refactor`…; the rest may be pt-BR). This holds regardless of
caveman mode.

## Arguments

- `$ARGUMENTS` - Optional flags and base branch:
  - `--draft` - Create the PR as a draft
  - `[base-branch]` - Base branch to target (defaults to `main`)

## Instructions

**First, parse arguments and determine options:**

```bash
DRAFT_FLAG=""
BASE_BRANCH="main"

for arg in $ARGUMENTS; do
  case "$arg" in
    --draft) DRAFT_FLAG="--draft" ;;
    *)       BASE_BRANCH="$arg" ;;
  esac
done

# Verify base branch exists on the remote
if ! git rev-parse --verify "origin/$BASE_BRANCH" >/dev/null 2>&1; then
  echo "Error: Base branch 'origin/$BASE_BRANCH' does not exist."
  # Stop and inform the user
fi
```

Use `$BASE_BRANCH` and `$DRAFT_FLAG` in all git commands below.

1. **Validate current branch and commits:**

   ```bash
   CURRENT_BRANCH=$(git branch --show-current)

   if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
     echo "Error: Currently on base branch '$BASE_BRANCH'. Create a feature branch first."
     # Stop and inform the user
   fi

   COMMITS=$(git rev-list --count $BASE_BRANCH...HEAD)
   if [ "$COMMITS" -eq 0 ]; then
     echo "Error: No commits between $BASE_BRANCH and HEAD. Nothing to create a PR from."
     # Stop and inform the user
   fi
   ```

2. **Gather context about the changes:**

   ```bash
   git status
   git --no-pager log $BASE_BRANCH...HEAD --oneline
   git --no-pager diff $BASE_BRANCH...HEAD --stat --name-status
   ```

3. **Determine affected parts of the code (FSD slices)** for the first template
   section. Map changed files to these labels:
   - `src/features/auth/` → features/auth
   - `src/features/gallery/` → features/gallery
   - `src/features/events/` → features/events
   - `src/components/ui/` → components/ui (shared primitives)
   - `src/components/layout/` → components/layout
   - `src/app/` (routes, layout, page) → app routes
   - `src/lib/`, `src/proxy.ts` → lib / middleware
   - `src/app/globals.css`, design tokens → design system
   - `src/constants/`, `src/types/` → data / types

   List only the parts actually touched (one `- [x]` line each).

4. **Analyze the diff** — problem solved, what changed and why, risks, and
   whether it respects the repo PRD (FSD layering, zero `any`, no `style={{}}`
   for color/bg/border/filter, Glassmorphism via utilities + `cn()`,
   react-query for server state):

   ```bash
   git --no-pager diff $BASE_BRANCH...HEAD
   git --no-pager log $BASE_BRANCH...HEAD --format="%s%n%b"
   ```

5. **Check if the branch is pushed; push if needed:**

   ```bash
   git rev-parse --abbrev-ref --symbolic-full-name @{upstream} 2>/dev/null || echo "not-pushed"
   # if not-pushed:
   git push -u origin "$CURRENT_BRANCH"
   ```

6. **Extract Linear issue ID (if present)** for References:

   ```bash
   LINEAR_ID=$(echo "$CURRENT_BRANCH" | grep -oE '[A-Z]+-[0-9]+' | head -1)
   if [ -z "$LINEAR_ID" ]; then
     LINEAR_ID=$(git log $BASE_BRANCH...HEAD --format="%s" | grep -oE '[A-Z]+-[0-9]+' | head -1)
   fi
   ```

   If found, add `- Linear: ABC-123` under References. Branches here often have
   no Linear ID (e.g. `feat/t1-tokens-theme`) — that's fine.

7. **Verify build and lint** so the checklist is honest (do not guess):

   ```bash
   npm run build   # Next.js build also runs TypeScript — this is the type check
   npm run lint    # eslint (note: --fix; confirm it leaves no errors)
   ```

   This repo has **no test runner** — don't claim tests unless one was added.

8. **Generate a title** from the branch name (or summarize the changes),
   preferring the Conventional-Commits style of the lead commit:

   ```bash
   TITLE=$(echo "$CURRENT_BRANCH" | sed 's/^[^/]*\///' | sed 's/-/ /g' | sed 's/^./\U&/')
   ```

9. **Create the PR** with the template below. Fill every section from your
   analysis and **replace all bracketed placeholders** — leave nothing blank or
   templated:

   ```bash
   gh pr create --base $BASE_BRANCH $DRAFT_FLAG --title "$TITLE" --body "$(cat <<'EOF'
   ## Parts of Code Affected

   - [x] [ex.: features/gallery]

   ## Purpose

   [Por que essa mudança é necessária? Que problema resolve?]

   ## Details

   [O que exatamente mudou e por quê. Sutilezas que o revisor pode não notar. Riscos relevantes.]

   ## Pre-Submission Checklist

   - [ ] `npm run build` passa (inclui TypeScript)
   - [ ] `npm run lint` limpo
   - [ ] Sem `any`; sem `style={{...}}` para cor/bg/borda/filtro (Glassmorphism via utilities + `cn()`)
   - [ ] Arquivos agrupados por feature (FSD)

   ## Verify and Review

   [Passos de teste no front: rota/tela, o que clicar, resultado esperado. Exemplos de código se útil.]

   ## References

   - [links ou arquivos relacionados; adicione `Linear: ABC-123` se houver, senão remova]
   EOF
   )"
   ```

10. **Output the PR URL** when complete.

## Important Notes

- Tick checklist boxes only for what you actually verified (step 7).
- In "Parts of Code Affected", list only touched slices.
- Keep Purpose concise; surface real risks in Details.
- "Verify and Review" should be runnable steps for a reviewer, not vague.
- PR body in pt-BR; title in Conventional-Commits style (English type keyword). Holds even under caveman mode.

## Example Usage

```
/open-pr                  # PR against main
/open-pr --draft          # Draft PR against main
/open-pr some-branch      # PR against some-branch
/open-pr --draft develop  # Draft PR against develop
```

## Troubleshooting

- **No commits between base and head**: branch up-to-date with base; nothing to PR.
- **PR already exists**: `gh pr create` returns the existing URL — report it, don't fail.
- **Push fails**: upstream conflict or force-push divergence — ask the user how to proceed.
- **On base branch**: tell the user to create a feature branch first.
- **Build/lint fails**: report it and ask whether to open the PR anyway (draft) or fix first.
