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
  
  // Click PLAY button
  await page.mouse.click(640, 336);
  await page.waitForTimeout(5000);
  
  // Simulate gameplay - move left/right, accelerate
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press(i % 2 === 0 ? 'ArrowRight' : 'ArrowLeft');
    await page.waitForTimeout(300);
  }
  
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(2000);
  await page.keyboard.up('ArrowUp');
  
  // Press space for nitro
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  
  // Check for errors
  if (errors.length > 0) {
    console.log('=== CONSOLE ERRORS ===');
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('=== NO ERRORS DURING GAMEPLAY ===');
  }
  
  // Check final game state
  const gameState = await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameScene = window.__GAME.scene.getScene('GameScene');
      if (gameScene) {
        return {
          started: gameScene.started,
          paused: gameScene.paused,
          health: gameScene.health,
          score: Math.floor(gameScene.score),
          distance: Math.floor(gameScene.distance),
          entities: gameScene.entities ? gameScene.entities.length : 0,
          bannerText: gameScene.banner ? gameScene.banner.text : '',
          level: gameScene.level,
          combo: gameScene.combo,
          nitroCharge: gameScene.nitroCharge
        };
      }
    }
    return null;
  });
  console.log('Final game state:', gameState);
  
  await browser.close();
})();