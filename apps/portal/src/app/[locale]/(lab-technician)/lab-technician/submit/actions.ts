'use server';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

type SubmitTestPayload = {
  batchId: string;
  laboratoryId?: string;
  expectedResultDate?: string;
};

export async function submitTest(payload: SubmitTestPayload): Promise<void> {
  await apiFetch('/api/v1/lab-tests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  revalidatePath('/fr/lab-technician/queue');
}
