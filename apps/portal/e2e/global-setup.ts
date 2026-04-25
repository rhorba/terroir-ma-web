import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const AUTH_DIR = path.join(__dirname, '.auth');

const ROLES = [
  'super-admin',
  'cooperative-admin',
  'cooperative-member',
  'inspector',
  'lab-technician',
  'certification-body',
  'customs-agent',
];

export default async function globalSetup(_config: FullConfig) {
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const browser = await chromium.launch();

  for (const role of ROLES) {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to portal login page — NextAuth renders the "Se connecter" button
    await page.goto('http://localhost:3001/fr/login');

    // Click the sign-in button which triggers signIn('keycloak') → redirect to Keycloak
    await page.click('button[type="submit"]');

    // Wait for Keycloak login form to appear
    await page.waitForSelector('#username', { timeout: 15_000 });

    // Fill Keycloak credentials — users log in with email (loginWithEmailAllowed: true)
    await page.fill('#username', `test-${role}@terroir.ma`);
    await page.fill('#password', 'Test1234!');
    await page.click('[name="login"]');

    // Wait for redirect back to portal after successful auth
    await page.waitForURL(/localhost:3001\/fr\//, { timeout: 20_000 });

    await context.storageState({ path: path.join(AUTH_DIR, `${role}.json`) });
    await context.close();
  }

  await browser.close();

  // Write seed data stub — smoke tests don't need specific seeded records
  fs.writeFileSync(
    path.join(AUTH_DIR, 'seed.json'),
    JSON.stringify({ cooperativeId: '00000000-0000-0000-0000-000000000001' }, null, 2),
  );
}
