# T9 — Mover `EVENT_COLOR_MAP` pra `lib/theme`

- **Resolve:** P9
- **Depende de:** T2
- **Fase:** 2 (migração / features)
- **Arquivos:** [data.ts](../../src/constants/data.ts), `lib/theme`, [EventsPanel.tsx](../../src/features/events/components/EventsPanel.tsx), [EventFormModal.tsx](../../src/features/events/components/EventFormModal.tsx)

## Problema

[constants/data.ts](../../src/constants/data.ts) mistura seed mock (`PHOTOS`, `EVENTS`, `ALBUMS`) com `EVENT_COLOR_MAP` ([data.ts:308-314](../../src/constants/data.ts#L308-L314)). Mapa cor→classe é design system, não dado. Mudam por motivos diferentes: mock some com backend; color map fica.

## Escopo

Mover `EVENT_COLOR_MAP` pra `lib/theme` (derivado da palette de T2). `data.ts` fica só seed. Atualizar imports em EventsPanel e EventFormModal.

## Critério de aceite

- `data.ts` só contém dado.
- Color map de evento mora no `lib/theme`, derivado da fonte canônica.
- Eventos renderizam igual.

## Status: parcial (valores tokenizados, não movido)

No T1, o `EVENT_COLOR_MAP` em `data.ts` teve os valores trocados por tokens (`bg-cyan-primary/12`, `shadow-glow-xs-rose`, etc.) — sem hex hardcoded.

**Ainda pendente:** o mapa **continua em `data.ts`**, misturado com o seed mock. Falta mover pra `lib/theme` (depende do T2). `EventsPanel` e `EventFormModal` ainda importam de `@/constants/data`.
