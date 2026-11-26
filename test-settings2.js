import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
    console.log('CONSOLE:', msg.type(), msg.text());
  });
  page.on('pageerror', error => {
    errors.push(error.message);
    console.log('PAGE ERROR:', error.message);
  });
  page.on('requestfailed', request => {
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText);
  });
  page.on('response', response => {
    if (response.status() === 404) {
      console.log('404 RESPONSE:', response.url(), response.statusText());
    }
  });

  console.log('Loading https://big-rig-wrecker.onrender.com/...');
  await page.goto('https://big-rig-wrecker.onrender.com/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for Phaser to initialize
  await page.waitForTimeout(3000);
  
  console.log('Clicking SETTINGS button...');
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const menuScene = window.__GAME.scene.getScene('MenuScene');
      if (menuScene) {
        menuScene.showSettings();
      }
    }
  });
  await page.waitForTimeout(1000);
  
  console.log('Checking if settings overlay exists...');
  const overlayInfo = await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const menuScene = window.__GAME.scene.getScene('MenuScene');
      if (menuScene) {
        return {
          overlayExists: !!menuScene.overlay,
          overlayChildren: menuScene.overlay ? menuScene.overlay.list.length : 0,
          overlayVisible: menuScene.overlay ? menuScene.overlay.visible : false,
          children: menuScene.overlay ? menuScene.overlay.list.map(c => ({ type: c.type, x: c.x, y: c.y })) : []
        };
      }
    }
    return null;
  });
  console.log('Overlay info:', JSON.stringify(overlayInfo, null, 2));
  
  await page.waitForTimeout(2000);
  
  console.log('Closing settings with Escape...');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  
  await browser.close();
})();