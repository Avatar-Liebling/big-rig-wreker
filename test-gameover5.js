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

  console.log('Loading https://big-rig-wrecker.onrender.com/...');
  await page.goto('https://big-rig-wrecker.onrender.com/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for Phaser to initialize
  await page.waitForTimeout(3000);
  
  // Click PLAY button
  await page.mouse.click(640, 336);
  await page.waitForTimeout(5000);
  
  // Force game over by setting health to 0 via console and call gameOver
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameScene = window.__GAME.scene.getScene('GameScene');
      if (gameScene) {
        console.log('Before gameOver - started:', gameScene.started, 'health:', gameScene.health);
        gameScene.health = 0;
        
        // Hook into the delayedCall
        const originalDelayedCall = gameScene.time.delayedCall.bind(gameScene.time);
        gameScene.time.delayedCall = function(delay, callback, args, context) {
          console.log('delayedCall scheduled with delay:', delay);
          const wrappedCallback = () => {
            console.log('delayedCall callback executing!');
            try {
              callback.apply(context, args);
            } catch (e) {
              console.error('delayedCall callback error:', e);
            }
          };
          return originalDelayedCall(delay, wrappedCallback, args, context);
        };
        
        gameScene.gameOver();
        console.log('After gameOver call - started:', gameScene.started, 'health:', gameScene.health);
      }
    }
  });
  await page.waitForTimeout(5000);
  
  // Check scene state
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
        health: gameScene?.health || 0,
        started: gameScene?.started
      };
    }
    return null;
  });
  console.log('Scene state after 5s:', gameState);
  
  await browser.close();
})();