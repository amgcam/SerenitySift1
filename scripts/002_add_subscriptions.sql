-- Add subscription and theme fields to profiles table
alter table public.profiles
add column if not exists subscription_status text default 'free' check (subscription_status in ('free', 'premium')),
add column if not exists subscription_id text,
add column if not exists purchased_themes jsonb default '["default"]'::jsonb,
add column if not exists active_theme text default 'default';

-- Update existing profiles to have default values
update public.profiles
set 
  subscription_status = 'free',
  purchased_themes = '["default"]'::jsonb,
  active_theme = 'default'
where subscription_status is null;
