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
    
    await test.step('Navigate to Honeywell', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Honeywell' }).click();

    })

    await test.step('Honeywell Modification', async () =>{
        try {
            await expect(await page.locator('#configuration-body')).toBeVisible()
            
            //Network Settings
            await page.getByRole('button', { name: 'right Network Settings undo' }).click();
            await page.getByRole('button', { name: 'right Bluetooth' }).click();
            await page.getByRole('button', { name: 'right Bluetooth whitelist enable' }).click();
            await page.getByRole('radio', { name: 'Enable' }).check();

            await page.getByRole('button', { name: 'right BT FTP Profile' }).click();
            await page.getByRole('listitem').filter({ hasText: /^Select Enable or disable to enable or disable BT FTP ProfileEnableDisable$/ }).getByLabel('Enable').check();

            await page.getByRole('button', { name: 'right VPN Profile undo Reset' }).click();
            await page.getByRole('button', { name: 'right VPN Type' }).click();
            await page.getByText('PPTP').click();

            //Scanner settings
            await page.getByRole('button', { name: 'right Scanner Settings undo' }).click();
            await page.getByRole('button', { name: 'right General Settings undo' }).click();
            await page.getByRole('button', { name: 'right Key Repeat Disable' }).click();
            await page.getByRole('listitem').filter({ hasText: 'Configure Scanner (DCS)' }).getByLabel('Enable').check();
            
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
       console.log('Post Data: \n', responseJSON.data.attributes.applications[5].managedConfiguration)
    
    })

    await test.step('Revert Settings ', async () =>{
        
        await page.getByRole('button', { name: 'right Network Settings undo' }).getByRole('button').click();
        await page.getByRole('button', { name: 'OK' }).click();
        
        await page.getByRole('button', { name: 'right Scanner Settings undo' }).getByRole('button').click();
        await page.getByRole('button', { name: 'OK' }).click();

        await page.getByRole('button', { name: 'save Save' }).click();
    })
})