import { config } from '../src/config/config';
import { test, expect } from "@playwright/test";
import { AdminPage } from '../src/pages/AdminLoginPage';
import { env } from 'node:process';

// Validate program Data of UI and API
test('Validate program Data of UI and API', async ({ page }) => {
  const adminPage = new AdminPage(page);
  const baseUrl = process.env.BASE_URL || "";
  await page.goto(baseUrl, {
    waitUntil: "domcontentloaded",
  });

  const adminUsername = process.env.ADMIN_USERNAME || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  await adminPage.login(adminUsername, adminPassword);
  
});