# T6 — `ui/Input` + `Field`

- **Resolve:** parte de P4
- **Depende de:** T1
- **Fase:** 1 (primitivos)
- **Arquivos:** novo `components/ui/Input.tsx`, `components/ui/Field.tsx`, [NavBar.tsx](../../src/components/layout/NavBar.tsx), [UploadModal.tsx](../../src/features/gallery/components/UploadModal.tsx), [EventFormModal.tsx](../../src/features/events/components/EventFormModal.tsx)

## Problema

Estilo de input refeito caso a caso: `FIELD_CLASS` local no [EventFormModal:17](../../src/features/events/components/EventFormModal.tsx#L17); NavBar e UploadModal cada um com o seu. `.glass-input` existe mas é subusado. O wrapper `Field` (label + input) existe só no EventFormModal.

## Escopo

`Input` — baseado em `.glass-input`, aceitando `type` (text/date/time), `textarea` via variant ou componente irmão. `Field` — label (estilo `font-mono-tech` mono) + children.

Migrar inputs de NavBar (search), UploadModal (group name), EventFormModal (todos os campos).

## Critério de aceite

- Inputs usam `<Input>`/`<Field>`; `FIELD_CLASS` local removido.
- `.glass-input` é a base única.
- Visual e foco (`focus:border`) preservados.
