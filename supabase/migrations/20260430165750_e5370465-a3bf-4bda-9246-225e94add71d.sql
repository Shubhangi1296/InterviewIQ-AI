-- =========================================
-- PROFILES
-- =========================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  field_category text,
  selected_job_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- =========================================
-- INTERVIEW SESSIONS
-- =========================================
create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  field_category text,
  interview_type text not null,
  difficulty_level text not null,
  total_score numeric,
  session_date timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index idx_sessions_user on public.interview_sessions(user_id);
create index idx_sessions_date on public.interview_sessions(session_date desc);

alter table public.interview_sessions enable row level security;

create policy "Users view own sessions"
  on public.interview_sessions for select using (auth.uid() = user_id);
create policy "Users insert own sessions"
  on public.interview_sessions for insert with check (auth.uid() = user_id);
create policy "Users update own sessions"
  on public.interview_sessions for update using (auth.uid() = user_id);
create policy "Users delete own sessions"
  on public.interview_sessions for delete using (auth.uid() = user_id);

-- =========================================
-- QUESTIONS
-- =========================================
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.interview_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_text text not null,
  question_type text,
  difficulty_level text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index idx_questions_session on public.questions(session_id);
create index idx_questions_user on public.questions(user_id);

alter table public.questions enable row level security;

create policy "Users view own questions"
  on public.questions for select using (auth.uid() = user_id);
create policy "Users insert own questions"
  on public.questions for insert with check (auth.uid() = user_id);
create policy "Users update own questions"
  on public.questions for update using (auth.uid() = user_id);
create policy "Users delete own questions"
  on public.questions for delete using (auth.uid() = user_id);

-- =========================================
-- RESPONSES
-- =========================================
create table public.responses (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  session_id uuid not null references public.interview_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_answer text,
  ai_score numeric,
  feedback text,
  strengths text[],
  weaknesses text[],
  created_at timestamptz not null default now()
);

create index idx_responses_question on public.responses(question_id);
create index idx_responses_session on public.responses(session_id);
create index idx_responses_user on public.responses(user_id);

alter table public.responses enable row level security;

create policy "Users view own responses"
  on public.responses for select using (auth.uid() = user_id);
create policy "Users insert own responses"
  on public.responses for insert with check (auth.uid() = user_id);
create policy "Users update own responses"
  on public.responses for update using (auth.uid() = user_id);
create policy "Users delete own responses"
  on public.responses for delete using (auth.uid() = user_id);

-- =========================================
-- PERFORMANCE TRACKING
-- =========================================
create table public.performance_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  average_score numeric default 0,
  total_sessions int default 0,
  strongest_area text,
  weakest_area text,
  progress_status text default 'just_started',
  updated_at timestamptz not null default now()
);

create index idx_perf_user on public.performance_tracking(user_id);

alter table public.performance_tracking enable row level security;

create policy "Users view own performance"
  on public.performance_tracking for select using (auth.uid() = user_id);
create policy "Users insert own performance"
  on public.performance_tracking for insert with check (auth.uid() = user_id);
create policy "Users update own performance"
  on public.performance_tracking for update using (auth.uid() = user_id);
create policy "Users delete own performance"
  on public.performance_tracking for delete using (auth.uid() = user_id);

-- =========================================
-- updated_at trigger
-- =========================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_perf_updated
before update on public.performance_tracking
for each row execute function public.set_updated_at();

-- =========================================
-- Auto-create profile + performance row on signup
-- =========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email
  );

  insert into public.performance_tracking (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();