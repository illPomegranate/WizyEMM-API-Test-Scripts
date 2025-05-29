//@ts-check
import {test, expect} from '@playwright/test'
const path = require("path")

test('New Profile COPE', async ({page}) => {

    function statusTexts(code)
    {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        return code >= 200  || code <= 300 ? 'OK' :
            code ==  401 ? 'Unauthorized' :
            code == 403 ? 'Forbidden' :
            code == 500 ? 'Internal Server Error' :
            'Unknown Status';
    }

    console.log('Create New COPE Profile')
    await test.step('Navigate to the profile management', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
    })

    const PROFILENAME = 

    await test.step('Check for existing profile', async () => {
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent qa COPE');

        await page.getByRole('textbox', { name: 'Filter by name' }).press('Enter');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');

        await page.waitForTimeout(2000)

        const existing = await page.getByRole('cell',{name: 'kent qa COPE', exact:true}).isVisible()

        if(await existing){
            await page.getByLabel('', { exact: true }).check();
            await page.getByRole('button', { name: 'Remove' }).click();
            await page.getByRole('button', { name: 'OK' }).click();
        }

        await page.getByRole('button', { name: 'plus Create' }).click();
        await page.getByRole('textbox', { name: '* Name' }).click();
        await page.getByRole('textbox', { name: '* Name' }).fill('kent qa COPE');
        await page.getByRole('radio', { name: 'Company-owned with work' }).check();
        await page.getByRole('button', { name: 'OK' }).click();

    })

    await test.step('Get Proper Info', async () =>{
        const response = await page.waitForResponse(response => response.url().includes('api/v1/profiles'))
        console.log('Uploaded Post Data\n')

        console.log('Request URL :', response.url())
        console.log('Method:', response.request().method())
        console.log('Status :', response.status(), response.statusText())

        const responseJSON = await response.request().postDataJSON()
        console.log('Post Data: \n', responseJSON)
    })
    
})