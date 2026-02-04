-- Add notification preferences to profiles table
alter table public.profiles
add column if not exists notification_enabled boolean default true,
add column if not exists notification_time text default '20:00',
add column if not exists notification_skip_weekends boolean default false,
add column if not exists notification_last_sent timestamptz,
add column if not exists notification_message_history jsonb default '[]'::jsonb;

-- Create notification_messages table to track which messages were sent
create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message_index integer not null,
  sent_at timestamptz default now(),
  opened boolean default false,
  mood_logged_after boolean default false
);

alter table public.notification_logs enable row level security;

create policy "notification_logs_select_own"
  on public.notification_logs for select
  using (auth.uid() = user_id);

create policy "notification_logs_insert_own"
  on public.notification_logs for insert
  with check (auth.uid() = user_id);

create policy "notification_logs_update_own"
  on public.notification_logs for update
  using (auth.uid() = user_id);
