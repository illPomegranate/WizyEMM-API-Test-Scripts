import { test, expect } from '@playwright/test';
import { website, loginResponse, logDataResponse } from '../../utils/dataHelpers.js';

//Adjust the timeout in dataHelpers if its not responding
test('OEM Integrations & Third Party Notification', async ({ page }) => {
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

//Click Configuration module to reveal Advanced tab
  await page.getByRole('menuitem', { name: 'control Configuration' }).locator('span').first().click();
  await page.getByRole('link', { name: 'Advanced' }).click();
  await page.waitForTimeout(1000);

  //OEM Integrations
  const datalogic = await logDataResponse(page, page.getByRole('listitem').filter({ hasText: 'Show Datalogic' }).getByRole('switch'), 
  '/api/v2/settings/', 'Datalogic');
  expect(datalogic.status()).toBe(200);
  expect(datalogic).toBeTruthy();

  const honeywell = await logDataResponse(page, page.getByRole('listitem').filter({ hasText: 'Show Honeywell' }).getByRole('switch'), 
  '/api/v2/settings/', 'Honeywell');
  expect(honeywell.status()).toBe(200);
  expect(honeywell).toBeTruthy();

  const samsung = await logDataResponse(page, page.getByRole('listitem').filter({ hasText: 'Show Samsung' }).getByRole('switch'), 
  '/api/v2/settings/', 'Samsung');
  expect(samsung.status()).toBe(200);
  expect(samsung).toBeTruthy();

  const urovo = await logDataResponse(page, page.getByRole('listitem').filter({ hasText: 'Show Urovo' }).getByRole('switch'), 
  '/api/v2/settings/', 'Urovo');
  expect(urovo.status()).toBe(200);
  expect(urovo).toBeTruthy();

  const zebra = await logDataResponse(page, page.getByRole('listitem').filter({ hasText: 'Show Zebra' }).getByRole('switch'), 
  '/api/v2/settings/', 'Zebra');
  expect(zebra.status()).toBe(200);
  expect(zebra).toBeTruthy();

//   //Third Party Notifications
//   const thirdPartyNotif = await logDataResponse(page, 
//   '/api/v2/settings/', 'Third Party Notifications');
//   expect(thirdPartyNotif.status()).toBe(200);
//   expect(thirdPartyNotif).toBeTruthy();



});