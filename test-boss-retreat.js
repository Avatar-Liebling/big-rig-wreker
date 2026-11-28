import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 900, height: 560 } });

  const errors = [];
  page.on('console', (m) => { 
    const text = m.text();
    errors.push(`[${m.type()}] ${text}`);
    if (text.includes('updateBoss') || text.includes('Timer error') || text.includes('Phase logic') || text.includes('Retreat/collision')) {
      console.log(`[CONSOLE ${m.type()}] ${text}`);
    }
  });
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('https://big-rig-wrecker.onrender.com/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const g = window.__GAME;
    if (g && g.scene) {
      const menu = g.scene.getScene('MenuScene');
      if (menu) menu.scene.start('GameScene');
    }
  });
  
  await page.waitForTimeout(3000);
  
  await page.evaluate(() => {
    const gs = window.__GAME.scene.getScene('GameScene');
    if (!gs) return;
    gs.level = 10;
    gs.bossQueued = false;
    gs.bossActive = false;
    gs.spawnBoss();
  });
  
  await page.waitForTimeout(5000);
  
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(5000);
    
    const result = await page.evaluate(() => {
      const gs = window.__GAME.scene.getScene('GameScene');
      if (!gs) return { error: 'no GameScene' };
      return {
        bossActive: gs.bossActive,
        bossY: gs.boss?.y,
        bossVy: gs.boss?.vy,
        bossPhase: gs.boss?.phase,
        bossAttacking: gs.boss?.attacking,
        bossAttackTimer: gs.boss?.attackTimer,
        bossAttackCooldown: gs.boss?.attackCooldown,
        bossAttackCount: gs.bossAttackCount,
        bossMaxAttacks: gs.bossMaxAttacks,
        bossRetreating: gs.bossRetreating,
        bossChaseMode: gs.bossChaseMode,
        bossChaseTimer: gs.bossChaseTimer,
        playerY: gs.player.y,
        bossId: gs.boss?.instanceId,
        errors: gs._errors ? gs._errors.slice(-5) : []
      };
    });
    
    console.log(`t=${i*5}s:`, result);
    if (result.errors && result.errors.length > 0) {
      result.errors.forEach(e => console.log('GAME ERROR:', e));
    }
    
    if (!result.bossActive) {
      console.log('✅ Boss retreated and cleaned up successfully!');
      break;
    }
  }
  
  console.log('\n=== ERRORS (' + errors.length + ') ===');
  errors.slice(0, 5).forEach((e) => console.log('ERROR:', e));

  await browser.close();
})();