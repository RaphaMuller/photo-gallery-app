# T8 — Extrair `StickerCreator`

- **Resolve:** P7
- **Depende de:** T2 (frames derivam da palette)
- **Fase:** 2 (migração / features)
- **Arquivos:** novo `features/gallery/components/StickerCreator.tsx`, [PhotoModal.tsx](../../src/features/gallery/components/PhotoModal.tsx)

## Problema

[PhotoModal.tsx](../../src/features/gallery/components/PhotoModal.tsx) tem 471 linhas e 4 responsabilidades: `TAG_COLORS`, `STICKER_FRAMES` (90 linhas), `StickerCreator` (wizard 2 steps + preview + download), `InfoRow`, e o modal. `StickerCreator` é feature inteira sem relação com "mostrar foto".

## Escopo

- Mover `StickerCreator` + `STICKER_FRAMES` pra `features/gallery/components/StickerCreator.tsx`. As cores de `STICKER_FRAMES` derivam da palette de T2.
- `InfoRow` — manter local ou promover a primitivo se reusado.
- PhotoModal importa `StickerCreator` e cai pra ~200 linhas.

## Critério de aceite

- PhotoModal < ~250 linhas, só "mostrar foto + tabs".
- `StickerCreator` autocontido, cores via palette canônica.
- Wizard funciona igual.

## Status: parcial (cores tokenizadas, não extraído)

No T1, as cores de `STICKER_FRAMES` viraram tokens (`text-purple`, `bg-teal/15`, `shadow-glow-sm-amber`, `shadow-glow-lg-*`, etc.) — sem hex hardcoded.

**Ainda pendente:** `StickerCreator` + `STICKER_FRAMES` **continuam inline no `PhotoModal.tsx`**; o arquivo segue grande com múltiplas responsabilidades. Falta extrair pra `features/gallery/components/StickerCreator.tsx`.
