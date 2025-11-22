-- Enable UUID generation
create extension if not exists pgcrypto;

-- Enums for operation type and status
do $$ begin
  if not exists (select 1 from pg_type where typname = 'operation_type') then
    create type operation_type as enum ('INCOMING','OUTGOING','INTERNAL','ADJUSTMENT');
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_type where typname = 'operation_status') then
    create type operation_status as enum ('DRAFT','WAITING','READY','DONE','CANCELED');
  end if;
end $$;

-- Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text not null unique,
  cost numeric not null,
  category text,
  uom text,
  min_stock_level integer not null default 0,
  current_stock integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Operations table
create table if not exists operations (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  type operation_type not null,
  partner text not null,
  schedule_date timestamptz not null,
  source_location text not null,
  destination_location text not null,
  status operation_status not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Operation items table
create table if not exists operation_items (
  id uuid primary key default gen_random_uuid(),
  operation_id uuid not null references operations(id) on delete cascade,
  product_id uuid not null references products(id),
  qty numeric not null,
  done_qty numeric not null default 0
);

-- Stock moves table
create table if not exists stock_moves (
  id uuid primary key default gen_random_uuid(),
  date timestamptz not null default now(),
  product_id uuid not null references products(id),
  qty numeric not null,
  from_location text not null,
  to_location text not null,
  reference_doc text not null,
  status operation_status not null,
  created_at timestamptz not null default now()
);

-- Sequences for operation references per type
create sequence if not exists seq_incoming start 1 increment 1;
create sequence if not exists seq_outgoing start 1 increment 1;
create sequence if not exists seq_internal start 1 increment 1;

-- Function to generate formatted reference
create or replace function generate_operation_reference(op_type operation_type)
returns text
language plpgsql as $$
declare
  n bigint;
  prefix text;
begin
  if op_type = 'INCOMING' then
    prefix := 'WH/IN';
    n := nextval('seq_incoming');
  elsif op_type = 'OUTGOING' then
    prefix := 'WH/OUT';
    n := nextval('seq_outgoing');
  elsif op_type = 'ADJUSTMENT' then
    prefix := 'WH/ADJ';
    n := nextval('seq_internal');
  else
    prefix := 'WH/INT';
    n := nextval('seq_internal');
  end if;
  return prefix || '/' || lpad(n::text, 4, '0');
end;
$$;

-- Trigger to set reference on insert when missing
create or replace function set_operation_reference()
returns trigger
language plpgsql as $$
begin
  if new.reference is null then
    new.reference := generate_operation_reference(new.type);
  end if;
  return new;
end;
$$;

drop trigger if exists operations_reference_bi on operations;
create trigger operations_reference_bi
before insert on operations
for each row execute procedure set_operation_reference();

-- Warehouses and locations (basic)
create table if not exists warehouses (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid references warehouses(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

-- Optional columns in case products table already exists
do $$ begin
  begin
    alter table products add column if not exists category text;
  exception when others then null;
  end;
  begin
    alter table products add column if not exists uom text;
  exception when others then null;
  end;
end $$;