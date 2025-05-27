import { test, expect } from '@playwright/test';
import { website, loginResponse, logLinkResponse } from '../utils/dataHelpers.js';

test('Geolocation', async ({ page }) => {
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

//Open Fleet Tracking Module to reveal tabs - Manually click Fleet Tracking if its not responding 
  await page.getByRole('menuitem', { name: 'environment Fleet Tracking' }).click();

  //Geolocation Tab
  const locator = page.getByRole('link', { name: 'Geolocation' });
  const geofence = await logLinkResponse(page, locator, '/api/v2/geofences', 'Geolocation');
  expect(geofence.status()).toBe(200);
  expect(geofence).toBeTruthy();
});
