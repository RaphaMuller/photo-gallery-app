# Masonry Photo Gallery

Uma aplicação web moderna para visualização de fotos, gerenciamento de eventos e autenticação, construída com foco em design dinâmico, performance e usabilidade.

## 🚀 Tecnologias Principais

- **Framework:** Next.js 15 (App Router)
- **Interface:** React 19, Tailwind CSS
- **Animações e Layout:** Framer Motion, React Responsive Masonry
- **Componentes:** Radix UI, Lucide React
- **Backend & Banco de Dados:** Supabase

## ✨ Funcionalidades

- **Galeria Interativa:** Layout estilo alvenaria (masonry) altamente responsivo e otimizado para exibição de imagens.
- **Gerenciamento de Eventos:** Módulo embutido para controle, listagem e detalhamento de eventos.
- **Autenticação:** Fluxos seguros de acesso e proteção de rotas integrados via Supabase Auth.
- **Design Dinâmico:** Animações e micro-interações fluidas em toda a interface do usuário.

## 📁 Arquitetura do Projeto

O projeto adota uma arquitetura baseada em features (Feature-Sliced Design) para maior escalabilidade:

```text
src/
├── app/          # Rotas e páginas do Next.js (App Router)
├── components/   # Componentes UI globais e reutilizáveis (botões, modais, etc.)
├── features/     # Módulos funcionais encapsulados da aplicação
│   ├── auth/     # Lógica e componentes de autenticação
│   ├── events/   # Gerenciamento de eventos
│   └── gallery/  # Componentes e lógica de visualização de imagens
├── lib/          # Utilitários e instâncias globais (ex: cliente do Supabase)
├── constants/    # Valores fixos e variáveis de configuração
└── types/        # Definições de tipos TypeScript globais
```

## 🛠️ Como Executar Localmente

### 1. Clonar e Instalar
```bash
git clone <URL_DO_REPOSITORIO>
cd masonry-photo-gallery-app
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto contendo as credenciais do seu projeto no Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 3. Rodar o Servidor
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.
