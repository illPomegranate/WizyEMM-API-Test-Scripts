import { test, expect } from '@playwright/test';
import { website } from '../../../utils/dataHelpers.js';

//Not yet updated code
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
  //Tick Box Response
  const tbstart = Date.now();
  const [tbResponse] = await Promise.all([page.waitForResponse(response => response.url().includes('/bigquery/v2/projects/wizyemm-partners/datasets/qa2/tables/logs/')),
  page.getByRole('row', { name: 'apitest wifi 1 apitest wifi 1' }).getByLabel('').check(),
  page.getByRole('row', { name: 'apitest wifi 2 apitest wifi 2' }).getByLabel('').check(),

  //Adjust the script if the first = error
  // page.getByRole('row', { name: 'apitest wifi 1 apitest wifi 1' }).getByLabel('', {exact: true}).check(),
  // page.getByRole('row', { name: 'apitest wifi 2 apitest wifi 2' }).getByLabel('', {exact: true}).check(),
  ]);
  const tbend = Date.now();
  const tbresponseTime = tbend - tbstart;
  const tbStatus = tbResponse.status();
  const tbMethod = tbResponse.request().method();
  let tbStatusMessage = '';
  
  switch (tbStatus) {
    case 200:
      tbStatusMessage = 'OK';
      break;
    case 400:
      tbStatusMessage = 'Bad Request';
      break;
    case 500:
      tbStatusMessage = 'Internal Server Error';
      break;
    default:
      tbStatusMessage = 'Unknown Status';
      break;
    }
    
  console.log('\nSelected User to Delete Response');
  console.log(`Method: ${tbMethod} | Status: ${tbStatus} | Message: ${tbStatusMessage}`);
  console.log(`Response Time: ${tbresponseTime} ms`);
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: 'Remove' }).click();
  await page.waitForTimeout(500);
    
  //OK - Delete User Response
  const okdstart = Date.now();
  const [okdResponse] = await Promise.all([page.waitForResponse(response => response.url().includes('/api/v1/wifi-networks/')),
  page.getByRole('button', { name: 'OK' }).click()
  ]);
  
  const okdend = Date.now();
  const okdresponseTime = okdend - okdstart;
  const okdStatus = okdResponse.status();
  const okdMethod = okdResponse.request().method();
  let okdStatusMessage = '';
  
  switch (okdStatus) {
    case 204:
      okdStatusMessage = 'User Account Deleted/No Content';
      break;
    case 400:
      okdStatusMessage = 'Bad Request';
      break;
    case 500:
      okdStatusMessage = 'Internal Server Error';
      break;
    default:
      okdStatusMessage = 'Unknown Status';
      break;
    }
    
    console.log('\nDeleting User Response');
    console.log(`Method: ${okdMethod} | Status: ${okdStatus} | Message: ${okdStatusMessage}`);
    console.log(`Response Time: ${okdresponseTime} ms`);
    await page.waitForTimeout(500);

  }
  else{
  //Create User 1
  const crstart = Date.now();
  const [crResponse] = await Promise.all([page.waitForResponse(response => response.url().includes('/bigquery/v2/projects/wizyemm-partners/datasets/qa2/tables/logs/')),
  page.getByRole('button', { name: 'plus Create' }).click()
  ]);

  const crend = Date.now();
  const crresponseTime = crend - crstart;
  const crStatus = crResponse.status();
  const crMethod = crResponse.request().method();
  let crStatusMessage = '';

  switch (crStatus) {
    case 200:
      crStatusMessage = 'OK';
      break;
    case 400:
      crStatusMessage = 'Bad Request';
      break;
    case 500:
      crStatusMessage = 'Internal Server Error';
      break;
    default:
      crStatusMessage = 'Unknown Status';
      break;
  }
  
  console.log('\nCreating Wi-fi Network 1 Response');
  console.log(`Method: ${crMethod} | Status: ${crStatus} | Message: ${crStatusMessage}`);
  console.log(`Response Time: ${crresponseTime} ms`);
  await page.waitForTimeout(500);


  await page.getByRole('textbox', { name: '* Name' }).click();
  await page.getByRole('textbox', { name: '* Name' }).fill('apitest wifi 1');
  await page.waitForTimeout(500);

  //OK - Wi-fi Network 1 Response
  const okstart = Date.now();
  const [okResponse] = await Promise.all([page.waitForResponse(response => response.url().includes('/bigquery/v2/projects/wizyemm-partners/datasets/qa2/tables/logs/')),
  page.getByRole('button', { name: 'OK' }).click()
  ]);
  
  const okend = Date.now();
  const okresponseTime = okend - okstart;

  const okRequest = okResponse.request(); 
  const okPayload = okRequest.postData();

  const okStatus = okResponse.status();
  const okMethod = okResponse.request().method();
  let okStatusMessage = '';
  
  switch (okStatus) {
    case 201:
      okStatusMessage = 'User Created';
      break;
    case 400:
      okStatusMessage = 'Bad Request';
      break;
    case 500:
      okStatusMessage = 'Internal Server Error';
      break;
    default:
      okStatusMessage = 'Unknown Status';
      break;
    }
    
  console.log('\nOK - Wi-fi Network 1 Created Response');
  console.log(`Method: ${okMethod} | Status: ${okStatus} | Message: ${okStatusMessage}`);
  console.log(`Response Time: ${okresponseTime} ms`);

  console.log('\nA new Wi-Fi network has been created');
  const okparsedPayload = JSON.parse(okPayload);
  console.log('Payload:', JSON.stringify(okparsedPayload, null, 2));
  await page.waitForTimeout(3000);

  //Update Wi-Fi Network
  await page.getByRole('switch', { name: 'Hidden SSID' }).click();
  await page.waitForTimeout(500);
  await page.locator('#form').getByText('Select security protocol').click();
  await page.getByTitle('None').nth(1).click();
  await page.waitForTimeout(500);
  await page.getByRole('switch', { name: 'Autoconnect' }).click();
  await page.waitForTimeout(500);

  //Save Update Wi-Fi Network Response
  const savestart = Date.now();
  const [saveResponse] = await Promise.all([page.waitForResponse(response => response.url().includes('/api/v1/wifi-networks/')),
  page.getByRole('button', { name: 'save Save' }).click()
  ]);
  
  const saveend = Date.now();
  const saveresponseTime = saveend - savestart;

  const saveRequest = saveResponse.request(); 
  const savePayload = saveRequest.postData();

  const saveStatus = saveResponse.status();
  const saveMethod = saveResponse.request().method();
  let saveStatusMessage = '';
  
  switch (saveStatus) {
    case 200:
      saveStatusMessage = 'OK';
      break;
    case 400:
      saveStatusMessage = 'Bad Request';
      break;
    case 500:
      saveStatusMessage = 'Internal Server Error';
      break;
    default:
      saveStatusMessage = 'Unknown Status';
      break;
    }
    
  console.log('\nSave - Update Wi-Fi Network 1 Response');
  console.log(`Method: ${saveMethod} | Status: ${saveStatus} | Message: ${saveStatusMessage}`);
  console.log(`Response Time: ${saveresponseTime} ms`);

  console.log('\napitest wifi has been updated (Security - None)');
  const saveparsedPayload = JSON.parse(savePayload);
  console.log('Payload:', JSON.stringify(saveparsedPayload, null, 2));
  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Wi-Fi Networks' }).click();
  await page.waitForTimeout(500);

  //Create User 2
  const cr2start = Date.now();
  const [cr2Response] = await Promise.all([page.waitForResponse(response => response.url().includes('/bigquery/v2/projects/wizyemm-partners/datasets/qa2/tables/logs/')),
  page.getByRole('button', { name: 'plus Create' }).click()
  ]);

  const cr2end = Date.now();
  const cr2responseTime = cr2end - cr2start;
  const cr2Status = cr2Response.status();
  const cr2Method = cr2Response.request().method();
  let cr2StatusMessage = '';

  switch (cr2Status) {
    case 200:
      cr2StatusMessage = 'OK';
      break;
    case 400:
      cr2StatusMessage = 'Bad Request';
      break;
    case 500:
      cr2StatusMessage = 'Internal Server Error';
      break;
    default:
      cr2StatusMessage = 'Unknown Status';
      break;
  }
  
  console.log('\nCreating Wi-fi Network 2 Response');
  console.log(`Method: ${cr2Method} | Status: ${cr2Status} | Message: ${cr2StatusMessage}`);
  console.log(`Response Time: ${cr2responseTime} ms`);
  await page.waitForTimeout(500);


  await page.getByRole('textbox', { name: '* Name' }).click();
  await page.getByRole('textbox', { name: '* Name' }).fill('apitest wifi 2');
  await page.waitForTimeout(500);

  //OK - Wi-fi Network 2 Created Response
  const ok2start = Date.now();
  const [ok2Response] = await Promise.all([page.waitForResponse(response => response.url().includes('/bigquery/v2/projects/wizyemm-partners/datasets/qa2/tables/logs/')),
  page.getByRole('button', { name: 'OK' }).click()
  ]);
  
  const ok2end = Date.now();
  const ok2responseTime = ok2end - ok2start;

  const ok2Request = ok2Response.request(); 
  const ok2Payload = ok2Request.postData();

  const ok2Status = ok2Response.status();
  const ok2Method = ok2Response.request().method();
  let ok2StatusMessage = '';
  
  switch (ok2Status) {
    case 201:
      ok2StatusMessage = 'User Created';
      break;
    case 400:
      ok2StatusMessage = 'Bad Request';
      break;
    case 500:
      ok2StatusMessage = 'Internal Server Error';
      break;
    default:
      ok2StatusMessage = 'Unknown Status';
      break;
    }
    
  console.log('\nOK - Wi-fi Network 2 Response');
  console.log(`Method: ${ok2Method} | Status: ${ok2Status} | Message: ${ok2StatusMessage}`);
  console.log(`Response Time: ${ok2responseTime} ms`);

  console.log('\nA new Wi-Fi network has been created');
  const ok2parsedPayload = JSON.parse(ok2Payload);
  console.log('Payload:', JSON.stringify(ok2parsedPayload, null, 2));
  await page.waitForTimeout(3000);

  //Update Wi-Fi Network
  await page.locator('#form').getByText('Select security protocol').click();
  await page.getByTitle('WEP-PSK').click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: '* Password' }).click();
  await page.getByRole('textbox', { name: '* Password' }).fill('GARDENVILLA18');
  await page.waitForTimeout(500);
  await page.getByRole('switch', { name: 'Autoconnect' }).click();
  await page.waitForTimeout(500);

  //Save Update Wi-Fi Network Response
  const save2start = Date.now();
  const [save2Response] = await Promise.all([page.waitForResponse(response => response.url().includes('/api/v1/wifi-networks/')),
  page.getByRole('button', { name: 'save Save' }).click()
  ]);
  
  const save2end = Date.now();
  const save2responseTime = save2end - save2start;

  const save2Request = save2Response.request(); 
  const save2Payload = save2Request.postData();

  const save2Status = save2Response.status();
  const save2Method = save2Response.request().method();
  let save2StatusMessage = '';
  
  switch (save2Status) {
    case 200:
      save2StatusMessage = 'OK';
      break;
    case 400:
      save2StatusMessage = 'Bad Request';
      break;
    case 500:
      save2StatusMessage = 'Internal Server Error';
      break;
    default:
      save2StatusMessage = 'Unknown Status';
      break;
    }
    
  console.log('\nSave - Update Wi-Fi Network 2 Response');
  console.log(`Method: ${save2Method} | Status: ${save2Status} | Message: ${save2StatusMessage}`);
  console.log(`Response Time: ${save2responseTime} ms`);

  console.log('\napitest wifi has been updated (Security - WEP-PSK & WPA-PSK)');
  const save2parsedPayload = JSON.parse(save2Payload);
  console.log('Payload:', JSON.stringify(save2parsedPayload, null, 2));
  }

//Pending - WPA -EAP and its additional functions 
  
});
