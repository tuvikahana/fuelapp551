-- FuelApp Database Setup
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard

-- Users table
create table if not exists users (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  username text unique not null,
  password_hash text not null,
  role text not null default 'field_user',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Vehicle types table
create table if not exists vehicle_types (
  id text primary key default gen_random_uuid()::text,
  name text unique not null,
  fuel_tank_capacity_liters float not null,
  estimated_km_per_liter float not null,
  fuel_band_threshold_75 float not null default 75,
  fuel_band_threshold_50 float not null default 50,
  fuel_band_threshold_25 float not null default 25,
  fuel_band_threshold_10 float not null default 10,
  action_threshold_plan_refuel float not null default 35,
  action_threshold_refuel_soon float not null default 20,
  action_threshold_refuel_now float not null default 10,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Vehicles table
create table if not exists vehicles (
  id text primary key default gen_random_uuid()::text,
  vehicle_number text unique not null,
  vehicle_type_id text not null references vehicle_types(id),
  nickname text,
  notes text,
  last_full_refuel_odometer float,
  latest_confirmed_odometer float,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Odometer readings table
create table if not exists odometer_readings (
  id text primary key default gen_random_uuid()::text,
  vehicle_id text not null references vehicles(id),
  user_id text references users(id),
  input_method text not null,
  ocr_value float,
  confirmed_value float not null,
  image_url text,
  created_at timestamptz default now()
);

-- Refuel events table
create table if not exists refuel_events (
  id text primary key default gen_random_uuid()::text,
  vehicle_id text not null references vehicles(id),
  user_id text references users(id),
  event_type text not null default 'full_refuel',
  odometer_at_refuel float not null,
  created_at timestamptz default now()
);

-- Auto-update updated_at on vehicles and vehicle_types
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger vehicles_updated_at
  before update on vehicles
  for each row execute function update_updated_at();

create or replace trigger vehicle_types_updated_at
  before update on vehicle_types
  for each row execute function update_updated_at();

-- Disable RLS (no per-user auth in this app)
alter table users disable row level security;
alter table vehicle_types disable row level security;
alter table vehicles disable row level security;
alter table odometer_readings disable row level security;
alter table refuel_events disable row level security;

-- Enable Realtime for relevant tables
alter publication supabase_realtime add table vehicles;
alter publication supabase_realtime add table odometer_readings;
alter publication supabase_realtime add table refuel_events;

-- Seed: vehicle type
insert into vehicle_types (name, fuel_tank_capacity_liters, estimated_km_per_liter)
values ('האמר צבאי', 95, 4)
on conflict (name) do nothing;

-- Seed: sample vehicles
insert into vehicles (vehicle_number, vehicle_type_id, nickname)
select '1001', id, 'סיור א' from vehicle_types where name = 'האמר צבאי'
on conflict (vehicle_number) do nothing;

insert into vehicles (vehicle_number, vehicle_type_id, nickname)
select '1002', id, 'סיור ב' from vehicle_types where name = 'האמר צבאי'
on conflict (vehicle_number) do nothing;

insert into vehicles (vehicle_number, vehicle_type_id, nickname)
select '1003', id, 'פיקוד' from vehicle_types where name = 'האמר צבאי'
on conflict (vehicle_number) do nothing;
