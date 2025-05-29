//@ts-check
import {expect, test} from '@playwright/test'

test('Checking Configurations (Security Settings)', async ({page}) =>{
    function statusTexts(code)
    {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        return code >= 200  || code <= 300 ? 'OK' :
            code ==  401 ? 'Unauthorized' :
            code == 403 ? 'Forbidden' :
            code == 500 ? 'Internal Server Error' :
            'Unknown Status';
    }

    await test.step('Navigate to the configuration section', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Configuration' }).click();

    })

    await test.step('Modify Password constraints', async () =>{
        await page.getByRole('tab', { name: 'Security Settings' }).click();

        await page.getByLabel('Security Settings').locator('span').filter({ hasText: 'Unspecified' }).first().click();
        await page.locator('div').filter({ hasText: /^Alphanumeric$/ }).nth(1).click();

        expect( await page.getByRole('heading', { name: 'Password History Length' })).toBeVisible()
        for (const passInput of await page.getByRole('listitem').getByRole('spinbutton').all() )
            await passInput.fill(Math.floor(Math.random() * 10).toString())
            await page.waitForTimeout(100)
    })

    await test.step('Modify Keyguard configuration', async () =>{
        await page.getByRole('button', { name: 'Setup Keyguard Configuration' }).click();
        expect( await page.getByRole('dialog')).toBeVisible()

        let index = 0
        for (const buttons of await page.getByRole('listitem').getByRole('switch').all()){
            if (index != 0 && index != 8)
            {
                await buttons.click()
                await page.waitForTimeout(100)
            }
            index++
        }
        await page.getByRole('button', { name: 'OK' }).click();
    })

     await test.step('Modify Factory Reset Protection', async () =>{
        let emailBase = 'kentqatest@gmail.com'
        await page.locator('.ant-select-selection-overflow').getByRole('combobox').fill(emailBase)

        await page.locator('#rc_select_8').press('Enter');

    })

    //Add info printing
     await test.step('Get info', async () =>{
        await page.getByRole('button', { name: 'save Save' }).click();
        const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        const postData = response.request().postDataJSON()

        console.log('Configuration - Security Settings')
        console.log('Request URL :', response.url())
        console.log('Request Method : ', response.request().method())
        console.log('Status Code : ', response.status(), statusTexts(response.status()))
        //console.log('\nPost Data: ', postData)

        const responseJSON = await response.request().postDataJSON()
        console.log('Post Data: \n', JSON.stringify(responseJSON, null, 2))
    
    })

    await test.step('Revert Settings ', async () =>{
       await page.getByRole('tab', { name: 'Security Settings' }).click();

       await page.locator('span').filter({ hasText: 'Alphanumeric' }).first().click();
       await page.locator('.ant-select-item-option-content').first().click();

       await page.getByRole('button', { name: 'Setup Keyguard Configuration' }).click();
       await page.getByRole('dialog').getByRole('listitem').filter({ hasText: 'Disable all customizations' }).getByRole('switch').click();
       await page.getByRole('dialog').getByRole('listitem').filter({ hasText: 'Disable all customizations' }).getByRole('switch').click();

       await page.getByRole('button', { name: 'OK' }).click();

       await page.getByLabel('close').locator('svg').click();

       await page.getByRole('button', { name: 'save Save' }).click();

    })
})