'use server';

import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

export async function createBatch(formData: {
  productTypeCode: string;
  harvestIds: string[];
  totalQuantityKg: number;
  processingDate: string;
}): Promise<{ error?: string }> {
  try {
    await apiFetch('/api/v1/batches', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    revalidatePath('/fr/cooperative-member/batches');
    revalidatePath('/fr/cooperative-member');
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erreur serveur' };
  }
}
