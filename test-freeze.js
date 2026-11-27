import { chromium } from 'playwright';

const URL = process.env.TEST_URL || 'http://localhost:4173/';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text());
  });
  page.on('pageerror', (error) => errors.push('PAGEERROR: ' + error.message + '\n' + (error.stack || '')));

  console.log('Loading ' + URL + ' ...');
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Start the game
  await page.mouse.click(640, 336);

  // Wait for the countdown to finish (scene.started === true)
  await page.waitForFunction(() => {
    const s = window.__GAME?.scene?.getScene('GameScene');
    return s && s.started;
  }, { timeout: 15000 });
  console.log('Game started.');
  await page.waitForTimeout(500);

  // Track frame progress to detect a frozen update loop.
  await page.evaluate(() => {
    const scene = window.__GAME?.scene?.getScene('GameScene');
    if (!scene) return;
    window.__frameTick = 0;
    window.__lastTick = performance.now();
    scene.events.on('postupdate', () => {
      window.__frameTick++;
      window.__lastTick = performance.now();
    });
  });

  const sample = async (label, ms) => {
    const before = await page.evaluate(() => window.__frameTick || 0);
    await page.waitForTimeout(ms);
    const after = await page.evaluate(() => window.__frameTick || 0);
    const delta = after - before;
    const state = await page.evaluate(() => {
      const s = window.__GAME?.scene?.getScene('GameScene');
      if (!s) return null;
      return {
        started: s.started,
        health: Math.round(s.health),
        score: Math.round(s.score),
        distance: Math.round(s.distance),
        level: s.level,
        entities: s.entities?.length ?? 0,
        bossActive: s.bossActive,
      };
    });
    // A scene that stopped being started (e.g. game over -> GameOverScene) is a
    // legitimate stop, not a freeze.
    const sceneStopped = state && state.started === false;
    const ok = delta > 5 || sceneStopped;
    const tag = sceneStopped ? 'STOP ' : ok ? 'OK  ' : 'FREEZE';
    console.log(`${tag} ${label}: frames=${delta} state=${JSON.stringify(state)}`);
    return { ok, delta, state, sceneStopped };
  };

  const results = [];
  results.push(await sample('after start', 2000));

  // Drive around: steer, boost, brake, go vertical
  const drive = async (label, keys, ms) => {
    for (const k of keys) await page.keyboard.down(k);
    await page.waitForTimeout(ms);
    for (const k of keys) await page.keyboard.up(k);
    return await sample(label, 1500);
  };

  results.push(await drive('steering', ['KeyA'], 1200));
  results.push(await drive('steering right', ['KeyD'], 1200));
  results.push(await drive('vertical up', ['KeyW'], 1500));
  results.push(await drive('vertical down', ['KeyS'], 1500));
  results.push(await drive('nitro', ['ShiftLeft'], 2000));
  results.push(await drive('brake', ['Space'], 1500));
  results.push(await drive('combo', ['KeyD', 'KeyW'], 2000));

  // Teleport into an oil slick to force the exact collision that used to freeze
  await page.evaluate(() => {
    const s = window.__GAME?.scene?.getScene('GameScene');
    if (!s) return;
    const oil = s.entities.find((e) => e.kind === 'oil');
    if (oil) {
      oil.y = s.player.y;
      oil.x = s.player.x;
    } else {
      // Spawn one if none exists
      const o = s.physics.add.sprite(s.player.x, s.player.y, 'oil_slick');
      o.setDisplaySize(50, 40);
      o.kind = 'oil';
      o.vy = 0;
      o.wrecked = false;
      o.points = 0;
      s.entities.push(o);
    }
  });
  results.push(await sample('oil slick hit', 1500));

  // Install god mode so the player survives the whole test run
  await page.evaluate(() => {
    window.__godMode = setInterval(() => {
      const g = window.__GAME?.scene?.getScene('GameScene');
      if (g && g.started) g.health = 100;
    }, 100);
  });

  // Force-spawn a boss and let it interact
  await page.evaluate(() => {
    const s = window.__GAME?.scene?.getScene('GameScene');
    if (!s) return;
    s.level = 10;
    s.health = 100;
    s.spawnBoss();
  });
  results.push(await sample('boss active', 2500));

  // Ram the boss at speed
  await page.evaluate(() => {
    const s = window.__GAME?.scene?.getScene('GameScene');
    if (!s || !s.boss) return;
    s.health = 100;
    s.speed = 420;
    s.boss.y = s.player.y;
    s.boss.x = s.player.x;
  });
  results.push(await sample('boss ram', 1500));

  // Force a vehicle upgrade (checkpoint)
  await page.evaluate(() => {
    const s = window.__GAME?.scene?.getScene('GameScene');
    if (!s) return;
    s.distance = 6000;
    s.checkVehicleUpgrade();
  });
  results.push(await sample('vehicle upgrade', 1500));

  // Long soak: many collisions, let the game run
  await page.evaluate(() => {
    const s = window.__GAME?.scene?.getScene('GameScene');
    if (!s) return;
    s.speed = 420;
    s.health = 100;
  });
  results.push(await sample('soak 5s', 5000));

  console.log('\n=== CONSOLE ERRORS ===');
  if (errors.length === 0) console.log('(none)');
  else errors.slice(0, 20).forEach((e) => console.log(e));

  await page.evaluate(() => {
    if (window.__godMode) clearInterval(window.__godMode);
  });

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== SUMMARY: ${results.length - failed.length}/${results.length} checks passed ===`);
  if (failed.length) {
    console.log('FROZEN AT:');
    failed.forEach((f) => console.log(' -', JSON.stringify(f.state)));
  }

  await browser.close();
  process.exit(failed.length ? 1 : 0);
})();
