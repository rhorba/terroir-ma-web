'use server';

import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

export async function grantCertification(
  id: string,
  validFrom: string,
  validUntil: string,
): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/v1/certifications/${id}/grant`, {
      method: 'PATCH',
      body: JSON.stringify({ validFrom, validUntil }),
    });
    revalidatePath('/fr/certification-body/certifications');
    revalidatePath(`/fr/certification-body/certifications/${id}`);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erreur serveur' };
  }
}

export async function denyCertification(
  id: string,
  reason: string,
): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/v1/certifications/${id}/deny`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
    revalidatePath('/fr/certification-body/certifications');
    revalidatePath(`/fr/certification-body/certifications/${id}`);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erreur serveur' };
  }
}

export async function startReview(
  id: string,
  remarks?: string,
): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/v1/certifications/${id}/start-review`, {
      method: 'POST',
      body: JSON.stringify({ remarks }),
    });
    revalidatePath(`/fr/certification-body/certifications/${id}`);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erreur serveur' };
  }
}

export async function startFinalReview(
  id: string,
): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/v1/certifications/${id}/start-final-review`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    revalidatePath(`/fr/certification-body/certifications/${id}`);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erreur serveur' };
  }
}

export async function revokeCertification(
  id: string,
  reason: string,
): Promise<{ error?: string }> {
  try {
    await apiFetch(`/api/v1/certifications/${id}/revoke`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
    revalidatePath('/fr/certification-body/certifications');
    revalidatePath(`/fr/certification-body/certifications/${id}`);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Erreur serveur' };
  }
}
