import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/auth-utils', () => ({
  getAccessToken: vi.fn(),
}));

import { apiFetch } from '@/lib/api-server';
import { getAccessToken } from '@/lib/auth-utils';

const mockGetAccessToken = vi.mocked(getAccessToken);

function makeResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
    text: vi.fn().mockResolvedValue(JSON.stringify(body)),
    statusText: 'OK',
  } as unknown as Response;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', vi.fn());
  mockGetAccessToken.mockResolvedValue('bearer-token');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiFetch', () => {
  it('unwraps envelope.data on successful response', async () => {
    const mockFetch = vi.mocked(global.fetch);
    const payload = { id: '1', name: 'Test' };
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: payload }));

    const result = await apiFetch<typeof payload>('/api/v1/test');
    expect(result).toEqual(payload);
  });

  it('passes Authorization Bearer header', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: [] }));

    await apiFetch('/api/v1/items');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/items'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer bearer-token',
        }),
      }),
    );
  });

  it('sets Content-Type: application/json', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: null }));

    await apiFetch('/api/v1/items');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
  });

  it('merges extra init options (method, body)', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: { ok: true } }));

    await apiFetch('/api/v1/resource', {
      method: 'POST',
      body: JSON.stringify({ foo: 'bar' }),
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ foo: 'bar' }) }),
    );
  });

  it('allows overriding headers via init.headers', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: {} }));

    await apiFetch('/api/v1/resource', {
      headers: { 'x-custom': 'value' },
    });

    const call = mockFetch.mock.calls[0][1] as RequestInit;
    const headers = call.headers as Record<string, string>;
    expect(headers['x-custom']).toBe('value');
  });

  it('throws with status code on non-ok response', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(makeResponse({ message: 'Not found' }, 404));

    await expect(apiFetch('/api/v1/missing')).rejects.toThrow('API 404');
  });

  it('throws with status code on 500 response', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(makeResponse({ message: 'Server error' }, 500));

    await expect(apiFetch('/api/v1/broken')).rejects.toThrow('API 500');
  });

  it('falls back to statusText when text() fails', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      text: vi.fn().mockRejectedValue(new Error('parse fail')),
    } as unknown as Response);

    await expect(apiFetch('/api/v1/down')).rejects.toThrow('API 503: Service Unavailable');
  });

  it('sets cache: no-store', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: null }));

    await apiFetch('/api/v1/cached');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('defaults to localhost:3000 as base URL when env is unset', async () => {
    const mockFetch = vi.mocked(global.fetch);
    mockFetch.mockResolvedValue(makeResponse({ success: true, data: {} }));

    await apiFetch('/api/v1/test');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/v1/test');
  });
});
