import { test, expect } from '@playwright/test';
import { website, loginResponse, StatusMessage } from '../../utils/dataHelpers.js';
import { createUsers } from '../../utils/advancedHelpers.js';


test('Dashboard', async ({ page }) => {
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

//Click Configuration module to reveal Users tab - Manually click if its not responding
  await page.getByRole('menuitem', { name: 'control Configuration' }).locator('span').first().click();
  await page.getByRole('link', { name: 'Users', exact: true }).click() //Users Tab
  await page.waitForTimeout(3000);




});