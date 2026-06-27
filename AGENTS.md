<!-- BEGIN:nextjs-agent-rules -->

# Engineering Rules — Social Gallery

These are the architectural and code rules for this project. Treat them as binding: follow them by default and only deviate when the user explicitly asks. When a deviation is unavoidable, record it in the `CHANGELOG.md` so the next reader knows why.

## Quick Reference

- **Structure:** group by feature (FSD), not by file type.
- **Types:** zero `any`; `interface` for entities, `type` for unions.
- **Styling:** glassmorphism via utilities + `cn()`; no `style={{...}}` for color/bg/border/filter; tokens-first, zero raw hex.
- **State:** `@tanstack/react-query` for server state; `useState`/Context for local UI.
- **Docs:** every PR updates `CHANGELOG.md`, and `AGENTS.md` / `README.md` / `docs/` when they apply.

---

## 1. Directory Structure (Feature-Sliced Design — simplified)

- Group files by **feature** (business domain), not by file type.
- `src/features/`: independent domains (e.g. `features/auth`, `features/gallery`). Each owns its components, hooks, and utils.
- `src/components/ui/`: only "dumb", generic visual components (buttons, inputs) shared globally.

## 2. TypeScript (Strict)

- **Zero `any`:** `any` is forbidden. Use `unknown` with validation when the type is genuinely unknown.
- Global DB interfaces live in `src/types/index.ts`.
- Local, file-specific types go at the top of the consuming file.
- Use `interface` for entities/objects and `type` for literals/unions.

## 3. Styling & Design System (Strict No-Inline Policy)

- **Strict glassmorphism:** the visual language is neon, dark themes, and translucent glass.
- **No `style={{...}}` for design:** never mix logic with inline CSS in JSX. The `style` attribute is forbidden for colors, borders, backgrounds, and filters.
- **Utility classes (`globals.css`):** every repeated glassmorphism pattern (blur, complex RGBA backgrounds, translucent borders) MUST be abstracted into `@layer utilities` in `globals.css` (e.g. `.glass-modal`, `.glass-overlay`, `.glass-input`).
- **Conditionals with `cn()`:** any style variation driven by state or props (e.g. `isActive ? 'bg-cyan' : 'bg-transparent'`) MUST go through the `cn()` helper (`clsx` + `tailwind-merge`) imported from `src/lib/utils`.
- **Animations (Framer Motion):** keep simple objects (`initial`, `animate`, `exit`) inline for readability, but the DOM's core CSS stays purely in `className`.

### 3.1 Design Tokens (Tokens-First — No Raw Values)

Tokens live in the `@theme inline` block of `globals.css` and are the **single source** for color, typography, glow, and surfaces. JSX never carries raw values.

- **No hardcoded hex/rgba in JSX:** no `#00D9FF` or `rgba(0,217,255,.12)` in `className`. Use the registered color token (`bg-cyan-primary`, `text-cyan-primary`, `border-cyan-primary`, `from-cyan-primary`). Neon palette: `cyan-primary`, `cyan-dim`, `purple`, `rose`, `amber`, `teal`, `green`, `indigo`.
- **No design arbitrary values:** no `text-[0.6rem]`, `shadow-[0_0_20px_rgba(...)]`, `bg-[#14141a]`. Use the tokens instead:
  - **Surfaces:** `bg-surface-modal`, `bg-surface-card`, `bg-surface-deep` (near-blacks).
  - **Typography micro-scale:** `text-3xs` (9px), `text-2xs` (10px), `text-hero` (56px) — additive to Tailwind's `xs/sm/base/lg`.
  - **Glows:** per-color `shadow-glow-{xs,sm,lg}-{cyan,purple,rose,amber,teal,green}` and structural `shadow-glow-cyan-{sm,md,lg,strong}`, `shadow-glow-white-{sm,md}`, `shadow-card`, `shadow-card-glow`, `shadow-modal`, `shadow-modal-lg`.
- **Opacity modifiers require a literal-hex token:** in `@theme inline`, `bg-cyan-primary/12` only applies the alpha if the token is a **literal color** (`--color-cyan-primary: #00D9FF`). A `var(--cyan)` reference makes Tailwind drop the opacity and render full strength. **Never** define a color token as `var(...)` if it is used with a `/N` modifier.
- **Page gradient & ambient glows via utility:** use `.bg-app-gradient` (single source for the 3-stop page gradient — do not re-create `from-/via-/to-` inline), `.ambient-glow-cyan` / `.ambient-glow-purple` (radial background glows), and `.glow-current` (glow that follows the element's `currentColor`).
- **Color maps reference tokens:** `EVENT_COLOR_MAP`, `TAG_COLORS`, `STICKER_FRAMES`, etc. are a semantic layer and must return classes/tokens (`bg-cyan-primary/[0.12]`), never raw `rgba(...)` strings.
- **No orphan tokens:** do not register a token nobody consumes (that was the `--chart-1..5` smell). A new token lands with its usage; a token left unused gets removed.
- **Legitimate dynamic `style` is still allowed:** only runtime-computed values that are NOT color/bg/border/filter — e.g. `minHeight`, `opacity`, spinner size. Color/bg/border/filter **always** go through `className`.

## 4. State Management

- **Server state:** use `@tanstack/react-query` for Supabase communication (fetching, caching, mutation).
- **Local UI state:** use `useState` or Context API.

## 5. Documentation Required on Every PR

Every feature, refactor, or structural decision must update the docs **in the same PR** that introduces it. A PR that changes behavior or a convention without touching the matching doc is incomplete. Before opening a PR, walk the four targets below and update whichever apply:

1. **`CHANGELOG.md`** — **always.** Add a new numbered section (continuing the sequence) describing the what, the why, and any conscious deviation/risk. Close it with the date as `> Data e hora: YYYY-MM-DD`. This is the project's narrative history — never skip it.
2. **`AGENTS.md` (this file)** — when the PR creates or changes a **convention** (new token, new utility, new styling/typing/architecture rule). The rule lands here before it's enforced in review.
3. **`README.md`** — when **setup, stack, scripts, environment variables, or the directory tree** the README describes change. Keep it true to what a fresh clone sees today.
4. **`docs/`** — create or update a dedicated doc for changes with depth (architectural decision, refactor plan, integration). Refactor tasks live in `docs/tasks/`; broad decisions get their own doc. Link the doc from the `CHANGELOG` entry when it helps.

**PR self-check:** `CHANGELOG` updated? New convention → `AGENTS.md`? Setup/stack changed → `README`? Deep change → doc in `docs/`?
<!-- END:prd-architecture-rules -->
