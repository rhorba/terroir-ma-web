import { test, expect } from '@playwright/test';

test.describe('Export documents portal — unauthenticated smoke tests', () => {
  test('list page redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/fr/customs-agent/export-documents');
    await expect(page).toHaveURL(/\/fr\/login|\/api\/auth\/signin/);
  });

  test('generate new doc page redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/fr/customs-agent/export-documents/new');
    await expect(page).toHaveURL(/\/fr\/login|\/api\/auth\/signin/);
  });

  test('detail page redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/fr/customs-agent/export-documents/00000000-0000-0000-0000-000000000000');
    await expect(page).toHaveURL(/\/fr\/login|\/api\/auth\/signin/);
  });

  test('customs-agent dashboard redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/fr/customs-agent');
    await expect(page).toHaveURL(/\/fr\/login|\/api\/auth\/signin/);
  });
});
