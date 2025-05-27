import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse, payloadRequest, StatusMessage } from '../utils/dataHelpers.js';

//Adjust the timeout in dataHelpers if its not responding
test('Notifications Module', async ({ page }) => {
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

  //Navigate to Notifications tab - Adjust the getByRole if its not responding
  //await page.getByRole('menuitem', { name: 'bell Notifications' }).locator('span').first().click();
  await page.getByRole('menuitem', { name: 'bell Notifications' }).click();

  //Go to Configure tab
  const configure = await logResponse(page, page.getByRole('link', { name: 'Configure' }), 
  '/api/v1/administrators/', 'Configure Tab'
  );
  expect(configure.status()).toBe(200);

  //Bell Toggle Notification  
  const bell = await logResponse(page, page.locator('#byBellNotificationSwitch'), 
  '/bigquery/v2/projects/', 'Bell Notification'
  );
  expect(bell.status()).toBe(200);

  //Email Toggle Notification
  const email = await logResponse(page, page.locator('#byEmailNotificationSwitch'), 
  '/bigquery/v2/projects/', 'Email Notification'
  );
  expect(email.status()).toBe(200);

  const isEmailEnabled = await page.locator('#byEmailNotificationSwitch').isChecked();
 if (isEmailEnabled) {
  console.log('Email Notification is enabled -> Frequency is available');

  //Frequency dropdown
  await page.getByText('By day', { exact: true }).click();
  await page.waitForTimeout(200);

  //Select frequency - Modify if other 'FREQUENCY' is now available
  const frequency = await logResponse(page, page.locator('#DAILY').getByText('By day'), 
  '/bigquery/v2/projects/', 'Frequency'
  );
  expect(frequency.status()).toBe(200);
 } 
 else {
  console.log('\nEmail Notification is disabled');
 }
  //Update Notifications Button
  const update = await payloadRequest(page, 'Update', '/api/v1/administrators/me');
  expect(update.status()).toBe(200);
  expect(update.request().postDataJSON()).toBeTruthy();
});