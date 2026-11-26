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
      // Check if GameOverScene is already created
      const goScene = window.__GAME.scene.getScene('GameOverScene');
      if (goScene && goScene.sys) {
        // Hook into all scene lifecycle methods
        const sys = goScene.sys;
        if (sys.init) {
          const originalInit = sys.init.bind(sys);
          sys.init = function(...args) {
            console.log('GameOverScene.init() CALLED', args);
            return originalInit(...args);
          };
        }
        if (sys.preload) {
          const originalPreload = sys.preload.bind(sys);
          sys.preload = function(...args) {
            console.log('GameOverScene.preload() CALLED');
            return originalPreload(...args);
          };
        }
        if (sys.create) {
          const originalCreate = sys.create.bind(sys);
          sys.create = function(...args) {
            console.log('GameOverScene.create() CALLED');
            try {
              const result = originalCreate(...args);
              console.log('GameOverScene.create() COMPLETED');
              return result;
            } catch (e) {
              console.error('GameOverScene.create() ERROR:', e);
              throw e;
            }
          };
        }
        
        // Hook into scene events
        goScene.events.on('create', () => console.log('GameOverScene event: create'));
        goScene.events.on('start', () => console.log('GameOverScene event: start'));
        goScene.events.on('ready', () => console.log('GameOverScene event: ready'));
        goScene.events.on('shutdown', () => console.log('GameOverScene event: shutdown'));
        goScene.events.on('destroy', () => console.log('GameOverScene event: destroy'));
        
        console.log('Hooks added to GameOverScene');
      }
      
      window.__GAME.scene.start('GameOverScene', {
        score: 1000,
        carsWrecked: 5,
        maxCombo: 3,
        distance: 5000,
        level: 2,
        dailyComplete: false
      });
      console.log('scene.start() called');
    }
  });
  
  // Check scene state at various intervals
  for (let i = 1; i <= 8; i++) {
    await page.waitForTimeout(1000);
    const gameState = await page.evaluate(() => {
      if (window.__GAME && window.__GAME.scene) {
        const gameOverScene = window.__GAME.scene.getScene('GameOverScene');
        return {
          gameOverSceneActive: gameOverScene?.active || false,
          gameOverSceneVisible: gameOverScene?.visible || false,
          gameOverSceneExists: !!gameOverScene
        };
      }
      return null;
    });
    console.log(`Scene state after ${i}s:`, gameState);
  }
  
  await browser.close();
})();