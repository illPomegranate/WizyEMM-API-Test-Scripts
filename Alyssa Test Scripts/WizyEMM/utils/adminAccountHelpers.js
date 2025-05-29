import { StatusMessage } from './dataHelpers.js'; 

//CREATE ADMIN ACCOUNT
export async function createAdmin(page, adminAccountData, timeout = 10000) {
  const {
  firstName,
  lastName,
  email,
  roleType,
  useOwnSplashtopAccount = false,
  profiles = [], 
  labels = [],
  addMoreLabels = []
  } = adminAccountData;

  if (!firstName || !lastName || !email || !roleType) {
  throw new Error('Fill-out required fields.'); }

  const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  if (!emailRegex.test(email)) {
  throw new Error(`Invalid email: ${email}`);}

  await page.getByRole('button', { name: 'plus Create' }).click();
  await page.getByRole('textbox', { name: '* First Name :' }).fill(firstName);
  await page.getByRole('textbox', { name: '* Last Name :' }).fill(lastName);
  await page.getByRole('textbox', { name: '* Email :' }).fill(email);

  if (!useOwnSplashtopAccount) {
  await page.locator('#create-admin-splashtop').click();
  await page.getByTitle('Use Splashtop Service Account').click();}

  //Role selection
  await page.locator('#create-admin-role').click();
  const roleOption = page.locator(`.ant-select-item-option-content >> text="${roleType}"`);
  await roleOption.scrollIntoViewIfNeeded();
  await roleOption.click();

  //Profiles
  if (Array.isArray(profiles) && profiles.length > 0 &&
  await page.locator('.ant-select-selection-overflow').first().isVisible()) 
  {const profileField = page.locator('.ant-select-selection-overflow').first();
  for (const prof of profiles) {
    if (prof?.trim()) {
    await profileField.click();
    await page.getByTitle(prof).click();
    }
  }
}

  //Labels
  if (Array.isArray(labels) && labels.length > 0 &&
  await page.locator('.ant-form-item-control-input-content > div > .ant-select > .ant-select-selector').isVisible()) 
  {const labelInput = page.locator('.ant-form-item-control-input-content > div > .ant-select > .ant-select-selector');
  await labelInput.click();
    for (const label of labels) {
    if (label?.trim()) {
    const labelOption = page.locator('span', { hasText: label });
    await labelOption.click();
    }
  }
}

  //Add Group Labels
  if (Array.isArray(addMoreLabels) && addMoreLabels.length > 0) {for (const extraLabel of addMoreLabels)
    {if (extraLabel?.trim()) {
  await page.getByRole('button', { name: 'plus Add group label' }).click();
  await page.locator('div:nth-child(2) > .ant-select > .ant-select-selector').click();
  await page.getByText(extraLabel).click();
    }
  }
}
  const start = Date.now();
  const [admin] = await Promise.all([page.waitForResponse(res => res.url().includes('/api/v1/administrators'), { timeout }),
  page.getByRole('button', { name: 'OK' }).click()
  ]);
  const end = Date.now();
  const duration = end - start;
  const payload = admin.request().postDataJSON();

  console.log('\nCreate Admin Account');
  console.log(`Method: ${admin.request().method()} | Status: ${admin.status()} | Message: ${StatusMessage(admin.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  return admin;
}

  

