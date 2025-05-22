//@ts-check
import { test, expect } from '@playwright/test'

test('02. Open Profile and change name', async ({ page}) =>{
    await page.goto('/dashboard')
    await page.getByRole('link', { name: 'file-text Profile Management' }).click();
    await page.getByRole('textbox', { name: 'Filter by name' }).click();
    await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
    await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
    await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
    await page.getByRole('button', { name: 'edit' }).click();
    await page.getByRole('textbox').first().click();
    await page.getByRole('textbox').first().press('ControlOrMeta+a');
    await page.getByRole('textbox').first().fill('kent qa change name');
    await page.getByRole('textbox').first().press('Enter');
    await page.getByRole('button', { name: 'save Save' }).click();

    // Di sure kung patch
    const response = await page.waitForResponse(response => response.request().method() === 'PATCH' )
    console.log('\nTest 02 - Edit Name')
    console.log('Response URL :', response.url())
    console.log('Response Request Method :', response.request().method())
    console.log('Response Status Code :', response.status())

    //Edit pabalik
    await page.getByRole('button', { name: 'edit' }).click();
    await page.getByRole('textbox').first().click();
    await page.getByRole('textbox').first().press('ControlOrMeta+a');
    await page.getByRole('textbox').first().fill('kent qa - Duplicate');
    await page.getByRole('textbox').first().press('Enter');
    await page.getByRole('button', { name: 'save Save' }).click();
    await page.waitForTimeout(3000)
    
})