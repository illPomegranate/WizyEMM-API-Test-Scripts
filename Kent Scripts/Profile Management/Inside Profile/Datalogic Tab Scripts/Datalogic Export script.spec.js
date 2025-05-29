//@ts-check
import {test, expect} from '@playwright/test'
const path = require("path")

test('Datalogic exporting', async ({page}) => {

    console.log('Exporting Datalogic config')
    await test.step('Navigate to Zebra  section', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.waitForTimeout(500)
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Datalogic' }).click();
    
    })

    await test.step('Download Datalogic Config', async () =>{

           try {
               page.on('response', response =>{
               if(response.url().includes('/managed-configurations/')){
                   console.log('Request URL :', response.url())
                   console.log(`Method: ${response.request().method()}`)
                   console.log(`Status : ${response.status(), response.statusText()}\n`)
               }
               })
           
               //Download event
               const downloadPromise = page.waitForEvent('download');
               await page.getByText('export').click();
               const download = await downloadPromise;
           
               const fileName = '\\WizyEMM-stuff\\downloads\\datalogicExports.json'
               const filePath = path.join(process.cwd(), fileName)
               await download.saveAs(filePath);
           
               console.log(`Download Path: ${filePath}`)
               console.log('Download URL: \n\t', download.url())
           
               //Exported File
               const toImport = require(filePath)
               console.log('Local JSON File')
               console.log(toImport.steps)
               
           } catch (error) {
               console.log(`Something went wrong: ${error}`)
           }
       })

})