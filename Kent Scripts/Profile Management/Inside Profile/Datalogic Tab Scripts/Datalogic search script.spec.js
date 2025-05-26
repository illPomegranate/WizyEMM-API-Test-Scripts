//@ts-check
import {test, expect} from '@playwright/test'
const path = require("path")

test('Datalogic Tab Search', async ({page}) => {

    console.log('Datalogic Tab Search')
    await test.step('Navigate to the Datalogic section', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.waitForTimeout(500)
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Datalogic' }).click();
    
    })

    await test.step('Search something', async () => {
        try {
            const searchQuery = ['Bluetooth', 'Airplane', 'Network', 'Advanced', 'Disable']
 
            //Get all variables containing the word
            for(const query of searchQuery){

                const searchBar= await page.getByRole('textbox', { name: 'Press Enter to search for' })
                await searchBar.fill(query)
                await page.getByRole('button', { name: 'search' }).click()

                //Di tapos
                //const items = await page.getByText(query)
                //const itemNum = await items.count() 

                //console.log(`${query} count (times appeared):${itemNum}`)
            }

        } catch (error) {
            console.log(`Something went wrong: ${error}`)
        }
    })

    await test.step('Get Proper Info', async () =>{
        //const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        //console.log('Uploaded Post Data\n')
//
        //console.log('Request URL :', response.url())
        //console.log('Method:', response.request().method())
        //console.log('Status :', response.status(), response.statusText())
//
        //const responseJSON = await response.request().postDataJSON()
        //console.log('Post Data: \n', responseJSON.data.attributes.applications[3].managedConfiguration.steps)
    })
    
})