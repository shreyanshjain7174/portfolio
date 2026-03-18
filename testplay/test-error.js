const { chromium } = require('playwright');

(async () => {
    console.log('Starting Playwright...');
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('======== BROWSER ERROR ========');
            console.log(msg.text());
        } else if (msg.type() === 'warning') {
            console.log('BROWSER WARNING:', msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log('======== PAGE EXCEPTION ========');
        console.log(error.message);
        if (error.stack) console.log(error.stack);
    });

    console.log('Navigating to', process.argv[2]);
    await page.goto(process.argv[2] || 'http://localhost:3000', { waitUntil: 'networkidle' });

    console.log('Waiting 2s...');
    await page.waitForTimeout(2000);

    await browser.close();
    console.log('Done.');
})();
