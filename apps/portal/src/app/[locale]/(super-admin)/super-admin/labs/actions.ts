'use server';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-server';

export async function accreditLab(id: string): Promise<void> {
  await apiFetch(`/api/v1/labs/${id}/accredit`, { method: 'POST', body: '{}' });
  revalidatePath('/[locale]/(super-admin)/super-admin/labs', 'page');
}

export async function revokeLab(id: string): Promise<void> {
  await apiFetch(`/api/v1/labs/${id}/revoke`, { method: 'POST', body: '{}' });
  revalidatePath('/[locale]/(super-admin)/super-admin/labs', 'page');
}

export async function createLab(
  name: string,
  onssaAccreditationNumber?: string,
): Promise<void> {
  await apiFetch('/api/v1/labs', {
    method: 'POST',
    body: JSON.stringify({
      name,
      onssaAccreditationNumber: onssaAccreditationNumber || undefined,
    }),
  });
  revalidatePath('/[locale]/(super-admin)/super-admin/labs', 'page');
}
