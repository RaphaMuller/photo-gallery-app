# T10 — Prev/next do PhotoModal

- **Resolve:** P6
- **Depende de:** — (independente)
- **Fase:** 3 (cleanup)
- **Arquivos:** [PhotoModal.tsx](../../src/features/gallery/components/PhotoModal.tsx), [gallery/page.tsx](../../src/app/gallery/page.tsx)

## Problema

[PhotoModal.tsx:319-335](../../src/features/gallery/components/PhotoModal.tsx#L319-L335) renderiza botões `ChevronLeft`/`ChevronRight` com `onClick` vazio ("Navigation handled at parent level"). O parent não passa handler — botões aparecem e não fazem nada. Feature quebrada visível. `currentIdx`/`canPrev`/`canNext` já calculados ([PhotoModal.tsx:258-260](../../src/features/gallery/components/PhotoModal.tsx#L258-L260)).

## Escopo

Decidir e fazer **uma** das duas:
- **Implementar** — passar `onNavigate(direction)` do parent (a page controla `selectedPhoto` via index na lista `filteredPhotos`).
- **Remover** — tirar os botões se navegação não é prioridade agora.

Sem stub. Regra global: nada de código especulativo/quebrado.

## Critério de aceite

- Ou prev/next navega de verdade, ou os botões somem.
- Nenhum `onClick` vazio remanescente.
