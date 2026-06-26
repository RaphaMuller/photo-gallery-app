# T12 — `today` real no MiniCalendar

- **Resolve:** P10
- **Depende de:** — (independente)
- **Fase:** 3 (cleanup)
- **Arquivos:** [EventsPanel.tsx](../../src/features/events/components/EventsPanel.tsx)

## Problema

[EventsPanel.tsx:21-22](../../src/features/events/components/EventsPanel.tsx#L21-L22) — `const today = new Date(2026, 5, 25)` e `viewDate` fixo em junho/2026. Calendário sempre acha que hoje é 25/jun/2026. Em produção mostra "hoje" errado.

## Escopo

Usar `new Date()` real para `today` e mês inicial do `viewDate`. Se a data fixa for proposital (demo/screenshot), manter mas comentar o porquê — hoje parece bug.

## Critério de aceite

- `today` reflete a data real (ou comentário justificando a fixa).
- "Hoje" destacado corretamente no mês corrente.
