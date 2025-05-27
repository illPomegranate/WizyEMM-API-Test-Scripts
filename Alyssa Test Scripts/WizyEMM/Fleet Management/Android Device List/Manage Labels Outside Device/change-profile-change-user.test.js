import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse, payloadRequest } from '../../../utils/dataHelpers.js';
import { registerDevice } from '../../../utils/androidDeviceHelpers.js';

//Run this test twice (2x) if the device is not existing
//From Register Device if not existing -> Change Profile - Change User-> Unregister Device
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

//Open Fleet Management Module to reveal tabs - Manually click Fleet Management if its not responding 
  await page.getByRole('menuitem', { name: 'mobile Fleet Management' }).click();
  await page.getByRole('link', { name: 'Android Device List' }).click();
  await page.waitForTimeout(3000);

  //Search the device first
  await page.getByRole('button', { name: 'Serial Number / IMEI down' }).click();
  await page.getByRole('textbox', { name: 'Serial Number' }).fill('garden2025');
  await page.getByRole('textbox', { name: 'Serial Number' }).press('Enter');

  let androidDeviceExists = false;
  try {
    const rowLocator = page.getByRole('row', { name: 'garden2025 wizyEMM-PH Manila' });
    await rowLocator.waitFor({ timeout: 5000 });
    androidDeviceExists = true;
  } catch (register) {
    androidDeviceExists = false;
  }

  if (androidDeviceExists) { 
  //Click Change Profile - Adjust/Modify the Profile locator if its not responding
  await page.getByRole('row', { name: 'garden2025 wizyEMM-PH Manila' }).locator('label').click();
  await page.getByText('Change profile').click();
  //await page.locator('#app').getByText('Change profile').click();
  await page.getByText('-15-5-25-Test').click();
  //OK - Change Profile
  const okChangeProfile = await payloadRequest(page, 'OK', '/api/v2/devices/');
  console.log('\nDevices has been updated')
  expect(okChangeProfile.status()).toBe(200);
  expect(okChangeProfile).toBeTruthy();
  await page.waitForTimeout(2000);

  //Click Change User - Adjust/Modify the User locator if its not responding
  await page.getByRole('row', { name: 'garden2025 wizyEMM-PH Manila' }).locator('label').click();
  await page.getByText('Change user').click();
  await page.getByText('0808', { exact: true }).click();
  //OK - Change User
  const okChangeUser = await payloadRequest(page, 'OK', '/api/v2/devices/');
  console.log('\nDevices has been updated')
  expect(okChangeUser.status()).toBe(200);
  expect(okChangeUser).toBeTruthy();
  await page.waitForTimeout(2000);

  //Unregister Device
  await page.getByRole('row', { name: 'garden2025 wizyEMM-PH Manila' }).locator('label').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Unregister' }).click();
  await page.waitForTimeout(1000);
  //OK - Unregister Device
  const okUnregister = await logResponse(page, page.getByRole('button', { name: 'OK' }), 
  '/api/v2/devices/', 'OK - Unregister Device'
  );
  console.log('The device unregistered successfully')
  expect(okUnregister.status()).toBe(204);
  }
  else{
  //Modify or Duplicate this to have new Registered Device - you can add // to not include the customData, name, & user
  const registerResponse = await registerDevice(page, {
    serialNumber: 'garden2025',
    profile: 'fm',
    customData: 'May2025',
    name: 'wizyEMM-PH',
    label: 'Manila', //Adjust the locator in /utils/androidDeviceHelpers.js if its not responding
    user: 'apitest'
  });
  expect(registerResponse.status()).toBe(201);
  expect(registerResponse).toBeTruthy();
  }
});