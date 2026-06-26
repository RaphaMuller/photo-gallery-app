# T11 — Tipo `ViewMode`

- **Resolve:** P8
- **Depende de:** — (independente)
- **Fase:** 3 (cleanup)
- **Arquivos:** [types/types.ts](../../src/types/types.ts), [NavBar.tsx](../../src/components/layout/NavBar.tsx), [gallery/page.tsx](../../src/app/gallery/page.tsx)

## Problema

`'gallery' | 'events'` aparece cru em 3 lugares: [NavBar.tsx:12-13](../../src/components/layout/NavBar.tsx#L12-L13) (duas props) e [gallery/page.tsx:48](../../src/app/gallery/page.tsx#L48) (state). Adicionar view = editar 3 lugares, sem aviso do TS se esquecer um.

## Escopo

`export type ViewMode = 'gallery' | 'events'` em `types/types.ts`. Importar e usar nos dois arquivos.

## Critério de aceite

- Union definida uma vez; NavBar e page importam.
- Build passa.
