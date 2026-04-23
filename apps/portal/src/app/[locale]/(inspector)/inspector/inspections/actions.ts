'use server';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

type ReportPayload = {
  passed: boolean;
  reportSummary: string;
  detailedObservations?: string;
  nonConformities?: string;
};

export async function fileReport(inspectionId: string, payload: ReportPayload): Promise<void> {
  await apiFetch(`/api/v1/inspections/${inspectionId}/report`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  revalidatePath('/fr/inspector/inspections');
}
