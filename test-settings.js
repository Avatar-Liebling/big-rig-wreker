import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  console.log('Loading https://big-rig-wrecker.onrender.com/...');
  await page.goto('https://big-rig-wrecker.onrender.com/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for Phaser to initialize
  await page.waitForTimeout(3000);
  
  // Click SETTINGS button (3rd button at y=456)
  await page.mouse.click(640, 456);
  await page.waitForTimeout(1000);
  
  // Test volume slider
  await page.mouse.click(580, 296); // Click on slider area
  await page.waitForTimeout(500);
  
  // Test mute toggle
  await page.mouse.click(580, 350); // Click mute button
  await page.waitForTimeout(500);
  
  // Close settings
  await page.mouse.click(640, 420); // Close button
  await page.waitForTimeout(500);
  
  // Check for errors
  if (errors.length > 0) {
    console.log('=== CONSOLE ERRORS ===');
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('=== NO ERRORS IN SETTINGS ===');
  }
  
  await browser.close();
})();