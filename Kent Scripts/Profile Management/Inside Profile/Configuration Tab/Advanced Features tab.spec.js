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

    await test.step('Navigate to the configuration section', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Configuration' }).click();

    })

    await test.step('Add profile wifi', async () =>{
        await page.getByRole('tab', { name: 'Advanced Features' }).click();

        expect(await page.locator('div').filter({ hasText: /^Advanced Device Status Update$/ }).first()).toBeVisible()

        const tab = await page.getByLabel('Advanced Features').locator('div').filter({ hasText: 'Advanced Device Status UpdateThis feature should be activated before device' }).nth(1);

        for (const buttons of await tab.getByRole('switch').all())
            await buttons.click()
            await page.waitForTimeout(100)
        
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
       console.log('Post Data: \n', postData)
    
    })

    await test.step('Revert Settings ', async () =>{
       

    })
})