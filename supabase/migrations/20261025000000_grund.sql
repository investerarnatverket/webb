-- Investeringsnätverket: grundschema.
-- Kör i Supabase: SQL Editor -> klistra in -> Run (eller `supabase db push`).
--
-- Medlem = en rad i medlemmar. Rader läggs till av sajten med den hemliga
-- nyckeln (sidan Medlemmar), aldrig av webbläsaren. Prenumeranter lagras inte
-- här alls: de ligger bara i Resend, och först när de bekräftat sin adress.

create type public.arrangor as enum ('natverket', 'aktiespararna', 'unga_aktiespararna', 'annan');

create table public.medlemmar (
  id uuid primary key references auth.users (id) on delete cascade,
  namn text not null check (char_length(namn) between 1 and 80),
  roll text not null default '' check (char_length(roll) <= 80),
  visas_publikt boolean not null default false,
  skapad timestamptz not null default now()
);

create table public.event (
  id uuid primary key default gen_random_uuid(),
  titel text not null check (char_length(titel) between 3 and 140),
  beskrivning text not null default '' check (char_length(beskrivning) <= 4000),
  startar timestamptz not null,
  slutar timestamptz check (slutar is null or slutar > startar),
  plats text not null default '' check (char_length(plats) <= 200),
  arrangor public.arrangor not null default 'natverket',
  lank text check (lank is null or lank ~* '^https://'),
  publicerad boolean not null default false,
  skapad_av uuid default auth.uid() references auth.users (id) on delete set null,
  skapad timestamptz not null default now(),
  uppdaterad timestamptz not null default now()
);

create index event_publicerade_startar on public.event (startar) where publicerad;

-- security definer: policyerna nedan läser medlemmar, som själv har RLS.
create function public.ar_medlem() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.medlemmar where id = (select auth.uid()));
$$;

create function public.satt_uppdaterad() returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.uppdaterad = now();
  return new;
end;
$$;

create trigger event_uppdaterad before update on public.event
for each row execute function public.satt_uppdaterad();

alter table public.medlemmar enable row level security;
alter table public.event enable row level security;

create policy "publicerade event syns för alla, utkast för medlemmar"
  on public.event for select to anon, authenticated
  using (publicerad or public.ar_medlem());
create policy "medlemmar skapar event"
  on public.event for insert to authenticated
  with check (public.ar_medlem());
create policy "medlemmar ändrar event"
  on public.event for update to authenticated
  using (public.ar_medlem()) with check (public.ar_medlem());
create policy "medlemmar tar bort event"
  on public.event for delete to authenticated
  using (public.ar_medlem());

create policy "medlemmar som valt det syns publikt"
  on public.medlemmar for select to anon, authenticated
  using (visas_publikt or public.ar_medlem());
create policy "medlem ändrar sin egen rad"
  on public.medlemmar for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Uttryckliga rättigheter, så att schemat inte hänger på projektets standardval.
grant select on public.event, public.medlemmar to anon, authenticated;
grant insert, update, delete on public.event to authenticated;
grant update (namn, roll, visas_publikt) on public.medlemmar to authenticated;
grant all on public.event, public.medlemmar to service_role;
