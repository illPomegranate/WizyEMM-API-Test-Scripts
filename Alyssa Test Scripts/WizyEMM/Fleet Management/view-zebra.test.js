import { test, expect } from '@playwright/test';
import { website, loginResponse, logTabResponse } from '../utils/dataHelpers.js';

test('Zebra Module', async ({ page }) => {
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
  await page.getByRole('link', { name: 'Zebra' }).click();
  await page.waitForTimeout(3000);

  //Deployments - Zebra
  const deploymentsZebra = await logTabResponse(page, page.getByRole('tab', { name: 'Deployments' }), 
  '/api/v2/', 'Deployments - Zebra' 
  );
  expect(deploymentsZebra.status()).toBe(200);
  expect(deploymentsZebra).toBeTruthy();

  //Updates - Zebra
  const updateZebra = await logTabResponse(page, page.getByRole('tab', { name: 'Updates' }), 
  '/api/v2/', 'Updates - Zebra' 
  );
  expect(updateZebra.status()).toBe(200);
  expect(updateZebra).toBeTruthy();

  //Setting - Zebra
  const settingsZebra = await logTabResponse(page, page.getByRole('tab', { name: 'Settings' }), 
  '/api/zebra/enrollment', 'Settings - Zebra' 
  );
  expect(settingsZebra.status()).toBe(200);
  expect(settingsZebra).toBeTruthy();

});