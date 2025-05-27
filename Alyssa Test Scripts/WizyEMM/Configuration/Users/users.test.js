const { test, expect } = require('@playwright/test');
function user(statusCode) {
  const statusMessages = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  };
  return statusMessages[statusCode] || 'Unknown Status';
  }

test('Users Tab Test', async ({ page }) => {
//Open website
  const response = await page.goto('https://qa2.staging-us.wizyemm.app/');
  console.log(`Opening Website Method: ${response.request().method()} | Status: ${response.status()} | Message: ${user(response.status())}`);
  test.setTimeout(120000);
    
//Login Credentials
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(2000);
  await page.locator('id=email').fill('ms.alycortez@gmail.com')
  await page.waitForTimeout(200);
  await page.locator('id=password').fill('Newmsalypass1!')
  await page.waitForTimeout(200);
    
  //Login button status
  const start = Date.now();
  const [login] = await Promise.all([page.waitForResponse(response => response.url().includes('/login'), { timeout: 5000 }),
  page.locator('//*[@id="btn-login"]').click()
  ]);
  const end = Date.now();
  const responseTime = end - start;
  console.log(`\nLogin Method: ${login.request().method()} | Status: ${login.status()} | Message: ${user(login.status())}`);
  console.log(`Response Time: ${responseTime} ms`);
  expect(login.status()).toBe(200);
  await page.waitForTimeout(15000);

//Click Configuration module to reveal Users tab - Manually click if its not responding
  await page.getByRole('menuitem', { name: 'control Configuration' }).locator('span').first().click();
  await page.getByRole('link', { name: 'Users', exact: true }).click() //Users Tab
  await page.waitForTimeout(3000);

  //Look if user account is existing
  const existing = await page.getByRole('row', { name: '1317 ms.alycortez@gmail.'}).isVisible();
if (existing) {
  await page.getByRole('row', { name: '1317 ms.alycortez@gmail.' }).locator('label').click();
  await page.getByRole('button', { name: 'Remove' }).click();
  await page.waitForTimeout(1000);

  //OK - Delete User Account
  const [okd] = await Promise.all([page.waitForResponse((response) => response.url().includes('/api/v1/users'), { timeout: 10000 }),
  page.getByRole('button', { name: 'OK' }).click(),
  ]);
  console.log('\nOK - Delete User Account');
  console.log(`Method: ${okd.request().method()} | Status: ${okd.status()} | Message: ${user(okd.status())}`);
  expect(okd.status()).toBe(204); 
  await page.waitForTimeout(2000);

} else {//Fill-out User form
  await page.getByRole('button', { name: 'plus Create' }).click();
  await page.getByRole('textbox', { name: '* Username :' }).fill('1317');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: '* Password :' }).fill('Gardenvilla18!');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: '* Confirm Password :' }).fill('Gardenvilla18!');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'First Name :' }).fill('api');
  await page.getByRole('textbox', { name: 'Last Name :' }).fill('test');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: '* Email :' }).fill('ms.alycortez@gmail.com');
  await page.waitForTimeout(500);
  await page.getByLabel('New User').getByText('Select profile').click();
  await page.getByTitle('-5-2-2025 InternQATest').click();
  await page.waitForTimeout(500);

  //Custom Attributes
  await page.getByRole('switch').first().click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Custom Attribute 1 :' }).fill('SVT');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Custom Attribute 2 :' }).fill('Sebong');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Custom Attribute 3 :' }).fill('GoSe');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Custom Attribute 4 :' }).fill('Happy');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'Custom Attribute 5 :' }).fill('Burstday');
  await page.waitForTimeout(500);
  await page.locator('#staging').click()
  await page.waitForTimeout(500);

  //OK - User Created 
  const [okuser] = await Promise.all([page.waitForResponse((response) =>response.url().includes('/api/v1/users'), { timeout: 10000 }),
  page.getByRole('button', { name: 'OK' }).click(),
  ]);
  const okuserRequest = okuser.request();
  const okuserPayload = okuserRequest.postData();
  const okuserparsed = JSON.parse(okuserPayload);

  console.log('\nOK - User Account');
  console.log(`Method: ${okuser.request().method()} | Status: ${okuser.status()} | Message: ${user(okuser.status())}`);
  console.log('Payload:', JSON.stringify(okuserparsed, null, 2));
  expect(okuser.status()).toBe(201);
  expect(okuserPayload).toBeTruthy();
  await page.waitForTimeout(2000);
 
  //Select User Account
  await page.getByText('1317').click();
  await page.getByRole('textbox', { name: 'First Name :' }).fill('picheolin');
  await page.waitForTimeout(500);
  await page.getByRole('switch').nth(2).click();
  await page.getByRole('textbox', { name: '* Password :' }).fill('Newgarden2025');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: '* Confirm Password :' }).fill('Newgarden2025');
  await page.waitForTimeout(500);
  await page.locator('#staging').click();

  //OK - User Updated Response
  const [update] = await Promise.all([page.waitForResponse(response => response.url().includes('/api/v1/users')),
  page.getByRole('button', { name: 'OK' }).click()
  ]);
  const updateRequest = update.request();
  const updatePayload = updateRequest.postData();
  const updateparsed = JSON.parse(updatePayload);

  console.log('\nUpdate - User Account');
  console.log(`Method: ${update.request().method()} | Status: ${update.status()} | Message: ${user(update.status())}`);
  console.log('Payload:', JSON.stringify(updateparsed, null, 2));
  expect(update.status()).toBe(200);
  expect(updatePayload).toBeTruthy();
  await page.waitForTimeout(2000);
  }

});