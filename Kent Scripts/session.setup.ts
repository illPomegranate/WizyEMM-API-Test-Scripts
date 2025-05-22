import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.

    await page.goto('https://qa2.staging-us.wizyemm.app/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(1000)
    
    await page.fill('#email', 'kentqatest@gmail.com');
    await page.waitForTimeout(1000)
    await page.fill('#password', 'Admin456!');
    await page.waitForTimeout(2000)
    
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForURL('https://qa2.staging-us.wizyemm.app/dashboard');
    //await page.waitForURL('https://qa2.staging-us.wizyemm.app/dashboard');
    // Wait until the page receives the cookies.
    // Sometimes login flow sets cookies in the process of several redirects.
    // Wait for the final URL to ensure that the cookies are actually set.
    // Alternatively, you can wait until the page reaches a state where all cookies are set.
    // End of authentication steps.
    
    await page.context().storageState({ path: authFile });
    console.log(authFile);

});