import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse } from '../../utils/dataHelpers.js';
import { registerDevice } from '../../utils/androidDeviceHelpers.js';

test('Register/Unregister Device', async ({ page }) => {
//Opening Website
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

  //Search first the Android Device
  await page.getByRole('button', { name: 'Device Name down' }).click();
  await page.getByRole('textbox', { name: 'Device Name' }).fill('wizyemm');
  await page.getByRole('textbox', { name: 'Device Name' }).press('Enter');

  let androidDeviceExists = false;
  try {
    const rowLocator = page.getByRole('row', { name: 'wave102025 wizyEMM Manila' });
    await rowLocator.waitFor({ timeout: 5000 });
    androidDeviceExists = true;
  } catch (register) {
    androidDeviceExists = false;
  }

 //Unregister device
 if (androidDeviceExists) { 
  await page.getByRole('row', { name: 'wave102025 wizyEMM Manila' }).locator('label').click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Unregister' }).click();

  //OK - Unregister Device
  const okUnregister = await logResponse(page, page.getByRole('button', { name: 'OK' }), 
  '/api/v2/devices/', 'OK - Unregister Device'
  );
  console.log('\nThe device has been deleted')
  expect(okUnregister.status()).toBe(204);
 } 
  else{
  //Modify or Duplicate this to have new Registered Device - you can add // to not include the customData, name, & user
  const registerResponse = await registerDevice(page, {
    serialNumber: 'wave102025',
    profile: 'fm',
    customData: 'Garden Villa',
    name: 'wizyEMM',
    label: 'Manila', //Adjust the locator in /utils/androidDeviceHelpers.js if its not responding
    user: 'apitest'
  });
  expect(registerResponse.status()).toBe(201);
  expect(registerResponse).toBeTruthy();
  }
});