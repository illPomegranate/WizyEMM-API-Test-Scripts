import { test, expect } from '@playwright/test';
import { website, loginResponse, StatusMessage } from '../utils/dataHelpers.js';

test('Create-Profile-Label-Delete', async ({ page }) => {
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

  //Admin Account
  const [adm] = await Promise.all([page.waitForResponse(response => response.url().includes('/google.firestore.v1.Firestore/Listen/'), { timeout: 20000 }),
  page.getByRole('link', { name: 'smile Admin Accounts' }).click(),
]);
  console.log('\nAdmin Account')
  console.log(`Method: ${adm.request().method()} | Status: ${adm.status()} | Message: ${StatusMessage(adm.status())}`);
  expect(adm.status()).toBe(200);
  await page.waitForTimeout(5000);

  //DELETE - Regional Admin Account
  const existing = await page.getByRole('cell', {name: 'abcde apitest'}).isVisible()
if(existing){
  await page.getByRole('row', { name: 'abcde apitest ac.internqa@' }).getByLabel('', { exact: true }).check();
  await page.getByRole('button', { name: 'Remove' }).click();
  await page.waitForTimeout(1000)

  //OK - Delete Button
  const okDelete = await logResponse(page, page.getByRole('button', { name: 'OK' }), 
  '/api/v1/administrators', 'OK - Delete Admin Account'
  );
  console.log('Admin Account has been deleted')
  expect(okDelete.status()).toBe(204);

} else {
  //CREATE - New Admin Account
  await page.getByRole('button', { name: 'plus Create' }).click()
  //Fill-out form 
  await page.getByRole('textbox', { name: '* First Name :' }).fill('abcde');
  await page.getByRole('textbox', { name: '* Last Name :' }).fill('apitest');
  await page.getByRole('textbox', { name: '* Email :' }).fill('ac.internqa@gmail.com');
  await page.waitForTimeout(1000);
  await page.locator('#create-admin-splashtop').click();
  await page.getByTitle('Use Splashtop Service Account').locator('div').click();
  await page.locator('#create-admin-role').click();
  await page.waitForTimeout(200);

//Regional Admin Role
  page.getByTitle('Regional Administrator', { exact: true }).click()

//Profile dropdown
  await page.locator('.ant-select-selection-overflow').first().click();
  await page.waitForTimeout(200)
  await page.locator('.ant-select-selection-overflow').first().click();
  await page.getByRole('combobox', { name: '* Profile :' }).fill('api');
  await page.waitForTimeout(200)
  await page.getByText('apitest', { exact: true }).click();

//Label dropdown
  await page.locator('.ant-select-selection-overflow').first().click();
  await page.locator('.ant-form-item-control-input-content > div > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
  await page.getByText('test label').nth(1).click()
  await page.waitForTimeout(200);
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(2000);

  //OK - CREATE Button
  const okCreateAdmin = await payloadRequest(page, 'OK', '/api/v1/administrators');
  expect(okCreateAdmin.status()).toBe(201);
  expect(okCreateAdmin).toBeTruthy();
}
});

test('Update Admin Account Test', async ({ page }) => {
//Open website
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

  //Admin Account
  const [adm] = await Promise.all([page.waitForResponse(response => response.url().includes('/google.firestore.v1.Firestore/Listen/'), { timeout: 20000 }),
  page.getByRole('link', { name: 'smile Admin Accounts' }).click(),
]);
  console.log('\nAdmin Account')
  console.log(`Method: ${adm.request().method()} | Status: ${adm.status()} | Message: ${StatusMessage(adm.status())}`);
  expect(adm.status()).toBe(200);
  await page.waitForTimeout(5000);

 const existing = await page.getByRole('cell', {name: 'abcde apitest'}).isVisible()
if(existing){
  await page.getByText('abcde apitest').click();
  await page.waitForTimeout(200);
  await page.getByText('Use Splashtop Service Account').click();
  await page.waitForTimeout(200);
  await page.getByText('Use Own Splashtop Account').click();
  await page.getByTitle('Regional Administrator').click();
  await page.waitForTimeout(200); 
  await page.getByText('Extended Regional').click();
  await page.waitForTimeout(200);
  await page.locator('.ant-select-selection-overflow').first().click();
  await page.waitForTimeout(200);
  await page.getByText('QA Automation').click();
  await page.waitForTimeout(200);
  await page.locator('.ant-form-item-control-input-content > div > .ant-select > .ant-select-selector > .ant-select-selection-overflow').click();
  await page.waitForTimeout(200);
  await page.locator('div').filter({ hasText: /^00001 smart label$/ }).first().click();
  await page.waitForTimeout(200);

  //Update Admin Account
  const okUpdateAdmin = await payloadRequest(page, 'OK', '/api/v1/administrators');
  expect(okUpdateAdmin.status()).toBe(200);
  expect(okUpdateAdmin).toBeTruthy();
}
else {
  console.log('\nAdministrator has been deleted')
}
});
