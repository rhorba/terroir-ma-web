import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import {
  verifyCooperative,
  rejectCooperative,
} from '@/app/[locale]/(super-admin)/super-admin/cooperatives/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('verifyCooperative', () => {
  it('calls PATCH /api/v1/cooperatives/:id/verify', async () => {
    await verifyCooperative('coop-123');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/cooperatives/coop-123/verify',
      expect.objectContaining({ method: 'PATCH' }),
    );
  });

  it('sends a correlation-id header', async () => {
    await verifyCooperative('coop-123');
    const headers = (mockApiFetch.mock.calls[0][1] as RequestInit)
      .headers as Record<string, string>;
    expect(headers['x-correlation-id']).toBeDefined();
    expect(typeof headers['x-correlation-id']).toBe('string');
    expect(headers['x-correlation-id'].length).toBeGreaterThan(0);
  });

  it('revalidates cooperatives page on success', async () => {
    await verifyCooperative('coop-123');
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Not found'));
    await expect(verifyCooperative('bad-id')).rejects.toThrow('Not found');
  });
});

describe('rejectCooperative', () => {
  it('calls PUT /api/v1/cooperatives/:id/deactivate with reason', async () => {
    await rejectCooperative('coop-456', 'Documents manquants');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/cooperatives/coop-456/deactivate',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ reason: 'Documents manquants' }),
      }),
    );
  });

  it('revalidates cooperatives page on success', async () => {
    await rejectCooperative('coop-456', 'raison');
    expect(mockRevalidatePath).toHaveBeenCalledOnce();
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Server error'));
    await expect(rejectCooperative('coop-456', 'reason')).rejects.toThrow('Server error');
  });

  it('passes empty reason string correctly', async () => {
    await rejectCooperative('coop-789', '');
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.reason).toBe('');
  });
});
