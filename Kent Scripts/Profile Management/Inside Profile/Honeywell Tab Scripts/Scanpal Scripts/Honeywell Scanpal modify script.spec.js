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
        await page.getByRole('tab', { name: 'Scanpal Devices' }).click();

    })

    await test.step('Honeywell Modification', async () =>{
        try {
            await expect(await page.getByLabel('Scanpal Devices').locator('div').filter({ hasText: 'Honeywell UEMConnect ScanPal' }).nth(2)).toBeVisible()
            
            //Network Settings
            await page.getByRole('button', { name: 'right Network Settings undo' }).first().click();
            await page.getByRole('button', { name: 'right Blutooth configurations' }).click();
            await page.getByRole('button', { name: 'right Bluetooth whitelist enable' }).click();
            await page.getByRole('radio', { name: 'Disable' }).check();

            await page.getByRole('button', { name: 'right Bluetooth', exact: true }).click();
            await page.getByRole('listitem').filter({ hasText: /^Select Enable or disable to enable or disable BluetoothEnableDisable$/ }).getByLabel('Disable').check();
            
            await page.getByRole('button', { name: 'right Enable Bluetooth Silent' }).click();
            await page.getByRole('radio', { name: 'Disable' }).nth(1).check();

            await page.getByRole('button', { name: 'right Ethernet Settings undo' }).click();
            await page.getByRole('button', { name: 'right Ethernet Static' }).click();
            await page.getByRole('radio', { name: 'DHCP' }).check();
            
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
       console.log('Post Data: \n', responseJSON.data.attributes.applications[6].managedConfiguration)
    
    })

    await test.step('Revert Settings ', async () =>{
        
        await page.getByRole('tab', { name: 'Scanpal Devices' }).click();
        await page.getByRole('button', { name: 'right Network Settings undo' }).getByRole('button').click()
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'save Save' }).click();

        await page.getByRole('tab', { name: 'Scanpal Devices' }).click();

    })
})