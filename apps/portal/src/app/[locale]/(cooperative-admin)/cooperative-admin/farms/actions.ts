'use server';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';

type MapFarmInput = {
  name: string;
  regionCode: string;
  commune?: string;
  areaHectares: number;
  cropTypes: string[];
  latitude?: number;
  longitude?: number;
};

export async function mapFarm(input: MapFarmInput): Promise<void> {
  const cooperativeId = await getCooperativeId();
  if (!cooperativeId) throw new Error('No cooperative in session');
  await apiFetch(`/api/v1/cooperatives/${cooperativeId}/farms`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  revalidatePath('/[locale]/(cooperative-admin)/cooperative-admin/farms', 'page');
}
