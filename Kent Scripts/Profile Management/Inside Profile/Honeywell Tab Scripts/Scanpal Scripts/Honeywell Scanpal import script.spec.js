//@ts-check
import {expect, test} from '@playwright/test'
const path = require("path")

test('Honeywell imports', async ({page}) =>{
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

    const fileName = '\\WizyEMM-stuff\\downloads\\honeyWellScanpalImports.json'
    const filePath = path.join(process.cwd(), fileName)

    await test.step('Importing honeywell scanpal', async () =>{
        try {
            const toImport = require(filePath)
            console.log('Local Scanpal File')

            console.log(toImport)
            console.log('==================================\n')
        } catch (error) {
            console.log(`Something went wrong: ${error}`)
        }
    })

    await test.step('Import the config', async () => {
        try {
            await page.locator('//*[@id="rc-tabs-1-panel-com.honeywell.oemconfig.scanpal"]/div[2]/div/div[2]/div/div[2]/div/span/div/span/input').setInputFiles(filePath);
            await page.waitForTimeout(100)
            //await page.getByRole('button', { name: 'save Save' }).click();
        } catch (error) {
            console.log(`Something went wrong: ${error}`)
        }
    })

    //Add info printing
     await test.step('Get info', async () =>{

       await page.getByRole('button', { name: 'save Save' }).click();
       const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
       const postData = response.request().postDataJSON()

       console.log('Honeywell Scanpal')
       console.log('Request URL :', response.url())
       console.log('Request Method : ', response.request().method())
       console.log('Status Code : ', response.status(), statusTexts(response.status()))

       const responseJSON = await response.request().postDataJSON()
       console.log('Post Data: \n', responseJSON.data.attributes.applications[6].managedConfiguration)
    
    })
})