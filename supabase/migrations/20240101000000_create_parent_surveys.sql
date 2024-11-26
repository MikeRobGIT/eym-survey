-- Create the parent_surveys table
create table public.parent_surveys (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references auth.users(id) on delete cascade not null,
  child_name text not null,
  grade text not null,
  subjects text[] not null,
  overall_experience text not null,
  communication_satisfaction text not null,
  frequency text not null,
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Add a unique constraint to prevent multiple submissions for the same child
  unique(parent_id, child_name)
);

-- Set up RLS policies
alter table public.parent_surveys enable row level security;

create policy "Users can view their own submissions"
  on public.parent_surveys for select
  using (auth.uid() = parent_id);

create policy "Users can insert their own submissions"
  on public.parent_surveys for insert
  with check (auth.uid() = parent_id);

create policy "Users can update their own submissions"
  on public.parent_surveys for update
  using (auth.uid() = parent_id);

create policy "Users can delete their own submissions"
  on public.parent_surveys for delete
  using (auth.uid() = parent_id);

-- Add these RLS policies after the table creation

-- Enable RLS
alter table parent_surveys enable row level security;

-- Create policies
create policy "Users can create their own surveys"
  on parent_surveys for insert
  with check (auth.uid() = parent_id);

create policy "Users can view their own surveys"
  on parent_surveys for select
  using (auth.uid() = parent_id);

create policy "Users can update their own surveys"
  on parent_surveys for update
  using (auth.uid() = parent_id);

create policy "Users can delete their own surveys"
  on parent_surveys for delete
  using (auth.uid() = parent_id);

-- Create indexes
create index parent_surveys_parent_id_idx on public.parent_surveys(parent_id);
create index parent_surveys_created_at_idx on public.parent_surveys(created_at);