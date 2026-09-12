-- 3X V3.1 reference schema. PostgreSQL. Use bigint/numeric base units; never float for accounting.

create table users (
  id uuid primary key,
  telegram_id text unique,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default now()
);

create table agents (
  id uuid primary key,
  owner_user_id uuid not null references users(id),
  is_primary boolean not null default false,
  environment text not null check (environment in ('simulation','testnet','mainnet')),
  name text not null,
  avatar_key text,
  generation smallint,
  level text not null default '1X_HATCHLING',
  state text not null default 'READY',
  reputation numeric(12,6) not null default 0,
  created_at timestamptz not null default now()
);
create unique index one_primary_agent_per_user on agents(owner_user_id) where is_primary;

create table agent_wallets (
  agent_id uuid primary key references agents(id),
  network text not null,
  owner_address text,
  agentic_wallet_address text,
  operator_key_ref text,
  status text not null,
  activated_at timestamptz
);

create table generation_entitlements (
  agent_id uuid primary key references agents(id),
  generation smallint not null,
  activation_sequence bigint not null unique,
  seed_entitlement numeric(40,0) not null,
  growth_entitlement numeric(40,0) not null,
  parameter_version text not null,
  created_at timestamptz not null default now()
);

create table economic_accounts (
  id uuid primary key,
  agent_id uuid references agents(id),
  owner_user_id uuid references users(id),
  account_type text not null,
  asset text not null,
  environment text not null,
  created_at timestamptz not null default now(),
  unique(agent_id, owner_user_id, account_type, asset, environment)
);

create table economic_events (
  id uuid primary key,
  agent_id uuid references agents(id),
  event_type text not null,
  reason_code text not null,
  environment text not null,
  qualified boolean not null default false,
  qualification_reason text,
  external_value_usd numeric(30,8),
  related_party_flag boolean not null default false,
  realized boolean not null default true,
  idempotency_key text not null unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table ledger_entries (
  id bigserial primary key,
  economic_event_id uuid not null references economic_events(id),
  debit_account_id uuid not null references economic_accounts(id),
  credit_account_id uuid not null references economic_accounts(id),
  asset text not null,
  amount_base_units numeric(40,0) not null check (amount_base_units > 0),
  created_at timestamptz not null default now()
);

create table growth_entitlements (
  agent_id uuid primary key references agents(id),
  seed_basis numeric(40,0) not null,
  max_growth_reward numeric(40,0) not null,
  current_stage text not null default '1X',
  runway_end timestamptz,
  parameter_version text not null,
  updated_at timestamptz not null default now()
);

create table growth_claims (
  id uuid primary key,
  agent_id uuid not null references agents(id),
  stage text not null,
  amount_base_units numeric(40,0) not null,
  nonce text not null unique,
  status text not null,
  tx_hash text,
  created_at timestamptz not null default now(),
  unique(agent_id, stage)
);

create table skill_definitions (
  id text not null,
  version text not null,
  name text not null,
  tier text not null,
  manifest jsonb not null,
  code_hash text,
  prompt_hash text,
  certification_status text not null,
  created_at timestamptz not null default now(),
  primary key(id, version)
);

create table skill_instances (
  id uuid primary key,
  skill_id text not null,
  skill_version text not null,
  owner_user_id uuid not null references users(id),
  bound_agent_id uuid references agents(id),
  state text not null,
  acquired_at timestamptz not null default now(),
  foreign key(skill_id, skill_version) references skill_definitions(id, version)
);

create table energy_accounts (
  agent_id uuid primary key references agents(id),
  base_units numeric(30,6) not null default 0,
  premium_units numeric(30,6) not null default 0,
  premium_expiry timestamptz,
  updated_at timestamptz not null default now()
);

create table energy_transactions (
  id uuid primary key,
  agent_id uuid not null references agents(id),
  type text not null,
  units numeric(30,6) not null,
  cost_3x_base_units numeric(40,0),
  external_cost_usd numeric(30,8),
  reason_code text not null,
  trace_id uuid,
  created_at timestamptz not null default now()
);

create table opportunities (
  id uuid primary key,
  type text not null,
  source text not null,
  environment text not null,
  expected_gross_value_usd numeric(30,8),
  capacity jsonb,
  requirements jsonb,
  risk_metadata jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table decision_traces (
  id uuid primary key,
  agent_id uuid not null references agents(id),
  opportunity_id uuid references opportunities(id),
  environment text not null,
  status text not null,
  expected_net_value_usd numeric(30,8),
  premium_energy_budget numeric(30,6),
  result_code text,
  share_summary jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table trace_steps (
  id uuid primary key,
  trace_id uuid not null references decision_traces(id) on delete cascade,
  seq integer not null,
  circuit_id text not null,
  step_type text not null,
  state text not null,
  energy_cost numeric(30,6) not null default 0,
  summary text,
  model_call_ref text,
  policy_version text,
  started_at timestamptz,
  ended_at timestamptz,
  unique(trace_id, seq)
);

create table learning_updates (
  id uuid primary key,
  agent_id uuid not null references agents(id),
  parameter_key text not null,
  before_value jsonb not null,
  after_value jsonb not null,
  evidence jsonb not null,
  benchmark_result jsonb,
  rollback_token text not null,
  created_at timestamptz not null default now()
);

create table execution_intents (
  id uuid primary key,
  agent_id uuid not null references agents(id),
  trace_id uuid references decision_traces(id),
  intent_type text not null,
  payload jsonb not null,
  intent_hash text not null unique,
  risk_status text not null,
  risk_policy_version text,
  state text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table executions (
  id uuid primary key,
  intent_id uuid not null references execution_intents(id),
  tx_hash text,
  state text not null,
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table skill_benchmarks (
  id uuid primary key,
  skill_id text not null,
  skill_version text not null,
  benchmark_version text not null,
  results jsonb not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);

create index economic_events_agent_time on economic_events(agent_id, created_at desc);
create index traces_agent_time on decision_traces(agent_id, created_at desc);
create index trace_steps_trace_seq on trace_steps(trace_id, seq);
