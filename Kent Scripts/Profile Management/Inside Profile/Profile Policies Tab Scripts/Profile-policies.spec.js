//@ts-check
import {test, expect} from '@playwright/test'
test.setTimeout(300000)
/* NOTE remove comment nalang neto sa baba tas icomment/ delete yung sa taas, thankss
        also make sure na everything is disabled, set to unspecified at naka disallow yung sa policies para gumana */

test('Test each section of the poliicy', async ({page}) =>  {
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
    //Non kiosk profile
    await test.step('Go to profile', async () =>{
        //await page.goto('https://qa2.staging-us.wizyemm.app/')
        //await page.getByRole('button', { name: 'Login' }).click();
        //await page.locator('#email').click();
        //await page.locator('#email').fill('kentqatest@gmail.com');
        //await page.waitForTimeout(200)
        //await page.locator('#email').press('Tab');
        //await page.locator('#password').fill('Admin4456!');
        //await page.waitForTimeout(200)
        //await page.getByRole('button', { name: 'Login', exact: true }).click();

        await page.goto('https://qa2.staging-us.wizyemm.app/dashboard');
        await page.getByRole('link', { name: 'file-text Profile Management' }).click();
        await page.getByRole('textbox', { name: 'Filter by name' }).click();
        await page.waitForTimeout(3000)
        await page.getByRole('textbox', { name: 'Filter by name' }).fill('kent');
        await page.getByRole('textbox', { name: 'Filter by name' }).press('Escape');
        await page.getByRole('link', { name: 'kent qa - Duplicate' }).click();
    })

    await test.step('01. Test different policy configs - cross profile section', async () =>{
        //Show Work Contacts
        await page.getByText('Unspecified').first().click();
        await page.getByText('Personal Disallowed').click();
        
        //Cross Profile Copy Paste
        await page.getByText('Unspecified').first().click();
        await page.getByText('Personal Disallowed').nth(2).click();

        //Cross Profile Data Sharing
        await page.locator('#app').getByText('Unspecified').click();
        await page.getByText('Personal Disallowed').nth(4).click();
        
        await page.getByRole('button', { name: 'save Save' }).click();
        response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        const responseJSON = response.request().postDataJSON()

        //Output
        console.log('\nProfile Policy - Create profile policies')
        console.log('Profile URL :', await page.url())
        console.log('Request Method : ', response.request().method())
        console.log('Status Code : ', response.status(), statusTexts(response.status()))
        console.log('\nPost Data - Cross Profile Policies: \n', responseJSON.data.attributes.crossProfilePolicies,'\n')


    })
    await page.waitForTimeout(200)

    await test.step('02. Global settings', async () => {

        await page.getByRole('listitem').filter({ hasText: 'Disable screen captureWhether' }).getByRole('switch').click();
        await page.getByRole('listitem').filter({ hasText: 'Disable key guardWhether the' }).getByRole('switch').click();

        //Untrusted APps Policy
        await page.getByText('Disallow untrusted app').click();
        await page.getByText('Allow untrusted app installs', { exact: true }).click();

        //Developer Options
        await page.getByText('Disabled', { exact: true }).click();
        await page.getByText('Allow', { exact: true }).click();

        //Auto Date and Timezone
        await page.getByText('User Choice').click();
        await page.getByText('Enforced').nth(4).click();

        await page.getByRole('listitem').filter({ hasText: 'Set bluetooth offWhether' }).getByRole('switch').click();
        await page.getByRole('listitem').filter({ hasText: 'Disallow data roaming (from' }).getByRole('switch').click();

        await page.getByRole('button', { name: 'save Save' }).click();
        response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        const responseJSON = response.request().postDataJSON()
        
        //Output
        console.log('\nProfile Policy - Global Settings')
        console.log('\nPost Data - Global Settings: \n', responseJSON,'\n')

    })
    await page.waitForTimeout(2000)

    await test.step('03. User restrictions', async () => {

        //Click all switch
        for (const card of await page.locator('div:nth-child(4) > .ant-card > .ant-card-body').getByRole('switch').all())
        await card.click()
        await page.waitForTimeout(300)

        //Google Protect Verify Apps
        await page.getByText('Enforced').nth(3).click();
        await page.getByText('User Choice').click();

        await page.getByRole('button', { name: 'save Save' }).click();

        response = await page.waitForResponse(response => response.request().method() === 'PATCH')
        const responseJSON = response.request().postDataJSON()
        
        //Output
        console.log('\nProfile Policy - User Restrictions')
        console.log('\nPost Data - User Restrictions: \n', responseJSON,'\n')

    })
    await page.waitForTimeout(3000)

    await test.step('Revert', async () =>{
        //Cross Profile
        await page.getByText('Personal Disallowed').first().click();
        await page.getByText('Unspecified', { exact: true }).click();
        await page.getByText('Personal Disallowed').first().click();
        await page.getByText('Unspecified').nth(4).click();
        await page.locator('#app').getByText('Personal Disallowed').click();
        await page.getByText('Unspecified', { exact: true }).nth(4).click();
        
        //Global Settings
        await page.getByRole('listitem').filter({ hasText: 'Disable screen captureWhether' }).getByRole('switch').click();
        await page.getByRole('listitem').filter({ hasText: 'Disable key guardWhether the' }).getByRole('switch').click();
        await page.getByText('Allow untrusted app installs').click();
        await page.getByText('Disallow untrusted app').click();
        await page.getByText('Allow', { exact: true }).click();
        await page.getByText('Disabled', { exact: true }).click();
        
        await page.getByText('Enforced', { exact: true }).click();
        await page.getByText('User Choice').nth(1).click();
        await page.getByRole('listitem').filter({ hasText: 'Set bluetooth offWhether' }).getByRole('switch').click();
        await page.getByRole('listitem').filter({ hasText: 'Disallow data roaming (from' }).getByRole('switch').click();

        //User Restrictions
        for (const card of await page.locator('div:nth-child(4) > .ant-card > .ant-card-body').getByRole('switch').all())
            await card.click()
            await page.waitForTimeout(300)

        await page.getByText('User Choice').nth(1).click();
        await page.getByText('Enforced', { exact: true }).nth(1).click();
        
        await page.getByRole('button', { name: 'save Save' }).click();
    })
})
