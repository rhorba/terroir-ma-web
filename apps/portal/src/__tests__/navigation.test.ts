import { describe, it, expect, vi } from 'vitest';

vi.mock('next-intl/navigation', () => ({
  createSharedPathnamesNavigation: vi.fn().mockReturnValue({
    Link: vi.fn(),
    redirect: vi.fn(),
    usePathname: vi.fn(),
    useRouter: vi.fn(),
  }),
}));

import { locales, defaultLocale } from '@/navigation';

describe('navigation constants', () => {
  it('exports exactly 3 locales', () => {
    expect(locales).toHaveLength(3);
  });

  it('includes French locale', () => {
    expect(locales).toContain('fr');
  });

  it('includes Arabic locale', () => {
    expect(locales).toContain('ar');
  });

  it('includes Amazigh locale', () => {
    expect(locales).toContain('zgh');
  });

  it('has French as default locale', () => {
    expect(defaultLocale).toBe('fr');
  });

  it('defaultLocale is one of the locales', () => {
    expect(locales).toContain(defaultLocale);
  });
});
