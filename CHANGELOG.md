# Histórico do Projeto e Migração (Vite -> Next.js)

Este documento registra todas as etapas concluídas, decisões arquiteturais importantes e limpezas realizadas durante a migração do projeto base gerado pelo Figma AI para o ambiente moderno do Next.js.

## 1. Migração Arquitetural (Vite para Next.js 15)
O projeto originalmente foi prototipado no Figma (Figma AI) e exportado como uma aplicação React estática rodando via Vite.
- **Inicialização:** Foi criado um novo ambiente com `npx create-next-app` utilizando Next.js 15, TypeScript, Tailwind CSS v4, e o moderno App Router (`src/app`).
- **Roteamento:** A lógica de estado que controlava as páginas (Client-Side Rendering) foi adaptada para rodar de forma híbrida no App Router. A galeria principal foi isolada no `page.tsx`.
- **Otimização de Imagens:** Todas as tags nativas `<img />` foram substituídas pelo componente `<Image />` (`next/image`), permitindo carregamento inteligente (lazy loading), compressão automática WebP e otimização de cache.
- **Configuração de Domínio:** O arquivo `next.config.ts` foi configurado para permitir a importação de imagens externas otimizadas provenientes do domínio `images.unsplash.com`.
- **Fusão de Estilos:** Os arquivos originais `theme.css` e `globals.css` foram mesclados, garantindo a permanência das fontes globais (Inter, Bungee, etc.) e o estilo dark/glassmorphism original.

## 2. Refatoração e Limpeza de Código Morto (Dead Code)
O Figma AI gerou dezenas de componentes genéricos do "Shadcn UI" que não estavam sendo realmente importados pela aplicação, servindo apenas como peso morto.
- **Remoção de Arquivos (49 Arquivos):** 
  - A pasta inteira `src/components/ui/` foi deletada.
  - A pasta inteira `src/components/figma/` foi deletada.
- **Remoção de Dependências (53 Pacotes Inúteis):** 
  - Foram desinstalados mais de 50 pacotes via `npm uninstall`, incluindo bibliotecas pesadas como `recharts`, `react-day-picker`, `sonner`, `embla-carousel-react`, e inúmeros módulos `@radix-ui/react-*` que não estavam sendo usados. 
  - *Resultado:* Isso limpou 232 pacotes transitivos de dentro da `node_modules`, reduzindo drasticamente o tempo de compilação.
- **Auditoria Rigorosa:** Utilizamos a ferramenta `knip` para varrer o projeto e atestar que 100% dos arquivos fantasmas, dependências inúteis e tipagens órfãs (como o tipo genérico `ViewMode`) haviam sido removidos com sucesso.

## 3. Correção de Bugs e Ajustes Finais
Ao rodar a aplicação migrada no ambiente Next.js, encontramos e resolvemos dois problemas graves de compatibilidade e acessibilidade:

### A. Hydration Mismatch (`react-responsive-masonry`)
- **O Problema:** Como o Next.js pré-renderiza o HTML no servidor (SSR), o componente `react-responsive-masonry` tentava desenhar a galeria sem ter acesso ao `window.innerWidth`, criando apenas 1 coluna. Quando chegava no navegador (Client), ele redistribuía para 3 colunas, causando um "Hydration Mismatch" e quebrando a árvore React.
- **A Solução:** O componente `PhotoGallery` foi importado dinamicamente utilizando `next/dynamic` com a opção `ssr: false`. Isso garante que a matemática das colunas de alvenaria (masonry) seja calculada exclusivamente no navegador do usuário, resolvendo totalmente o erro.

### B. Acessibilidade de Modais (Radix UI Warnings)
- **O Problema:** Os componentes de diálogo (`PhotoModal`, `UploadModal`, `EventFormModal`) feitos com Radix UI estavam emitindo erros no console exigindo a presença de um `Dialog.Title` e `Dialog.Description` por questões de acessibilidade (Leitores de Tela / A11y).
- **A Solução:** Injetamos componentes `<Dialog.Title>` e `<Dialog.Description>` nos modais utilizando a classe do Tailwind `sr-only` (Screen Reader Only). Assim, os requisitos de acessibilidade foram totalmente cumpridos sem alterar a estética "clean" e de vidro (glassmorphism) exigida pelo design.

## 4. Padronização Arquitetural e Limpeza de CSS-in-JS (FSD)
Após estabelecer as bases do projeto, notamos a necessidade de uma refatoração arquitetural profunda para padronizar o código, eliminar lógicas misturadas com CSS (`style={{...}}`) e abraçar o FSD (Feature-Sliced Design).
- **Criação de Regras Base (`AGENTS.md`):** Foi documentado um PRD arquitetural estrito proibindo o uso da propriedade `style` para definições de cores, layouts ou backgrounds em toda a aplicação. Toda a estilização deve ser feita utilizando as utilidades nativas do Tailwind CSS v4.
- **Utilitários Globais (`global.css`):** Para manter o código limpo, evitamos repetições exaustivas de classes de "glassmorphism" criando as diretivas `@utility` (como `.glass-nav`, `.glass-modal`, `.glass-overlay`) reaproveitáveis.
- **Refatoração Completa de Componentes:** Foram refatorados os componentes chave do sistema para usar unicamente as diretivas tailwind e a função `cn()` para interações dinâmicas. Entre eles: `AuthModal.tsx`, `NavBar.tsx`, `FilterBar.tsx`, `PhotoCard.tsx`, `PhotoModal.tsx`, `UploadModal.tsx`, `EventsPanel.tsx` e `EventFormModal.tsx`.
- **Mapeamento de Cores Constantes (`data.ts`):** O `EVENT_COLOR_MAP` foi reescrito. Em vez de injetar strings RGB brutas inline (`rgba(X, Y, Z)`), os mapas de cores agora retornam classes semânticas e literais do Tailwind (como `bg-cyan-primary/[0.12]`), garantindo precisão milimétrica sem desvios do guia de estilos principal.

## 5. Fase 2: Autenticação, Proteção de Rotas e Redesign da Landing Page
Após a estruturação base, avançamos para a implementação de segurança e criação de uma porta de entrada amigável para o usuário.
- **Supabase SSR:** Instalação e configuração do pacote `@supabase/ssr` para gerenciar a autenticação e cookies em ambientes Server-Side. Foram criados os clientes `client.ts` e `server.ts` dentro de `src/lib/supabase/`.
- **Proteção via Proxy (Middleware):** Implementamos o arquivo `src/proxy.ts` (convenção Next.js) que intercepta todas as requisições para caminhos protegidos (como `/gallery`), validando a sessão do usuário no Supabase e redirecionando para o login caso não esteja autenticado.
- **Isolamento de Rotas:** O sistema foi dividido. A rota raiz `/` tornou-se uma página pública (Landing Page), enquanto o núcleo da aplicação (galeria e painéis) foi movido com segurança para `/gallery`.
- **Redesign da Landing Page (V2):** Refatoramos completamente a página inicial para focar na conversão, criando uma experiência *Premium*:
  - **Split Layout:** Dividimos o layout desktop em 50/50.
  - **Marquee Infinito:** Adicionamos uma "parede de fotos" no lado direito, deslizando infinitamente usando Framer Motion, com interatividade (pause-on-hover) e zoom nas fotos.
  - **Estilização Refinada:** Textos ganhando *text-gradients* e um logotipo de câmera minimalista gerado (neon).
- **Componentes Globais:** Criação de um utilitário central para carregamentos suaves (`<LoadingSpinner />`), padronizando o feedback visual no sistema.

---

> **A partir de agora:** Todas as novas features, refatorações ou decisões estruturais importantes devem ser logadas neste arquivo ou em subarquivos de histórico, mantendo a documentação técnica impecável e acompanhando o histórico de prompts.
