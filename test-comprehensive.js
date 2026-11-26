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

  console.log('=== Loading game ===');
  await page.goto('https://big-rig-wrecker.onrender.com/', { waitUntil: 'networkidle', timeout: 30000 });
  
  await page.waitForTimeout(3000);
  
  console.log('=== Testing HOW TO PLAY ===');
  await page.mouse.click(640, 396); // HOW TO PLAY
  await page.waitForTimeout(2000);
  await page.keyboard.press('Escape'); // Close
  await page.waitForTimeout(500);
  
  console.log('=== Testing SETTINGS ===');
  await page.mouse.click(640, 456); // SETTINGS
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape'); // Close
  await page.waitForTimeout(500);
  
  console.log('=== Testing PLAY ===');
  await page.mouse.click(640, 336); // PLAY
  await page.waitForTimeout(6000);
  
  console.log('=== Testing gameplay input ===');
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press(i % 2 === 0 ? 'ArrowRight' : 'ArrowLeft');
    await page.waitForTimeout(300);
  }
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(2000);
  await page.keyboard.up('ArrowUp');
  
  console.log('=== Testing PAUSE ===');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);
  await page.keyboard.press('Escape'); // Resume
  await page.waitForTimeout(1000);
  
  console.log('=== Forcing Game Over ===');
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
  
  console.log('=== Testing PLAY AGAIN ===');
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const goScene = window.__GAME.scene.getScene('GameOverScene');
      if (goScene) {
        const container = goScene.children.list.find(c => c.type === 'Container' && c.list?.some(l => l.text === 'PLAY AGAIN'));
        if (container) {
          console.log('Clicking PLAY AGAIN...');
          const rect = container.list[0];
          if (rect && rect.emit) {
            rect.emit('pointerdown');
          }
        }
      }
    }
  });
  await page.waitForTimeout(5000);
  
  console.log('=== Testing gameplay after PLAY AGAIN ===');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(500);
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(500);
  
  console.log('=== Forcing Game Over again ===');
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
  
  console.log('=== Testing MAIN MENU ===');
  await page.evaluate(() => {
    if (window.__GAME && window.__GAME.scene) {
      const goScene = window.__GAME.scene.getScene('GameOverScene');
      if (goScene) {
        const container = goScene.children.list.find(c => c.type === 'Container' && c.list?.some(l => l.text === 'MAIN MENU'));
        if (container) {
          console.log('Clicking MAIN MENU...');
          const rect = container.list[0];
          if (rect && rect.emit) {
            rect.emit('pointerdown');
          }
        }
      }
    }
  });
  await page.waitForTimeout(5000);
  
  console.log('=== Final scene check ===');
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
  console.log('Final scene state:', JSON.stringify(gameState, null, 2));
  
  console.log('=== Error summary ===');
  if (errors.length > 0) {
    console.log('ERRORS FOUND:');
    errors.forEach(e => console.log('  -', e));
  } else {
    console.log('NO ERRORS!');
  }
  
  await browser.close();
})();