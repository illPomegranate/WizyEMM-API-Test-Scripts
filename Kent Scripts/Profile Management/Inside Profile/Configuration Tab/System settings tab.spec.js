//@ts-check
import {expect, test} from '@playwright/test'

test('Checking Configurations (System settings)', async ({page}) =>{
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

    await test.step('Modify configuration', async () =>{
        const checkValue = await page.getByRole('listitem').filter({ hasText: 'Enable device' }).getByRole('switch')
        expect( await page.getByRole('tablist').filter({ hasText: 'System SettingsSecurity' })).toBeVisible()

        if(await checkValue.isChecked()){
           // console.log('Naka on')
        } else{
            //console.log('Naka sarado')
            await checkValue.check()
        }

        //Location Settings
        await page.locator('span').filter({ hasText: 'Let the user choose' }).first().click();
        await page.getByText('Enforced', { exact: true }).click();

        await page.getByRole('listitem').filter({ hasText: 'Report device' }).getByRole('switch').click();

        //Permission Management
        await page.locator('span').filter({ hasText: 'Grant' }).first().click();
        await page.locator('div').filter({ hasText: /^Prompt$/ }).nth(1).click();

        //System and App Updates
        await page.locator('span').filter({ hasText: 'Unspecified' }).first().click();
        await page.locator('div').filter({ hasText: /^Postponed$/ }).nth(1).click();

        await page.getByRole('button', { name: 'right Freeze time period' }).click();
        await page.getByRole('button', { name: 'plus Add freeze time period' }).click();

        await page.locator('div').filter({ hasText: /^Start date$/ }).nth(1).click();
        await page.getByText('January').click();
        await page.locator('div > div:nth-child(2) > .ant-select-selector').click();
        await page.getByTitle('2', { exact: true }).locator('div').click();

        await page.locator('div').filter({ hasText: /^End date$/ }).nth(1).click();
        await page.getByText('February').click();
        await page.locator('div:nth-child(4) > .ant-select-selector').click();
        await page.getByTitle('1', { exact: true }).locator('div').click();

        await page.getByTitle('Unspecified').click();
        await page.getByText('Wi-Fi Only').click();


        await page.getByRole('button', { name: 'save Save' }).click();
    })
    //Add info printing
     await test.step('Get info', async () =>{
        const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        const postData = response.request().postDataJSON()

        console.log('Configuration - System Settings')
        console.log('Request URL :', response.url())
        console.log('Request Method : ', response.request().method())
        console.log('Status Code : ', response.status(), statusTexts(response.status()))
        //console.log('\nPost Data: ', postData)

        const responseJSON = await response.request().postDataJSON()
        console.log('Post Data: \n', JSON.stringify(responseJSON, null, 2))
    
    })

    await test.step('Revert Settings ', async () =>{
        await page.locator('span').filter({ hasText: 'Enforced' }).first().click();
        await page.getByText('Let the user choose', { exact: true }).click();
        await page.locator('span').filter({ hasText: 'Prompt' }).first().click();
        await page.locator('div').filter({ hasText: /^Grant$/ }).nth(1).click();

        await page.locator('span').filter({ hasText: 'Postponed' }).first().click();
        await page.getByText('Unspecified', { exact: true }).nth(1).click();
        
        await page.getByRole('button', { name: 'right Freeze time period' }).click();
        await page.getByRole('button', { name: 'delete' }).click();

        await page.getByLabel('System Settings').getByTitle('Wi-Fi Only').click();
        await page.getByTitle('Unspecified').locator('div').click();

        await page.getByRole('button', { name: 'save Save' }).click();
    })
})