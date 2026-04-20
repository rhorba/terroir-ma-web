import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const locales = ['fr', 'ar', 'zgh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales,
});
