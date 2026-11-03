import type { StudentClient, VisaApplication } from './storageService';

const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

async function call<T>(table: string, token: string, method = 'GET', query = 'select=*', body?: unknown): Promise<T> {
  if (!url || !key) throw new Error('Supabase URL or public key is not configured.');
  const response = await fetch(url + '/rest/v1/' + table + '?' + query, {
    method,
    headers: { apikey: key, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json', ...(method === 'GET' ? {} : { Prefer: 'return=representation' }) },
    ...(body === undefined ? {} : { body: JSON.stringify(body) })
  });
  if (!response.ok) throw new Error('CRM request failed (' + response.status + '): ' + await response.text());
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const date = (v?: string) => v ? new Date(v).toLocaleDateString('en-GB') : '';
const client = (r: any): StudentClient => ({ id: r.id, name: r.name, email: r.email || '', phone: r.phone || '', targetCountry: r.target_country || '', targetUniversity: r.target_university || undefined, currentStage: r.current_stage, assignedCounselor: r.assigned_counselor || '', notes: r.notes || '', createdAt: date(r.created_at), updatedAt: date(r.updated_at) });
const visa = (r: any): VisaApplication => ({ id: r.id, studentName: r.student_name, country: r.country, visaType: r.visa_type, intakeSeason: r.intake_season || '', applicationStatus: r.application_status, casI20Number: r.cas_i20_number || undefined, deadline: r.deadline || '', lastUpdated: date(r.last_updated) });

export const adminCrmService = {
  async clients(token: string) { return (await call<any[]>('student_clients', token, 'GET', 'select=*&order=created_at.desc')).map(client); },
  async addClient(token: string, item: Omit<StudentClient, 'id' | 'createdAt' | 'updatedAt'>) {
    const rows = await call<any[]>('student_clients', token, 'POST', 'select=*', { name: item.name, email: item.email, phone: item.phone, target_country: item.targetCountry, target_university: item.targetUniversity || null, current_stage: item.currentStage, assigned_counselor: item.assignedCounselor, notes: item.notes });
    return client(rows[0]);
  },
  async updateClient(token: string, id: string, stage: StudentClient['currentStage']) {
    const rows = await call<any[]>('student_clients', token, 'PATCH', 'id=eq.' + encodeURIComponent(id) + '&select=*', { current_stage: stage, updated_at: new Date().toISOString() });
    if (!rows[0]) throw new Error('Student record not found or access denied.');
    return client(rows[0]);
  },
  async deleteClient(token: string, id: string) { await call('student_clients', token, 'DELETE', 'id=eq.' + encodeURIComponent(id)); },
  async visas(token: string) { return (await call<any[]>('visa_applications', token, 'GET', 'select=*&order=created_at.desc')).map(visa); },
  async addVisa(token: string, item: Omit<VisaApplication, 'id' | 'lastUpdated'>) {
    const rows = await call<any[]>('visa_applications', token, 'POST', 'select=*', { student_name: item.studentName, country: item.country, visa_type: item.visaType, intake_season: item.intakeSeason, application_status: item.applicationStatus, cas_i20_number: item.casI20Number || null, deadline: item.deadline, last_updated: new Date().toISOString() });
    return visa(rows[0]);
  },
  async updateVisa(token: string, id: string, status: VisaApplication['applicationStatus']) {
    const rows = await call<any[]>('visa_applications', token, 'PATCH', 'id=eq.' + encodeURIComponent(id) + '&select=*', { application_status: status, last_updated: new Date().toISOString() });
    if (!rows[0]) throw new Error('Visa record not found or access denied.');
    return visa(rows[0]);
  },
  async deleteVisa(token: string, id: string) { await call('visa_applications', token, 'DELETE', 'id=eq.' + encodeURIComponent(id)); }
};
