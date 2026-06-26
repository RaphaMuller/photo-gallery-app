-- Habilitar a extensão UUID se não estiver habilitada
create extension if not exists "uuid-ossp";

-- 1. Tabela de Perfis de Usuários (A autenticação real vem da tabela auth.users do próprio Supabase)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text,
  avatar_url text,
  whatsapp_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Tabela de Grupos (Galerias)
create table public.groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Tabela Pivot: Membros do Grupo (N:N)
-- Roles possíveis: 'admin', 'editor', 'viewer'
create table public.group_members (
  user_id uuid references public.profiles(id) on delete cascade not null,
  group_id uuid references public.groups(id) on delete cascade not null,
  role text not null check (role in ('admin', 'editor', 'viewer')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, group_id)
);

-- 4. Tabela de Fotos
create table public.photos (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  uploader_id uuid references public.profiles(id) on delete set null,
  title text not null,
  url text not null,
  width integer,
  height integer,
  tags text[] default '{}',
  is_flagged boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tabela de Eventos (Roles/Encontros)
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete set null,
  title text not null,
  event_date date not null,
  event_time time not null,
  description text,
  color text default 'cyan',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Tabela de RSVPs (Confirmações nos eventos)
create table public.event_rsvps (
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status text not null check (status in ('confirmed', 'declined')),
  primary key (event_id, user_id)
);

-- =========================================================================
-- CONFIGURAÇÃO DE RLS (ROW LEVEL SECURITY)
-- Isso garante a privacidade: Usuários só enxergam dados dos grupos em que estão
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.photos enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;

-- Exemplos de Políticas Básicas (Policies):

-- Profiles: Qualquer um logado pode ver perfis, mas só o dono altera o próprio.
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Groups: Usuário só vê o grupo se for membro.
create policy "Users can view groups they belong to" on public.groups for select
using ( exists (select 1 from public.group_members where group_id = groups.id and user_id = auth.uid()) );

-- Photos: Só vê fotos do grupo que pertence.
create policy "Users can view photos of their groups" on public.photos for select
using ( exists (select 1 from public.group_members where group_id = photos.group_id and user_id = auth.uid()) );
