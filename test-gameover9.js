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
      console.log('404 RESPONSE:', response.url());
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
  await page.waitForTimeout(8000);
  
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
  console.log('Scene state after 8s:', gameState);
  
  await browser.close();
})();