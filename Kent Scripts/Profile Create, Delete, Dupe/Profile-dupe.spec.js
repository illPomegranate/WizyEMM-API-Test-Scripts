// @ts-check
import { test, expect } from '@playwright/test'
test.setTimeout(300000);

test('Profile Duplication - should be 200 or OK', async ({page}) =>{
    await page.goto('/dashboard');
    await page.getByRole('link', { name: 'file-text Profile Management' }).click();

    await page.getByRole('textbox', { name: 'Filter by name' }).click();
    await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
    await page.waitForTimeout(1000)
    await page.getByRole('textbox', { name: 'Filter by name' }).press('Enter');
    await page.waitForTimeout(1000)
    await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
    await page.waitForTimeout(1000)
    
    const existing = await page.getByRole('cell', {name: 'kent qa'}).count()
    await page.waitForTimeout(1000)

    if(existing > 0 && existing <= 1)
    {
        await page.getByRole('row', { name: 'kent qa Personally-owned with' }).getByLabel('', { exact: true }).check();
        
        await page.waitForTimeout(2000)
        await page.getByRole('button', { name: 'Duplicate' }).click()

        const source = await page.waitForResponse(source => source.url().includes('api/v1/profiles/') && source.request().method() === 'GET')

        await page.getByRole('button', { name: 'OK' }).click();

        var statusText
        if(source.status() > 199 || source.status() < 300 )
        {
            statusText = 'OK'
        }

        console.log('Source Profile')
        console.log("Status Method :", source.request().method(),'\nStatus Code:', source.status(), statusText)
        console.log('Profile Link: ', source.url())
        /*TODO Get source profile and print */
    }
    else 
    {
        console.log("\nDuplicate Found\n")
    }
    await page.getByRole('row', { name: 'kent qa Personally-owned with' }).getByLabel('', { exact: true }).uncheck();
    await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();

    //Get the API URL
    const response = await page.waitForResponse(response => response.status() === 200 && response.request().method() === 'POST')
    const status = (await response.url().substring(response.url().lastIndexOf('/') + 1))

    //Get the current URL of the Profile I am in
    const currentPage = await page.url()

    //Determine status code
    var statusText
    if(response.status() > 199 || response.status() < 300 )
    {
        statusText = 'OK'
    }

    //Print out results
    console.log('\nDuplicate Profile')
    console.log("Status Method :", response.request().method(),'\nStatus Code:', response.status(), statusText)
    console.log('Profile Link: ', currentPage)

})