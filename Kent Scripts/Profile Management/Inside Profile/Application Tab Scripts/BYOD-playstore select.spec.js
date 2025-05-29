//@ts-check
import{test, expect} from '@playwright/test'

//Script for Playstore Mode selection
test('Test the Application section of profile', async ({page}) => {
let response

function statusTexts(code)
{
    if(code >= 200 && code <= 300)
    {
        return 'OK'
    } 
    else if ( code == 401)
    { 
        return 'Unauthorized'
    }
    else if ( code == 403)
    { 
        return 'Forbidden'
    }
    else if ( code == 500)
    { 
        return 'Internal Server Error'
    }
    else 
    {
        return 'Unknown Status'
    }
}

await test.step('Navigate to the application section', async () => {

    await page.goto('/dashboard')
    await page.getByRole('link', { name: 'file-text Profile Management' }).click();
    await page.getByRole('textbox', { name: 'Filter by name' }).click();
    await page.waitForTimeout(3000)
    
    await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
    await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
    await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
    await page.getByRole('tab', { name: 'Applications' }).click();

})

await test.step('Set mode selection to open play store', async () => {

    //save muna then get the ones with patch methods
    const comboText = await page.getByText('Restricted Play Store', {exact: true})
    comboText.click()

    await page.getByText('Open Play Store').click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('button', { name: 'save Save' }).click();

    response = await page.waitForResponse(response => response.request().method() === 'PATCH')
    const postData = response.request().postDataJSON()

    const responseBody = response
    //Output
    console.log('Play store set to Open')
    console.log('Request Method : ', response.request().method())
    console.log('Status Code : ', response.status(), statusTexts(response.status()))
    console.log('\nPost Data: ', postData)
    

})
await test.step('Set mode selection into Restricted', async () => {

    const comboText = await page.getByText('Open Play Store', {exact: true})
    comboText.click()

    await page.getByText('Restricted Play Store').click();
    await page.getByRole('button', { name: 'Yes' }).click();
    await page.getByRole('button', { name: 'save Save' }).click();

    response = await page.waitForResponse(response => response.request().method() === 'PATCH')
    const postData = response.request().postDataJSON()

    //Output
    console.log('Play store set to Restricted')
    console.log('Request Method : ', response.request().method())
    console.log('Status Code : ', response.status(), statusTexts(response.status()))
    console.log('\nPost Data: ', postData)
})

})