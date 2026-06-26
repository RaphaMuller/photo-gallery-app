# T4 — `ui/Modal` + `ui/IconButton`

- **Resolve:** parte de P4
- **Depende de:** T1
- **Fase:** 1 (primitivos)
- **Arquivos:** novo `components/ui/Modal.tsx`, `components/ui/IconButton.tsx`, + 4 modais

## Problema

4 modais duplicam o scaffold Radix inteiro (Root/Portal/Overlay glass-overlay+motion/Content spring) + close button — ~40 linhas cada. Inconsistente: só [AuthModal:63](../../src/features/auth/components/AuthModal.tsx#L63) usa `.glass-modal`; os outros 3 refazem `bg-[#0f0f12]/95 border... shadow-[...]` na mão.

## Escopo

`Modal` — wrapper que recebe `open`, `onClose`, `title`/`description` (sr-only), `children`. Encapsula Root/Portal/Overlay/Content + animação spring padrão + close button. Usar `.glass-modal` de forma consistente.

`IconButton` — botão circular de ícone (close, e reaproveitável). Usado pelo `Modal` e por outros (close do search no NavBar, etc).

Migrar: [AuthModal](../../src/features/auth/components/AuthModal.tsx), [PhotoModal](../../src/features/gallery/components/PhotoModal.tsx), [UploadModal](../../src/features/gallery/components/UploadModal.tsx), [EventFormModal](../../src/features/events/components/EventFormModal.tsx).

## Critério de aceite

- 4 modais usam `<Modal>`; scaffold duplicado eliminado.
- Estilo de modal unificado (todos via `.glass-modal` / mesmo shell).
- Animações e comportamento (close on overlay click, ESC) preservados.
