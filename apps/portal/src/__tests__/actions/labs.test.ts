import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import {
  accreditLab,
  revokeLab,
  createLab,
} from '@/app/[locale]/(super-admin)/super-admin/labs/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('accreditLab', () => {
  it('calls POST /api/v1/labs/:id/accredit', async () => {
    await accreditLab('lab-001');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/labs/lab-001/accredit',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('revalidates labs list page', async () => {
    await accreditLab('lab-001');
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Not found'));
    await expect(accreditLab('bad-lab')).rejects.toThrow('Not found');
  });
});

describe('revokeLab', () => {
  it('calls POST /api/v1/labs/:id/revoke', async () => {
    await revokeLab('lab-002');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/labs/lab-002/revoke',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('revalidates labs list page', async () => {
    await revokeLab('lab-002');
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Already revoked'));
    await expect(revokeLab('lab-002')).rejects.toThrow('Already revoked');
  });
});

describe('createLab', () => {
  it('calls POST /api/v1/labs with name', async () => {
    await createLab('Laboratoire Rabat');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/labs',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('includes name in body', async () => {
    await createLab('Laboratoire Casablanca');
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.name).toBe('Laboratoire Casablanca');
  });

  it('includes onssaAccreditationNumber when provided', async () => {
    await createLab('Lab Fes', 'ONSSA/LAB/2025/001');
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.onssaAccreditationNumber).toBe('ONSSA/LAB/2025/001');
  });

  it('sets onssaAccreditationNumber to undefined when empty string passed', async () => {
    await createLab('Lab Agadir', '');
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.onssaAccreditationNumber).toBeUndefined();
  });

  it('revalidates labs list page', async () => {
    await createLab('New Lab');
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Duplicate name'));
    await expect(createLab('Duplicate')).rejects.toThrow('Duplicate name');
  });
});
