//@ts-check
import {test, expect} from '@playwright/test'
const path = require("path")

test('Import Knox Config', async ({page}) => {

    console.log('Importing Knox preset Configuration')
    await test.step('Navigate to the Knox section', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.waitForTimeout(500)
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Knox' }).click();
    
    })

    const fileName = '\\WizyEMM-stuff\\downloads\\com-samsung-android-knox-kpu.json'
    const filePath = path.join(process.cwd(), fileName)

    await test.step('Read the JSON File to be imported', async () => {
        const toImport = require(filePath)
        console.log('Local Knox File')

        console.log(toImport)
        console.log('==================================\n')

    })

    await test.step('Import the config', async () => {

        await page.locator('input[type="file"]').setInputFiles(filePath);
        await page.waitForTimeout(100)
        await page.getByRole('button', { name: 'save Save' }).click();
    })

    await test.step('Get Proper Info', async () =>{
        const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        console.log('Uploaded Post Data\n')

        console.log('Request URL :', response.url())
        console.log('Method:', response.request().method())
        console.log('Status :', response.status(), response.statusText())

        const responseJSON = await response.request().postDataJSON()
        console.log('Post Data: \n', responseJSON.data.attributes.applications[0])
        

    })
    
})