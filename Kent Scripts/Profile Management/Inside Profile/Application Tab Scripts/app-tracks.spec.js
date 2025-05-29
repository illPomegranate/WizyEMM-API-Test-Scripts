//@ts-check
import {expect, test} from '@playwright/test'

test('Checking Tracks (Companion)', async ({page}) =>{
    
    function statusTexts(code)
    {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        return code >= 200  || code <= 300 ? 'OK' :
            code ==  401 ? 'Unauthorized' :
            code == 403 ? 'Forbidden' :
            code == 500 ? 'Internal Server Error' :
            'Unknown Status';
    }

    await test.step('Navigate to the application section', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.waitForTimeout(100)
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Applications' }).click();

    })

    await test.step('Navigate to the application section', async () => {
        await page.getByRole('link', { name: 'Tracks' }).nth(1).click();

        expect( await page.locator('div.ant-modal-content').filter({hasText: 'Application Tracks'})).toBeVisible()
        
        await page.getByRole('radio', { name: 'alpha' }).check();
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'save Save' }).click();
    })

    await test.step('Get info', async () =>{
        const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        const postData = response.request().postDataJSON()

        console.log('Tracks Tab')
        console.log('Request URL :', response.url())
        console.log('Request Method : ', response.request().method())
        console.log('Status Code : ', response.status(), statusTexts(response.status()))
        //console.log('\nPost Data: ', postData)

        const responseJSON = await response.request().postDataJSON()

        //App is Companion
        console.log('Track ID: \n', responseJSON.data.attributes.applications[1].accessibleTrackIds)
    
    })
    await test.step('revert test', async () =>{

        await page.getByRole('link', { name: 'Tracks' }).nth(1).click();
        await page.getByRole('radio', { name: 'Production' }).check();
        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'save Save' }).click();
    })
})