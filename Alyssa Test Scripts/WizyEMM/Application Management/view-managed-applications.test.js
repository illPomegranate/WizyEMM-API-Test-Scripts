import { test, expect } from '@playwright/test';
import { website, loginResponse, logLinkResponse } from '../../utils/dataHelpers.js';

test('Managed Applications', async ({ page }) => {
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

//Open Application Management Module to reveal tabs - Manually click Application Management if its not responding 
  await page.getByRole('menuitem', { name: 'android Application Management' }).click();

  //Application Logs Module
  const locator = page.getByRole('link', { name: 'Managed Applications' });
  const managedApp = await logLinkResponse(page, locator, '/api/v2/managedapps', 'Managed Applications');
  expect(managedApp.status()).toBe(200);
  expect(managedApp).toBeTruthy();

});






