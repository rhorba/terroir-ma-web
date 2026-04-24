'use server';

import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

export async function validateDocument(id: string): Promise<void> {
  await apiFetch(`/api/v1/export-documents/${id}/validate`, { method: 'POST' });
  revalidatePath(`/fr/customs-agent/export-documents/${id}`);
}
