create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean not null default false,
  credits integer not null default 0 check (credits >= 0),
  premium_expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('mpesa', 'stripe')),
  provider_transaction_id text unique,
  amount integer not null check (amount > 0),
  currency text not null default 'KES',
  status text not null check (status in ('pending', 'completed', 'failed', 'cancelled')),
  plan text not null,
  credits_awarded integer not null default 0 check (credits_awarded >= 0),
  premium_days integer not null default 0 check (premium_days >= 0),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create or replace function public.create_profile_for_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

alter table public.profiles enable row level security;
alter table public.payments enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can read own payments" on public.payments for select using (auth.uid() = user_id);

-- Service-role callers bypass RLS. No client write policies are intentionally created.
create or replace function public.consume_credits(p_cost integer)
returns boolean language plpgsql security definer set search_path = public as $$
declare affected integer;
begin
  if p_cost <= 0 then
    raise exception 'Credit cost must be greater than zero';
  end if;

  update public.profiles
  set credits = credits - p_cost, updated_at = now()
  where id = auth.uid()
    and (premium_expires_at > now() or credits >= p_cost);
  get diagnostics affected = row_count;
  return affected = 1;
end;
$$;

revoke all on function public.consume_credits(integer) from public;
grant execute on function public.consume_credits(integer) to authenticated;

create or replace function public.complete_payment(p_payment_id uuid, p_provider_transaction_id text)
returns boolean language plpgsql security definer set search_path = public as $$
declare payment_row public.payments%rowtype;
begin
  select * into payment_row from public.payments where id = p_payment_id for update;
  if not found then raise exception 'Payment not found'; end if;
  if payment_row.status = 'completed' then return true; end if;
  if payment_row.status <> 'pending' then return false; end if;

  update public.payments set status = 'completed', provider_transaction_id = p_provider_transaction_id,
    completed_at = now() where id = p_payment_id;
  update public.profiles set
    credits = credits + payment_row.credits_awarded,
    is_premium = is_premium or payment_row.premium_days > 0,
    premium_expires_at = case when payment_row.premium_days > 0 then
      greatest(coalesce(premium_expires_at, now()), now()) + make_interval(days => payment_row.premium_days)
      else premium_expires_at end,
    updated_at = now()
  where id = payment_row.user_id;
  return true;
end;
$$;

revoke all on function public.complete_payment(uuid, text) from public;
