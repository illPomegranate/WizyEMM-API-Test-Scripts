//@ts-check
import {expect, test} from '@playwright/test'

test('Checking advanced tab in applications module', async ({page}) =>{
    
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

    await test.step('Navigate to Advanced tab', async() =>{
        await page.getByRole('link', { name: 'Advanced' }).first().click();
        await expect(await page.locator('body > div:nth-child(17) > div > div.ant-modal-wrap.ant-modal-centered > div > div.ant-modal-content')).toBeVisible()


        await page.locator('div').filter({ hasText: /^Default$/ }).nth(1).click();
        await page.getByTitle('Postponed').click();

        await page.getByRole('spinbutton').fill('');
        await page.getByRole('spinbutton').fill(Math.floor(Math.random() * 10).toString());
        
        await page.locator('div').filter({ hasText: /^Not Set$/ }).nth(1).click();
        await page.getByText('Normal').click();
        
        for (const checkBox of await page.locator('div.ant-modal-content').getByRole('checkbox').all())
            await checkBox.isChecked() == true ? await checkBox.uncheck() : await checkBox.check()
            await page.waitForTimeout(100)

        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'save Save' }).click();

    })
    
    await test.step('Get Info', async () => {
        const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        const postData = response.request().postDataJSON()

        console.log('Advanced Tab')
        console.log('Request URL :', response.url())
        console.log('Request Method : ', response.request().method())
        console.log('Status Code : ', response.status(), statusTexts(response.status()))
        //console.log('\nPost Data: ', postData)

        const responseJSON = await response.request().postDataJSON()

        // have to be specific kahit na wala sa intellisense
        //App is adobe acrobat
        console.log('Post Data: \n', responseJSON.data.attributes.applications[2])

    })
    await test.step('Revert Tests', async () => {
        
        await page.getByRole('link', { name: 'Advanced' }).first().click();
        await page.locator('div').filter({ hasText: /^Postponed$/ }).nth(1).click();
        await page.getByTitle('Default').click();

        await page.locator('div').filter({ hasText: /^Normal$/ }).nth(1).click();
        await page.getByText('Not Set').click();

        await page.getByRole('button', { name: 'OK' }).click();
        await page.getByRole('button', { name: 'save Save' }).click();
    })
    
})