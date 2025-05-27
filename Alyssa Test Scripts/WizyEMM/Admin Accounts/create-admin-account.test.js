import { test, expect } from '@playwright/test';
import { website, loginResponse } from '../utils/dataHelpers.js';
import { createAdmin } from '../utils/adminAccountHelpers.js';


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

  await page.getByRole('link', { name: 'smile Admin Accounts' }).click();

//CREATE ADMIN ACCOUNT '000000-InternQATest' '0000111-InternQATest'
  const adminAccount = await createAdmin(page, {
    firstName: 'Admin',
    lastName: 'Wizy',
    email: 'ac.internqa@gmail.com',
    roleType: 'Regional Administrator',
    profiles: ['fm'],
    labels: ['0707'],
    addMoreLabels: ['test label'],
    useOwnSplashtopAccount: true
});
  console.log('\nA new administrator has been created');
  expect(adminAccount.status()).toBe(201);
  expect(adminAccount).toBeTruthy();

  const adminAccount2 = await createAdmin(page, {
    firstName: 'Admin',
    lastName: 'EMM',
    email: 'yssancortez@gmail.com',
    roleType: 'Local Administrator',
    profiles: ['fm'],
    labels: [],
    addMoreLabels: [],
    useOwnSplashtopAccount: false
});
  console.log('\nA new administrator has been created');
  expect(adminAccount2.status()).toBe(201);
  expect(adminAccount2).toBeTruthy();

 });
