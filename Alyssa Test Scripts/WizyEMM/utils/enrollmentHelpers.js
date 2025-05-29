const { expect } = require('@playwright/test');
import { logResponse, StatusMessage } from './dataHelpers.js';

//HONEYWELL DEVICE
export async function honeywellDevice(page, {
  notifyEmail,
  defaultProfileName,
  log = true,
  timeout = 10000}) {

  await page.getByRole('textbox', {name: 'Email to notify in case of'}).fill(notifyEmail);
  //Clear field first (X)
  const clearButton = page.locator('#form svg').nth(2);
  if (await clearButton.isVisible()) {
    await clearButton.click();
  }

  const profileSelector = page.locator('#default-profile-selector');
  await profileSelector.click();
  await profileSelector.fill(defaultProfileName);

  let profileResponse = null;
  if (log) {
    profileResponse = await logResponse(page,
    page.getByTitle(defaultProfileName),'/api/v1/', 'Default Profile Update',timeout);

    if (profileResponse) {
      console.log(`Profile update status: ${profileResponse.status()}`);
      expect(profileResponse.status()).toBe(200);
    }
  } else {
    await page.getByTitle(defaultProfileName).click();
  }
  await page.waitForTimeout(500);
  return profileResponse;
}

//UPDATE GLOBAL QR CODE
export async function globalQRCode(page, defaultProfile, timeout = 10000) {
  const clearButton = page.locator(
    'div:nth-child(4) > .ant-card-body > .ant-form-item > .ant-row > div:nth-child(2) > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-select > .ant-select-clear > .anticon > svg'
  );

  if (await clearButton.isVisible()) {
    await clearButton.click();
  }

  const selector = page.locator('#default-profile-selector');
  await selector.click();
  await selector.fill(defaultProfile);

  const selectedProfile = page.getByTitle(defaultProfile);
  await selectedProfile.waitFor({ state: 'visible', timeout: 3000 });
  await selectedProfile.click();

  //Update QR button
  const response = await logResponse(page,page.getByRole('button', { name: 'Update QR code' }),
  '/bigquery/v2/projects/','Update Global QR Code', timeout);
  expect(response.status()).toBe(200);
  return response;
}


//THIRD PARTY NOTIFICATIONS
export async function updateThirdParty(page, webHook, timeout = 20000) {
  const start = Date.now();
  const [response] = await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/v2/settings/'), { timeout }),
    page.getByRole('textbox', { name: 'https://www.mywebhook.com/path' }).click(),
    page.getByRole('textbox', { name: 'https://www.mywebhook.com/path' }).fill(webHook),
    page.getByRole('textbox', { name: 'https://www.mywebhook.com/path' }).press('Enter')
  ]);

  const end = Date.now();
  const duration = end - start;

  const request = response.request();
  const payload = request.postData();
  const parsedPayload = payload ? JSON.parse(payload) : {};


  console.log('\nThird Party Notif Response');
  console.log(`Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log('Payload:', JSON.stringify(parsedPayload, null, 2));

  await page.waitForTimeout(500);

  return response;
}
