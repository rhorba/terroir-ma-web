'use server';
import { apiFetch } from '@/lib/api-server';
import { getAccessToken } from '@/lib/auth-utils';
import { revalidatePath } from 'next/cache';

type RecordResultPayload = {
  testValues: Record<string, number | string>;
  technicianName?: string;
  laboratoryName?: string;
};

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function recordResult(labTestId: string, payload: RecordResultPayload): Promise<void> {
  await apiFetch(`/api/v1/lab-tests/${labTestId}/results`, {
    method: 'POST',
    body: JSON.stringify({ labTestId, ...payload }),
  });
  revalidatePath('/fr/lab-technician/queue');
}

export async function uploadReport(labTestId: string, formData: FormData): Promise<void> {
  const token = await getAccessToken();
  const file = formData.get('file') as File;
  if (!file || file.size === 0) throw new Error('Fichier requis');

  const body = new FormData();
  body.append('file', file);

  const res = await fetch(`${BASE}/api/v1/lab-tests/${labTestId}/report`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token ?? ''}` },
    body,
  });
  if (!res.ok) throw new Error(`Upload échoué: ${res.status}`);
  revalidatePath(`/fr/lab-technician/queue/${labTestId}`);
}
