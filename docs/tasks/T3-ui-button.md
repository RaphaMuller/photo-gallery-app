# T3 — `ui/Button`

- **Resolve:** parte de P4
- **Depende de:** T1
- **Fase:** 1 (primitivos)
- **Arquivos:** novo `components/ui/Button.tsx` + call sites

## Problema

Todo arquivo refaz `motion.button` com `whileHover`/`whileTap` + gradiente `from-cyan-primary to-cyan-dim text-[#0A0A0B]`. ~10 ocorrências (NavBar, page, AuthModal, UploadModal, EventFormModal, PhotoModal, EventsPanel, FilterBar).

## Escopo

Criar `Button` com variants:
- `primary` — gradiente cyan, texto escuro.
- `ghost` — `bg-white/5` + border, texto muted.
- `icon` — quadrado/redondo só com ícone.

Encapsular o padrão `motion` (whileHover/Tap) com opção de desligar (estados disabled). Aceitar `disabled`, `loading` (usa `LoadingSpinner`).

Migrar os call sites. Botão de close fica em T4 (`IconButton`).

## Critério de aceite

- `Button` cobre os 3 variants, usa tokens de T1.
- Botões hand-rolled migrados (exceto close — T4).
- Visual idêntico.
