import { test, expect } from '@playwright/test';
import { website, loginResponse } from '../utils/dataHelpers.js';
import { deleteAdmin } from '../utils/adminAccountHelpers.js';


//Adjust the timeout in dataHelpers if its not responding
//Can create 2 Admin Accounts w/ different gmail
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

//DELETE ANY ADMIN ACCOUNT with APPLICABLE ROLES and VISIBLE IN THE FIRST PAGE
  // const deleteAccount = await deleteAdmin(page, 'AdminQA EMM-US yssancortez@'); //Modify the firstName, lastName, and email
  // expect(deleteAccount.status()).toBe(204);


});


