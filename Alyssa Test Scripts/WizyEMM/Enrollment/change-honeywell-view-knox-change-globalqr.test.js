import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse, payloadRequest, responseRequest, noCacheResponse } from '../utils/dataHelpers.js';
import { honeywellDevice, globalQRCode } from '../utils/enrollmentHelpers.js';

//Adjust the timeout in dataHelpers if its not responding
test('Enrollment Module', async ({ page }) => {
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

//Click Enrollment module to reveal tabs - Adjust the getbyRole if its not responding or manually click
  //await page.getByRole('menuitem', { name: 'schedule Enrollment' }).click();
  await page.getByRole('menuitem', { name: 'schedule Enrollment' }).locator('span').first().click();
  await page.waitForTimeout(2000);

  //Go to Honeywell tab
  const honeywellTab = await logResponse(page, page.getByRole('link', { name: 'Honeywell' }), 
  '/api/oem/enrollment/honeywell', 'Honeywell Tab'
  );
  expect(honeywellTab.status()).toBe(200);

  //Modify Honeywell fields
  await honeywellDevice(page, {
    notifyEmail: 'ms.alycortez@gmail.com',
    defaultProfileName: 'apitest'
  });

  //Update Honeywell Enrollment Token
  const updateHoneywell = await responseRequest(page, 'Update', '/api/oem/enrollment/honeywell');
  expect(updateHoneywell.status()).toBe(200);
  expect(updateHoneywell).toBeTruthy();

  //Knoxx Mobile Enrollment Tab
  const knox = await noCacheResponse(page,'Knox Mobile Enrollment','/static/bundled/',
  'Knox Mobile Enrollment (No Cache/Headless)'
  );
  expect(knox.status()).toBe(200);
  await page.waitForTimeout(500);

  //Navigate Global QR Code
  await page.getByRole('link', { name: 'Global QR Code' }).click();
  await page.waitForTimeout(1000);

  //Modify the default profile
  await globalQRCode(page, 'apitest');

  //OK - Global QR Code
  const okQR = await payloadRequest(page, 'OK', '/api/v1/signin-details/');
  console.log('\nThe QR code has been updated')
  expect(okQR.status()).toBe(200);
  expect(okQR).toBeTruthy();
});