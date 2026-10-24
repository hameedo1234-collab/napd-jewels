-- Link signed-in storefront orders to the customer's Supabase profile, while
-- keeping guest checkout unchanged. Points are awarded only after delivery.

alter table public.orders
  add column if not exists customer_user_id uuid
    references public.profiles (id) on delete set null;

create index if not exists orders_customer_user_created_at_idx
  on public.orders (customer_user_id, created_at desc)
  where customer_user_id is not null;

create table if not exists public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  order_id uuid not null references public.orders (id) on delete cascade,
  entry_type text not null check (entry_type in ('earned', 'reversed')),
  points_delta integer not null check (points_delta <> 0),
  created_at timestamptz not null default now(),
  constraint loyalty_transactions_order_entry_unique unique (order_id, entry_type)
);

create index if not exists loyalty_transactions_customer_created_at_idx
  on public.loyalty_transactions (customer_id, created_at desc);

alter table public.loyalty_transactions enable row level security;

grant select on public.orders, public.order_items to authenticated;
revoke all on public.loyalty_transactions from anon, authenticated;
grant select on public.loyalty_transactions to authenticated;

drop policy if exists orders_select_customer_own on public.orders;
create policy orders_select_customer_own
  on public.orders for select to authenticated
  using (customer_user_id = (select auth.uid()));

drop policy if exists order_items_select_customer_own on public.order_items;
create policy order_items_select_customer_own
  on public.order_items for select to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and o.customer_user_id = (select auth.uid())
    )
  );

drop policy if exists loyalty_transactions_select_customer_or_owner on public.loyalty_transactions;
create policy loyalty_transactions_select_customer_or_owner
  on public.loyalty_transactions for select to authenticated
  using (
    customer_id = (select auth.uid())
    or public.is_owner((select auth.uid()))
  );

-- Keep the existing guest/owner RPC untouched. Signed-in customer checkout uses
-- this parallel RPC, deriving account ownership from the verified session.
create or replace function public.place_order_for_customer(
  p_customer_name text,
  p_customer_phone text,
  p_city text,
  p_address text,
  p_subtotal numeric,
  p_shipping_fee numeric,
  p_total numeric,
  p_notes text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product_id uuid;
  v_qty integer;
  v_customer_user_id uuid := auth.uid();
begin
  if v_customer_user_id is not null and not exists (
    select 1 from public.profiles p
    where p.id = v_customer_user_id and p.role = 'customer'
  ) then
    v_customer_user_id := null;
  end if;

  insert into public.orders (
    customer_name,
    customer_phone,
    city,
    address,
    subtotal,
    shipping_fee,
    total,
    notes,
    customer_user_id
  )
  values (
    p_customer_name,
    p_customer_phone,
    p_city,
    p_address,
    p_subtotal,
    p_shipping_fee,
    p_total,
    p_notes,
    v_customer_user_id
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := (v_item->>'quantity')::integer;

    insert into public.order_items (
      order_id,
      product_id,
      title,
      unit_price,
      quantity,
      line_total,
      image_url
    )
    values (
      v_order_id,
      v_product_id,
      v_item->>'title',
      (v_item->>'unit_price')::numeric,
      v_qty,
      (v_item->>'line_total')::numeric,
      v_item->>'image_url'
    );
  end loop;

  return v_order_id;
end;
$function$;

revoke all on function public.place_order_for_customer(text, text, text, text, numeric, numeric, numeric, text, jsonb) from public, anon;
grant execute on function public.place_order_for_customer(text, text, text, text, numeric, numeric, numeric, text, jsonb) to authenticated;

create or replace function public.apply_loyalty_order_status()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_points integer;
begin
  if new.customer_user_id is null or old.status is not distinct from new.status then
    return new;
  end if;

  if new.status = 'delivered' then
    -- Current earning rule: one point per whole shekel spent on pieces;
    -- shipping is excluded. The point-to-discount value is intentionally unset.
    v_points := floor(greatest(coalesce(new.subtotal, 0), 0))::integer;
    if v_points > 0 then
      insert into public.loyalty_transactions (customer_id, order_id, entry_type, points_delta)
      values (new.customer_user_id, new.id, 'earned', v_points)
      on conflict (order_id, entry_type) do nothing;
    end if;
  elsif new.status = 'cancelled' and old.status = 'delivered' then
    select points_delta into v_points
    from public.loyalty_transactions
    where order_id = new.id and entry_type = 'earned';

    if v_points is not null and v_points > 0 then
      insert into public.loyalty_transactions (customer_id, order_id, entry_type, points_delta)
      values (new.customer_user_id, new.id, 'reversed', -v_points)
      on conflict (order_id, entry_type) do nothing;
    end if;
  end if;

  return new;
end;
$function$;

drop trigger if exists orders_award_loyalty_points on public.orders;
create trigger orders_award_loyalty_points
  after update of status on public.orders
  for each row execute function public.apply_loyalty_order_status();

revoke all on function public.apply_loyalty_order_status() from public, anon, authenticated;
