import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse, TabResponse } from '../../../utils/dataHelpers.js';
import { registerDevice } from '../../../utils/androidDeviceHelpers.js';

//Run this test twice (2x) if the device is not existing
//From Register Device if not existing -> Check Options Inside Device -> Unregister Device
//Modify the 'Response' to get the payload/response data
test('Options Tabs', async ({ page }) => {
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
  await page.getByRole('textbox', { name: 'Serial Number' }).fill('API-TEST');
  await page.getByRole('textbox', { name: 'Serial Number' }).press('Enter');

  let androidDeviceExists = false;
  try {
    const rowLocator = page.getByRole('link', { name: 'API-TEST' });
    await rowLocator.waitFor({ timeout: 5000 });
    androidDeviceExists = true;
  } catch (register) {
    androidDeviceExists = false;
  }

  if (androidDeviceExists) { 
  await page.getByRole('link', { name: 'API-TEST' }).click();

  //Click Applications Tab
  const appTab = await TabResponse(page, page.getByRole('tab', { name: 'Applications' }), 
  '/api/v2/', 'Applications Tab'
  );
  expect(appTab.status()).toBe(200);
  await page.waitForTimeout(500); 

  //Click Information Tab
  const infoTab = await TabResponse(page, page.getByRole('tab', { name: 'Information' }), 
  '/bigquery/v2/', 'Information Tab'
  );
  expect(infoTab.status()).toBe(200);

  //Click Application Logs Tab
  const appLogsTab = await TabResponse(page, page.getByRole('tab', { name: 'Application Logs' }), 
  '/bigquery/v2/', 'Application Logs Tab'
  );
  expect(appLogsTab.status()).toBe(200);
  await page.waitForTimeout(500);

  //Click Knox Logs Tab
  const knoxTab = await TabResponse(page, page.getByRole('tab', { name: 'Knox Logs' }), 
  '/bigquery/v2/', 'Knox Logs Tab'
  );
  expect(knoxTab.status()).toBe(200);
  await page.waitForTimeout(500);

  //Click Usage Tab
  const usageTab = await TabResponse(page, page.getByRole('tab', { name: 'Usage' }), 
  '/api/metrics/', 'Usage Tab'
  );
  expect(usageTab.status()).toBe(200);
  await page.waitForTimeout(500);

  //Click Events Tab
  const eventsTab = await TabResponse(page, page.getByRole('tab', { name: 'Events' }), 
  '/api/v2/', 'Events Tab'
  );
  expect(eventsTab.status()).toBe(200);
  await page.waitForTimeout(500);

  //Click Remote Control Tab
  const remoteControl = await logResponse(page, page.getByText('Remote Control'), 
  '/bigquery/v2/', 'Remote Control Tab'
  );
  expect(remoteControl.status()).toBe(200);

  //OK - Unregister Device
  await page.getByRole('button', { name: 'Unregister' }).click();
  const okUnregister = await logResponse(page, page.getByRole('button', { name: 'OK' }), 
  '/api/v2/devices/', 'OK - Unregister Device'
  );
  console.log('The device unregistered successfully')
  expect(okUnregister.status()).toBe(204);
  }
  else{
  //Modify or Duplicate this to have new Registered Device - you can add // to not include the customData, name, & user
  const registerResponse = await registerDevice(page, {
    serialNumber: 'API-TEST',
    profile: 'fm',
    customData: 'Check Options if working',
    name: 'wizyEMM',
    label: 'Manila', //Adjust the locator in /utils/androidDeviceHelpers.js if its not responding
    user: 'apitest'
  });
  expect(registerResponse.status()).toBe(201);
  expect(registerResponse).toBeTruthy();
  }
});