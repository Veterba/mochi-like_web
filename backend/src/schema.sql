create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  login text unique not null,
  password_hash text not null,
  nickname text not null,
  avatar text,
  created_at timestamptz not null default now()
);

create table if not exists learning (
  user_id uuid not null references users(id) on delete cascade,
  language text not null,
  status text not null check (status in ('learning','completed')),
  primary key (user_id, language)
);

create table if not exists activity (
  user_id uuid not null references users(id) on delete cascade,
  day date not null,
  primary key (user_id, day)
);

create table if not exists folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references folders(id) on delete cascade,
  name text not null
);

create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  front text not null,
  back text not null default ''
);

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null references chats(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_chat_idx on chat_messages (chat_id, created_at);
