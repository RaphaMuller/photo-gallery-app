# T14 — Lint incremental

- **Resolve:** P1
- **Depende de:** T1–T13 (tudo migrado)
- **Fase:** 4 (trava)
- **Arquivos:** config ESLint (flat config)

## Problema

O PRD proíbe `style=` p/ cor/bg/border e arbitrary values, mas nada força isso — então o código degrada sozinho. Violações listadas em P1.

## Escopo

- `no-restricted-syntax` (ou regra equivalente) barrando atributo `style` com cor/bg/border/filter.
- `eslint-plugin-tailwindcss` (já em devDeps) barrando arbitrary values (`text-[...]`, `bg-[#...]`).
- **Incremental:** começar como `warn`, migrar os arquivos restantes, depois flipar pra `error`.

Esta task é o portão final — só vira `error` quando T1–T13 fecharem e o `lint` passar limpo.

## Critério de aceite

- Regras ativas; `npm run lint` limpo.
- Regras em `error` (não `warn`) ao final.
- Novo `style=` de cor ou arbitrary value quebra o lint.

## Achado (durante T1): lint está quebrado hoje

`npm run lint` **não roda**. `eslint.config.mjs` quebra ao carregar:

```
TypeError: tailwind.configs.flat/recommended is not iterable
```

A flat config do `eslint-plugin-tailwindcss` está incorreta (a versão instalada não expõe `configs.flat.recommended` iterável, ou o spread está errado). Os avisos de classe canônica que aparecem no editor vêm da integração do language server, **não** deste CLI.

Implicação: o **primeiro passo do T14 é consertar o carregamento do `eslint.config.mjs`** — senão o gate nunca passa. A migração de CSS do T1 já deixou o código sem `style=` de cor nem arbitrary values de hex/rem/shadow, então a maior parte da adequação já está feita; falta a config funcionar e flipar pra `error`.
