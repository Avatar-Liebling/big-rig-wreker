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
  
  // Test flow: Click PLAY -> play a bit -> force game over -> click MAIN MENU
  console.log('Clicking PLAY...');
  await page.mouse.click(640, 336);
  await page.waitForTimeout(6000);
  
  console.log('Forcing game over...');
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameScene = window.__GAME.scene.getScene('GameScene');
      if (gameScene) {
        gameScene.health = 0;
        gameScene.gameOver();
      }
    }
  });
  await page.waitForTimeout(5000);
  
  console.log('Clicking MAIN MENU button programmatically...');
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const goScene = window.__GAME.scene.getScene('GameOverScene');
      if (goScene) {
        // Find the MAIN MENU button and click it programmatically
        const container = goScene.children.list.find(c => c.type === 'Container' && c.list?.some(l => l.text === 'MAIN MENU'));
        if (container) {
          console.log('Found MAIN MENU container, emitting pointerdown...');
          const rect = container.list[0];
          if (rect && rect.emit) {
            rect.emit('pointerdown');
          }
        }
      }
    }
  });
  await page.waitForTimeout(1000);
  
  console.log('Checking if MenuScene started...');
  await page.waitForTimeout(4000);
  
  console.log('Checking scenes...');
  const gameState = await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const scenes = window.__GAME.scene.scenes;
      const result = [];
      for (const s of scenes) {
        result.push({
          key: s.key,
          active: s.sys?.settings?.active,
          visible: s.sys?.settings?.visible,
          isRunning: s.sys?.isRunning
        });
      }
      return { allScenes: result };
    }
    return null;
  });
  console.log('Scene state after MAIN MENU:', JSON.stringify(gameState, null, 2));
  
  await browser.close();
})();