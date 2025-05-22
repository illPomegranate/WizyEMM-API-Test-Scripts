//@ts-check

import {test, expect} from '@playwright/test'
test.setTimeout(300000)

test('Modify App Permissions', async ({page}) =>{
    console.log('App Permissions\n')
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

        //console.log(await permButtons.count())
        for (const buttons of await page.locator('body > div:nth-child(17) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-body > div.ant-collapse.ant-collapse-icon-position-end.ant-collapse-borderless > div:nth-child(1)').getByRole('button').all())
            await buttons.click()
            await page.waitForTimeout(500)
         
        ////await permButtons.click()
        //await page.getByRole('button', { name: 'right (android.permission.ACCESS_ADSERVICES_AD_ID)' }).click();
        //await page.getByLabel('Set Adobe Acrobat Reader:').getByRole('listitem').getByText('Unspecified').click();
        //await page.getByText('Prompt').click();
//
        //await page.getByRole('button', { name: 'right (android.permission.ACCESS_ADSERVICES_ATTRIBUTION)' }).click();
        //await page.getByLabel('Set Adobe Acrobat Reader:').getByText('Unspecified').click();
        //await page.getByText('Grant').nth(3).click();
        //await page.getByRole('button', { name: 'right (android.permission.ACCESS_ADSERVICES_TOPICS)' }).click();
        //await page.getByLabel('Set Adobe Acrobat Reader:').getByText('Unspecified').click();
        //await page.getByText('Deny').nth(4).click();
        //await page.getByRole('button', { name: 'OK' }).click();
        //await page.getByRole('button', { name: 'save Save' }).click();
//
        //
//
        //await page.getByRole('button', { name: 'OK' }).click();
        //await page.getByRole('button', { name: 'save Save' }).click();
    })
})