import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false }); // Run with UI to see what happens
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

  console.log('Loading https://big-rig-wrecker.onrender.com/...');
  await page.goto('https://big-rig-wrecker.onrender.com/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for Phaser to initialize
  await page.waitForTimeout(3000);
  
  // Click PLAY button
  await page.mouse.click(640, 336);
  await page.waitForTimeout(5000);
  
  // Force game over by setting health to 0 via console
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameScene = window.__GAME.scene.getScene('GameScene');
      if (gameScene) {
        gameScene.health = 0;
        gameScene.gameOver();
      }
    }
  });
  await page.waitForTimeout(5000); // Wait longer
  
  // Check for errors
  if (errors.length > 0) {
    console.log('=== CONSOLE ERRORS ===');
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('=== NO ERRORS ===');
  }
  
  // Check if we're in GameOverScene
  const gameState = await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameScene = window.__GAME.scene.getScene('GameScene');
      const gameOverScene = window.__GAME.scene.getScene('GameOverScene');
      const menuScene = window.__GAME.scene.getScene('MenuScene');
      const bootScene = window.__GAME.scene.getScene('BootScene');
      return {
        scenes: [
          { key: 'BootScene', active: bootScene?.active || false },
          { key: 'MenuScene', active: menuScene?.active || false },
          { key: 'GameScene', active: gameScene?.active || false },
          { key: 'GameOverScene', active: gameOverScene?.active || false }
        ],
        health: gameScene?.health || 0
      };
    }
    return null;
  });
  console.log('Scene state:', gameState);
  
  await browser.close();
})();