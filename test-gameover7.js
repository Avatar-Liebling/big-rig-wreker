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
        
        // Hook into GameOverScene create
        const originalGameOverCreate = window.__GAME.scene.scenes.find(s => s.key === 'GameOverScene')?.sys?.create;
        if (originalGameOverCreate) {
          console.log('Hooking GameOverScene create');
          window.__GAME.scene.scenes.find(s => s.key === 'GameOverScene').sys.create = function(...args) {
            console.log('GameOverScene create called');
            try {
              return originalGameOverCreate.apply(this, args);
            } catch (e) {
              console.error('GameOverScene create error:', e);
              throw e;
            }
          };
        }
        
        // Hook into scene.start
        const originalSceneStart = gameScene.scene.start.bind(gameScene.scene);
        gameScene.scene.start = function(key, data) {
          console.log('scene.start called with:', key, data);
          return originalSceneStart(key, data);
        };
        
        gameScene.gameOver();
        console.log('After gameOver call - started:', gameScene.started, 'health:', gameScene.health);
      }
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
        started: gameScene?.started,
        gameOverSceneExists: !!gameOverScene
      };
    }
    return null;
  });
  console.log('Scene state after 8s:', gameState);
  
  await browser.close();
})();