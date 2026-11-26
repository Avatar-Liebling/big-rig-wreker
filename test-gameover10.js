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
  
  // Go directly to GameOverScene
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      window.__GAME.scene.start('GameOverScene', {
        score: 1000,
        carsWrecked: 5,
        maxCombo: 3,
        distance: 5000,
        level: 2,
        dailyComplete: false
      });
    }
  });
  await page.waitForTimeout(1000);
  
  // Check scene state immediately
  const gameState1 = await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameOverScene = window.__GAME.scene.getScene('GameOverScene');
      return {
        gameOverSceneActive: gameOverScene?.active || false,
        gameOverSceneExists: !!gameOverScene
      };
    }
    return null;
  });
  console.log('Scene state after 1s:', gameState1);
  
  await page.waitForTimeout(4000);
  
  const gameState2 = await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameOverScene = window.__GAME.scene.getScene('GameOverScene');
      return {
        gameOverSceneActive: gameOverScene?.active || false,
        gameOverSceneExists: !!gameOverScene
      };
    }
    return null;
  });
  console.log('Scene state after 5s:', gameState2);
  
  await browser.close();
})();