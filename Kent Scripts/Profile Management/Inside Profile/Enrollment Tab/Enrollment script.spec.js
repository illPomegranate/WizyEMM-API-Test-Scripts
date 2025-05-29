//@ts-check
import {expect, test} from '@playwright/test'

test('Enrollment modifications', async ({page}) =>{
    function statusTexts(code)
    {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        return code >= 200  || code <= 300 ? 'OK' :
            code ==  401 ? 'Unauthorized' :
            code == 403 ? 'Forbidden' :
            code == 500 ? 'Internal Server Error' :
            'Unknown Status';
    }
    
    await test.step('Navigate to Enrollment', async () => {

        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Enrollment' }).click();

    })

    await test.step('Enrollment Modification', async () =>{
        try {
            await expect(page.locator('div').filter({ hasText: /^Configuration FileRegenerate$/ }).first()).toBeVisible()
       
            for(const checkBox of await page.getByRole('checkbox').all()){
                await checkBox.isChecked() === true ? await checkBox.uncheck() : await checkBox.check()
                await page.waitForTimeout(100)
            }
            
           await page.locator('#app').getByTitle('Afrikaans (NA)').click();
           await page.getByText('Akan (GH)').click();

           await page.locator('#app').getByTitle('Africa/Algiers').click();
           await page.getByTitle('Africa/Asmara').locator('div').click();
           
           await page.waitForTimeout(100)
           await page.getByText('Wifi sa bahay').click();
           await page.getByText('1111api (1111api)').click();
            
        } catch (error) {
            console.log(`Something went wrong : ${error}`)
        }
        
    })

    //Add info printing
     await test.step('Get info', async () =>{

        await page.getByRole('button', { name: 'save Save' }).click();
        const response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        const postData = response.request().postDataJSON()

        console.log('Configuration - Network Settings')
        console.log('Request URL :', response.url())
        console.log('Request Method : ', response.request().method())
        console.log('Status Code : ', response.status(), statusTexts(response.status()))

        const responseJSON = await response.request().postDataJSON()
        console.log('Post Data: \n', responseJSON.data.attributes)
    
    })

    await test.step('Revert Settings ', async () =>{
       
        
    await page.locator('#app').getByText('Akan (GH)').click();
    await page.getByText('Afrikaans (NA)').click();

    await page.waitForTimeout(100)
    await page.locator('#app').getByTitle('Africa/Asmara').click();
    await page.getByTitle('Africa/Algiers').locator('div').click();

    await page.getByText('1111api', { exact: true }).click();
    await page.getByText('Wifi sa bahay (1231223123)').click();
    
//
    await page.getByRole('button', { name: 'save Save' }).click();
        
    })
})