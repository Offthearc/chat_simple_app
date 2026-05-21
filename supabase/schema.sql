-- profiles (public user data, extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- chat rooms
create table if not exists chat_rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  is_default boolean default false,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- room messages
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references chat_rooms(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- direct messages
create table if not exists direct_messages (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- article discussion comments
create table if not exists article_comments (
  id uuid default gen_random_uuid() primary key,
  article_id text not null,
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamptz default now()
);

-- polls
create table if not exists polls (
  id uuid default gen_random_uuid() primary key,
  room_id uuid references chat_rooms(id) on delete cascade not null,
  created_by uuid references profiles(id) not null,
  question text not null,
  options jsonb not null,
  created_at timestamptz default now(),
  ends_at timestamptz
);

-- poll votes (one per user per poll enforced by unique)
create table if not exists poll_votes (
  id uuid default gen_random_uuid() primary key,
  poll_id uuid references polls(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  option_index integer not null,
  created_at timestamptz default now(),
  unique(poll_id, user_id)
);

-- enable realtime
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table direct_messages;
alter publication supabase_realtime add table article_comments;
alter publication supabase_realtime add table poll_votes;

-- Row Level Security
alter table profiles enable row level security;
alter table chat_rooms enable row level security;
alter table messages enable row level security;
alter table direct_messages enable row level security;
alter table article_comments enable row level security;
alter table polls enable row level security;
alter table poll_votes enable row level security;

-- profiles policies
create policy "Profiles are viewable by all authenticated users" on profiles for select using (auth.role() = 'authenticated');
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- chat_rooms policies
create policy "Rooms viewable by authenticated" on chat_rooms for select using (auth.role() = 'authenticated');
create policy "Authenticated can create rooms" on chat_rooms for insert with check (auth.role() = 'authenticated');

-- messages policies
create policy "Messages viewable by authenticated" on messages for select using (auth.role() = 'authenticated');
create policy "Authenticated can send messages" on messages for insert with check (auth.uid() = user_id);

-- direct_messages policies
create policy "Users can see their own DMs" on direct_messages for select using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Authenticated can send DMs" on direct_messages for insert with check (auth.uid() = sender_id);

-- article_comments policies
create policy "Article comments viewable by authenticated" on article_comments for select using (auth.role() = 'authenticated');
create policy "Authenticated can comment" on article_comments for insert with check (auth.uid() = user_id);

-- polls policies
create policy "Polls viewable by authenticated" on polls for select using (auth.role() = 'authenticated');
create policy "Authenticated can create polls" on polls for insert with check (auth.uid() = created_by);

-- poll_votes policies
create policy "Poll votes viewable by authenticated" on poll_votes for select using (auth.role() = 'authenticated');
create policy "Users can vote once" on poll_votes for insert with check (auth.uid() = user_id);

-- auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
