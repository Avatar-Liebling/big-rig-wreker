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

  console.log('Loading http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait a bit for Phaser to initialize
  await page.waitForTimeout(3000);
  
  // Check if canvas exists and has content
  const canvas = await page.$('canvas');
  if (canvas) {
    const boundingBox = await canvas.boundingBox();
    console.log(`Canvas found: ${boundingBox.width}x${boundingBox.height}`);
    
    // Check if Phaser game is running
    const gameReady = await page.evaluate(() => {
      return !!window.__GAME;
    });
    console.log(`Phaser game initialized: ${gameReady}`);
    
    // Check if scene is active
    const currentScene = await page.evaluate(() => {
      if (window.__GAME && window.__GAME.scene) {
        return window.__GAME.scene.scenes.map(s => ({ key: s.sys.config.key, active: s.sys.isActive() }));
      }
      return null;
    });
    console.log('Current scenes:', currentScene);
  } else {
    console.log('No canvas found!');
  }
  
  if (errors.length > 0) {
    console.log('\n=== CONSOLE ERRORS ===');
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('\n=== NO CONSOLE ERRORS ===');
  }
  
  await browser.close();
})();