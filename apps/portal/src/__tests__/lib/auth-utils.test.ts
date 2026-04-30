import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

import { getAccessToken, getRoles, getCooperativeId } from '@/lib/auth-utils';
import { auth } from '@/auth';

const mockAuth = vi.mocked(auth);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getAccessToken', () => {
  it('returns token when session has accessToken', async () => {
    mockAuth.mockResolvedValue({ accessToken: 'tok-abc', user: {}, expires: '' } as never);
    await expect(getAccessToken()).resolves.toBe('tok-abc');
  });

  it('throws when session is null', async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(getAccessToken()).rejects.toThrow('Not authenticated');
  });

  it('throws when session has no accessToken', async () => {
    mockAuth.mockResolvedValue({ user: {}, expires: '' } as never);
    await expect(getAccessToken()).rejects.toThrow('Not authenticated');
  });
});

describe('getRoles', () => {
  it('returns roles from session user', async () => {
    mockAuth.mockResolvedValue({
      user: { roles: ['super-admin', 'inspector'] },
      expires: '',
    } as never);
    await expect(getRoles()).resolves.toEqual(['super-admin', 'inspector']);
  });

  it('returns empty array when session is null', async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(getRoles()).resolves.toEqual([]);
  });

  it('returns empty array when user has no roles property', async () => {
    mockAuth.mockResolvedValue({ user: { name: 'Alice' }, expires: '' } as never);
    await expect(getRoles()).resolves.toEqual([]);
  });

  it('returns empty array when roles is undefined on user', async () => {
    mockAuth.mockResolvedValue({ user: { roles: undefined }, expires: '' } as never);
    await expect(getRoles()).resolves.toEqual([]);
  });
});

describe('getCooperativeId', () => {
  it('returns cooperativeId from session user', async () => {
    mockAuth.mockResolvedValue({
      user: { cooperativeId: 'coop-uuid-123' },
      expires: '',
    } as never);
    await expect(getCooperativeId()).resolves.toBe('coop-uuid-123');
  });

  it('returns null when session is null', async () => {
    mockAuth.mockResolvedValue(null as never);
    await expect(getCooperativeId()).resolves.toBeNull();
  });

  it('returns null when user has no cooperativeId', async () => {
    mockAuth.mockResolvedValue({ user: {}, expires: '' } as never);
    await expect(getCooperativeId()).resolves.toBeNull();
  });

  it('returns null when cooperativeId is explicitly null', async () => {
    mockAuth.mockResolvedValue({
      user: { cooperativeId: null },
      expires: '',
    } as never);
    await expect(getCooperativeId()).resolves.toBeNull();
  });
});
