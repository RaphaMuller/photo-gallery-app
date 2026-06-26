# Refactor de arquitetura — componentização e design system

Estado atual: tipagem é sólida (zero `any`, `type`/`interface` usados certo), mas styling e componentização estão ruins. O projeto viola o próprio PRD em vários pontos e não tem nada que force as regras — então degrada sozinho.

Este doc lista os problemas, propõe os padrões e marca as decisões que ainda faltam fechar.

---

## Problemas

### P1 — `style={{...}}` inline, proibido pelo PRD

O PRD proíbe `style` para cor/bg/border/filter. Acontece em todo lugar:

- [gallery/page.tsx:90-93](../src/app/gallery/page.tsx#L90-L93) — gradient + fontFamily no root
- [gallery/page.tsx:100-123](../src/app/gallery/page.tsx#L100-L123) — glows ambient 100% inline
- [gallery/page.tsx:172-175](../src/app/gallery/page.tsx#L172-L175) — aside border/bg inline
- [PhotoGallery.tsx:17-27](../src/features/gallery/components/PhotoGallery.tsx#L17-L27) — empty state todo inline, hex cru `#9A9AA2`
- [PhotoCard.tsx:52,59-62](../src/features/gallery/components/PhotoCard.tsx#L52-L62) — minHeight + opacity inline
- [LoadingSpinner.tsx:13-17](../src/components/ui/LoadingSpinner.tsx#L13-L17) — borderTopColor inline
- [EventFormModal.tsx:179](../src/features/events/components/EventFormModal.tsx#L179) — boxShadow inline

A regra existe e ninguém segue. Sem lint pra barrar, continua assim.

### P2 — Cores hardcoded em vez de tokens

`globals.css` tem tokens bons (`--primary`, `--cyan`, `--chart-1..5`). Os componentes ignoram e cravam hex:

- `text-[#a78bfa]`, `bg-[#fb7185]`, `#4ecdc4`, `#fbbf24`, `#34d399`, `#818cf8` espalhados
- `bg-[#0A0A0B]`, `bg-[#0f0f12]`, `bg-[#14141a]` repetidos dezenas de vezes
- `--chart-1..5` ([globals.css:33-37](../src/app/globals.css#L33-L37)) = exatamente esses hex, mas **nunca usados** — palette re-hardcoded à mão
- Gradiente da página divergente: `--page-bg-from/to` define `#1B1B1E→#0A0A0B`, mas [gallery/page.tsx:91](../src/app/gallery/page.tsx#L91) usa 3-stop diferente inline. Duas verdades.

### P3 — Mesma palette codificada 4 vezes (smell-raiz)

Três mapas "cor → bundle de classe" + os tokens CSS. Tudo a mesma palette neon:

| Local | Forma |
| --- | --- |
| [PhotoCard.tsx:13-21](../src/features/gallery/components/PhotoCard.tsx#L13-L21) `TAG_COLORS` | text+bg+border |
| [PhotoModal.tsx:18-26](../src/features/gallery/components/PhotoModal.tsx#L18-L26) `TAG_COLORS` | **copy-paste idêntico** |
| [PhotoModal.tsx:28-95](../src/features/gallery/components/PhotoModal.tsx#L28-L95) `STICKER_FRAMES` | 90 linhas, 10 props de cor |
| [data.ts:308-314](../src/constants/data.ts#L308-L314) `EVENT_COLOR_MAP` | bg+text+dot+border+shadow |

Resolver isso é o maior ganho do refactor. Uma palette canônica → derivar todos.

### P4 — `components/ui/` quase vazio

PRD: `ui/` = burros, genéricos, compartilhados. Só tem `LoadingSpinner`. O resto é reinventado inline:

- **Button** — todo arquivo refaz `motion.button` com `whileHover/whileTap` + gradiente `from-cyan-primary to-cyan-dim`. ~10x.
- **Modal** — 4 modais duplicam o scaffold Radix inteiro + close button (~40 linhas cada). E só [AuthModal:63](../src/features/auth/components/AuthModal.tsx#L63) usa `.glass-modal`; os outros 3 refazem na mão.
- **Badge/Tag** — pill duplicado PhotoCard + PhotoModal.
- **Input/Field** — `FIELD_CLASS` local no EventFormModal; NavBar e UploadModal cada um com o seu. `.glass-input` subusado.
- [PhotoCard.tsx:39-43](../src/features/gallery/components/PhotoCard.tsx#L39-L43) refaz `.glass-card` na mão, divergindo da utility.

### P5 — Login Google duplicado cross-feature

[app/page.tsx:17-33](../src/app/page.tsx#L17-L33) e [AuthModal.tsx:22-38](../src/features/auth/components/AuthModal.tsx#L22-L38) têm `handleGoogleLogin` + SVG + erro idênticos. `createClient()` vira singleton de módulo em 4 arquivos ([NavBar:4](../src/components/layout/NavBar.tsx#L4) cria um client só pra `signOut`). Falta `useAuth`/`AuthProvider` em `features/auth`. Auth state gerido ad-hoc com `useEffect` em [gallery/page.tsx:35-45](../src/app/gallery/page.tsx#L35-L45).

### P6 — Dead code: navegação prev/next quebrada

[PhotoModal.tsx:319-335](../src/features/gallery/components/PhotoModal.tsx#L319-L335) renderiza botões `ChevronLeft`/`ChevronRight` com `onClick` vazio e comentário "Navigation handled at parent level". O parent ([gallery/page.tsx:185-189](../src/app/gallery/page.tsx#L185-L189)) não passa handler nenhum. Os botões aparecem mas não fazem nada — usuário clica e nada acontece.

Pior que feio: é feature quebrada visível. O `currentIdx`/`canPrev`/`canNext` já estão calculados ([PhotoModal.tsx:258-260](../src/features/gallery/components/PhotoModal.tsx#L258-L260)), só falta fiar o callback.

**Fix:** ou implementa de verdade (passar `onNavigate(direction)` do parent, ou mover `selectedPhoto` index pra dentro do modal), ou remove os botões. Não deixa stub. Regra global: nada de stub especulativo.

### P7 — PhotoModal com 471 linhas faz coisa demais

[PhotoModal.tsx](../src/features/gallery/components/PhotoModal.tsx) carrega: `TAG_COLORS`, `STICKER_FRAMES` (90 linhas de config), o componente `StickerCreator`, o `InfoRow`, e o modal principal. Quatro responsabilidades num arquivo.

`StickerCreator` é uma feature inteira (wizard de 2 steps, preview, download) enfiada no modal de detalhe. Não tem nada a ver com "mostrar foto".

**Fix:** extrair `features/gallery/components/StickerCreator.tsx` (leva `STICKER_FRAMES` junto). `InfoRow` vira primitivo ou fica local. PhotoModal cai pra ~200 linhas e fica legível.

### P8 — Tipo `ViewMode` repetido inline

`'gallery' | 'events'` aparece cru em 3 lugares: [NavBar.tsx:12-13](../src/components/layout/NavBar.tsx#L12-L13) (duas props) e [gallery/page.tsx:48](../src/app/gallery/page.tsx#L48) (state). Adicionar uma view ("albums", "map") = caçar e editar 3 lugares, e o TS não avisa se esquecer um.

**Fix:** `export type ViewMode = 'gallery' | 'events'` em `types/types.ts`. Importar nos dois arquivos.

### P9 — `data.ts` mistura dado com apresentação

[constants/data.ts](../src/constants/data.ts) tem seed mock (`PHOTOS`, `EVENTS`, `ALBUMS`) **e** `EVENT_COLOR_MAP` ([data.ts:308-314](../src/constants/data.ts#L308-L314)). Mapa de cor→classe Tailwind é design system, não dado. Concerns diferentes que mudam por motivos diferentes: o mock some quando entrar backend; o color map fica.

**Fix:** color map vai junto da solução de P3 (token de palette / `lib/theme`). `data.ts` fica só seed — e idealmente vira fetch quando o react-query entrar (P5/decisões).

### P10 — `today` hardcoded no calendário

[EventsPanel.tsx:21-22](../src/features/events/components/EventsPanel.tsx#L21-L22) — `const today = new Date(2026, 5, 25)` e `viewDate` fixo em junho/2026. Calendário sempre acha que hoje é 25/jun/2026. Em produção mostra "hoje" errado.

**Fix:** `new Date()` real. Manter a data fixa só se for decisão consciente de demo (e aí comenta o porquê). Hoje parece bug, não escolha.

### P11 — Sem escala tipográfica

Literais arbitrários de fonte por todo lado: `text-[0.8rem]`, `text-[0.75rem]`, `text-[0.68rem]`, `text-[0.65rem]`, `text-[0.62rem]`, `text-[0.6rem]`... Cada componente escolhe um rem no olho. Sem consistência, e mudar o ritmo tipográfico = editar dezenas de literais.

**Fix:** definir steps no `@theme` (ou usar a escala default do Tailwind: `text-xs`/`text-sm`/...). Trocar os arbitrary values. Entra junto da tokenização (P2/decisões).

### P12 — PRD pede react-query, projeto não tem

PRD: "Use `@tanstack/react-query` para comunicação com Supabase". Não está nas deps ([package.json](../package.json)) e não há uma chamada sequer. Hoje é tudo mock constant + `useEffect` ad-hoc pra auth.

Não é bug agora (sem backend real), mas é gap PRD↔código. Vira decisão: entra neste refactor ou espera o backend. Ver **Decisões a fechar**.

---

## Padrões propostos

1. **Palette = token único.** Definir as cores semânticas (tag/event/frame) no `@theme` do `globals.css`. Matar os 4 mapas, derivar de um só.
2. **`components/ui/` real:** `Button`, `Modal`, `Badge`, `Input`, `IconButton`. Migrar as duplicações pra lá.
3. **Escala tipográfica** no theme — trocar `text-[0.Xrem]` por steps nomeados.
4. **`features/auth`:** `AuthProvider` + `useAuth`. Matar singletons e o login duplicado.
5. **Lint que force as regras** — `no-restricted-syntax` barrando `style=` p/ cor; `eslint-plugin-tailwindcss` (já instalado) barrando arbitrary values. Sem isso, o PRD é decoração.
6. **Hooks de domínio** — tirar o filter/sort da page pra `useFilteredPhotos`.

---

## Decisões (fechadas)

| Decisão | Escolha | Por quê |
| --- | --- | --- |
| Escopo do design system | **Primitivos mínimos** — Button, Modal, Badge, Input, IconButton | Cobre as duplicações reais sem construir o que ninguém usa. |
| Tokenização | **Completa** — cor + tipografia + spacing + shadows | Resolve P2, P3 e P11 de uma vez e vira base dos primitivos. |
| react-query | **Depois** | Sem backend real é especulativo. Fica fora deste refactor; mantém mock. |
| Lint | **Incremental** — warn → migra → error | Não trava o build durante a migração. |

A ordem cai direto disso: **tokens são fundação** (primitivos e migração dependem deles) → **primitivos** → **migração dos componentes** → **lint vira error** no fim.

---

## Tasks

Uma task por arquivo em [`tasks/`](./tasks/). Cada uma é pequena o bastante pra virar um PR.

| # | Task | Resolve | Depende de |
| --- | --- | --- | --- |
| T1 | [Definir tokens no `@theme`](./tasks/T1-tokens-theme.md) | P2, P11 | — |
| T2 | [Palette canônica](./tasks/T2-palette-canonica.md) | P3 | T1 |
| T3 | [`ui/Button`](./tasks/T3-ui-button.md) | P4 | T1 |
| T4 | [`ui/Modal` + `ui/IconButton`](./tasks/T4-ui-modal.md) | P4 | T1 |
| T5 | [`ui/Badge`](./tasks/T5-ui-badge.md) | P4 | T1, T2 |
| T6 | [`ui/Input` + `Field`](./tasks/T6-ui-input.md) | P4 | T1 |
| T7 | [`features/auth`: `AuthProvider` + `useAuth`](./tasks/T7-features-auth.md) | P5 | T3 |
| T8 | [Extrair `StickerCreator`](./tasks/T8-extrair-sticker-creator.md) | P7 | T2 |
| T9 | [Mover `EVENT_COLOR_MAP` pra `lib/theme`](./tasks/T9-mover-event-color-map.md) | P9 | T2 |
| T10 | [Prev/next do PhotoModal](./tasks/T10-photomodal-navegacao.md) | P6 | — |
| T11 | [Tipo `ViewMode`](./tasks/T11-viewmode-type.md) | P8 | — |
| T12 | [`today` real no MiniCalendar](./tasks/T12-today-calendario.md) | P10 | — |
| T13 | [Hook `useFilteredPhotos`](./tasks/T13-use-filtered-photos.md) | dívida de domínio | — |
| T14 | [Lint incremental](./tasks/T14-lint-incremental.md) | P1 | T1–T13 |

### Ordem de execução

A dependência manda. Ordem recomendada:

1. **T1** — fundação. Bloqueia quase tudo. Faz primeiro, sozinha.
2. **T2** — palette canônica (precisa de T1).
3. **T3, T4, T6** — primitivos que só dependem de T1. Podem ser paralelos entre si.
4. **T5** — Badge (precisa de T1 **e** T2).
5. **T7** — auth (precisa do Button/T3).
6. **T8, T9** — extrações que consomem a palette (T2).
7. **T10, T11, T12, T13** — cleanups independentes. Encaixam em qualquer momento; bons pra preencher buracos ou começar em paralelo desde já.
8. **T14** — por último. Liga as regras como `error` só quando T1–T13 fecharem.

Caminho crítico: **T1 → T2 → T5/T8/T9 → T14**. Fase 3 (T10–T13) não bloqueia nada e pode rodar desde o dia 1.

---

## Fora de escopo

- **react-query / camada de dados** — entra quando houver backend real. Por ora, mock constants ficam.
