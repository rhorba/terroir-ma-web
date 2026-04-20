'use server';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-server';
import { randomUUID } from 'crypto';

export async function verifyCooperative(id: string): Promise<void> {
  await apiFetch(`/api/v1/cooperatives/${id}/verify`, {
    method: 'PATCH',
    headers: { 'x-correlation-id': randomUUID() },
    body: JSON.stringify({}),
  });
  revalidatePath('/[locale]/(super-admin)/super-admin/cooperatives', 'page');
}

export async function rejectCooperative(id: string, reason: string): Promise<void> {
  await apiFetch(`/api/v1/cooperatives/${id}/deactivate`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  });
  revalidatePath('/[locale]/(super-admin)/super-admin/cooperatives', 'page');
}
