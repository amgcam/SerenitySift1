-- Professional accounts and patient relationships for Serenity Pro/Scope

-- Add professional fields to profiles
alter table public.profiles
add column if not exists is_professional boolean default false,
add column if not exists professional_role text,
add column if not exists license_number text,
add column if not exists pro_tier text check (pro_tier in ('free', 'pro', 'scope')),
add column if not exists pro_tier_expires_at timestamptz;

-- Create patient_connections table (links professionals to patients)
create table if not exists public.patient_connections (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('pending', 'active', 'revoked')) default 'pending',
  invite_token text unique,
  invite_expires_at timestamptz,
  share_moods boolean default true,
  share_notes boolean default true,
  share_chats boolean default true,
  connected_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz default now(),
  unique(professional_id, patient_id)
);

alter table public.patient_connections enable row level security;

-- Professionals can see their own connections
create policy "connections_select_professional"
  on public.patient_connections for select
  using (auth.uid() = professional_id);

-- Patients can see connections where they are the patient
create policy "connections_select_patient"
  on public.patient_connections for select
  using (auth.uid() = patient_id);

-- Professionals can insert connections (send invites)
create policy "connections_insert_professional"
  on public.patient_connections for insert
  with check (auth.uid() = professional_id);

-- Both professionals and patients can update connections (accept/revoke)
create policy "connections_update_professional"
  on public.patient_connections for update
  using (auth.uid() = professional_id or auth.uid() = patient_id);

-- Professionals can delete connections
create policy "connections_delete_professional"
  on public.patient_connections for delete
  using (auth.uid() = professional_id);

-- Update moods policy to allow professionals to view patient moods
create policy "moods_select_professional"
  on public.moods for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.patient_connections
      where patient_id = moods.user_id
      and professional_id = auth.uid()
      and status = 'active'
      and share_moods = true
    )
  );

-- Update chat_messages policy to allow professionals to view patient chats
create policy "chat_messages_select_professional"
  on public.chat_messages for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.patient_connections
      where patient_id = chat_messages.user_id
      and professional_id = auth.uid()
      and status = 'active'
      and share_chats = true
    )
  );

-- Create consent_audit table for compliance tracking
create table if not exists public.consent_audit (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.patient_connections(id) on delete cascade,
  action text not null check (action in ('accepted', 'updated', 'revoked')),
  share_moods boolean,
  share_notes boolean,
  share_chats boolean,
  created_at timestamptz default now()
);

alter table public.consent_audit enable row level security;

create policy "consent_audit_select_involved"
  on public.consent_audit for select
  using (
    exists (
      select 1 from public.patient_connections
      where id = consent_audit.connection_id
      and (professional_id = auth.uid() or patient_id = auth.uid())
    )
  );

create policy "consent_audit_insert_involved"
  on public.consent_audit for insert
  with check (
    exists (
      select 1 from public.patient_connections
      where id = connection_id
      and (professional_id = auth.uid() or patient_id = auth.uid())
    )
  );
