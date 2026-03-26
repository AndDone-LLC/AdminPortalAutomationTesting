import { config } from '../src/config/config';
import { test, expect } from "@playwright/test";
import { AdminPage } from '../src/pages/AdminLoginPage';

// Helper to get env-specific credentials for QAT/UAT
const getEnvCredentials = () => {
  const env = process.env.APP_ENV || 'QAT';
  if (env === 'UAT') {
    return {
      url: process.env.UAT_BASE_URL || '',
      username: process.env.UAT_ADMIN_USERNAME || '',
      password: process.env.UAT_ADMIN_PASSWORD || '',
    };
  }
  return {
    url: process.env.BASE_URL || '',
    username: process.env.ADMIN_USERNAME || '',
    password: process.env.ADMIN_PASSWORD || '',
  };
};

test('Validate program Data of UI and API', async ({ page }) => {
  const adminPage = new AdminPage(page);
  const { url, username, password } = getEnvCredentials();
  if (!url) throw new Error('Base URL is not set for the selected environment.');
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  if (!username || !password) throw new Error('Admin credentials are not set for the selected environment.');
  await adminPage.login(username, password);
});