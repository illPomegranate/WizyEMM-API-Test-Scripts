//@ts-check

import {test, expect} from '@playwright/test'
import { error } from 'console'
test.setTimeout(300000)

test('Import Config', async ({page}) =>{
   
    console.log('Import Managed Config\n')
    await test.step('Navigate to the application section', async () => {

        try {
            await page.goto('/dashboard')
            await page.getByRole('link', { name: 'file-text Profile Management' }).click();
            await page.getByRole('textbox', { name: 'Filter by name' }).click();
            await page.waitForTimeout(500)
            
            await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
            await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
            await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
            await page.getByRole('tab', { name: 'Applications' }).click();
        } catch (error) {
            console.log(error)
        }
        
    
    })

    await test.step('Read the JSON File to be imported', async () => {
        const toImport = require('C:\\Users\\Kent\\Desktop\\Work\\playwright test\\WizyEMM-stuff\\downloads\\adobe.json')
        console.log('Local JSON File')
        console.log(toImport)
        console.log('==================================\n')

    })
    
    await test.step('Import a config', async () => {

        await page.getByRole('link', { name: 'Configuration' }).first().click();
        await expect(page.locator('#configuration-body')).toBeVisible()

        try {
            await page.locator('input[type="file"]').setInputFiles('C:\\Users\\Kent\\Desktop\\Work\\playwright test\\WizyEMM-stuff\\downloads\\adobe.json');
            await page.waitForTimeout(100)
            await page.getByRole('button', { name: 'Submit' }).click();
            await page.getByRole('button', { name: 'save Save' }).click();
        } catch (error) {
            console.log(error)
        }
        
    })

    await test.step('Get Proper Info', async () =>{
        const response = await page.waitForResponse(response => response.request().method() === 'PATCH')

        console.log('Uploaded Post Data\n')
        console.log('Request URL :', response.url())
        console.log('Method:', response.request().method())
        console.log('Status :', response.status(), response.statusText())

        const responseJSON = await response.request().postDataJSON()
        console.log('Uploaded JSON: \n', responseJSON.data.attributes.applications[2].managedConfiguration)

    })

})