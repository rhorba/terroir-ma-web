'use server';
import { revalidatePath } from 'next/cache';
import { apiFetch } from '@/lib/api-server';
import { getCooperativeId } from '@/lib/auth-utils';

type AddMemberInput = {
  fullName: string;
  fullNameAr?: string;
  cin: string;
  phone: string;
  email?: string;
  role: string;
};

export async function addMember(input: AddMemberInput): Promise<void> {
  const cooperativeId = await getCooperativeId();
  if (!cooperativeId) throw new Error('No cooperative in session');
  await apiFetch(`/api/v1/cooperatives/${cooperativeId}/members`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  revalidatePath('/[locale]/(cooperative-admin)/cooperative-admin/members', 'page');
}
