//@ts-check
import {expect, test} from '@playwright/test'
import { text } from 'stream/consumers'

test('Modify Adobe Acrobat Managed Config', async ({page}) =>{
    let num = 0

    console.log('Modify Adobe Acrobat Managed Config\n')
    await test.step('Navigate to the application section', async () => {

        try {
            await page.goto('/dashboard')
            await page.getByRole('link', { name: 'file-text Profile Management' }).click();
            await page.getByRole('textbox', { name: 'Filter by name' }).click();
            await page.waitForTimeout(3000)
            
            await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
            await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
            await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
            await page.getByRole('tab', { name: 'Applications' }).click();
        } catch (error) {
            console.log(error)
        }
    })

    await test.step('Open Config v2', async () =>{
        
        try {
        
            await page.getByRole('link', { name: 'Configuration' }).first().click();
            await expect(page.locator('#configuration-body')).toBeVisible()

            for (const card of await page.locator('#configuration-body').getByRole('button').all())
                await card.click()
                await page.waitForTimeout(300)

            for (const  buttons of await page.locator('#configuration-body').getByRole('switch').all())
                await buttons.click()
                await page.waitForTimeout(300)

            const textBox = await page.locator('#string-enterprise_name')
            const name = 'automation test '

            if ((await textBox.inputValue()) || !(await textBox.inputValue())){
                num = increment((await textBox.inputValue()).match(/\d+/))

                await page.locator('#string-enterprise_name').click()
                await page.locator('#string-enterprise_name').fill(name + num)

            }

            function increment(currentNum){
                if(currentNum >= 0 ){
                    return Number(currentNum) + Number(1)
                } else{
                    return currentNum
                }
            }

            await page.getByRole('button', { name: 'Submit' }).click();
            await page.getByRole('button', { name: 'save Save' }).click();

        } catch (error) {
            console.log(error)
        }
    })

    await test.step('Get Proper Info', async () =>{
        const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        console.log('Request URL :', response.url())
        console.log('Method:', response.request().method())
        console.log('Status :', response.status(), response.statusText())

        const responseJSON = await response.request().postDataJSON()

        //App is adobe acrobat
        console.log('Post Data: \n', responseJSON.data.attributes.applications[2])

    })
})