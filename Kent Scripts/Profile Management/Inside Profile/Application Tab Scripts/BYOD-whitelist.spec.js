//@ts-check
import {test} from '@playwright/test'
test.setTimeout(30000)

test('Profile Management - Applications Tab (Installed Application)', async ({ page }) =>{
    let response

    function statusTexts(code){
        if(code >= 200 && code <= 300){
            return 'OK'
        } 
        else if ( code == 401){ 
            return 'Unauthorized'
        }
        else if ( code == 403){ 
            return 'Forbidden'
        }
        else if ( code == 500){ 
            return 'Internal Server Error'
        }else {
            return 'Unknown Status'
        }
    }

    await test.step('Navigate to the application section', async () =>{
        await page.goto('/dashboard')
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.waitForTimeout(3000)
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
        await page.getByRole('tab', { name: 'Applications' }).click();
    })

    await test.step('Add an application', async () => {
           await page.getByRole('button', { name: 'plus Choose Applications' }).first().click();
           await page.getByRole('row', { name: 'Adobe Acrobat Reader: Edit' }).getByLabel('').check();
           await page.getByRole('button', { name: 'OK' }).click(); 
           await page.getByRole('button', { name: 'save Save' }).click();
    
           response = await page.waitForResponse(response => response.request().method() === 'PATCH')
    
           console.log('Request Method : ', response.request().method())
           console.log('Status Code : ', response.status(), statusTexts(response.status()))
           const postData = response.request().postDataJSON()
           
           console.log('Post Data: ', JSON.stringify(postData, null, 2), '\n')
       })
})