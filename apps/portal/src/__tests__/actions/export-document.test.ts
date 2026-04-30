import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/api-server', () => ({ apiFetch: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

import { validateDocument } from '@/app/[locale]/(customs-agent)/customs-agent/export-documents/[id]/actions';
import { apiFetch } from '@/lib/api-server';
import { revalidatePath } from 'next/cache';

const mockApiFetch = vi.mocked(apiFetch);
const mockRevalidatePath = vi.mocked(revalidatePath);

beforeEach(() => {
  vi.clearAllMocks();
  mockApiFetch.mockResolvedValue(undefined);
});

describe('validateDocument', () => {
  it('calls POST /api/v1/export-documents/:id/validate', async () => {
    await validateDocument('doc-001');
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/api/v1/export-documents/doc-001/validate',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('revalidates the document detail page', async () => {
    await validateDocument('doc-001');
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      '/fr/customs-agent/export-documents/doc-001',
    );
  });

  it('uses the correct document ID in the URL', async () => {
    await validateDocument('doc-xyz-789');
    const url = mockApiFetch.mock.calls[0][0] as string;
    expect(url).toContain('doc-xyz-789');
  });

  it('throws when apiFetch fails', async () => {
    mockApiFetch.mockRejectedValue(new Error('Already validated'));
    await expect(validateDocument('doc-001')).rejects.toThrow('Already validated');
  });

  it('throws on network error', async () => {
    mockApiFetch.mockRejectedValue(new Error('Network timeout'));
    await expect(validateDocument('doc-002')).rejects.toThrow('Network timeout');
  });

  it('revalidates with the specific document ID in path', async () => {
    await validateDocument('special-doc-id');
    expect(mockRevalidatePath).toHaveBeenCalledWith(
      expect.stringContaining('special-doc-id'),
    );
  });
});
