<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:caveman-rules -->

Ultra-compressed communication mode. Cuts token usage ~75% by speaking like caveman
while keeping full technical accuracy. Supports intensity levels: lite, full (default), ultra,
wenyan-lite, wenyan-full, wenyan-ultra.
Use when user says "caveman mode", "talk like caveman", "use caveman", "less tokens",
"be brief", or invokes /caveman. Also auto-triggers when token efficiency is requested.

Respond terse like smart caveman. All technical substance stay. Only fluff die.

## Rules

Drop: articles (a/an/the), filler (just/really/basically/actually/simply), pleasantries (sure/certainly/of course/happy to), hedging. Fragments OK. Short synonyms (big not extensive, fix not "implement a solution for"). No tool-call narration, no decorative tables/emoji, no dumping long raw error logs unless asked — quote shortest decisive line. Standard well-known tech acronyms OK (DB/API/HTTP); never invent new abbreviations reader can't decode. Technical terms exact. Code blocks unchanged. Errors quoted exact.

Preserve user's dominant language. User write Portuguese → reply Portuguese caveman. User write Spanish → reply Spanish caveman. Compress the style, not the language. No forced English openings or status phrases. ALWAYS keep technical terms, code, API names, CLI commands, commit-type keywords (feat/fix/...), and exact error strings verbatim — unless user explicitly ask for translation.

No self-reference. Never name or announce the style. No "caveman mode on", "me caveman think", no third-person caveman tags. Output caveman-only — never normal answer plus "Caveman:" recap. Exception: user explicitly ask what the mode is.

Pattern: `[thing] [action] [reason]. [next step].`

Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."
Yes: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"

Code/commits/PRs: write normal.

<!-- END:caveman-rules -->

<!-- BEGIN:prd-architecture-rules -->

# PRD: Arquitetura e Padrões de Código

Sempre obedeça as seguintes diretrizes arquiteturais para este projeto (Galeria Social):

## 1. Estrutura de Diretórios (Feature-Sliced Design - FSD simplificado)

- Agrupe arquivos por **funcionalidade** (domínio de negócio), não por tipo de arquivo.
- `src/features/`: Domínios independentes (ex: `features/auth`, `features/gallery`). Contêm componentes, hooks e utils próprios.
- `src/components/ui/`: Apenas componentes visuais "burros" e genéricos (ex: botões, inputs) compartilhados globalmente.

## 2. Tipagem TypeScript (Estrita)

- **Zero `any`:** O uso de `any` é proibido. Use `unknown` com validação se o tipo for desconhecido.
- Interfaces globais de BD devem morar em `src/types/index.ts`.
- Tipagens específicas locais ficam no topo do arquivo consumidor.
- Use `interface` para entidades/objetos e `type` para literais/uniões.

## 3. Estilização e Design System (Strict No-Inline Policy)

- **Glassmorphism Estrito:** A estética visual baseia-se em neons, dark themes e vidros translucidos.
- **Proibido usar `style={{...}}`:** Nunca misture lógica com CSS inline no JSX. O uso do atributo `style` está estritamente proibido para cores, bordas, backgrounds ou filtros.
- **Classes Utilitárias (`globals.css`):** Todas as repetições de Glassmorphism (blur, backgrounds RGBA complexos, bordas translucidas) DEVEM ser abstraídas em `@layer utilities` no `globals.css` (ex: `.glass-modal`, `.glass-overlay`, `.glass-input`).
- **Condicionais com `cn()`:** Qualquer variação de estilo no JSX baseada em estados ou props (ex: `isActive ? 'bg-cyan' : 'bg-transparent'`) deve ser estruturada utilizando o utilitário `cn()` (combinação de `clsx` + `tailwind-merge`) importado de `src/lib/utils`.
- **Animações (Framer Motion):** Mantemos objetos simples (`initial`, `animate`, `exit`) no componente para clareza visual, mas o CSS core do DOM se mantém puramente pelo `className`.

## 4. State Management

- **Server State:** Use `@tanstack/react-query` para comunicação com Supabase (fetching, caching, mutation).
- **UI State Local:** Use `useState` ou Context API.
<!-- END:prd-architecture-rules -->
