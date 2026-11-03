-- NextBorder Admin CRM tables
-- Prepared on feature branch only. Review and apply to a non-production database first.
-- Admin-only access is enforced with the existing public.has_role(uuid, app_role) helper.

create table if not exists public.student_clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  phone text not null default '',
  target_country text not null default '',
  target_university text,
  current_stage text not null default 'Initial Inquiry'
    check (current_stage in ('Initial Inquiry','IELTS Preparation','Document Review','Visa Processing','Visa Approved')),
  assigned_counselor text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visa_applications (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  country text not null
    check (country in ('USA','Canada','United Kingdom','Australia','Schengen')),
  visa_type text not null
    check (visa_type in ('Student (F1 / Tier 4 / Study Permit)','Tourist / Visit','Work Permit')),
  intake_season text not null default '',
  application_status text not null default 'Documents Gathering'
    check (application_status in ('Documents Gathering','SOP / Essay Review','Application Submitted','Biometrics / Interview','Visa Granted')),
  cas_i20_number text,
  deadline text not null default '',
  last_updated timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.student_clients enable row level security;
alter table public.visa_applications enable row level security;

drop policy if exists "Admins manage student clients" on public.student_clients;
create policy "Admins manage student clients"
on public.student_clients
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'::app_role))
with check (public.has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins manage visa applications" on public.visa_applications;
create policy "Admins manage visa applications"
on public.visa_applications
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'::app_role))
with check (public.has_role(auth.uid(), 'admin'::app_role));

grant select, insert, update, delete on public.student_clients to authenticated;
grant select, insert, update, delete on public.visa_applications to authenticated;

create index if not exists student_clients_created_at_idx
  on public.student_clients (created_at desc);
create index if not exists student_clients_current_stage_idx
  on public.student_clients (current_stage);
create index if not exists visa_applications_created_at_idx
  on public.visa_applications (created_at desc);
create index if not exists visa_applications_country_idx
  on public.visa_applications (country);
create index if not exists visa_applications_application_status_idx
  on public.visa_applications (application_status);
