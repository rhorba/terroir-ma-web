'use server';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-server';

export async function createProductType(formData: FormData): Promise<void> {
  const body = {
    code: formData.get('code') as string,
    nameFr: formData.get('nameFr') as string,
    nameAr: formData.get('nameAr') as string,
    nameZgh: (formData.get('nameZgh') as string) || undefined,
    certificationType: formData.get('certificationType') as 'IGP' | 'AOP' | 'LA',
    regionCode: formData.get('regionCode') as string,
    labTestParameters: [],
    hsCode: (formData.get('hsCode') as string) || undefined,
    onssaCategory: (formData.get('onssaCategory') as string) || undefined,
  };
  await apiFetch('/api/v1/product-types', { method: 'POST', body: JSON.stringify(body) });
  revalidatePath('/[locale]/(super-admin)/super-admin/specifications', 'page');
}

export async function updateProductType(id: string, formData: FormData): Promise<void> {
  const body = {
    nameFr: formData.get('nameFr') as string,
    nameAr: formData.get('nameAr') as string,
    nameZgh: (formData.get('nameZgh') as string) || undefined,
    hsCode: (formData.get('hsCode') as string) || undefined,
    validityDays: formData.get('validityDays')
      ? Number(formData.get('validityDays'))
      : undefined,
  };
  await apiFetch(`/api/v1/product-types/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  revalidatePath('/[locale]/(super-admin)/super-admin/specifications', 'page');
}

export async function deactivateProductType(id: string): Promise<void> {
  await apiFetch(`/api/v1/product-types/${id}/deactivate`, { method: 'DELETE' });
  revalidatePath('/[locale]/(super-admin)/super-admin/specifications', 'page');
}
