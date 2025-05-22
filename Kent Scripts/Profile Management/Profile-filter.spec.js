//@ts-check
//dito na ako ehehe
import { test } from '@playwright/test'
test.setTimeout(30000)

//Test is only for my duplicate profile
test('01. Profile filter check', async ({ page}) =>{
    //await page.goto('/dashboard')
    await page.goto('/dashboard');

    await page.getByRole('link', { name: 'file-text Profile Management' }).click();
    await page.getByRole('textbox', { name: 'Filter by name' }).click();
    await page.waitForTimeout(3000)
    await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
    await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');

    const response = await page.waitForResponse(response => response.url().includes('kent'))

    //Look for profile sort
    console.log("Test 01 - Profile Filter")
    console.log('Request URL :',response.url())
    console.log('Response Method :',response.request().method())
    console.log('Response Status Code:',response.status())

    //await page.getByRole('textbox', { name: 'Filter by name' }).click();
    //
    //await page.waitForTimeout(2000);
    //await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
    //await page.waitForTimeout(2000);
    //
    //await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
    //await page.waitForTimeout(2000);
    //
    //await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
    //
    //const response = await page.waitForResponse(response => response.url().includes('/api/v1/profiles'))
    //console.log('Status Method: ', response.request().method(), '\nStatus Code: ', response.status())
    //
    ////just check the entire thing good luck readin all that
    //const status = await response.statusText();
    //console.log(status)

    //await page.goto('/profiles/8def6d3c-7b99-450e-b92a-ad9393f29478/policies')
    //const response = await page.waitForResponse(response => response.url().includes('api/v1/profiles'))

    //const response = await page.waitForResponse(response => response.url().includes('/profiles/8def6d3c-7b99-450e-b92a-ad9393f29478/policies'))
    //console.log(response.statusText())
    //console.log(response.request().method())
    //console.log(response.status())
    //console.log(response.statusText())
        
})
