import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { submitTest } from '@/app/[locale]/(lab-technician)/lab-technician/submit/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('submitTest', () => {
  it('calls POST /api/v1/lab-tests with batch ID', async () => {
    await submitTest({ batchId: 'batch-123' });
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/lab-tests',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('includes batchId in body', async () => {
    await submitTest({ batchId: 'batch-xyz' });
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.batchId).toBe('batch-xyz');
  });

  it('includes optional laboratoryId when provided', async () => {
    await submitTest({ batchId: 'b-1', laboratoryId: 'lab-001' });
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.laboratoryId).toBe('lab-001');
  });

  it('includes optional expectedResultDate when provided', async () => {
    await submitTest({ batchId: 'b-2', expectedResultDate: '2025-12-01' });
    const body = JSON.parse(
      (mockApiFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.expectedResultDate).toBe('2025-12-01');
  });

  it('revalidates lab queue path', async () => {
    await submitTest({ batchId: 'b-3' });
    expect(mockRevalidatePath).toHaveBeenCalledWith('/fr/lab-technician/queue');
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Batch not found'));
    await expect(submitTest({ batchId: 'bad-batch' })).rejects.toThrow('Batch not found');
  });
});
