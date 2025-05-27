import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse, payloadRequest } from '../../../utils/dataHelpers.js';
import { registerDevice } from '../../../utils/androidDeviceHelpers.js';

//Run this test twice (2x) if the device is not existing
//From Register Device if not existing -> Assign > Remove > Create > Edit > Delete Labels -> Unregister Device
test('Assign-Remove-Create-Edit-Delete', async ({ page }) => {
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
  await page.getByRole('textbox', { name: 'Serial Number' }).fill('villa2025');
  await page.getByRole('textbox', { name: 'Serial Number' }).press('Enter');

  let androidDeviceExists = false;
  try {
    const rowLocator = page.getByRole('row', { name: 'villa2025 wizyEMM Manila' });
    await rowLocator.waitFor({ timeout: 5000 });
    androidDeviceExists = true;
  } catch (register) {
    androidDeviceExists = false;
  }

  if (androidDeviceExists) { 
  await page.getByRole('row', { name: 'villa2025 wizyEMM Manila' }).locator('label').click();
  await page.waitForTimeout(2000);

  //Click Assign 
  await page.getByRole('button', { name: 'Manage labels down' }).click();
  await page.getByRole('button', { name: 'Assign' }).click();
  await page.getByLabel('Assign Label').locator('div').filter({ hasText: 'Please select labels' }).nth(3).click();
  await page.getByText('test label').first().click();
  await page.locator('.ant-modal-body').click();
  //OK - Assign Label
  const okAssignLabel = await payloadRequest(page, 'OK', '/api/v2/devices/');
  console.log('\nDevices have been updated')
  expect(okAssignLabel.status()).toBe(200);
  expect(okAssignLabel).toBeTruthy();
  await page.waitForTimeout(1000);

  //Click Remove Connected 
  await page.getByRole('button', { name: 'Manage labels down' }).click();
  await page.getByRole('button', { name: 'Remove connected labels' }).click();
  await page.locator('.ant-select-selection-overflow').click();
  await page.getByText('test label').click();
  await page.locator('.ant-modal-body').click();
  //OK - Remove Connected Label
  const okRemoveLabel = await payloadRequest(page, 'OK', '/api/v2/devices/');
  console.log('\nLabels were removed to the device/s')
  expect(okRemoveLabel.status()).toBe(200);
  expect(okRemoveLabel).toBeTruthy();
  await page.waitForTimeout(1000);

  //Click Create 
  await page.getByRole('row', { name: 'villa2025 wizyEMM Manila' }).locator('label').click(); //Unclick first to refresh
  await page.getByRole('row', { name: 'villa2025 wizyEMM Manila' }).locator('label').click();
  await page.getByRole('button', { name: 'Manage labels down' }).click();
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('textbox', { name: '* Name' }).fill('0101wave10');
  await page.getByText('Cyan').click();
  await page.waitForTimeout(1000);
  //OK - Create Label
  const okCreateLabel = await payloadRequest(page, 'OK', '/api/v2/labels');
  console.log('\nA new label has been created')
  expect(okCreateLabel.status()).toBe(201);
  expect(okCreateLabel).toBeTruthy();
  await page.waitForTimeout(2000);

  //Click Edit
  await page.getByRole('button', { name: 'Manage labels down' }).click();
  await page.getByRole('button', { name: 'Edit/Delete' }).click();
  await page.getByRole('row', { name: '0101wave10 --- Edit' }).locator('label').click();
  await page.getByRole('row', { name: '0101wave10 --- Edit' }).getByRole('button').click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: '* Name' }).fill('0101wave2025');
  await page.getByText('Orange').click();
  //OK - Edit Label
  const okEditLabel = await payloadRequest(page, 'OK', '/api/v2/labels');
  console.log('\nThis label has been updated')
  expect(okEditLabel.status()).toBe(200);
  expect(okEditLabel).toBeTruthy();
  await page.waitForTimeout(1000);

  //Click Delete
  await page.getByRole('row', { name: '0101wave2025 --- Edit' }).locator('label').click(); //Unclick first to refresh
  await page.getByRole('row', { name: '0101wave2025 --- Edit' }).locator('label').click();
  await page.getByRole('button', { name: 'Remove' }).click();
  //OK - Delete Label
  const okDeleteLabel = await logResponse(page, page.getByRole('button', { name: 'OK' }), 
  '/api/v2/labels', 'OK - Delete Label'
  );
  console.log('Label has been deleted')
  expect(okDeleteLabel.status()).toBe(204);

  //Unregister Device
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.getByRole('row', { name: 'villa2025 wizyEMM Manila' }).locator('label').click(); //Unclick first to refresh
  await page.getByRole('row', { name: 'villa2025 wizyEMM Manila' }).locator('label').click();
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
    serialNumber: 'villa2025',
    profile: 'fm',
    customData: '01010101',
    name: 'wizyEMM',
    label: 'Manila', //Adjust the locator in /utils/androidDeviceHelpers.js if its not responding
    user: 'apitest'
  });
  expect(registerResponse.status()).toBe(201);
  expect(registerResponse).toBeTruthy();
  }
});