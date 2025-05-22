/* NOTE: Requires the Adobe acrobat to be in the list to work 
            File should be empty if no option is modified*/
//@ts-check
import {test, expect} from '@playwright/test'
import { request } from 'http'
const path = require("path")

//Export
 test('Export Adobe Acrobat Config', async ({page}) =>{

    console.log('Exporting Managed Config\n')
    await test.step('Navigate to the application section', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.waitForTimeout(3000)
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Applications' }).click();
    
    })
    
    await test.step('Download Managed Config', async () =>{

        page.on('response', response =>{
            if(response.url().includes('/managed-configurations/')){
                console.log('Request URL :', response.url())
                console.log(`Method: ${response.request().method()}`)
                console.log(`Status : ${response.status(), response.statusText()}\n`)
            }
        })
        await page.getByRole('link', { name: 'Configuration' }).first().click();
        await expect(page.locator('#configuration-body')).toBeVisible()

        //Download event
        const downloadPromise = page.waitForEvent('download');
        await page.getByText('export').click();
        const download = await downloadPromise;

        const fileName = '\\WizyEMM-stuff\\downloads\\adobe.json'
        const filePath = path.join(process.cwd(), fileName)
        await download.saveAs(filePath);

        console.log(`Download Path: ${filePath}`)
        console.log('Download URL: \n\t', download.url())


        //Exported File
        const toImport = require('C:\\Users\\Kent\\Desktop\\Work\\playwright test\\WizyEMM-stuff\\downloads\\adobe.json')
        console.log('Local JSON File')
        console.log(toImport)
    })
    
})