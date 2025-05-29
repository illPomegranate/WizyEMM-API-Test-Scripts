import { test, expect } from '@playwright/test';
import { website, loginResponse, payloadRequest, logResponse } from '../../utils/dataHelpers.js';
import { createUser } from '../../utils/advancedHelpers.js';

test('Users Account', async ({ page }) => {
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

  //Look if User account is existing - Modify name
  const existing = await page.getByRole('row', { name: '1317 ms.alycortez@gmail.'}).isVisible();
if (existing) {
  await page.getByRole('row', { name: '1317 ms.alycortez@gmail.' }).locator('label').click();
  await page.getByRole('button', { name: 'Remove' }).click();
  await page.waitForTimeout(1000);

  const deleteUser = await logResponse(page, page.getByRole('button', { name: 'OK' }).click(), 
  '/api/v1/users', 'User Deleted');
  expect(deleteUser.status()).toBe(204);
} 
else {//Fill-out User form
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
 
  //Select User Account to update - Modify locators
  await page.getByText('1317').click();
  await page.getByRole('textbox', { name: 'First Name :' }).fill('picheolin');
  await page.getByRole('switch').nth(2).click();
  await page.getByRole('textbox', { name: '* Password :' }).fill('Newgarden2025');
  await page.getByRole('textbox', { name: '* Confirm Password :' }).fill('Newgarden2025');
  await page.locator('#staging').click();

  //OK - User Updated 
  const updateUser = await payloadRequest(page, 'OK', '/api/v1/users');
  expect(updateUser.status()).toBe(200);
  expect(updateUser).toBeTruthy();
}
});
