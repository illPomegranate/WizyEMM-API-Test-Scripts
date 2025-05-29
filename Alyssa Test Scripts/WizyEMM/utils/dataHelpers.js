export function StatusMessage(statusCode) {
  const statusMessages = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
  };
  return statusMessages[statusCode] || 'Unknown Status';
}

export async function website(page, url, label = 'Website') {
  const start = Date.now();
  const response = await page.goto(url);
  const end = Date.now();
  const duration = end - start;

  console.log(`\n${label} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  return response;
}

//Login Credentials
export async function loginResponse(page, buttonName, url, timeout = 30000) {
  await page.locator('id=email').fill('ms.alycortez@gmail.com');
  await page.waitForTimeout(200);
  await page.locator('id=password').fill('Newmsalypass1!');
  await page.waitForTimeout(200);

  const start = Date.now();
  const [login] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
  page.getByRole('button', { name: buttonName, exact: true }).click()
  ]);
  const end = Date.now();
  const duration = end - start;

  console.log(`\n${buttonName} Method: ${login.request().method()} | Status: ${login.status()} | Message: ${StatusMessage(login.status())}`);
  console.log(`Response Time: ${duration} ms`);
  return login;
}

//Log with Response time only - any method - to check if the 'BUTTONS' are working
export async function logResponse(page, button, url, label = 'Action', timeout = 30000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
    typeof button === 'string'
      ? page.locator(button).click()
      : button.click()
  ]);
  const end = Date.now();
  const duration = end - start;
  console.log(`\n${label} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);

  return response;
}

//Log Response only - any method - to check if the 'TABS' are working
export async function TabResponse(page, tab, url, label = 'Action', timeout = 30000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
    typeof tab === 'string'
      ? page.locator(tab).click()
      : tab.click()
  ]);
  const end = Date.now();
  const duration = end - start;

  console.log(`\n${label} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  return response;
}

//Log with Response Data - any method - to check if the 'TABS' are working
export async function logTabResponse(page, tab, url, label = 'Action', timeout = 30000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
    typeof tab === 'string'
      ? page.locator(tab).click()
      : tab.click()
  ]);
  const end = Date.now();
  const duration = end - start;

  const responseData = await response.json();
  console.log(`\n${label} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log(`Response:\n${JSON.stringify(responseData, null, 2)}`);
  return response;
}

//Log with Payload only - best for POST/PATCH methods - for getByRole 
export async function payloadRequest(page, buttonName, url, timeout = 30000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
  page.getByRole('button', { name: buttonName }).click()
  ]);
  const end = Date.now();
  const duration = end - start;

  const payload = response.request().postDataJSON();
  console.log(`\n${buttonName} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  return response;
}

//Log with Payload only - best for POST/PATCH methods - for getByRole - SUBMIT input type of button
  export async function submitRequest(page, buttonName, url, timeout = 20000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
  page.getByRole('button', { name: buttonName, exact: true }).click()
  ]);
  const end = Date.now();
  const duration = end - start;

  const payload = response.request().postDataJSON();
  console.log(`\n${buttonName} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log('Payload:', JSON.stringify(payload, null, 2));
  return response;
}

//Log with Response Data only - best for POST/PATCH methods - for getByRole
export async function responseRequest(page, buttonName, url, timeout = 20000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
  page.getByRole('button', { name: buttonName }).click()
  ]);
  const end = Date.now();
  const duration = end - start;
  const responseData = await response.json();

  console.log(`\n${buttonName} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log(`Response:\n${JSON.stringify(responseData, null, 2)}`);
  return response;
}

//Log with Response data - for special 'LINKS'
export async function logLinkResponse(page, locator, urlSubstring, label = 'Log Link', timeout = 10000) {
  try {
    await locator.waitFor({ state: 'visible', timeout });
    const start = Date.now();
    const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(urlSubstring), { timeout }),
    locator.click()
    ]);
    const end = Date.now();
    const duration = end - start;
    const responseData = await response.json();

    console.log(`\n${label} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
    console.log(`Response Time: ${duration} ms`);
    console.log(`Response:\n${JSON.stringify(responseData, null, 2)}`);
    return response;
  } catch (error) {
    console.error(`Failed to get ${label}:`, error);
    throw error;
  }
}

//Log with Payload- any method - to check if the 'BUTTONS' are working
export async function logDataResponse(page, button, url, label = 'Action', timeout = 30000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
    typeof button === 'string'
      ? page.locator(button).click()
      : button.click()
  ]);
  const end = Date.now();
  const duration = end - start;
  const payload = response.request().postDataJSON();

  console.log(`\n${label} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  return response;
}

//Log with Response Data - Dashboard
export async function dashboardResponse(page, button, url, label = 'Static Response', timeout = 60000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
    typeof button === 'string'
      ? page.locator(button).click()
      : button.click()
  ]);
  const end = Date.now();
  const duration = end - start;
  const responseData = await response.json();

  console.log(`\n${label} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`Response Time: ${duration} ms`);
  console.log(`Response:\n${JSON.stringify(responseData, null, 2)}`);

  return response;
}

//Log with Etag for Knox Mobile
export async function noCacheResponse(page, link, url, label = 'Static Resource', timeout = 20000) {
  const start = Date.now();
  const [response] = await Promise.all([page.waitForResponse(res => res.url().includes(url), { timeout }),
  page.getByRole('link', { name: link }).click()
  ]);
  const end = Date.now();
  const duration = end - start;
  const etag = response.headers()['etag'] || 'N/A';

  console.log(`\n${label} Method: ${response.request().method()} | Status: ${response.status()} | Message: ${StatusMessage(response.status())}`);
  console.log(`ETag: ${etag}`)
  console.log(`Response Time: ${duration} ms`);
  return response;
}





