// @ts-check
import { test, expect } from '@playwright/test'
test.setTimeout(300000);

const PROFILENAME = 'kent qa'
/* TODO
        - Learn how to use page
        -   Get the response of the deleted profile - Done
        -   Get the status code of the deleted profile - Done
        -   Access different stuff kek */

test('Profile Create and delete', async ({ page }) => {
    var response
    var statusText
    
    await page.goto('/dashboard');

    await page.waitForTimeout(1000)
    await page.getByRole('link', { name: 'file-text Profile Management' }).click();
    await page.waitForTimeout(1000)

    //Check if the profile exists first
    await page.getByRole('textbox', { name: 'Filter by name' }).click();
    await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
    await page.waitForTimeout(1000)
    await page.getByRole('textbox', { name: 'Filter by name' }).press('Enter');
    await page.waitForTimeout(1000)
    await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
    await page.waitForTimeout(1000)
    
    const existing = await page.getByRole('cell',{name: PROFILENAME, exact:true}).isVisible()
    await page.waitForTimeout(1000)

    //Binaliktad ko muna post and delete blocks
    if(existing)
    {
        await page.getByRole('row', { name: 'kent qa Personally-owned with' }).getByLabel('', { exact: true }).check();
        await page.waitForTimeout(2000)
        await page.getByRole('button', { name: 'Remove' }).click();
        await page.waitForTimeout(1000)
        await page.getByRole('button', { name: 'OK' }).click();

        response = await page.waitForResponse(response => response.url().includes('api/v1/profiles'))
        if(response.status() > 199 || response.status() < 300 )
        {
            statusText = 'OK'
        }

        console.log("\nProfile deleted");
        console.log("Status Method :", response.request().method(),'\nStatus Code: ', response.status(), ' ', statusText)

        //Link of deleted profile
        const finalUrl = (await response.url().substring(response.url().lastIndexOf('/') + 1));
        console.log("Affected profile: ", page.url() + '/' + finalUrl +'/policies/')

    } 
    else 
    {
        //console.log("Profile does not exist")
        //await page.waitForTimeout(1000)
        //return;
    }

        //Extra stuff
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.waitForTimeout(2000)
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.waitForTimeout(2000)
        //Extra stuff
        await page.waitForTimeout(1000)
        await page.getByRole('button', { name: 'plus Create' }).click();
        await page.waitForTimeout(1000)

        await page.getByRole('textbox', { name: '* Name' }).click();
        await page.getByRole('textbox', { name: '* Name' }).fill('kent qa');
        await page.getByLabel('New Profile').getByText('Personally-owned with work').click();
        await page.waitForTimeout(1000)
        
        //Check Status Response 
        await page.getByRole('button', { name: 'OK' }).click();

        response = await page.waitForResponse(response => response.url().includes('api/v1/profiles'))
        if(response.status() > 199 || response.status() < 300 )
        {
                statusText = 'OK'
        }
        //https://stg-wizy-emm-us.appspot.com/api/v1/profiles
                
        console.log("\nProfile created");
        console.log("Status Method :", response.request().method(),'\nStatus Code:', response.status(), statusText)
        await page.waitForTimeout(1000)
        console.log("Profile Link: ", page.url())
})
