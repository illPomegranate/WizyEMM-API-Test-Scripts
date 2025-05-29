import { test, expect } from '@playwright/test';
import { website, loginResponse, logResponse, payloadRequest } from '../utils/dataHelpers.js';

test('Wi-Fi Networks', async ({ page }) => {
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

//Click Configuration module to reveal Wi-Fi Networks tab 
  await page.getByRole('menuitem', { name: 'control Configuration' }).locator('span').first().click();
  //Wi-Fi Networks Tab
  await page.getByRole('link', { name: 'Wi-Fi Networks' }).click();
  await page.waitForTimeout(3000);

  //DELETE - Existing User Account
  const existing = 
  await page.getByRole('row', { name: 'apitest wifi 1 apitest wifi 1' }).isVisible();
  await page.getByRole('row', { name: 'apitest wifi 2 apitest wifi 2' }).isVisible();
  await page.waitForTimeout(1000);
  
  if(existing){
  await page.getByRole('row', { name: 'apitest wifi 1 apitest wifi 1' }).locator('label').click();
  await page.getByRole('row', { name: 'apitest wifi 2 apitest wifi 2' }).locator('label').click();

  await page.getByRole('button', { name: 'Remove' }).click();
  await page.waitForTimeout(500);

  //OK - Delete Wi-Fi Networks 
  const okDeleteWifi = await logResponse(page, page.getByRole('button', { name: 'OK' }), 
  '/api/v1/wifi-networks/', 'OK - Delete Wi-Fi Networks'
  );
  console.log('The wi-fi netwroks has been deleted')
  expect(okDeleteWifi.status()).toBe(204);
  }
  else{
  //Create User 1
  await   page.getByRole('button', { name: 'plus Create' }).click()
  await page.getByRole('textbox', { name: '* Name' }).fill('apitest wifi 1');
  await page.waitForTimeout(500);

  //OK - Wi-fi Network 1 
  const okCreateWifi = await payloadRequest(page, 'OK', '/api/v1/wifi-networks');
  expect(okCreateWifi.status()).toBe(201);
  expect(okCreateWifi).toBeTruthy();

  //Update Wi-Fi Network
  await page.getByRole('switch', { name: 'Hidden SSID' }).click();
  await page.waitForTimeout(500);
  await page.locator('#form').getByText('Select security protocol').click();
  await page.getByTitle('None').nth(1).click();
  await page.waitForTimeout(500);
  await page.getByRole('switch', { name: 'Autoconnect' }).click();
  await page.waitForTimeout(500);

  //Save Update Wi-Fi Network Response
  const okUpdateWifi = await payloadRequest(page, 'Save', '/api/v1/wifi-networks/');
  expect(okUpdateWifi.status()).toBe(200);
  expect(okUpdateWifi).toBeTruthy();

  await page.getByRole('link', { name: 'Wi-Fi Networks' }).click();
  await page.waitForTimeout(500);

  //Create User 2
  await page.getByRole('button', { name: 'plus Create' }).click()
  await page.getByRole('textbox', { name: '* Name' }).fill('apitest wifi 2');
  await page.waitForTimeout(500);

  //OK - Wi-fi Network 2 
  const okCreateWifi2 = await payloadRequest(page, 'OK', '/api/v1/wifi-networks');
  expect(okCreateWifi2.status()).toBe(201);
  expect(okCreateWifi2).toBeTruthy();

  //Update Wi-Fi Network
  await page.getByRole('switch', { name: 'Hidden SSID' }).click();
  await page.waitForTimeout(500);
  await page.locator('#form').getByText('Select security protocol').click();
  await page.getByTitle('WEP-PSK').click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: '* Password' }).fill('GARDENVILLA18');
  await page.waitForTimeout(500);
  await page.getByRole('switch', { name: 'Autoconnect' }).click();
  await page.waitForTimeout(500);

  //Save Update Wi-Fi Network Response
  const okUpdateWifi2 = await payloadRequest(page, 'Save', '/api/v1/wifi-networks/');
  expect(okUpdateWifi2.status()).toBe(200);
  expect(okUpdateWifi2).toBeTruthy();

//Pending - WPA -EAP and its additional functions 
  }
});
