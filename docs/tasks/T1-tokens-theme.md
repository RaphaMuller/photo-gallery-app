# T1 — Definir tokens no `@theme`

- **Resolve:** base de P2, P11
- **Depende de:** —
- **Fase:** 0 (fundação)
- **Arquivos:** [globals.css](../../src/app/globals.css)

## Problema

`globals.css` tem tokens bons (`--primary`, `--cyan`, `--chart-1..5`) mas os componentes ignoram e cravam hex. Os `--chart-1..5` ([globals.css:33-37](../../src/app/globals.css#L33-L37)) são exatamente a palette neon usada à mão, mas nunca referenciados. Não há escala tipográfica nem de spacing/shadow — tudo é literal arbitrário (`text-[0.62rem]`, `shadow-[0_0_24px_rgba(...)]`).

## Escopo

Definir no `@theme` do `globals.css`:

- **Cor** — palette semântica: `--color-tag-*`, `--color-event-*`, `--color-frame-*`, derivadas dos `--chart-*` existentes. Cobrir a paleta neon: cyan, purple (`#a78bfa`), rose (`#fb7185`), amber (`#fbbf24`), teal (`#4ecdc4`), green (`#34d399`), indigo (`#818cf8`).
- **Tipografia** — escala nomeada cobrindo os rem usados hoje (0.6 → 0.95rem + headings).
- **Spacing** — se houver valores repetidos fora da escala Tailwind.
- **Shadows** — tokens pros glows recorrentes (`shadow-glow-sm`, `shadow-glow-lg`, etc.) hoje hardcoded.

Não migrar componentes ainda — só definir os tokens. Migração é T2+.

## Critério de aceite

- Tokens definidos no `@theme`, build passa.
- `--chart-*` órfãos resolvidos (renomeados/reaproveitados como tokens semânticos).
- Nenhum componente alterado ainda (essa task é só a fundação).

## Status: feito (com desvio)

- **Tokens + build:** OK. `--chart-1..5` removidos e reaproveitados na paleta neon.
- **Desvio nos aliases semânticos:** o critério pedia `--color-tag-*`/`--color-event-*`/`--color-frame-*`. Foram criados e **removidos** — optou-se por paleta flat (`cyan-primary`, `purple`, `rose`, `amber`, `teal`, `green`, `indigo`). Motivo: a migração foi feita in-place mantendo os mapas de cor nos componentes (decisão do executor, fora do escopo original do T1), então os aliases por domínio virariam tokens órfãos — o mesmo smell que acabara de ser corrigido nos `--chart-*`. Os mapas (`TAG_COLORS`, `STICKER_FRAMES`, `EVENT_COLOR_MAP`) seguem como camada semântica e referenciam a paleta flat.
- **"Nenhum componente alterado" não vale mais:** a migração dos componentes (escopo de T2/T11) foi feita junto, no mesmo PR. T1 deixou de ser só fundação.
- Registrado no `CHANGELOG.md` (seção 7).
