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
    
    await test.step('Navigate to Datalogic', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Datalogic' }).click();

    })

    await test.step('Datalogic Modification', async () =>{
        try {
            await expect(await page.locator('#configuration-body')).toBeVisible()
       
            await page.getByRole('button', { name: 'right Apply All Defaults' }).click();
            await page.getByRole('switch').click();

            await page.getByRole('button', { name: 'right Dock Settings undo' }).click();
            await page.getByRole('button', { name: 'right Firmware update policy' }).click();
            await page.getByText('Update disabled').click();

            await page.getByRole('button', { name: 'right Cradle unlock notification policy' }).click();
            await page.getByText('SSD Locking', { exact: true }).click();
            
            await page.getByRole('button', { name: 'right Security undo Reset' }).click();
            await page.getByRole('button', { name: 'right Datalogic SDK API' }).click();
            await page.getByRole('button', { name: 'right Reset API access lists' }).click();
            await page.getByRole('listitem').filter({ hasText: 'Security settingsDatalogic' }).getByRole('switch').click();
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
       console.log('Post Data: \n', responseJSON.data.attributes.applications[4].managedConfiguration)
    
    })

    await test.step('Revert Settings ', async () =>{
        
        await page.getByRole('button', { name: 'Reset', exact: true }).click();
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'save Save' }).click();

    })
})