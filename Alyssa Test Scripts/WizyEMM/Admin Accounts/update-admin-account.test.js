import { test, expect } from '@playwright/test';
import { website, loginResponse } from '../utils/dataHelpers.js';
import { updateAdmin } from '../utils/adminAccountHelpers.js';

//Adjust the timeout in dataHelpers if its not responding
//Modify adminAccount field in your preferred details
test('Admin Accounts', async ({ page }) => {
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

  await page.getByRole('link', { name: 'smile Admin Accounts' }).click();

//UPDATE ANY ADMIN ACCOUNT VISIBLE ONLY IN THE FIRST PAGE
  const updateAccount = await updateAdmin(page, {
    identifierAdmin: 'Admin EMM',
    firstName: 'AdminQA',
    lastName: 'EMM-US',
    roleType: 'Extended Service Center', //Manually Scroll the bar in this field to discover the role
    switchToOwnSplashtop: false
  });
  expect(updateAccount.status()).toBe(200);
  expect(updateAccount).toBeTruthy();

  const updateAccount2 = await updateAdmin(page, {
    identifierAdmin: 'Admin Wizy',
    firstName: 'AdminQA',
    lastName: 'EMM-JAPAC',
    roleType: 'Manager', //Manually Scroll the bar in this field to discover the role
    switchToOwnSplashtop: true
  });
  expect(updateAccount2.status()).toBe(200);
  expect(updateAccount2).toBeTruthy();

});
