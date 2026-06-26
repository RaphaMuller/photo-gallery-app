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
