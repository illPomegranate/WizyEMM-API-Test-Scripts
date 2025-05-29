//@ts-check

import {test, expect} from '@playwright/test'
test.setTimeout(300000)

test('Modify App Permissions', async ({page}) =>{
    console.log('App Permissions\n')

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
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Applications' }).click();
    
    })

    await test.step('Go to permissions tab', async () =>{
        await page.getByRole('link', { name: 'Permissions' }).first().click();
        expect(page.locator('body > div:nth-child(17) > div > div.ant-modal-wrap > div > div.ant-modal-content')).toBeVisible()

        await page.getByRole('button', { name: 'right (android.permission.ACCESS_ADSERVICES_AD_ID)' }).click();
        await page.getByText('Unspecified').click();
        await page.getByText('Prompt', { exact: true }).click();

        await page.getByRole('button', { name: 'right (android.permission.ACCESS_ADSERVICES_ATTRIBUTION)' }).click();
        await page.getByLabel('Set Adobe Acrobat Reader:').getByText('Unspecified').click();
        await page.getByText('Grant').nth(3).click();
        
        await page.getByRole('button', { name: 'right View network' }).click();
        await page.getByLabel('Set Adobe Acrobat Reader:').getByText('Unspecified').click();
        await page.getByText('Deny').nth(4).click();
        
        await page.getByRole('button', { name: 'OK' }).click();
        
        //Flaky - takes a while to load
    })

    await test.step('Get info', async () =>{

       await page.getByRole('button', { name: 'save Save' }).click();
       const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
       const postData = response.request().postDataJSON()

       console.log('Configuration - Network Settings')
       console.log('Request URL :', response.url())
       console.log('Request Method : ', response.request().method())
       console.log('Status Code : ', response.status(), statusTexts(response.status()))

       const responseJSON = await response.request().postDataJSON()
       console.log('Post Data: \n', responseJSON.data.attributes.applications[2].permissionGrants)
    
    })

    await test.step('Revert settings', async () =>{
        
        await page.getByRole('row', { name: 'Adobe Acrobat Reader: Edit' }).getByRole('link').nth(1).click();

        await page.getByRole('button', { name: 'right (android.permission.ACCESS_ADSERVICES_AD_ID)' }).click();
        await page.getByText('Prompt').click();
        await page.getByText('Unspecified', { exact: true }).click();

        await page.getByRole('button', { name: 'right (android.permission.ACCESS_ADSERVICES_ATTRIBUTION)' }).click();
        await page.getByLabel('Set Adobe Acrobat Reader:').getByText('Grant').click();
        await page.getByText('Unspecified').nth(3).click();
        
        await page.getByRole('button', { name: 'right View network' }).click();
        await page.getByLabel('Set Adobe Acrobat Reader:').getByText('Deny').click();
        await page.getByText('Unspecified', { exact: true }).nth(4).click();

        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'save Save' }).click();
        
    })
})