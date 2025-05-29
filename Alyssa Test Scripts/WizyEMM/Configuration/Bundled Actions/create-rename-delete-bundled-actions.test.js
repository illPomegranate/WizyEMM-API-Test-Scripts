import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse, payloadRequest } from '../utils/dataHelpers.js';

//Create bundled actions > rename bundled actions > end
//Run this test again to remove delete the bundled actions
test('Change Profile & Change User', async ({ page }) => {
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

//Click Configuration module to reveal Bundled Actions tab
  await page.getByRole('menuitem', { name: 'control Configuration' }).locator('span').first().click();
  //Bundled Actions Tab
  await page.getByRole('link', { name: 'Bundled Actions' }).click();
  await page.waitForTimeout(3000);

//DELETE - Bundled Action
  const existing = await page.getByRole('row', { name: '0101 api bundle test', exact: true }).isVisible()

if(existing){
  await page.getByRole('row', { name: '0101 api bundle test', exact: true }).getByLabel('').check();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.waitForTimeout(500);

//OK - Delete Existing Bundled Action Response
  const okUnregister = await logResponse(page, page.getByRole('button', { name: 'OK' }), 
  '/api/v1/device-actions/', 'OK - Delete Existing Bundled Action'
  );
  console.log('Deleted existing bundled action')
  expect(okUnregister.status()).toBe(204);
  }
  else{
  await page.getByRole('button', { name: 'plus Create' }).click(); 
  await page.getByRole('textbox', { name: '* Name' }).fill('api bundle test');
  await page.waitForTimeout(500);

  //OK - New Bundled Action Respons
  const newBundledAction = await payloadRequest(page, 'OK', '/api/v1/');
  expect(newBundledAction.status()).toBe(201);
  expect(newBundledAction).toBeTruthy();
  
  //Rename - api bundle test
  await page.getByRole('link', { name: 'Bundled Actions' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('row', { name: 'api bundle test' }).getByLabel('').check();
  await page.getByRole('button', { name: 'Rename' }).click();
  await page.getByRole('textbox', { name: '* Name :' }).fill('0101 api bundle test');
  await page.waitForTimeout(1000);

  //OK - Rename Bundled Action Response
  const renameBundledAction = await payloadRequest(page, 'OK', '/api/v1/');
  expect(renameBundledAction.status()).toBe(200);
  expect(renameBundledAction).toBeTruthy();
  }
});
