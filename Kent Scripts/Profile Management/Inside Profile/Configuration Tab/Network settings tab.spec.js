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
        await page.getByRole('tab', { name: 'Network Settings' }).click();

        await page.getByRole('button', { name: 'plus Add' }).click();
        expect(await page.locator('div').filter({ hasText: /^Add Profile Wi-Fi Networks$/ }).first()).toBeVisible()

        await page.waitForTimeout(3000)
        await page.getByRole('textbox', { name: 'Filter by name', exact: true }).fill('interns')

        await page.getByRole('row', { name: 'interns wifi1 interns wifi1 WEP-PSK', exact: true }).getByRole('cell').first().getByRole('checkbox').check()

        await page.getByRole('button', { name: 'OK' }).click()

        await page.locator('div').filter({ hasText: /^Choose Application$/ }).nth(1).getByRole('combobox').click()
        await page.locator('div').filter({ hasText: /^Companion$/ }).nth(2).click();
        await page.getByRole('switch').click();
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
       console.log('Post Data: \n', JSON.stringify(responseJSON, null, 2))
    
    })

    await test.step('Revert Settings ', async () =>{
        await page.getByRole('tab', { name: 'Network Settings' }).click();

       await page.locator('tbody').getByRole('cell').filter({ hasText: /^$/ }).getByRole('checkbox').check()
       await page.getByRole('button', { name: 'Remove' }).click()
       await page.getByRole('button', { name: 'Yes' }).click();


       await page.getByRole('listitem').filter({ hasText: 'VPN AppCompanion' }).locator('svg').nth(1).click()
       await page.getByRole('button', { name: 'save Save' }).click();

    })
})