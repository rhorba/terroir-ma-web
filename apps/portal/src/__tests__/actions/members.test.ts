import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth-utils', () => ({ getCooperativeId: vi.fn() }));

import { addMember } from '@/app/[locale]/(cooperative-admin)/cooperative-admin/members/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';
import { getCooperativeId } from '@/lib/auth-utils';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);
const mockGetCooperativeId = vi.mocked(getCooperativeId);

const baseMember = {
  fullName: 'Fatima Zahra',
  cin: 'AB123456',
  phone: '+212612345678',
  role: 'cooperative-member',
};

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
  mockGetCooperativeId.mockResolvedValue('coop-uuid-xyz');
});

describe('addMember', () => {
  it('calls POST /api/v1/cooperatives/:coopId/members', async () => {
    await addMember(baseMember);
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/cooperatives/coop-uuid-xyz/members',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('passes member data in body', async () => {
    await addMember(baseMember);
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.fullName).toBe('Fatima Zahra');
    expect(body.cin).toBe('AB123456');
    expect(body.role).toBe('cooperative-member');
  });

  it('revalidates members page', async () => {
    await addMember(baseMember);
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when cooperativeId is null', async () => {
    mockGetCooperativeId.mockResolvedValue(null);
    await expect(addMember(baseMember)).rejects.toThrow('No cooperative in session');
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('duplicate CIN'));
    await expect(addMember(baseMember)).rejects.toThrow('duplicate CIN');
  });

  it('handles optional fields (fullNameAr, email)', async () => {
    await addMember({ ...baseMember, fullNameAr: 'فاطمة الزهراء', email: 'f@coop.ma' });
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.fullNameAr).toBe('فاطمة الزهراء');
    expect(body.email).toBe('f@coop.ma');
  });
});
