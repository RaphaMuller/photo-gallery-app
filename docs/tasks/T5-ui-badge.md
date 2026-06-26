# T5 — `ui/Badge`

- **Resolve:** parte de P4
- **Depende de:** T1, T2
- **Fase:** 1 (primitivos)
- **Arquivos:** novo `components/ui/Badge.tsx`, [PhotoCard.tsx](../../src/features/gallery/components/PhotoCard.tsx), [PhotoModal.tsx](../../src/features/gallery/components/PhotoModal.tsx)

## Problema

Pill de tag duplicado em PhotoCard e PhotoModal: `font-changa text-[0.6rem] rounded-full border` + lookup em `TAG_COLORS`. Mesmo padrão visual, dois lugares.

## Escopo

`Badge` que recebe o "papel"/cor (tag, event) e o label, consumindo a palette canônica de T2. Variar tamanho se necessário (card usa menor que modal).

Migrar os pills de PhotoCard e PhotoModal. Tags de evento (EventsPanel) também podem usar, se encaixar.

## Critério de aceite

- `Badge` consome `lib/theme` (T2), sem hex local.
- PhotoCard e PhotoModal usam `<Badge>`.
- Visual idêntico.
