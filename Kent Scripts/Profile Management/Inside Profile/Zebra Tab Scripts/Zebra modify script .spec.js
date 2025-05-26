//@ts-check
import {expect, test} from '@playwright/test'

test('Checking Tracks (Companion)', async ({page}) =>{
    function statusTexts(code)
    {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        return code >= 200  || code <= 300 ? 'OK' :
            code ==  401 ? 'Unauthorized' :
            code == 403 ? 'Forbidden' :
            code == 500 ? 'Internal Server Error' :
            'Unknown Status';
    }

    await test.step('Navigate to zebra', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Zebra' }).click();

    })

    await test.step('Zebra Modification', async () =>{
       
        //await page.getByRole('button', { name: 'down-circle Open Step' }).click();    
        await page.getByRole('link', { name: 'Add another group' }).click();
        await page.locator('[id="string-steps\\.1\\.stepExplanation"]').click();
        await page.locator('[id="string-steps\\.1\\.stepExplanation"]').fill('test step');
        await page.locator('[id="string-steps\\.1\\.stepExplanation"]').press('Enter');

        await page.getByRole('button', { name: 'down-circle Open Step' }).nth(1).click();

        await expect(page.getByLabel('test step').locator('div').filter({ hasText: 'Error ModeAnalytics' }).nth(3)).toBeVisible()
        await page.getByRole('button', { name: 'right Error Mode' }).click();
        await page.getByText('Stop').click();
        await page.getByRole('button', { name: 'right Analytics Configuration' }).click();
        await page.getByRole('button', { name: 'right State' }).click();
        await page.getByText('Do not change').click();
        await page.getByRole('button', { name: 'right User Control of State' }).click();
        await page.getByText('Off').nth(1).click();
        await page.getByRole('button', { name: 'right App Feature' }).click();
        await page.getByRole('button', { name: 'right App Feature State' }).click();
        await page.getByText('Do not change').nth(2).click();
        await page.getByRole('button', { name: 'right App Feature Name' }).click();
        await page.getByText('Background Data').click();
        await page.getByRole('button', { name: 'Submit' }).click();

        //await page.getByRole('button', { name: 'save Save' }).click();
    })

    //Add info printing
     await test.step('Get info', async () =>{

       await page.getByRole('button', { name: 'save Save' }).click();
       const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
       const postData = response.request().postDataJSON()

       console.log('Configuration - Network Settings')
       console.log('Request URL :', response.url())
       console.log('Request Method : ', response.request().method())
       console.log('Status Code : ', response.status(), statusTexts(response.status()))
       //console.log('\nPost Data: ', postData)

       const responseJSON = await response.request().postDataJSON()
       console.log('Post Data: \n', responseJSON.data.attributes.applications[3])
    
    })

    await test.step('Revert Settings ', async () =>{

        await page.getByRole('button', { name: 'delete Remove Bundle' }).nth(1).click();
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'save Save' }).click();

    })
})