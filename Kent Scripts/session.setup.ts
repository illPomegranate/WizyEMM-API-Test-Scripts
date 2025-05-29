import { test as setup } from '@playwright/test';
import { existsSync } from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
    await page.goto('https://qa2.staging-us.wizyemm.app/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(1000)
    
    await page.fill('#email', 'kentqatest@gmail.com');
    await page.waitForTimeout(1000)
    await page.fill('#password', 'Admin456!');
    await page.waitForTimeout(1000)
    
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await page.waitForURL('https://qa2.staging-us.wizyemm.app/dashboard');
    
    await page.context().storageState({ path: authFile });
    console.log(authFile);

});