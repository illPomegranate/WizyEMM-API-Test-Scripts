import { StatusMessage } from './dataHelpers.js'; 

//Included 'If' condition to all not required field
export async function createUser(page, 
  { username, password, firstName, lastName, email, profileTitle, customAttributes = [] }, timeout = 10000) 
   {
  await page.getByRole('button', { name: 'plus Create' }).click();
  await page.getByRole('textbox', { name: '* Username :' }).fill(username);
  await page.getByRole('textbox', { name: '* Password :' }).fill(password);
  await page.getByRole('textbox', { name: '* Confirm Password :' }).fill(password);
  await page.getByRole('textbox', { name: 'First Name :' }).fill(firstName);
  await page.getByRole('textbox', { name: 'Last Name :' }).fill(lastName);
  await page.getByRole('textbox', { name: '* Email :' }).fill(email);
  await page.getByLabel('New User').getByText('Select profile').click();
  await page.getByTitle(profileTitle).click();
  await page.waitForTimeout(300);

  //Custom Attributes
  if (customAttributes.length > 0) {
    await page.getByRole('switch').first().click();
    for (let i = 0; i < customAttributes.length; i++) {
      await page.getByRole('textbox', { name: `Custom Attribute ${i + 1} :` }).fill(customAttributes[i]);
      await page.waitForTimeout(200);
    }
  }
  await page.locator('#staging').click();
  await page.waitForTimeout(300);

  //OK - Create User
  const start = Date.now();
  const [okUser] = await Promise.all([page.waitForResponse(res => res.url().includes('/api/v1/users'), { timeout }),
  page.getByRole('button', { name: 'OK' }).click()
  ]);
  const end = Date.now();
  const duration = end - start;
  const payload = okUser.request().postDataJSON();

  console.log('\nOK - User Account');
  console.log(`Method: ${okUser.request().method()} | Status: ${okUser.status()} | Message: ${StatusMessage(okUser.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  return okUser;
}

