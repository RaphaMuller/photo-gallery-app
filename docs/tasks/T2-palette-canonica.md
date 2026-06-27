# T2 — Palette canônica

- **Resolve:** P3 (smell-raiz)
- **Depende de:** T1
- **Fase:** 0 (fundação)
- **Arquivos:** novo `lib/theme`, [PhotoCard.tsx](../../src/features/gallery/components/PhotoCard.tsx), [PhotoModal.tsx](../../src/features/gallery/components/PhotoModal.tsx), [data.ts](../../src/constants/data.ts)

## Problema

A mesma palette neon está codificada 4 vezes em formatos diferentes:

| Local | Forma |
| --- | --- |
| [PhotoCard.tsx:13-21](../../src/features/gallery/components/PhotoCard.tsx#L13-L21) `TAG_COLORS` | text+bg+border |
| [PhotoModal.tsx:18-26](../../src/features/gallery/components/PhotoModal.tsx#L18-L26) `TAG_COLORS` | copy-paste idêntico |
| [PhotoModal.tsx:28-95](../../src/features/gallery/components/PhotoModal.tsx#L28-L95) `STICKER_FRAMES` | 90 linhas, 10 props de cor |
| [data.ts:308-314](../../src/constants/data.ts#L308-L314) `EVENT_COLOR_MAP` | bg+text+dot+border+shadow |

## Escopo

Criar fonte única em `lib/theme` (ex: `palette.ts`) derivada dos tokens de T1. Um mapa por "papel" (tag, event, frame) ou um mapa base + helpers que montam os bundles de classe.

Substituir:
- `TAG_COLORS` (×2) → import do `lib/theme`.
- `EVENT_COLOR_MAP` → mover/derivar (a movimentação de `data.ts` é detalhada em T9; aqui só a fonte canônica).
- `STICKER_FRAMES` cores → derivar da palette (a extração do componente é T8).

## Critério de aceite

- Zero duplicação de mapa cor→classe; tudo deriva de `lib/theme`.
- PhotoCard e PhotoModal usam a fonte única.
- Build + visual idênticos ao atual (refactor puro, sem mudança de aparência).

## Status: parcial (terreno mudou)

Durante o T1, os **valores** dos 4 mapas já foram tokenizados — `TAG_COLORS` (×2), `STICKER_FRAMES` e `EVENT_COLOR_MAP` agora usam tokens da paleta flat (`text-purple`, `bg-cyan-primary/12`, `shadow-glow-lg-rose`, etc.), sem mais hex hardcoded.

**Ainda pendente (o core do T2):** a *duplicação* segue — os 4 mapas continuam existindo em formatos diferentes. Falta criar a fonte única em `lib/theme` e derivar todos dela. O ganho agora é menor (não tem mais hex pra caçar), mas o smell-raiz P3 (mesma palette codificada N vezes) não foi resolvido.
