import { test, expect } from '@playwright/test';
import { website, loginResponse } from '../../utils/dataHelpers.js';
import { createUser } from '../../utils/advancedHelpers.js';

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

  //Create Users
  const userAccount = await createUser(page, {
    username: '1317',
    password: 'Gardenvilla18!',
    firstName: 'Wizy',
    lastName: 'Team',
    email: 'ms.alycortez@gmail.com',
    profileTitle: '000000-InternQATest',
    customAttributes: ['SVT', 'Sebong', 'GoSe', 'Happy', 'Burstday']
  });
  expect(userAccount.status()).toBe(201);
  expect(userAccount).toBeTruthy();

  const userAccount2 = await createUser(page, {
    username: '202510wave',
    password: 'Gardenvilla18!',
    firstName: 'Wizy',
    lastName: 'EMM',
    email: 'ms.alycortez@gmail.com',
    profileTitle: 'fm',
    customAttributes: ['Intern', 'QA', ' ', 'Test', ' ']
  });
  expect(userAccount2.status()).toBe(201);
  expect(userAccount2).toBeTruthy();
