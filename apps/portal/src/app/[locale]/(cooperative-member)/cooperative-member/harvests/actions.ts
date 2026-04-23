'use server';

import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

export async function logHarvest(formData: {
  farmId: string;
  productTypeCode: string;
  quantityKg: number;
  harvestDate: string;
  campaignYear: string;
  method: string;
}): Promise<{ error?: string }> {
  try {
    await apiFetch('/api/v1/harvests', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    revalidatePath('/fr/cooperative-member/harvests');
    revalidatePath('/fr/cooperative-member');
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erreur serveur' };
  }
}
