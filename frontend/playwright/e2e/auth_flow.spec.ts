import { test, expect } from '@playwright/test';

test('Register -> Login -> Logout flow', async ({ page }) => {

  // ── Mock des appels API (backend non requis) ─────────────────
  await page.route('**/auth/register', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });

  await page.route('**/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ access_token: 'fake-token-for-testing' }),
    });
  });

  await page.route('**/dashboard/summary', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        total_income: 5000,
        total_expense: 2000,
        balance: 3000,
        transaction_count: 42,
      }),
    });
  });

  // ── Inscription ──────────────────────────────────────────────
  await page.goto('/register');
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'Password123');
  await page.fill('input[name="confirmPassword"]', 'Password123');
  await page.click("button[type='submit']");
  await expect(page).toHaveURL(/\/login/);

  // ── Connexion ─────────────────────────────────────────────────
  await page.waitForSelector('input[name="email"]');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'Password123');
  await page.click("button[type='submit']");
  await expect(page).toHaveURL(/\/dashboard/);
  // ── Vérifier le tableau de bord ───────────────────────────────
  await page.waitForSelector('button:has-text("Se d")');
  const cards = page.locator('[class*="cardsGrid"] > [class*="card"]');
  await expect(cards).toHaveCount(4);

  // ── Déconnexion ───────────────────────────────────────────────
  await page.click('button:has-text("Se d")');
  await expect(page).toHaveURL(/\/login/);
});
