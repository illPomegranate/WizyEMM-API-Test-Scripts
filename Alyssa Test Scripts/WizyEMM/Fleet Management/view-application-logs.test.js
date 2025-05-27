import { test, expect } from '@playwright/test';
import { website, loginResponse, logLinkResponse } from '../utils/dataHelpers.js';

test('Application Logs', async ({ page }) => {
  const wizyEMM = await website(page, 'https://qa2.staging-us.wizyemm.app/', 'WizyEMM Staging Website');
  expect(wizyEMM.status()).toBe(200);
  test.setTimeout(120000);

//Opening Login
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(2000);
  //Login Credentials - Go to /utils/dataHelpers.js to modify
  const login = await loginResponse(page, 'Login', '/login');
  expect(login.status()).toBe(200);
  await page.waitForTimeout(15000);

//Open Fleet Management Module to reveal tabs - Manually click Fleet Management if its not responding 
  await page.getByRole('menuitem', { name: 'mobile Fleet Management' }).click();

//Application Logs Module
  const locator = page.getByRole('link', { name: 'Application Logs' });
  const appLogs = await logLinkResponse(page, locator, '/api/v2/', 'Application Logs');
  expect(appLogs.status()).toBe(200);
  expect(appLogs).toBeTruthy();
});