import { StatusMessage } from './dataHelpers.js'; 

//Included 'If' condition to all not required field
export async function registerDevice(page, androidDeviceData, timeout = 10000) {
  const { serialNumber, profile, customData, name, label, user } = androidDeviceData;

  await page.getByRole('button', { name: 'plus Register Device' }).click();
  await page.getByRole('textbox', { name: '* Serial Number' }).fill(serialNumber);
  await page.getByRole('combobox', { name: '* Profile' }).click();
  await page.getByText(profile).click();
  await page.waitForTimeout(500);

  if (customData) {
    await page.getByRole('textbox', { name: 'Custom data' }).fill(customData); }
  if (name) {
    await page.getByRole('textbox', { name: 'Name' }).fill(name);}

  //Adjust the getByText if its not responding
  await page.getByRole('combobox', { name: '* Labels' }).click();
  //await page.getByText(label).nth(3).click();
  await page.getByText(label).click();

  if (user) {
  await page.getByRole('combobox', { name: 'User' }).click();
  await page.getByText(user).click();}

  await page.waitForTimeout(500);

  //Register Device
  const start = Date.now();
  const [register] = await Promise.all([page.waitForResponse(res => res.url().includes('/api/v1/devices'), { timeout }),
  page.getByRole('button', { name: 'Register', exact: true }).click()
  ]);
  const end = Date.now();
  const duration = end - start;
  const payload = register.request().postDataJSON();

  console.log('\nRegister Device');
  console.log(`Method: ${register.request().method()} | Status: ${register.status()} | Message: ${StatusMessage(register.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  return register;
}



