import { test, expect } from '@playwright/test';
import * as path from 'path';

const AUTH_DIR = path.join(__dirname, '.auth');

function authState(role: string) {
  return path.join(AUTH_DIR, `${role}.json`);
}

test.describe('Certification chain — inspector', () => {
  test.use({ storageState: authState('inspector') });

  test('inspector dashboard renders after login', async ({ page }) => {
    await page.goto('/fr/inspector');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
  });

  test('inspector inspections list loads', async ({ page }) => {
    await page.goto('/fr/inspector/inspections');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Certification chain — lab-technician', () => {
  test.use({ storageState: authState('lab-technician') });

  test('lab technician dashboard renders after login', async ({ page }) => {
    await page.goto('/fr/lab-technician');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
  });

  test('lab technician test queue loads', async ({ page }) => {
    await page.goto('/fr/lab-technician/lab-tests');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Certification chain — certification-body', () => {
  test.use({ storageState: authState('certification-body') });

  test('certification body dashboard renders after login', async ({ page }) => {
    await page.goto('/fr/certification-body');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
  });

  test('certification body certifications list loads', async ({ page }) => {
    await page.goto('/fr/certification-body/certifications');
    await expect(page).not.toHaveURL(/\/fr\/login/);
    await expect(page).not.toHaveTitle(/500|Error/i);
    await expect(page.locator('body')).toBeVisible();
  });
});
