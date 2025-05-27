import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse, logTabResponse } from '../utils/dataHelpers.js';

//Adjust the timeout in dataHelpers if its not responding
test('Release Notes & Settings', async ({ page }) => {
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

 //Navigate to Release Notes Module
  const releaseNotes = await logResponse(page, page.getByRole('link', { name: 'calendar Release Notes' }), 
  '/api/v1/administrators/me', 'Release Notes Module'
  );
  expect(releaseNotes.status()).toBe(200);
  await page.waitForTimeout(2000);

  //Navigate to Settings
  await page.getByRole('link', { name: 'setting' }).click();

  //GDPR Settings 
  const gdpr = await logTabResponse(page, page.getByRole('tab', { name: 'GDPR Settings' }), 
  '/api/v1/customers', 'GDPR Settings' 
  );
  expect(gdpr.status()).toBe(200);

});