import { test, expect } from '@playwright/test';
import { website, loginResponse, StatusMessage } from '../utils/dataHelpers.js';

test('Dashboard', async ({ page }) => {
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

  await page.getByRole('link', { name: 'VisibilityIQ Dashboard' }).click();
  await page.waitForTimeout(2000); 

  //One URL, all API  
  async function waitForApiSafe(page, urlPart, timeout = 5000) {
    try {
      return await Promise.race([
        page.waitForResponse(response => response.url().includes(urlPart)),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`No response for ${urlPart}`)), timeout)
        )
      ]);
    } catch (err) {
      console.warn(err.message);
      return null;
    }
  }
  
  //Dashboard
  const [dbResponse, profResponse, admResponse, enrbResponse, enrbrResponse, enrosResponse, batResponse, lastResponse, updResponse, netResponse] = await Promise.all([
    waitForApiSafe(page, '/api/metrics/base-metrics'),
    waitForApiSafe(page, '/api/metrics/active-devices-per-profile'),
    waitForApiSafe(page, '/api/metrics/active-devices-per-management-mode'),
    waitForApiSafe(page, '/api/metrics/enrolled-devices-per-build-number'),
    waitForApiSafe(page, '/api/metrics/enrolled-devices-per-brand'),
    waitForApiSafe(page, '/api/metrics/enrolled-devices-per-os-version'),
    waitForApiSafe(page, '/api/metrics/battery-level-breakdown'),
    waitForApiSafe(page, '/api/metrics/devices-last-seen-breakdown'),
    waitForApiSafe(page, '/api/metrics/devices-profile-update-status'),
    waitForApiSafe(page, '/api/metrics/device-connectivity'),
    page.getByRole('link', { name: 'pie-chart Dashboard' }).click()
  ]);
  
  //Base Metrics
  const dbResponseBody = await dbResponse.json();
  console.log('\nDashboard');
  console.log(`Method: ${dbResponse.request().method()} | Status: ${dbResponse.status()} | Message: ${StatusMessage(dbResponse.status())}`);
  console.log(`Base Metrics Response:\n${JSON.stringify(dbResponseBody, null, 2)}`);
  expect(dbResponse.status()).toBe(200);
  expect(dbResponseBody).toBeTruthy();
  
  //Profiles
  const profResponseBody = await profResponse.json(); 
  console.log('\nProfiles');
  console.log(`Method: ${profResponse.request().method()} | Status: ${profResponse.status()} | Message: ${StatusMessage(profResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(profResponseBody, null, 2)}`);
  expect(profResponse.status()).toBe(200);
  expect(profResponseBody).toBeTruthy();

  //Management Mode Distribution
  const admResponseBody = await admResponse.json();
  console.log('\nManagement Mode Distribution');
  console.log(`Method: ${admResponse.request().method()} | Status: ${admResponse.status()} | Message: ${StatusMessage(admResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(admResponseBody, null, 2)}`);
  expect(admResponse.status()).toBe(200);
  expect(admResponseBody).toBeTruthy();

  //Enrolled Devices per Build Number
  const enrbResponseBody = await enrbResponse.json();
  console.log('\nEnrolled Devices per Build Number');
  console.log(`Method: ${enrbResponse.request().method()} | Status: ${enrbResponse.status()} | Message: ${StatusMessage(enrbResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(enrbResponseBody, null, 2)}`);
  expect(enrbResponse.status()).toBe(200);
  expect(enrbResponseBody).toBeTruthy();

  //Device Distribution/Enrolled Device per Brand
  const enrbrResponseBody = await enrbrResponse.json();
  console.log('\nDevice Distribution');
  console.log(`Method: ${enrbrResponse.request().method()} | Status: ${enrbrResponse.status()} | Message: ${StatusMessage(enrbrResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(enrbrResponseBody, null, 2)}`);
  expect(enrbrResponse.status()).toBe(200);
  expect(enrbrResponseBody).toBeTruthy();
 
  //Android Version Distribution
  const enrosResponseBody = await enrosResponse.json();
  console.log('\nAndroid Version Distribution');
  console.log(`Method: ${enrosResponse.request().method()} | Status: ${enrosResponse.status()} | Message: ${StatusMessage(enrosResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(enrosResponseBody, null, 2)}`);
  expect(enrosResponse.status()).toBe(200);
  expect(enrosResponseBody).toBeTruthy();
 
  //Battery Level Breakdown
  const batResponseBody = await batResponse.json();
  console.log('\nBattery Level Breakdown');
  console.log(`Method: ${batResponse.request().method()} | Status: ${batResponse.status()} | Message: ${StatusMessage(batResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(batResponseBody, null, 2)}`);
  expect(batResponse.status()).toBe(200);
  expect(batResponseBody).toBeTruthy();

  //Last Seen Breakdown
  const lastResponseBody = await lastResponse.json();
  console.log('\nLast Seen Breakdown');
  console.log(`Method: ${lastResponse.request().method()} | Status: ${lastResponse.status()} | Message: ${StatusMessage(lastResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(lastResponseBody, null, 2)}`);
  expect(lastResponse.status()).toBe(200);
  expect(lastResponseBody).toBeTruthy();
 
  //Profile Update Status Distribution
  const updResponseBody = await updResponse.json();
  console.log('\nProfile Update Status Distribution');
  console.log(`Method: ${updResponse.request().method()} | Status: ${updResponse.status()} | Message: ${StatusMessage(updResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(updResponseBody, null, 2)}`);
  expect(updResponse.status()).toBe(200);
  expect(updResponseBody).toBeTruthy();
 
  //Network Connectivity
  const netResponseBody = await netResponse.json();
  console.log('\nNetwork Connectivity');
  console.log(`Method: ${netResponse.request().method()} | Status: ${netResponse.status()} | Message: ${StatusMessage(netResponse.status())}`);
  console.log(`Response:\n${JSON.stringify(netResponseBody, null, 2)}`);
  expect(netResponse.status()).toBe(200);
  expect(netResponseBody).toBeTruthy();

});