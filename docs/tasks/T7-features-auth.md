# T7 — `features/auth`: `AuthProvider` + `useAuth`

- **Resolve:** P5
- **Depende de:** T3 (Button). Pode rodar em paralelo com o resto da Fase 1.
- **Fase:** 2 (migração / features)
- **Arquivos:** novo `features/auth/{context,hooks}`, [app/page.tsx](../../src/app/page.tsx), [AuthModal.tsx](../../src/features/auth/components/AuthModal.tsx), [NavBar.tsx](../../src/components/layout/NavBar.tsx), [gallery/page.tsx](../../src/app/gallery/page.tsx)

## Problema

`handleGoogleLogin` + SVG do Google + tratamento de erro duplicados em [app/page.tsx:17-33](../../src/app/page.tsx#L17-L33) e [AuthModal.tsx:22-38](../../src/features/auth/components/AuthModal.tsx#L22-L38). `createClient()` vira singleton de módulo em 4 arquivos — [NavBar:4](../../src/components/layout/NavBar.tsx#L4) cria um client só pra `signOut`. Auth state gerido ad-hoc no `useEffect` de [gallery/page.tsx:35-45](../../src/app/gallery/page.tsx#L35-L45).

## Escopo

- `AuthProvider` — segura o client, a sessão, e o subscribe a `onAuthStateChange`.
- `useAuth()` — expõe `user`, `signInWithGoogle()`, `signOut()`, `loading`, `error`.
- Componente `GoogleLoginButton` (ou variant do `Button` de T3) com o SVG, usado por page e AuthModal.
- Trocar os singletons espalhados e o `useEffect` da gallery por `useAuth`.

## Critério de aceite

- Um único ponto de auth (`useAuth`); zero `createClient()` solto em componente.
- Login Google sem duplicação.
- Fluxo login/logout/redirect funciona igual.
