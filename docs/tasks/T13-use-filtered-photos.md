# T13 — Hook `useFilteredPhotos`

- **Resolve:** dívida de domínio (lógica na page)
- **Depende de:** — (independente)
- **Fase:** 3 (cleanup)
- **Arquivos:** novo `features/gallery/hooks/useFilteredPhotos.ts`, [gallery/page.tsx](../../src/app/gallery/page.tsx)

## Problema

[gallery/page.tsx:58-81](../../src/app/gallery/page.tsx#L58-L81) tem o `useMemo` de filter+sort dentro da page. Lógica de domínio reutilizável misturada com a view. PRD (FSD): domínio mora em `features/`.

## Escopo

Extrair filter (search + tag) + sort pra `features/gallery/hooks/useFilteredPhotos.ts`. A page só consome o hook passando `searchQuery`, `activeTag`, `sortOption`.

## Critério de aceite

- Filter/sort fora da page, em `features/gallery/hooks`.
- Comportamento de filtro/ordenação idêntico.
