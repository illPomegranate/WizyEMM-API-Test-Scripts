//@ts-check
import {expect, test} from '@playwright/test'

test('Datalogic modifications', async ({page}) =>{
    function statusTexts(code)
    {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        return code >= 200  || code <= 300 ? 'OK' :
            code ==  401 ? 'Unauthorized' :
            code == 403 ? 'Forbidden' :
            code == 500 ? 'Internal Server Error' :
            'Unknown Status';
    }
    
    await test.step('Navigate to Applications', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Applications' }).click();

    })

    await test.step('Application Blacklist', async () =>{
        try {
            await expect(await page.getByText('Mode Selection')).toBeVisible()
            
            await page.getByText('Blocked Applications').scrollIntoViewIfNeeded()
            await page.getByRole('button', { name: 'plus Choose Applications' }).nth(1).click()

            await expect(page.getByLabel('Choose Applications').locator('div').filter({ hasText: 'Choose Applications' }).nth(1)).toBeVisible()

            await page.getByRole('row', { name: 'Call of Duty: Mobile Season 7' }).getByRole('checkbox').check()
            await page.getByRole('button', { name: 'OK' }).click()

        } catch (error) {
            console.log(`Something went wrong : ${error}`)
        }
        
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

       const responseJSON = await response.request().postDataJSON()
       console.log('Post Data: \n', responseJSON.data.attributes.applications[0])
    
    })

    await test.step('Revert settings', async () =>{
        
        await page.getByRole('row', { name: 'Call of Duty: Mobile Season 7' }).getByRole('checkbox').check()
        await page.getByRole('button', { name: 'Remove Applications' }).click()
        await page.getByRole('button', { name: 'Yes' }).click()

        await page.getByRole('button', { name: 'save Save' }).click();
        
    })

})