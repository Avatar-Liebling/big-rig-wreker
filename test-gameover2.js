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
  
  // Force game over by setting health to 0 via console
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameScene = window.__GAME.scene.getScene('GameScene');
      if (gameScene) {
        gameScene.health = 0;
      }
    }
  });
  await page.waitForTimeout(3000); // Wait longer for game over transition
  
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
  
  // Click PLAY AGAIN if in GameOverScene
  const goScene = gameState.scenes.find(s => s.key === 'GameOverScene' && s.active);
  if (goScene) {
    console.log('Clicking PLAY AGAIN...');
    await page.mouse.click(640, 360); // PLAY AGAIN button approximate position
    await page.waitForTimeout(4000);
    
    const gameState2 = await page.evaluate(() => {
      if (window.__GAME && window.__GAME.scene) {
        const gameScene = window.__GAME.scene.getScene('GameScene');
        return {
          started: gameScene?.started,
          health: gameScene?.health,
          score: gameScene?.score
        };
      }
      return null;
    });
    console.log('After PLAY AGAIN:', gameState2);
  }
  
  await browser.close();
})();