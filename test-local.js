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
  
  // Wait for Phaser to initialize
  await page.waitForTimeout(3000);
  
  // Click PLAY button
  await page.mouse.click(640, 336);
  await page.waitForTimeout(1000);
  
  // Wait for countdown and game start
  await page.waitForTimeout(5000);
  
  // Check for errors
  if (errors.length > 0) {
    console.log('=== CONSOLE ERRORS ===');
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('=== NO ERRORS ===');
  }
  
  // Check game state
  const gameState = await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameScene = window.__GAME.scene.getScene('GameScene');
      if (gameScene) {
        return {
          started: gameScene.started,
          paused: gameScene.paused,
          health: gameScene.health,
          score: gameScene.score,
          distance: gameScene.distance,
          entities: gameScene.entities ? gameScene.entities.length : 0,
          bannerText: gameScene.banner ? gameScene.banner.text : ''
        };
      }
    }
    return null;
  });
  console.log('Game state:', gameState);
  
  await browser.close();
})();