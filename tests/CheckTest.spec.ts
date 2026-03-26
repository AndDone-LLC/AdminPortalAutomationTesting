import { test } from "@playwright/test";
import { AdminPage } from '../src/pages/AdminLoginPage';

test('Validate program Data of UI and API', async ({ page }) => {
  const adminPage = new AdminPage(page);

  // Read URL and credentials directly from environment variables
  const baseUrl = process.env.BASE_URL;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  console.log("BASE_URL in test:", baseUrl);

  if (!baseUrl) throw new Error("BASE_URL is missing");
  if (!adminUsername) throw new Error("ADMIN_USERNAME is missing");
  if (!adminPassword) throw new Error("ADMIN_PASSWORD is missing");

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await adminPage.login(adminUsername, adminPassword);
});
