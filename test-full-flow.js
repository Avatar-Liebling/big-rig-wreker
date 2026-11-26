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
  
  console.log('Testing How to Play...');
  // Click HOW TO PLAY button (2nd button at y=396)
  await page.mouse.click(640, 396);
  await page.waitForTimeout(2000);
  
  // Press ESC to close
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  console.log('Testing Settings...');
  // Click SETTINGS button (3rd button at y=456)
  await page.mouse.click(640, 456);
  await page.waitForTimeout(1000);
  
  // Press ESC to close
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  
  console.log('Testing Gameplay...');
  // Click PLAY button
  await page.mouse.click(640, 336);
  await page.waitForTimeout(5000);
  
  // Play for a bit
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press(i % 2 === 0 ? 'ArrowRight' : 'ArrowLeft');
    await page.waitForTimeout(500);
  }
  
  // Pause with ESC
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  
  // Resume
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  
  // Play more
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(2000);
  await page.keyboard.up('ArrowUp');
  await page.waitForTimeout(2000);
  
  // Press space for nitro/horn
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1000);
  
  // Check for errors
  if (errors.length > 0) {
    console.log('=== CONSOLE ERRORS ===');
    errors.forEach(e => console.log('ERROR:', e));
  } else {
    console.log('=== NO ERRORS IN FULL FLOW ===');
  }
  
  // Check final game state
  const gameState = await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const gameScene = window.__GAME.scene.getScene('GameScene');
      const menuScene = window.__GAME.scene.getScene('MenuScene');
      const bootScene = window.__GAME.scene.getScene('BootScene');
      const gameOverScene = window.__GAME.scene.getScene('GameOverScene');
      return {
        activeScenes: [bootScene, menuScene, gameScene, gameOverScene].filter(s => s && s.active).map(s => s.key),
        gameScene: gameScene ? {
          started: gameScene.started,
          paused: gameScene.paused,
          health: gameScene.health,
          score: Math.floor(gameScene.score),
          distance: Math.floor(gameScene.distance),
          entities: gameScene.entities ? gameScene.entities.length : 0,
          level: gameScene.level,
          combo: gameScene.combo,
          nitroCharge: gameScene.nitroCharge
        } : null
      };
    }
    return null;
  });
  console.log('Final state:', JSON.stringify(gameState, null, 2));
  
  await browser.close();
})();