import Phaser from 'phaser';

const W = 800;
const H = 450;
const ROAD_LEFT = 200;
const ROAD_RIGHT = 600;
const ROAD_W = ROAD_RIGHT - ROAD_LEFT;
const LANES = [250, 333, 417, 500, 550];

// Checkpoint system - vehicle upgrade milestones
const CHECKPOINTS = [
  { distance: 5000, vehicle: 'truck', label: 'SEMI TRUCK', size: [92, 46], trailer: 'trailer' },
  { distance: 15000, vehicle: 'big_rig', label: 'BIG RIG', size: [110, 55], trailer: 'trailer_large' },
  { distance: 30000, vehicle: 'road_train', label: 'ROAD TRAIN', size: [130, 65], trailer: 'trailer_roadtrain' },
  { distance: 50000, vehicle: 'juggernaut', label: 'JUGGERNAUT', size: [150, 75], trailer: 'trailer_massive' },
];

// Daily challenge seed (based on date)
function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#0c1016');
    this.physics.world.setBounds(0, -400, W, H + 800);

    this.score = 0;
    this.health = 100;
    this.speed = 220;
    this.maxSpeed = 420;
    this.minSpeed = 140;
    this.distance = 0;
    this.level = 1;
    this.combo = 1;
    this.maxCombo = 1;
    this.carsWrecked = 0;
    this.nitroCharge = 0;
    this.nitroActive = 0;
    this.shieldTime = 0;
    this.comboTimer = 0;
    this.paused = false;
    this.started = false;
    this.rain = false;
    this.rainTimer = 12;
    this.spawnTimer = 0;
    this.obstacleTimer = 1.4;
    this.powerTimer = 4;
    this.policeTimer = 18;
    this.scroll = 0;
    this.entities = [];
    
    // New: boss battle state
    this.bossActive = false;
    this.boss = null;
    this.bossHealth = 0;
    this.bossMaxHealth = 0;
    this.bossSpawnedAt = 0;
    
    // New: daily challenge
    this.dailySeed = getDailySeed();
    this.dailyCompleted = false;
    this.dailyGoals = this.generateDailyGoals();
    this.dailyProgress = { wrecks: 0, distance: 0, combo: 0, coins: 0, perfect: false };
    // Track whether perfect was maintained throughout the run; reset when health drops.
    this.dailyPerfectMaintained = true;
    
    // New: new vehicle types
    this.carTypes = ['car_red', 'car_blue', 'car_green', 'car_yellow', 'car_white', 'motorcycle', 'pickup', 'bus', 'sports_low', 'ambulance', 'firetruck', 'tanker'];
    
    // Vehicle upgrade system - checkpoint-based
    this.currentVehicleTier = 0;
    this.checkpoints = CHECKPOINTS;
    this.nextCheckpoint = this.checkpoints[this.currentVehicleTier];
    this.vehicleUpgradePending = false;
    
    // Boss chase behavior
    this.bossChaseMode = false;
    this.bossChaseTimer = 0;
    this.bossRetreating = false;
    this.bossMaxAttacks = 0;
    this.bossAttackCount = 0;
    this.bossQueued = false;
    this.bossRamCooldown = 0;
    
    // Distance-based speed progression
    this.distanceSpeedBonus = 0;
    this.lastSpeedBonusDistance = 0;
    
    // Reward system
    this.totalScoreEarned = 0;
    this.levelUpRewards = [];
    
    // Analytics reference
    this.analytics = this.game.analytics;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      W: Phaser.Input.Keyboard.KeyCodes.W,
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
      ESC: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.drawWorld();
    this.createPlayer();
    this.createHud();
    this.createPause();
    this.startCountdown();

    // Notify analytics
    if (this.analytics) {
      this.analytics.trackGameStart('normal');
    }

    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.started || this.health <= 0) return;
      this.togglePause();
    });
  }

  drawWorld() {
    this.shoulders = [];
    this.buildings = [];
    this.trees = [];
    this.roadMarks = [];

    for (let i = 0; i < 4; i++) {
      const y = i * 200 - 200;
      this.shoulders.push(this.add.rectangle(100, y, 200, 220, 0x1b2420));
      this.shoulders.push(this.add.rectangle(700, y, 200, 220, 0x1b2420));
      const leftB = this.add.image(70, y, 'building_' + (1 + (i % 3))).setDisplaySize(90, 120);
      const rightB = this.add.image(730, y + 40, 'building_' + (1 + ((i + 1) % 3))).setDisplaySize(100, 140);
      this.buildings.push(leftB, rightB);
      const tree = this.add.image(150, y + 80, 'tree').setDisplaySize(36, 36);
      const tree2 = this.add.image(650, y + 30, 'tree').setDisplaySize(32, 32);
      this.trees.push(tree, tree2);
    }

    this.road = this.add.rectangle(W / 2, H / 2, ROAD_W, H + 40, 0x2a2e34).setDepth(1);
    this.shoulderL = this.add.rectangle(ROAD_LEFT - 18, H / 2, 28, H + 40, 0x3a3f46).setDepth(1);
    this.shoulderR = this.add.rectangle(ROAD_RIGHT + 18, H / 2, 28, H + 40, 0x3a3f46).setDepth(1);

    for (let i = 0; i < 10; i++) {
      const y = i * 70 - 80;
      this.roadMarks.push(this.add.rectangle(LANES[1] - 40, y, 6, 28, 0xf2d24b).setDepth(2));
      this.roadMarks.push(this.add.rectangle(LANES[2] - 8, y, 6, 28, 0xf2d24b).setDepth(2));
      this.roadMarks.push(this.add.rectangle(LANES[3] + 24, y, 6, 28, 0xf2d24b).setDepth(2));
    }

    this.rainLayer = this.add.rectangle(W / 2, H / 2, W, H, 0x0a1424, 0).setDepth(40);
    this.rainEmitter = this.add.particles(0, 0, 'rain_drop', {
      x: { min: 0, max: W },
      y: -20,
      lifespan: 700,
      speedY: { min: 420, max: 700 },
      speedX: { min: -40, max: 20 },
      quantity: 3,
      frequency: 40,
      alpha: { start: 0.45, end: 0.05 },
      emitting: false,
    }).setDepth(41);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(LANES[2], 340, 'truck');
    this.player.setDisplaySize(92, 46);
    this.player.setAngle(-90);
    this.player.setDepth(10);
    // Physics body for collision - cover full truck length, cab at front (top at -90 deg)
    // Visual: 92 tall x 46 wide at -90 deg. Body should cover cab area at top.
    // Visual top = player.y - 46 = 294, Visual bottom = player.y + 46 = 386
    // Body height 92 (full visual height), offset -46 puts top at 294 (visual top/cab)
    this.player.body.setSize(46, 92);  // width=visual width, height=full visual height
    this.player.body.setOffset(0, -46);  // shift body up to match visual top (cab)
    this.player.setCollideWorldBounds(true);

    this.trailer = this.add.image(this.player.x, this.player.y + 62, 'trailer');
    this.trailer.setDisplaySize(78, 40);
    this.trailer.setAngle(-90);
    this.trailer.setDepth(9);
    
    // Collision bounds for player + trailer (used for precise collision)
    // Player bounds: match physics body for accurate collision
    this.playerBounds = { width: 46, height: 92 };
    this.trailerBounds = { width: 62, height: 32 };

    // Enhanced exhaust with multiple layers - MORE VISIBLE
    this.exhaust = this.add.particles(0, 0, 'smoke_particle', {
      lifespan: { min: 400, max: 800 },
      speed: { min: 15, max: 50 },
      speedY: { min: 20, max: 60 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.6, end: 0 },
      frequency: 30,
      rotate: { min: 0, max: 360 },
      gravityY: -20,
    }).setDepth(20).setScrollFactor(0);
    
    // Heat shimmer above exhaust (rising heat distortion) - MORE VISIBLE
    this.heatShimmer = this.add.particles(0, 0, 'heat_shimmer', {
      lifespan: { min: 200, max: 400 },
      speedY: { min: -30, max: -10 },
      scale: { start: 0.7, end: 0 },
      alpha: { start: 0.5, end: 0 },
      frequency: 50,
      rotate: { min: -5, max: 5 },
      gravityY: -20,
    }).setDepth(20).setScrollFactor(0);
    
    // Second exhaust layer - darker smoke
    this.exhaust2 = this.add.particles(0, 0, 'smoke_particle', {
      lifespan: { min: 600, max: 1000 },
      speed: { min: 5, max: 25 },
      speedY: { min: 10, max: 40 },
      scale: { start: 1.0, end: 0 },
      alpha: { start: 0.4, end: 0 },
      frequency: 20,
      tint: 0x111111,
      gravityY: -10,
    }).setDepth(19).setScrollFactor(0);

    // Tire smoke emitters (one per rear wheel) - for burnouts/drifts - MORE VISIBLE
    this.tireSmokeL = this.add.particles(0, 0, 'tire_smoke', {
      lifespan: { min: 500, max: 1000 },
      speedX: { min: -20, max: 20 },
      speedY: { min: 10, max: 40 },
      scale: { start: 1.0, end: 1.8 },
      alpha: { start: 0.5, end: 0 },
      frequency: 20,
      emitting: false,
      gravityY: -30,
      rotate: { min: 0, max: 360 },
    }).setDepth(20).setScrollFactor(0);
    
    this.tireSmokeR = this.add.particles(0, 0, 'tire_smoke', {
      lifespan: { min: 500, max: 1000 },
      speedX: { min: -20, max: 20 },
      speedY: { min: 10, max: 40 },
      scale: { start: 1.0, end: 1.8 },
      alpha: { start: 0.5, end: 0 },
      frequency: 20,
      emitting: false,
      gravityY: -30,
      rotate: { min: 0, max: 360 },
    }).setDepth(20).setScrollFactor(0);

    // Road spray (wet road kick-up behind tires) - MORE VISIBLE
    this.roadSprayL = this.add.particles(0, 0, 'puddle_ripple', {
      lifespan: { min: 200, max: 400 },
      speedX: { min: -30, max: 30 },
      speedY: { min: 80, max: 150 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.7, end: 0 },
      frequency: 20,
      emitting: false,
      gravityY: 40,
      tint: 0xAADDFF,
    }).setDepth(20).setScrollFactor(0);
    
    this.roadSprayR = this.add.particles(0, 0, 'puddle_ripple', {
      lifespan: { min: 200, max: 400 },
      speedX: { min: -30, max: 30 },
      speedY: { min: 80, max: 150 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.7, end: 0 },
      frequency: 20,
      emitting: false,
      gravityY: 40,
      tint: 0xAADDFF,
    }).setDepth(20).setScrollFactor(0);

    this.flames = this.add.particles(0, 0, 'spark_particle', {
      lifespan: { min: 150, max: 300 },
      speedY: { min: 100, max: 220 },
      speedX: { min: -30, max: 30 },
      scale: { start: 1.2, end: 0 },
      tint: [0xffaa00, 0xff4400, 0xffff88, 0xff6600],
      frequency: 20,
      emitting: false,
      blendMode: 'ADD',
      gravityY: -50,
    }).setDepth(22).setScrollFactor(0);

    // Nitro flames (separate, more intense) - MORE VISIBLE
    this.nitroFlames = this.add.particles(0, 0, 'nitro_flame', {
      lifespan: { min: 100, max: 200 },
      speedY: { min: 200, max: 350 },
      scale: { start: 0.7, end: 0 },
      frequency: 15,
      emitting: false,
      blendMode: 'ADD',
      gravityY: -100,
    }).setDepth(23).setScrollFactor(0);

    this.headlights = this.add.ellipse(this.player.x, this.player.y - 40, 70, 90, 0xffffcc, 0.08).setDepth(7);
    
    // Volumetric headlight beams (using texture)
    this.headlightBeamVolL = this.add.image(this.player.x - 18, this.player.y - 160, 'volumetric_cone')
      .setOrigin(0.5, 1).setScale(0.6, 0.8).setAlpha(0.15).setDepth(6);
    this.headlightBeamVolR = this.add.image(this.player.x + 18, this.player.y - 160, 'volumetric_cone')
      .setOrigin(0.5, 1).setScale(0.6, 0.8).setAlpha(0.15).setDepth(6);
    
    // Headlight beams (dynamic triangle graphics - fallback)
    this.headlightBeamL = this.add.graphics().setDepth(6);
    this.headlightBeamR = this.add.graphics().setDepth(6);
    this.updateHeadlights();
  }
  
  updateHeadlights() {
    if (!this.player || !this.player.active) return;
    const x = this.player.x;
    const y = this.player.y - 40;
    this.headlights.setPosition(x, y - 40);
    
    // Update volumetric beams
    if (this.headlightBeamVolL && this.headlightBeamVolR) {
      this.headlightBeamVolL.setPosition(x - 18, y - 120);
      this.headlightBeamVolL.setRotation(Phaser.Math.DegToRad(-90));
      this.headlightBeamVolR.setPosition(x + 18, y - 120);
      this.headlightBeamVolR.setRotation(Phaser.Math.DegToRad(-90));
      // Pulse slightly
      const pulse = 0.9 + Math.sin(this.time.now / 300) * 0.1;
      this.headlightBeamVolL.setAlpha(0.15 * pulse);
      this.headlightBeamVolR.setAlpha(0.15 * pulse);
    }
    
    // Left headlight beam forward (graphics fallback)
    this.headlightBeamL.clear();
    this.headlightBeamL.fillStyle(0xffffcc, 0.08);
    this.headlightBeamL.fillTriangle(x - 18, y, x - 45, y - 110, x - 6, y - 110);
    // Right headlight beam forward
    this.headlightBeamR.clear();
    this.headlightBeamR.fillStyle(0xffffcc, 0.08);
    this.headlightBeamR.fillTriangle(x + 18, y, x + 6, y - 110, x + 45, y - 110);
  }

  createHud() {
    const hud = (obj) => obj.setScrollFactor(0).setDepth(50);
    
    // Top HUD bar with gradient background
    const topBg = this.add.graphics();
    topBg.fillGradientStyle(0x0a1018, 0x0a1018, 0x141820, 0x141820, 1);
    topBg.fillRect(0, 0, W, 52);
    hud(topBg);
    // Top border accent
    const topAccent = this.add.graphics();
    topAccent.lineStyle(2, 0xffcc00, 0.6);
    topAccent.lineBetween(0, 52, W, 52);
    hud(topAccent);
    
    this.scoreText = hud(this.add.text(16, 6, 'SCORE', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '11px', color: '#88aaaa',
      letterSpacing: 1,
    }));
    this.scoreValue = hud(this.add.text(16, 20, '0', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '26px', color: '#ffcc00',
      stroke: '#000000', strokeThickness: 2,
    }));
    
    // Center: Level + Combo
    this.levelText = hud(this.add.text(W / 2, 6, 'LEVEL 1', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '14px', color: '#ff8844',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5));
    this.comboText = hud(this.add.text(W / 2, 26, '', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '22px', color: '#ffcc00',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5));
    
    // Right: Speed
    this.speedText = hud(this.add.text(W - 16, 6, '0 MPH', {
      fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#88aaaa',
    }).setOrigin(1, 0));
    this.speedBar = hud(this.add.rectangle(W - 16, 26, 160, 6, 0x1a1a2a).setOrigin(1, 0.5));
    this.speedBar.setStrokeStyle(1, 0x333355);
    this.speedFill = hud(this.add.rectangle(W - 176, 26, 160, 6, 0x44ddff).setOrigin(0, 0.5));
    const speedMask = this.add.graphics().fillRect(W - 176, 23, 160, 6);
    this.speedFill.setMask(speedMask.createGeometryMask());
    
    // Bottom HUD bar - unified height and vertical alignment
    const barH = 50;
    const hudY = H - barH / 2; // y = 425: exact vertical center for all bottom HUD elements
    const botBg = this.add.graphics();
    botBg.fillGradientStyle(0x141820, 0x141820, 0x0a1018, 0x0a1018, 1);
    botBg.fillRect(0, H - barH, W, barH);
    hud(botBg);

    const botAccent = this.add.graphics();
    botAccent.lineStyle(2, 0xffcc00, 0.6);
    botAccent.lineBetween(0, H - barH, W, H - barH);
    hud(botAccent);
    
    // 1. Health meter (left) - aligned vertically to hudY
    hud(this.add.image(22, hudY, 'heart').setDisplaySize(18, 18));
    this.hpBarW = 120;
    this.hpBar = hud(this.add.rectangle(42, hudY, this.hpBarW, 12, 0x1a0a0a).setOrigin(0, 0.5));
    this.hpBar.setStrokeStyle(1, 0x442222);
    this.hpFill = hud(this.add.rectangle(42, hudY, this.hpBarW, 12, 0xff3333).setOrigin(0, 0.5));
    this.hpText = hud(this.add.text(42 + this.hpBarW + 8, hudY, '100', { 
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '15px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0, 0.5));
    
    // 2. Nitro meter (center-left) - aligned vertically to hudY
    hud(this.add.image(216, hudY, 'nitro').setDisplaySize(18, 18));
    this.nitroBarW = 110;
    this.nitroBar = hud(this.add.rectangle(234, hudY, this.nitroBarW, 12, 0x1a1400).setOrigin(0, 0.5));
    this.nitroBar.setStrokeStyle(1, 0x443300);
    this.nitroFill = hud(this.add.rectangle(234, hudY, this.nitroBarW, 12, 0xff8800).setOrigin(0, 0.5));
    this.nitroText = hud(this.add.text(234 + this.nitroBarW + 8, hudY, 'NITRO', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '13px', color: '#ffaa44',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0, 0.5));
    
    // 3. Daily challenge box (center-right) - completely within bottom HUD border
    this.dailyContainer = hud(this.add.container(510, hudY).setDepth(50));
    this.dailyBg = this.add.rectangle(0, 0, 210, 30, 0x0a1424, 0.85);
    this.dailyBg.setStrokeStyle(1, 0x336699);
    this.dailyText = this.add.text(0, 0, '', {
      fontFamily: 'Arial, sans-serif', fontSize: '10px', color: '#88ccff',
      wordWrap: { width: 200 },
      align: 'center',
    }).setOrigin(0.5);
    this.dailyContainer.add([this.dailyBg, this.dailyText]);
    
    // 4. Distance (far right) - aligned vertically to hudY
    this.distLabel = hud(this.add.text(784, hudY - 10, 'DISTANCE', {
      fontFamily: 'Arial, sans-serif', fontSize: '9px', fontWeight: 'bold', color: '#88aaaa',
      letterSpacing: 1,
    }).setOrigin(1, 0.5));
    this.distText = hud(this.add.text(784, hudY + 7, '0m', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '16px', color: '#ffcc00',
    }).setOrigin(1, 0.5));

    this.banner = hud(this.add.text(W / 2, H / 2, '', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '72px', color: '#ffffff',
      stroke: '#000000', strokeThickness: 8,
    }).setOrigin(0.5));
    
    // Screen edge damage vignette
    this.damageVignette = this.add.graphics();
    hud(this.damageVignette);
  }

  createPause() {
    this.pauseLayer = this.add.container(0, 0).setDepth(80).setVisible(false);
    const dim = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.65);
    const title = this.add.text(W / 2, 150, 'PAUSED', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '54px', color: '#ffcc00',
    }).setOrigin(0.5);
    const resume = this.makeMenuButton(W / 2, 230, 'RESUME', () => this.togglePause());
    const quit = this.makeMenuButton(W / 2, 290, 'QUIT', () => {
      this.game.audioManager?.stopEngine();
      this.scene.start('MenuScene');
    });
    this.pauseLayer.add([dim, title, resume, quit]);
  }

  makeMenuButton(x, y, label, cb) {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 180, 42, 0xff4400).setInteractive({ useHandCursor: true });
    const t = this.add.text(0, 0, label, {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '20px', color: '#fff',
    }).setOrigin(0.5);
    bg.on('pointerdown', cb);
    c.add([bg, t]);
    return c;
  }

  startCountdown() {
    const steps = ['3', '2', '1', 'GO!'];
    let i = 0;
    const tick = () => {
      this.banner.setText(steps[i]);
      this.banner.setScale(0.6);
      this.tweens.add({ targets: this.banner, scale: 1.15, duration: 280, yoyo: true });
      if (this.game.audioManager) {
        this.game.audioManager.resume();
        this.game.audioManager.play(i === 3 ? 'go' : 'countdown');
      }
      i += 1;
      if (i < steps.length) {
        this.time.delayedCall(700, tick);
      } else {
        this.time.delayedCall(500, () => {
          this.banner.setText('');
          this.started = true;
          this.game.audioManager?.startEngine();
        });
      }
    };
    tick();
  }

  togglePause() {
    this.paused = !this.paused;
    this.pauseLayer.setVisible(this.paused);
    this.physics.world.isPaused = this.paused;
    if (this.paused) this.game.audioManager?.setEngineSuspended(true);
    else if (this.started) this.game.audioManager?.setEngineSuspended(false);
  }

  spawnCar() {
    const key = Phaser.Math.RND.pick(this.carTypes);
    const lane = Phaser.Math.RND.pick(LANES);
    const car = this.physics.add.sprite(lane, -40, key);
    
    // Size based on vehicle type
    const sizes = {
      'car_red': [50, 30], 'car_blue': [50, 30], 'car_green': [50, 30],
      'car_yellow': [48, 26], 'car_white': [58, 32],
      'motorcycle': [35, 18], 'pickup': [65, 35], 'bus': [85, 40],
      'sports_low': [55, 28], 'ambulance': [60, 35], 'firetruck': [70, 40], 'tanker': [110, 55]
    };
    const [dw, dh] = sizes[key] || [50, 30];
    car.setDisplaySize(dw, dh);
    car.setAngle(-90);
    car.setDepth(6);
    car.body.setSize(dw * 0.8, dh * 0.8);
    
    // Different behaviors by type
    const difficulty = 1 + this.level * 0.12;
    car.kind = 'car';
    car.vehicleType = key;
    car.wrecked = false;
    
    if (key === 'motorcycle') {
      car.vy = Phaser.Math.Between(180, 280) * difficulty;
      car.hp = 1;
      car.points = 200;
      car.agile = true; // Weaves between lanes
      car.targetLane = lane;
      car.laneChangeTimer = Phaser.Math.Between(1, 3);
    } else if (key === 'bus') {
      car.vy = Phaser.Math.Between(50, 100) * difficulty;
      car.hp = 3;
      car.points = 300;
      car.slow = true;
    } else if (key === 'tanker') {
      car.vy = Phaser.Math.Between(60, 110) * difficulty;
      car.hp = 2;
      car.points = 400;
      car.explosive = true;
    } else if (key === 'sports_low') {
      car.vy = Phaser.Math.Between(200, 300) * difficulty;
      car.hp = 1;
      car.points = 350;
      car.fast = true;
    } else if (key === 'ambulance' || key === 'firetruck') {
      car.vy = Phaser.Math.Between(120, 200) * difficulty;
      car.hp = 2;
      car.points = 250;
      car.emergency = true;
      this.game.audioManager?.play('siren');
    } else if (key === 'pickup') {
      car.vy = Phaser.Math.Between(70, 150) * difficulty;
      car.hp = 1;
      car.points = 150;
    } else {
      car.vy = Phaser.Math.Between(70, 180) * difficulty;
      car.hp = 1;
      car.points = 100;
    }
    car.lane = lane;
    this.entities.push(car);
  }

  spawnPolice() {
    const lane = Phaser.Math.RND.pick(LANES);
    const car = this.physics.add.sprite(lane, -50, 'police');
    car.setDisplaySize(52, 30);
    car.setAngle(-90);
    car.setDepth(7);
    car.kind = 'police';
    car.vy = 160 + this.level * 8;
    car.wrecked = false;
    car.hp = 2;
    car.points = 500;
    this.entities.push(car);
    this.game.audioManager?.play('siren');
  }

  spawnBoss() {
    console.error('[spawnBoss] Called, this.bossActive=', this.bossActive, 'stack:', new Error().stack);
    if (this.bossActive) return;
    this.bossActive = true;
    this.bossMaxHealth = 300 + this.level * 100;
    this.bossHealth = this.bossMaxHealth;
    this.bossSpawnedAt = this.time.now;
    
    // Number of ram attempts before boss leaves (increases with level)
    this.bossMaxAttacks = 2 + Math.floor(this.level / 3); // 2 at level 1, 3 at level 3, 4 at level 6, etc.
    this.bossAttackCount = 0;
    
    const lane = LANES[2]; // Center lane
    this.boss = this.physics.add.sprite(lane, -100, 'boss_truck');
    this.boss.setDisplaySize(140, 70);
    this.boss.setAngle(-90);
    this.boss.setDepth(8);
    this.boss.instanceId = Date.now() + Math.random(); // Unique instance ID
    // Physics body for collision - narrower than display size for fair collision
    this.boss.body.setSize(80, 40);
    this.boss.body.setOffset(30, 15);
    this.boss.kind = 'boss';
    this.boss.vy = 40;
    this.boss.wrecked = false;
    this.boss.phase = 1;
    this.boss.attackTimer = 0;
    this.boss.side = 1; // 1 = right, -1 = left
    this.boss.attacking = false;
    this.boss.attackCooldown = 0;
    
    // Boss health bar
    this.bossBarBg = this.add.rectangle(W / 2, 70, 400, 16, 0x330000).setDepth(50).setScrollFactor(0);
    this.bossBarFill = this.add.rectangle(W / 2 - 198, 70, 396, 12, 0xff2200).setDepth(51).setScrollFactor(0).setOrigin(0, 0.5);
    this.bossBarLabel = this.add.text(W / 2, 70, 'BOSS', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '16px', color: '#ffcc00',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(52).setScrollFactor(0);
    
    // Attack counter display
    this.bossAttackText = this.add.text(W / 2, 90, `ATTACKS: 0 / ${this.bossMaxAttacks}`, {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '14px', color: '#ffcc00',
      stroke: '#000', strokeThickness: 2
    }).setOrigin(0.5).setDepth(52).setScrollFactor(0);
    
    this.flashBanner('BOSS INCOMING!');
    this.game.audioManager?.play('siren');
    this.entities.push(this.boss);
  }

  updateBoss(dt) {
    const boss = this.boss;
    if (!boss || !boss.active || !this.bossActive || !boss.scene) return;
    // Safety: if boss was removed from entities, stop processing
    if (!this.entities.includes(boss)) return;
    
    // RETREAT MODE: Boss leaves after max attacks - skip all attack logic
    if (this.bossRetreating) {
      boss.vy = 200; // Speed away downward
      boss.y += boss.vy * dt;
      boss.x = Phaser.Math.Linear(boss.x, this.player.x, 0.02); // Drift slightly toward player x
      
      // Sync physics body
      if (boss.body) boss.body.updateFromGameObject();
      
      // Check if boss left screen
      if (boss.y > this.cameras.main.height + 100) {
        this.cleanupBoss();
        return;
      }
      return;
    }
    
    console.log('[updateBoss] Called, attackCount:', this.bossAttackCount, 'attackTimer:', boss.attackTimer?.toFixed(2));
    
    // Movement pattern - wrapped in try/catch to see silent errors
    try {
      console.error('[updateBoss] TIMER UPDATE START dt=', dt, 'attackTimer=', boss.attackTimer, 'boss.instanceId=', boss.instanceId, 'this.boss.instanceId=', this.boss?.instanceId);
      const beforeAttackTimer = boss.attackTimer;
      const beforeAttackCooldown = boss.attackCooldown;
      boss.attackTimer += dt;
      if (boss.attackCooldown > 0) boss.attackCooldown -= dt;
      if (this.bossRamCooldown > 0) this.bossRamCooldown -= dt;
      const afterAttackTimer = boss.attackTimer;
      const afterAttackCooldown = boss.attackCooldown;
      console.error('[updateBoss] TIMER UPDATE END beforeAttackTimer=', beforeAttackTimer, 'afterAttackTimer=', afterAttackTimer, 'dt=', dt, 'beforeCooldown=', beforeAttackCooldown, 'afterCooldown=', afterAttackCooldown);
      if (beforeAttackTimer === afterAttackTimer && dt > 0) {
        console.error('[updateBoss] *** TIMER NOT INCREMENTING! boss===this.boss:', boss === this.boss, 'boss.attackTimer writable:', Object.getOwnPropertyDescriptor(boss, 'attackTimer')?.writable);
      }
    } catch (e) {
      console.error('[updateBoss] Timer error:', e.message, e.stack);
      return;
    }
    
    try {
      console.error('[updateBoss] PHASE LOGIC START phase=', boss.phase, 'attacking=', boss.attacking, 'attackTimer=', boss.attackTimer, 'attackCooldown=', boss.attackCooldown, 'attackCount=', this.bossAttackCount);
      // Check if player has passed the boss vertically (player is above boss)
      const playerPassedBoss = this.player.y < boss.y - 30;
      
      // Boss chase mode - if player passes boss, boss chases for a bit
      if (playerPassedBoss && !this.bossChaseMode) {
        this.bossChaseMode = true;
        this.bossChaseTimer = 8; // Chase for 8 seconds
        this.flashBanner('BOSS PURSUING!');
        this.game.audioManager?.play('siren');
      }
      
      if (this.bossChaseMode) {
        this.bossChaseTimer -= dt;
        // Chase player vertically and horizontally - LESS AGGRESSIVE
        // Skip linear interpolation during ram attack
        if (!boss.attacking) {
          boss.y = Phaser.Math.Linear(boss.y, this.player.y - 80, 0.03); // Stay further behind player, slower
          boss.x = Phaser.Math.Linear(boss.x, this.player.x, 0.05); // Slower horizontal tracking
        }
        
        // Less aggressive ramming during chase
        if (boss.attackTimer > 1.5 && boss.attackCooldown <= 0) {
          boss.attackTimer = 0;
          boss.attackCooldown = 2.0;
          boss.vy = 0; // Stop velocity during ram
          // Ram vertically downward at player (stop 80px above player)
          const self = this;
          this.tweens.add({
            targets: boss,
            y: this.player.y - 80, // Stop 80px above player
            duration: 500,
            ease: 'Power2',
            onComplete: () => { 
              if (!self.boss || !self.boss.active) return;
              self.boss.attacking = false;
              self.bossAttackCount++;
              if (self.bossAttackText) {
                self.bossAttackText.setText(`ATTACKS: ${self.bossAttackCount} / ${self.bossMaxAttacks}`);
              }
            }
          });
          // Visual indicator of ram
          this.emitRadial(boss.x, boss.y, 'spark_shower', 6, { speed: { min: 150, max: 400 }, lifespan: 250, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 30, blendMode: 'ADD' });
          this.cameras.main.shake(60, 0.005);
        }
        
        if (this.bossChaseTimer <= 0) {
          this.bossChaseMode = false;
        }
      } else {
      // Normal behavior when not chasing
      // Phase 1: Slow approach, ram attempts - FIRST ENCOUNTER (level 10) IS MUCH EASIER
      if (boss.phase === 1) {
        // Scale boss difficulty: level 10 = very slow, level 20+ = normal
        const isFirstBoss = this.level <= 12;
        const bossSpeed = isFirstBoss ? 0.2 : 1.0; // Even slower
        const bossAttackSpeed = isFirstBoss ? 3.0 : 1.0;
        
        // Don't move with velocity during ram attack (tween handles position)
        if (!boss.attacking) {
          boss.y += boss.vy * dt * bossSpeed;
          // Stop much further back - boss should never overlap player
          // Player is typically around Y=340, so boss should stop at Y=220
          const stopY = isFirstBoss ? 220 : 120;
          if (boss.y > stopY) {
            boss.y = stopY; // Clamp position
            boss.vy = 0; // STOP completely
          }
        }
        
        // Side-to-side sweeping - much slower on first boss
        boss.x += boss.side * (isFirstBoss ? 10 : 50) * dt;
        if (boss.x > ROAD_RIGHT - 40 || boss.x < ROAD_LEFT + 40) {
          boss.side *= -1;
        }
        
        // Ram attack - MUCH LESS FREQUENT on first boss
        const attackInterval = isFirstBoss ? Math.max(8, 10 - this.level * 0.1) : Math.max(2.5, 4 - this.level * 0.15);
        if (boss.attackTimer > attackInterval && boss.attackCooldown <= 0) {
          boss.attackTimer = 0;
          boss.attackCooldown = isFirstBoss ? 8 : 3; // Much longer cooldown
          boss.attacking = true;
          boss.vy = 0; // Stop velocity during ram
          // VERTICAL RAM - boss charges down at player (shorter distance on first boss)
          // Don't ram all the way to player - stop well short
          // For first boss, clamp is at Y=220, so target must be < 220 (higher on screen, smaller Y)
          const stopY = isFirstBoss ? 220 : 120;
          const targetY = isFirstBoss ? Math.min(this.player.y - 140, stopY - 40) : this.player.y - 100;
          const self = this;
          this.tweens.add({
            targets: boss,
            y: targetY,
            duration: isFirstBoss ? 1500 : 600, // Much slower ram
            ease: isFirstBoss ? 'Sine.easeInOut' : 'Power2',
            onComplete: () => { 
              if (!self.boss || !self.boss.active) return;
              self.boss.side = self.player.x < self.boss.x ? -1 : 1; 
              self.boss.attacking = false;
              self.bossAttackCount++;
              if (self.bossAttackText) {
                self.bossAttackText.setText(`ATTACKS: ${self.bossAttackCount} / ${self.bossMaxAttacks}`);
              }
            }
          });
          // Visual indicator of ram
          this.emitRadial(boss.x, boss.y, 'spark_shower', 5, { speed: { min: 150, max: 400 }, lifespan: 250, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 30, blendMode: 'ADD' });
          this.cameras.main.shake(50, 0.004);
        }
        
        if (this.bossHealth < this.bossMaxHealth * 0.6) {
          boss.phase = 2;
          this.flashBanner('BOSS ENRAGED!');
          this.game.audioManager?.play('wreck');
        }
      }
      // Phase 2: Faster, spawns minions - FIRST ENCOUNTER MUCH EASIER
      else if (boss.phase === 2) {
        const isFirstBoss = this.level <= 12;
        // Don't move with velocity during ram attack
        if (!boss.attacking) {
          boss.y += boss.vy * dt * (isFirstBoss ? 0.3 : 1.0); // Even slower
          boss.x += boss.side * (isFirstBoss ? 25 : 100) * dt;
          if (boss.x > ROAD_RIGHT - 40 || boss.x < ROAD_LEFT + 40) boss.side *= -1;
          // Keep boss further back in phase 2 too - clamp position
          if (isFirstBoss && boss.y > 200) {
            boss.y = 200; // Clamp position
            boss.vy = 0; // Stop moving down
          }
        } else {
          // Still allow horizontal movement during attack for visual effect
          boss.x += boss.side * (isFirstBoss ? 25 : 100) * dt;
        }
        
        if (boss.attackTimer > (isFirstBoss ? 6 : 1.8)) {
          boss.attackTimer = 0;
          // Spawn explosive barrels from sides - fewer on first boss
          if (!isFirstBoss || Phaser.Math.Between(0, 1) === 0) {
            const side = Phaser.Math.Between(0, 1) ? ROAD_LEFT + 30 : ROAD_RIGHT - 30;
            const barrel = this.physics.add.sprite(side, boss.y, 'barrel');
            barrel.setDisplaySize(22, 22);
            barrel.setDepth(5);
            barrel.kind = 'hard';
            barrel.vy = 0;
            barrel.wrecked = false;
            barrel.fromBoss = true;
            this.entities.push(barrel);
          }
          // Also do a vertical ram - much less often on first boss
          if (boss.attackCooldown <= 0) {
            boss.attackCooldown = isFirstBoss ? 8 : 2.5;
            boss.vy = 0; // Stop velocity during ram
            const self = this;
            // Phase 2 clamp for first boss is at Y=200, so target must be < 200 (higher on screen, smaller Y)
            const stopY = isFirstBoss ? 200 : 120;
            const targetY = isFirstBoss ? Math.min(this.player.y - 120, stopY - 40) : this.player.y - 80;
            this.tweens.add({
              targets: boss,
              y: targetY,
              duration: isFirstBoss ? 1200 : 500,
              ease: isFirstBoss ? 'Sine.easeInOut' : 'Power2',
              onComplete: () => {
                if (!self.boss || !self.boss.active) return;
                self.boss.attacking = false;
                self.bossAttackCount++;
              }
            });
            this.emitRadial(boss.x, boss.y, 'spark_shower', 6, { speed: { min: 150, max: 400 }, lifespan: 250, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 30, blendMode: 'ADD' });
          }
        }
        
        if (this.bossHealth < this.bossMaxHealth * 0.2) {
          boss.phase = 3;
          this.flashBanner('FINAL PHASE!');
        }
      }
      // Phase 3: Desperate, charges - MOST AGGRESSIVE (as intended for final phase)
      else {
        // Don't move with velocity during ram attack
        if (!boss.attacking) {
          boss.vy = 80; // Slower vertical
          boss.y += boss.vy * dt;
          // Don't let boss get too close to player vertically
          if (boss.y > this.player.y - 80) boss.y = this.player.y - 80;
          // Charge directly at player - both X and Y
          boss.x = Phaser.Math.Linear(boss.x, this.player.x, 0.06); // Was 0.08
        } else {
          // Still allow horizontal movement during attack for visual effect
          boss.x = Phaser.Math.Linear(boss.x, this.player.x, 0.06);
        }
        // Constant ramming in phase 3
        if (boss.attackCooldown <= 0) {
          boss.attackCooldown = 1.5; // Was 1.0
          boss.vy = 0; // Stop velocity during ram
          const self = this;
          this.tweens.add({
            targets: boss,
            y: this.player.y - 100, // Stop 100px above player
            duration: 400, // Was 350
            ease: 'Power3',
            onComplete: () => {
              if (!self.boss || !self.boss.active) return;
              self.boss.attacking = false;
              self.bossAttackCount++;
            }
          });
          this.emitRadial(boss.x, boss.y, 'spark_shower', 8, { speed: { min: 150, max: 400 }, lifespan: 250, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 30, blendMode: 'ADD' }); // Was 10
          this.cameras.main.shake(80, 0.006); // Was 100, 0.008
        }
      }
    }
    console.error('[updateBoss] PHASE LOGIC END phase=', boss.phase, 'attacking=', boss.attacking, 'attackTimer=', boss.attackTimer, 'attackCount=', this.bossAttackCount);
    
    // Sync boss physics body with sprite position for accurate collision
    if (this.boss && this.boss.body) this.boss.body.updateFromGameObject();
    
    // Boss may have been destroyed during this frame's logic
    if (!this.boss || !this.boss.active) return;
    
    // Update health bar
    const ratio = this.bossHealth / this.bossMaxHealth;
    if (this.bossBarFill) {
      this.bossBarFill.width = 396 * ratio;
      this.bossBarFill.fillColor = ratio > 0.5 ? 0xff2200 : (ratio > 0.2 ? 0xffaa00 : 0xff0000);
    }
    
    console.error('[updateBoss] RETREAT/COLLISION START bossAttackCount=', this.bossAttackCount, 'bossMaxAttacks=', this.bossMaxAttacks, 'bossRetreating=', this.bossRetreating);
    
    // Check collision with player - player can damage boss by ramming at high speed
    // A cooldown prevents contact damage from ticking every single frame.
    if (this.checkCollision(this.boss)) {
      const canRam = this.bossRamCooldown <= 0;
      if (canRam) {
        this.bossRamCooldown = 0.8; // 0.8s between contact hits
        if (this.speed > 350 || this.nitroActive > 0) {
          // Player rams boss at high speed - damage boss
          const bx = this.boss.x, by = this.boss.y;
          this.damageBoss(25);
          this.floatText(bx, by - 30, '-25', '#ff4444');
          this.emitRadial(bx, by, 'spark_particle', 12, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
          this.cameras.main.shake(100, 0.008);
          // Knockback (boss may have been defeated by this hit)
          if (this.boss && this.boss.active) {
            this.boss.x += (this.boss.x - this.player.x) * 0.3;
            this.boss.x += Phaser.Math.Between(-40, 40);
          }
        } else if (this.shieldTime <= 0) {
          // Boss damages player - MORE DAMAGE from boss ram
          this.damage(35);
          if (this.boss && this.boss.active) {
            this.boss.x += Phaser.Math.Between(-40, 40);
          }
        }
      }
    }
    
    // Boss may have been defeated above
    if (!this.boss || !this.boss.active) return;
    
    // Boss leaves after max attacks
    if (this.bossAttackCount >= this.bossMaxAttacks) {
      console.error('[updateBoss] RETREAT TRIGGERED: attackCount=', this.bossAttackCount, 'maxAttacks=', this.bossMaxAttacks);
      if (!this.bossRetreating) {
        this.bossRetreating = true;
        this.flashBanner('BOSS RETREATING!');
        this.game.audioManager?.play('siren');
      }
      this.boss.vy = 200; // Speed away
      this.boss.y += this.boss.vy * dt;
      if (this.boss.y > H + 100) {
        console.error('[updateBoss] CLEANUP from max attacks');
        this.cleanupBoss();
        return;
      }
    } else if (!this.bossChaseMode && this.boss.y > H + 100) {
      // Boss left the screen
      console.error('[updateBoss] CLEANUP from off-screen');
      this.cleanupBoss();
      return;
    }
    console.error('[updateBoss] RETREAT/COLLISION END bossRetreating=', this.bossRetreating, 'bossActive=', this.bossActive);
  } catch (e) {
    console.error('[updateBoss] Retreat/collision error:', e.message, e.stack);
    return;
  }
}
  
  cleanupBoss() {
    console.error('[cleanupBoss] Called, this.boss.instanceId=', this.boss?.instanceId, 'stack:', new Error().stack);
    if (this.boss) {
      // Remove from entities array
      const idx = this.entities.indexOf(this.boss);
      if (idx >= 0) this.entities.splice(idx, 1);
      try { this.boss.destroy(); } catch (_) {}
    }
    if (this.bossBarBg) { try { this.bossBarBg.destroy(); } catch (_) {} }
    if (this.bossBarFill) { try { this.bossBarFill.destroy(); } catch (_) {} }
    if (this.bossBarLabel) { try { this.bossBarLabel.destroy(); } catch (_) {} }
    if (this.bossAttackText) { try { this.bossAttackText.destroy(); } catch (_) {} }
    this.boss = null;
    this.bossActive = false;
    this.bossChaseMode = false;
    this.bossRetreating = false;
  }

  damageBoss(amount) {
    if (!this.boss || !this.boss.active) return;
    this.bossHealth -= amount;
    this.emitRadial(this.boss.x, this.boss.y, 'spark_particle', 8, { speed: { min: 40, max: 200 }, lifespan: 400, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    this.cameras.main.shake(80, 0.006);
    
    if (this.bossHealth <= 0) {
      this.defeatBoss();
    }
  }

  defeatBoss() {
    console.error('[defeatBoss] Called, this.boss.instanceId=', this.boss?.instanceId, 'stack:', new Error().stack);
    if (!this.boss) return;
    const bonus = 5000 * this.combo;
    this.score += bonus;
    this.flashBanner('BOSS DEFEATED! +' + bonus.toLocaleString());
    this.game.audioManager?.play('level_complete');
    
    // Massive explosion
    this.emitRadial(this.boss.x, this.boss.y, 'explosion_particle', 30, { speed: { min: 60, max: 250 }, lifespan: 600, scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    this.emitRadial(this.boss.x, this.boss.y, 'spark_particle', 20, { speed: { min: 40, max: 200 }, lifespan: 400, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    
    // Remove from entities array
    const idx = this.entities.indexOf(this.boss);
    if (idx >= 0) this.entities.splice(idx, 1);
    
    try { this.boss.destroy(); } catch (_) {}
    if (this.bossBarBg) { try { this.bossBarBg.destroy(); } catch (_) {} }
    if (this.bossBarFill) { try { this.bossBarFill.destroy(); } catch (_) {} }
    if (this.bossBarLabel) { try { this.bossBarLabel.destroy(); } catch (_) {} }
    if (this.bossAttackText) { try { this.bossAttackText.destroy(); } catch (_) {} }
    this.boss = null;
    this.bossActive = false;
    this.bossChaseMode = false;
    this.bossRetreating = false;
    this.combo = 1;
  }

  spawnObstacle() {
    const cluster = Phaser.Math.Between(0, 1) === 0;
    const count = cluster ? Phaser.Math.Between(2, 4) : 1;
    for (let i = 0; i < count; i++) {
      const roll = Math.random();
      let key, w, h, kind, points;
      
      if (roll < 0.25) {
        // Soft: Cone
        key = 'cone'; w = 22; h = 22; kind = 'soft'; points = 10;
      } else if (roll < 0.45) {
        // Soft: Barrel
        key = 'barrel'; w = 22; h = 22; kind = 'soft'; points = 15;
      } else if (roll < 0.6) {
        // Hard: Metal barrier
        key = 'barrier_metal'; w = 70; h = 22; kind = 'hard'; points = 25;
      } else if (roll < 0.72) {
        // Hard: Concrete barrier
        key = 'barrier_concrete'; w = 70; h = 22; kind = 'hard'; points = 30;
      } else if (roll < 0.82) {
        // New: Cargo container (wide, destructible)
        key = 'container'; w = 60; h = 35; kind = 'hard'; points = 100;
      } else if (roll < 0.9) {
        // New: Oil slick (slows, no damage)
        key = 'oil_slick'; w = 50; h = 40; kind = 'oil'; points = 0;
      } else {
        // New: Debris pile (multi-hit)
        key = 'debris'; w = 40; h = 30; kind = 'debris'; points = 50;
      }
      
      const x = Phaser.Math.Between(ROAD_LEFT + 30, ROAD_RIGHT - 30);
      const y = -30 - i * 40;
      const obj = this.physics.add.sprite(x, y, key);
      obj.setDisplaySize(w, h);
      obj.setDepth(5);
      obj.kind = kind;
      obj.vy = 0;
      obj.wrecked = false;
      obj.points = points;
      obj.hits = (kind === 'debris') ? 3 : 1;
      this.entities.push(obj);
    }
  }

  spawnPower() {
    const kinds = [
      { key: 'fuel', type: 'fuel' },
      { key: 'shield', type: 'shield' },
      { key: 'nitro', type: 'nitro' },
      { key: 'wrench', type: 'wrench' },
      { key: 'coin', type: 'coin' },
      { key: 'drone', type: 'drone' }, // New: drone drops random powerup
    ];
    const pick = Phaser.Math.RND.pick(kinds);
    const x = Phaser.Math.RND.pick(LANES);
    const p = this.physics.add.sprite(x, -30, pick.key);
    p.setDisplaySize(pick.key === 'drone' ? 20 : 26, pick.key === 'drone' ? 20 : 26);
    p.setDepth(6);
    p.kind = 'power';
    p.power = pick.type;
    p.baseY = 0;
    p.vy = 0;
    this.entities.push(p);
    this.tweens.add({ targets: p, scaleX: p.scaleX * 1.15, scaleY: p.scaleY * 1.15, yoyo: true, repeat: -1, duration: 400 });
  }

  generateDailyGoals() {
    // Deterministic daily goals based on seed
    const rng = (seed) => {
      let s = seed;
      return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    };
    const r = rng(this.dailySeed);
    
    const goalTypes = [
      { type: 'wrecks', target: 10 + Math.floor(r() * 20), desc: 'Wreck {target} vehicles' },
      { type: 'distance', target: 5000 + Math.floor(r() * 10000), desc: 'Drive {target}m' },
      { type: 'combo', target: 3 + Math.floor(r() * 3), desc: 'Reach x{target} combo' },
      { type: 'coins', target: 3 + Math.floor(r() * 5), desc: 'Collect {target} coins' },
      { type: 'perfect', target: 1, desc: 'Complete without damage' },
    ];
    
    // Pick 3 goals for today
    const shuffled = [...goalTypes].sort(() => r() - 0.5);
    return shuffled.slice(0, 3);
  }

  checkDailyProgress() {
    if (this.dailyCompleted) return;
    
    let completed = 0;
    for (const goal of this.dailyGoals) {
      let done = false;
      if (goal.type === 'wrecks' && this.dailyProgress.wrecks >= goal.target) done = true;
      if (goal.type === 'distance' && this.dailyProgress.distance >= goal.target) done = true;
      if (goal.type === 'combo' && this.dailyProgress.combo >= goal.target) done = true;
      if (goal.type === 'coins' && this.dailyProgress.coins >= goal.target) done = true;
      if (goal.type === 'perfect' && this.health === 100 && this.distance > 1000) done = true;
      
      if (done) completed++;
    }
    
    if (completed === this.dailyGoals.length) {
      this.dailyCompleted = true;
      this.flashBanner('DAILY CHALLENGE COMPLETE! +5000');
      this.score += 5000;
      this.game.audioManager?.play('level_complete');
    }
  }

  getDailyDisplay() {
    return this.dailyGoals.map(g => {
      let current = 0;
      if (g.type === 'wrecks') current = this.dailyProgress.wrecks;
      if (g.type === 'distance') current = this.dailyProgress.distance;
      if (g.type === 'combo') current = this.dailyProgress.combo;
      if (g.type === 'coins') current = this.dailyProgress.coins;
      if (g.type === 'perfect') current = (this.health === 100 && this.distance > 1000) ? 1 : 0;
      
      return `${g.desc.replace('{target}', g.target)}: ${Math.min(current, g.target)}/${g.target}`;
    }).join('  |  ');
  }

  update(_time, delta) {
    if (!this.started || this.paused) return;
    const dt = Math.min(delta, 40) / 1000;

    // Initialize error capture array if not exists
    if (!this._errors) this._errors = [];

    // Wrap each subsystem so a single error can never freeze the whole game loop.
    // A thrown error inside Phaser's update() would otherwise stop the scene permanently.
    const safe = (name, fn) => {
      try {
        fn();
      } catch (err) {
        const errorMsg = `GameScene error in ${name}: ${err.message}\n${err.stack}`;
        this._errors.push(errorMsg);
        console.error(errorMsg);
      }
    };

    safe('handleInput', () => this.handleInput(dt));
    safe('updatePlayer', () => this.updatePlayer(dt));
    safe('engineAudio', () => this.updateEngineAudio());
    safe('scrollWorld', () => this.scrollWorld(dt));
    safe('updateSpawns', () => this.updateSpawns(dt));
    safe('updateEntities', () => this.updateEntities(dt));
    safe('updateHud', () => this.updateHud());
    safe('updateWeather', () => this.updateWeather(dt));
    safe('checkRewards', () => this.checkRewards());
  }

  handleInput(dt) {
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;

    const steer = this.rain ? 220 : 280;
    if (left) this.player.x -= steer * dt;
    if (right) this.player.x += steer * dt;
    this.player.x = Phaser.Math.Clamp(this.player.x, ROAD_LEFT + 24, ROAD_RIGHT - 24);

    // Vertical movement - player can now move up and down the screen
    const verticalSpeed = 200;
    if (up) this.player.y -= verticalSpeed * dt;
    if (down) this.player.y += verticalSpeed * dt;
    // Clamp vertical position - player can go from near top to bottom
    this.player.y = Phaser.Math.Clamp(this.player.y, 60, H - 40);

    // Speed control (separate from vertical position)
    if (this.cursors.shift?.isDown) this.speed = Math.min(this.maxSpeed, this.speed + 180 * dt);
    else if (this.cursors.space?.isDown) this.speed = Math.max(this.minSpeed, this.speed - 260 * dt);
    else this.speed = Phaser.Math.Linear(this.speed, 260, 0.4 * dt);

    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
      if (this.nitroCharge >= 1) {
        this.nitroCharge = 0;
        this.nitroActive = 3.2;
        this.game.audioManager?.play('nitro');
        
        // Nitro activation screen effects
        this.cameras.main.flash(100, 0, 200, 255, false);
        this.time.timeScale = 1.2;
        this.time.delayedCall(100, () => { this.time.timeScale = 1; });
        
        // Screen shake on nitro activation
        this.cameras.main.shake(200, 0.01);
      } else {
        this.game.audioManager?.play('horn');
      }
    }
  }

  updatePlayer(dt) {
    if (this.nitroActive > 0) {
      this.nitroActive -= dt;
      this.speed = Math.min(this.maxSpeed + 180, this.speed + 80);
      this.flames.emitting = true;
      this.nitroFlames.emitting = true;
      this.nitroFlames.setPosition(this.trailer.x, this.trailer.y + 12);
    } else {
      this.flames.emitting = false;
      this.nitroFlames.emitting = false;
    }
    if (this.shieldTime > 0) {
      this.shieldTime -= dt;
      this.player.setTint(0x66ccff);
    } else {
      this.player.clearTint();
    }

    this.trailer.x = Phaser.Math.Linear(this.trailer.x, this.player.x, 0.18);
    this.trailer.y = this.player.y + 58;

    // Realistic vehicle steering lean & trailer articulation
    const turnVel = this.player.body ? this.player.body.velocity.x : 0;
    const cabTilt = Phaser.Math.Clamp(turnVel * 0.035, -8, 8);
    this.player.setAngle(-90 + cabTilt);

    const trailerDx = this.player.x - this.trailer.x;
    const trailerArtic = Phaser.Math.Clamp(trailerDx * 0.75, -18, 18);
    this.trailer.setAngle(-90 + trailerArtic);

    this.exhaust.setPosition(this.trailer.x, this.trailer.y + 22);
    this.exhaust2.setPosition(this.trailer.x, this.trailer.y + 26);
    this.heatShimmer.setPosition(this.trailer.x, this.trailer.y + 18);
    this.flames.setPosition(this.trailer.x, this.trailer.y + 18);
    this.updateHeadlights();

    // Tire smoke & road spray - emit when accelerating hard or turning
    const isAccelerating = this.cursors.shift?.isDown || this.nitroActive > 0;
    const isTurning = Math.abs(this.player.body?.velocity.x || 0) > 50;
    const isWet = this.rain;
    
    if (isAccelerating || (isTurning && this.speed > 150)) {
      this.tireSmokeL.emitting = true;
      this.tireSmokeR.emitting = true;
      // Position at rear wheels
      const trailerX = this.trailer.x;
      const trailerY = this.trailer.y + 30;
      this.tireSmokeL.setPosition(trailerX - 20, trailerY);
      this.tireSmokeR.setPosition(trailerX + 20, trailerY);
      
      // ENHANCED: More tire smoke particles for visibility
      if (Math.random() < 0.3) {
        this.emitRadial(trailerX - 20, trailerY, 'tire_smoke', 1, { speed: { min: 20, max: 60 }, speedY: { min: 10, max: 40 }, scale: { start: 1, end: 1.5 }, alpha: { start: 0.5, end: 0 }, gravityY: 30, blendMode: 'NORMAL' });
        this.emitRadial(trailerX + 20, trailerY, 'tire_smoke', 1, { speed: { min: 20, max: 60 }, speedY: { min: 10, max: 40 }, scale: { start: 1, end: 1.5 }, alpha: { start: 0.5, end: 0 }, gravityY: 30, blendMode: 'NORMAL' });
      }
    } else {
      this.tireSmokeL.emitting = false;
      this.tireSmokeR.emitting = false;
    }
    
    // Road spray when wet
    if (isWet && this.speed > 100) {
      this.roadSprayL.emitting = true;
      this.roadSprayR.emitting = true;
      const trailerX = this.trailer.x;
      const trailerY = this.trailer.y + 30;
      this.roadSprayL.setPosition(trailerX - 20, trailerY);
      this.roadSprayR.setPosition(trailerX + 20, trailerY);
      
      // ENHANCED: More road spray
      if (Math.random() < 0.2) {
        this.emitRadial(trailerX - 20, trailerY, 'puddle_ripple', 1, { speed: { min: 10, max: 30 }, speedY: { min: 50, max: 100 }, scale: { start: 0.8, end: 0 }, alpha: { start: 0.8, end: 0 }, gravityY: 100, blendMode: 'NORMAL', tint: 0xAADDFF });
        this.emitRadial(trailerX + 20, trailerY, 'puddle_ripple', 1, { speed: { min: 10, max: 30 }, speedY: { min: 50, max: 100 }, scale: { start: 0.8, end: 0 }, alpha: { start: 0.8, end: 0 }, gravityY: 100, blendMode: 'NORMAL', tint: 0xAADDFF });
      }
    } else {
      this.roadSprayL.emitting = false;
      this.roadSprayR.emitting = false;
    }

    // Distance-based speed progression
    this.updateSpeedFromDistance();
    
    // Update engine audio with current state
    this.updateEngineAudio();

    this.distance += this.speed * dt * 0.08;
    this.dailyProgress.distance = Math.floor(this.distance);
    this.score += Math.floor(this.speed * dt * 0.4);
    if (this.comboTimer > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) this.combo = 1;
    }
    const nextLevel = 1 + Math.floor(this.score / 2000);
    if (nextLevel > this.level) {
      this.level = nextLevel;
      this.flashBanner('LEVEL ' + this.level);
      this.game.audioManager?.play('level_complete');
      if (this.analytics) {
        this.analytics.trackLevelUp(this.level);
      }
    }
    
    // Check daily challenge
    this.checkDailyProgress();
    
    // Check vehicle upgrade checkpoints
    this.checkVehicleUpgrade();
  }
  
  checkVehicleUpgrade() {
    if (this.vehicleUpgradePending) return;
    
    if (this.nextCheckpoint && this.distance >= this.nextCheckpoint.distance) {
      this.vehicleUpgradePending = true;
      this.upgradeVehicle();
    }
  }
  
  upgradeVehicle() {
    const checkpoint = this.nextCheckpoint;
    if (!checkpoint) return;
    // Scene may have been torn down (game over) - bail out safely
    if (!this.player || !this.player.scene || !this.trailer || !this.trailer.scene) return;
    this.currentVehicleTier++;
    
    // Vehicle-specific physics body configs (width, height, offsetX, offsetY)
    // All vehicles face up (-90 deg), so cab is at top (smaller Y)
    // Use full visual height for body, offset by -visualHeight/2 to align top with visual top
    const bodyConfigs = {
      'truck': { width: 46, height: 92, offsetX: 0, offsetY: -46 },
      'big_rig': { width: 55, height: 110, offsetX: 0, offsetY: -55 },
      'road_train': { width: 65, height: 130, offsetX: 0, offsetY: -65 },
      'juggernaut': { width: 75, height: 150, offsetX: 0, offsetY: -75 },
    };
    const bodyCfg = bodyConfigs[checkpoint.vehicle] || bodyConfigs['truck'];
    
    // Update player sprite and size
    this.player.setTexture(checkpoint.vehicle);
    this.player.setDisplaySize(...checkpoint.size);
    this.player.body.setSize(bodyCfg.width, bodyCfg.height);
    this.player.body.setOffset(bodyCfg.offsetX, bodyCfg.offsetY);
    
    // Update collision bounds for player + trailer
    this.playerBounds = { 
      width: bodyCfg.width, 
      height: bodyCfg.height 
    };
    
    // Update trailer
    this.trailer.setTexture(checkpoint.trailer);
    const trailerSizes = {
      'trailer': [78, 40],
      'trailer_large': [95, 48],
      'trailer_roadtrain': [115, 55],
      'trailer_massive': [135, 65],
    };
    const [tw, th] = trailerSizes[checkpoint.trailer] || [78, 40];
    this.trailer.setDisplaySize(tw, th);
    
    // Update trailer collision bounds
    this.trailerBounds = { 
      width: tw * 0.8, 
      height: th * 0.8 
    };
    
    // Update exhaust position based on new trailer size
    this.exhaust.setPosition(this.trailer.x, this.trailer.y + th * 0.35);
    this.exhaust2.setPosition(this.trailer.x, this.trailer.y + th * 0.45);
    this.flames.setPosition(this.trailer.x, this.trailer.y + th * 0.3);
    
    // Update headlights position - at cab front (top of sprite at -90 deg)
    const headlightYOffset = this.player.body.offset.y + this.player.body.height / 2;
    this.headlights.setPosition(this.player.x, this.player.y + headlightYOffset);
    
    // Flash upgrade banner
    this.flashBanner(checkpoint.label + ' UNLOCKED!');
    this.game.audioManager?.play('level_complete');
    
    // Increase max speed and health with each upgrade
    this.maxSpeed += 40;
    this.minSpeed += 10;
    this.health = Math.min(100, this.health + 20);
    
    // Set next checkpoint
    if (this.currentVehicleTier < this.checkpoints.length) {
      this.nextCheckpoint = this.checkpoints[this.currentVehicleTier];
      this.time.delayedCall(2000, () => {
        this.flashBanner('Next: ' + this.nextCheckpoint.label + ' at ' + this.nextCheckpoint.distance.toLocaleString() + 'm');
      });
    } else {
      this.nextCheckpoint = null;
    }
    
    this.vehicleUpgradePending = false;
    
    // Analytics
    if (this.analytics && typeof this.analytics.track === 'function') {
      this.analytics.track('vehicle_upgrade', {
        tier: this.currentVehicleTier,
        vehicle: checkpoint.vehicle,
        distance: Math.floor(this.distance)
      });
    }
  }

  /**
   * Feed the live engine graph. Maps the truck's speed + input state onto a
   * normalised rpm (0..1) and a load figure (0..1), so the engine idles low,
   * rises through gears under throttle, and barks on gear changes.
   */
  updateEngineAudio() {
    const am = this.game.audioManager;
    if (!am || !am.ctx) return;

    const span = Math.max(1, this.maxSpeed - this.minSpeed);
    const speedNorm = Math.max(0, Math.min(1, (this.speed - this.minSpeed) / span));

    // Throttle: holding up/W is asking the engine to work, braking unloads it.
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;
    let load = (up ? 0.85 : 0.35) - (down ? 0.5 : 0);
    if (this.nitroActive > 0) load = 1;
    load = Math.max(0, Math.min(1, load));

    // rpm normalisation: base throttle raises rpm, so the engine "revs in gear"
    // rather than simply tracking road speed.
    let rpmNorm = Math.min(1, speedNorm * 0.78 + (up ? 0.22 : 0) + (this.nitroActive > 0 ? 0.25 : 0));
    am.updateEngine(rpmNorm, load);
  }

  /**
   * Distance-based speed progression.
   * As player travels further, base speed increases automatically.
   * This creates natural difficulty scaling with distance.
   */
  updateSpeedFromDistance() {
    // Every 5000m, increase min/max speed
    const bonusInterval = 5000;
    const newBonus = Math.floor(this.distance / bonusInterval) * 15; // +15 speed per 5km
    
    if (newBonus !== this.distanceSpeedBonus) {
      const diff = newBonus - this.distanceSpeedBonus;
      this.distanceSpeedBonus = newBonus;
      this.maxSpeed += diff;
      this.minSpeed += Math.floor(diff * 0.5);
      
      if (diff > 0) {
        this.flashBanner('SPEED BOOST! Max: ' + Math.round(this.maxSpeed * 0.28) + ' MPH');
        this.game.audioManager?.play('level_complete');
      }
    }
  }

  /**
   * Reward system based on score and level.
   * Grants health, nitro, shields, and bonus points at milestones.
   */
  checkRewards() {
    const oldScore = this.totalScoreEarned;
    this.totalScoreEarned = this.score;
    
    // Score-based rewards
    const scoreMilestones = [5000, 15000, 30000, 50000, 75000, 100000, 150000, 200000];
    for (const milestone of scoreMilestones) {
      if (oldScore < milestone && this.score >= milestone) {
        this.grantReward('score', milestone);
      }
    }
    
    // Level-based rewards (every 5 levels)
    if (this.level % 5 === 0 && !this.levelUpRewards.includes(this.level)) {
      this.levelUpRewards.push(this.level);
      this.grantReward('level', this.level);
    }
    
    // Distance-based rewards (every 10km)
    const distanceMilestones = [10000, 25000, 50000, 100000, 200000];
    for (const milestone of distanceMilestones) {
      // Check if we just crossed this milestone
      const oldDist = this.distance - this.speed * 0.08; // approximate previous frame
      if (oldDist < milestone && this.distance >= milestone) {
        this.grantReward('distance', milestone);
      }
    }
  }

  grantReward(type, value) {
    let rewardText = '';
    let rewardColor = '#ffcc00';
    
    switch (type) {
      case 'score':
        if (value >= 100000) {
          this.health = Math.min(100, this.health + 30);
          this.nitroCharge = Math.min(1, this.nitroCharge + 0.5);
          this.shieldTime += 8;
          rewardText = 'MEGA REWARD! +30 HP, NITRO, SHIELD';
          rewardColor = '#ff00ff';
        } else if (value >= 50000) {
          this.health = Math.min(100, this.health + 20);
          this.nitroCharge = Math.min(1, this.nitroCharge + 0.3);
          this.shieldTime += 5;
          rewardText = 'BIG REWARD! +20 HP, NITRO, SHIELD';
          rewardColor = '#ff6600';
        } else {
          this.health = Math.min(100, this.health + 10);
          this.nitroCharge = Math.min(1, this.nitroCharge + 0.2);
          rewardText = 'REWARD! +10 HP, NITRO';
        }
        break;
      case 'level':
        this.health = Math.min(100, this.health + 15);
        this.shieldTime += 3;
        this.nitroCharge = Math.min(1, this.nitroCharge + 0.25);
        rewardText = `LEVEL ${value} REWARD! +15 HP, SHIELD, NITRO`;
        rewardColor = '#00ffff';
        break;
      case 'distance':
        this.health = Math.min(100, this.health + 10);
        this.score += value / 10; // Bonus points
        rewardText = `${Math.floor(value/1000)}km BONUS! +10 HP, +${Math.floor(value/10)} PTS`;
        rewardColor = '#66ff66';
        break;
    }
    
    if (rewardText) {
      this.flashBanner(rewardText);
      this.floatText(this.player.x, this.player.y - 50, rewardText, rewardColor);
      this.cameras.main.flash(200, 0, 255, 100, false);
      this.game.audioManager?.play('powerup');
    }
  }

  scrollWorld(dt) {
    const dy = this.speed * dt * 0.85;
    const wrap = (obj, h) => {
      obj.y += dy;
      if (obj.y > H + h) obj.y -= h * 4;
    };
    this.shoulders.forEach((s) => wrap(s, 220));
    this.buildings.forEach((b) => wrap(b, 180));
    this.trees.forEach((t) => wrap(t, 200));
    this.roadMarks.forEach((m) => {
      m.y += dy;
      if (m.y > H + 20) m.y = -40;
    });
  }

  updateSpawns(dt) {
    const density = Math.max(0.45, 1.35 - this.level * 0.08);
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.spawnCar();
      this.spawnTimer = density + Math.random() * 0.6;
    }
    this.obstacleTimer -= dt;
    if (this.obstacleTimer <= 0) {
      this.spawnObstacle();
      this.obstacleTimer = Math.max(1.1, 3.2 - this.level * 0.15);
    }
    this.powerTimer -= dt;
    if (this.powerTimer <= 0) {
      this.spawnPower();
      this.powerTimer = 5 + Math.random() * 4;
    }
    if (this.score > 800) {
      this.policeTimer -= dt;
      if (this.policeTimer <= 0) {
        this.spawnPolice();
        this.policeTimer = Math.max(6, 16 - this.level);
      }
    }
    
    // Boss spawn every 10 levels
    if (this.level % 10 === 0 && !this.bossActive && !this.bossQueued) {
      this.bossQueued = true;
      this.time.delayedCall(5000, () => {
        this.bossQueued = false;
        this.spawnBoss();
      });
    }
    
    // Update boss
    if (this.bossActive) {
      this.updateBoss(dt);
    }
  }

  updateEntities(dt) {
    const dy = this.speed * dt;

    // --- PASS 1: cleanup invalid entities + move entities ---
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const e = this.entities[i];

      // Remove invalid or destroyed entities
      if (!e || !e.active || !e.scene || e.destroyed) {
        this.entities.splice(i, 1);
        continue;
      }
      // Collected power-ups are removed immediately
      if (e.collected) {
        try { e.destroy(); } catch (_) {}
        this.entities.splice(i, 1);
        continue;
      }

      // Wrecked entities scroll away, except cars in a spin-out: those are
      // driven by their own tween and must not be dragged down-screen.
      if (e.wrecked) {
        if (!e.spinningOut) e.y += dy;
        if (e.y > H + 80) {
          try { e.destroy(); } catch (_) {}
          this.entities.splice(i, 1);
        }
        continue;
      }

      // AI behavior
      if (e.kind === 'police') {
        e.x = Phaser.Math.Linear(e.x, this.player.x, 0.02 + this.level * 0.002);
      }
      if (e.kind === 'car' && e.agile) {
        // Motorcycle lane weaving
        e.laneChangeTimer -= dt;
        if (e.laneChangeTimer <= 0) {
          e.targetLane = Phaser.Math.RND.pick(LANES);
          e.laneChangeTimer = Phaser.Math.Between(1, 3);
        }
        e.x = Phaser.Math.Linear(e.x, e.targetLane, 0.05);
      }

      // Skip boss - its position is managed entirely by updateBoss()
      if (e.kind === 'boss') {
        // Still sync physics body for collision
        if (e.body) e.body.updateFromGameObject();
        continue;
      }

      // Scroll down the road
      e.y += dy - (e.vy || 0) * dt;
      if (e.kind === 'power') e.y += Math.sin(this.time.now / 200 + e.x) * 0.2;

      // Sync physics body with sprite position for accurate collision
      if (e.body) e.body.updateFromGameObject();

      // Off-screen cleanup
      if (e.y > H + 80) {
        try { e.destroy(); } catch (_) {}
        this.entities.splice(i, 1);
      }
    }

    // --- PASS 2: AI vehicle separation (snapshot so array changes don't break it) ---
    // Exclude boss - its position is managed entirely by updateBoss()
    const traffic = this.entities.filter(e =>
      e && e.active && !e.wrecked && !e.collected && e.scene && !e.destroyed &&
      (e.kind === 'car' || e.kind === 'police' ||
       e.kind === 'hard' || e.kind === 'container' || e.kind === 'debris')
    );

    for (let i = 0; i < traffic.length; i++) {
      const e = traffic[i];
      for (let j = i + 1; j < traffic.length; j++) {
        const other = traffic[j];
        if (!e.active || !other.active) continue;

        const dist = Phaser.Math.Distance.Between(e.x, e.y, other.x, other.y);
        const minDist = 60;
        if (dist < minDist && dist > 0) {
          // Push away from each other - both X and Y
          const pushX = (e.x - other.x) / dist * (minDist - dist) * 0.4;
          const pushY = (e.y - other.y) / dist * (minDist - dist) * 0.3;
          e.x += pushX * dt * 60;
          e.y += pushY * dt * 60;
          other.x -= pushX * dt * 60;
          other.y -= pushY * dt * 60;
          // Clamp to road bounds
          e.x = Phaser.Math.Clamp(e.x, ROAD_LEFT + 30, ROAD_RIGHT - 30);
          other.x = Phaser.Math.Clamp(other.x, ROAD_LEFT + 30, ROAD_RIGHT - 30);
          // Keep Y within reasonable bounds
          e.y = Phaser.Math.Clamp(e.y, -100, H + 100);
          other.y = Phaser.Math.Clamp(other.y, -100, H + 100);
        }
      }
    }

    // Sync physics bodies after separation pass
    for (const e of traffic) {
      if (e.body) e.body.updateFromGameObject();
    }

    // --- PASS 3: collision detection with player ---
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const e = this.entities[i];
      if (!e || !e.active || e.wrecked || e.collected || !e.scene || e.destroyed) continue;
      // Boss collisions are handled in updateBoss() to avoid double damage
      if (e.kind === 'boss') continue;
      if (!this.checkCollision(e)) continue;

      try {
        this.resolveHit(e);
      } catch (err) {
        console.error('Collision error:', err);
      }

      // Entity may have destroyed itself during resolveHit.
      // A wrecking car must stay alive so it can spin out before exploding,
      // so only collectables and already-destroyed entities are removed here.
      if (e.collected || !e.scene || e.destroyed || !e.active) {
        if (e.scene && !e.destroyed) {
          try { e.destroy(); } catch (_) {}
        }
        const idx = this.entities.indexOf(e);
        if (idx >= 0) this.entities.splice(idx, 1);
      } else if (e.wrecked && !e.spinningOut) {
        // Safety net for any wreck path that does not manage its own cleanup.
        const idx = this.entities.indexOf(e);
        if (idx >= 0) this.entities.splice(idx, 1);
      }
    }
  }

  hitRadius(e) {
    if (e.kind === 'hard') return 36;
    if (e.kind === 'container') return 40;
    if (e.kind === 'debris') return 32;
    if (e.kind === 'oil') return 30;
    if (e.kind === 'power') return 28;
    if (e.kind === 'soft') return 22;
    return 34;
  }

  // AABB collision detection for player + trailer vs entities
  checkCollision(entity) {
    // Safety check - entity must be valid
    if (!entity || !entity.active || !entity.scene || entity.destroyed) return false;
    
    // Player bounds - use physics body for accuracy (accounts for body offset)
    let pLeft, pRight, pTop, pBottom;
    if (this.player.body) {
      // Physics body bounds are more accurate when body has offset
      const body = this.player.body;
      pLeft = body.left;
      pRight = body.right;
      pTop = body.top;
      pBottom = body.bottom;
    } else {
      // Fallback to visual bounds
      const pW = this.playerBounds?.width || 70;
      const pH = this.playerBounds?.height || 34;
      pLeft = this.player.x - pW / 2;
      pRight = this.player.x + pW / 2;
      pTop = this.player.y - pH / 2;
      pBottom = this.player.y + pH / 2;
    }

    // Entity bounds - use physics body if available for accuracy
    let eLeft, eRight, eTop, eBottom;
    if (entity.body) {
      eLeft = entity.body.left;
      eRight = entity.body.right;
      eTop = entity.body.top;
      eBottom = entity.body.bottom;
    } else {
      // Fallback to visual bounds
      const eW = (entity.displayWidth || 30) * 0.8;
      const eH = (entity.displayHeight || 30) * 0.8;
      eLeft = entity.x - eW / 2;
      eRight = entity.x + eW / 2;
      eTop = entity.y - eH / 2;
      eBottom = entity.y + eH / 2;
    }

    // Check player collision - small tolerance for floating-point precision
    const EPS = 0.5;
    const playerHit = !(pRight < eLeft - EPS || pLeft > eRight + EPS || pBottom < eTop - EPS || pTop > eBottom + EPS);

    // Trailer bounds (centered on trailer) - optional, player collision still works without trailer
    let trailerHit = false;
    if (this.trailer && this.trailer.active && this.trailerBounds) {
      const tW = this.trailerBounds.width;
      const tH = this.trailerBounds.height;
      const tLeft = this.trailer.x - tW / 2;
      const tRight = this.trailer.x + tW / 2;
      const tTop = this.trailer.y - tH / 2;
      const tBottom = this.trailer.y + tH / 2;

      // Check trailer collision
      trailerHit = !(tRight < eLeft || tLeft > eRight || tBottom < eTop || tTop > eBottom);
    }

    return playerHit || trailerHit;
  }

  resolveHit(e) {
    if (e.kind === 'power') {
      this.collect(e);
      return;
    }
    if (e.kind === 'soft') {
      e.wrecked = true;
      this.score += 15;
      this.floatText(e.x, e.y, '+15', '#ffdd88');
      this.game.audioManager?.play('crash');
      this.emitRadial(e.x, e.y, 'dust_particle', 8, { speed: { min: 30, max: 150 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'NORMAL' });
      e.destroy();
      return;
    }
    if (e.kind === 'oil') {
      // Oil slick - slows truck, no damage
      e.wrecked = true;
      this.speed = Math.max(this.minSpeed, this.speed * 0.5);
      this.floatText(e.x, e.y, 'SLIP!', '#88aaff');
      this.game.audioManager?.play('screech');
      this.emitRadial(e.x, e.y, 'smoke_particle', 12, { speed: { min: 10, max: 40 }, speedY: { min: -30, max: -10 }, scale: { start: 1.5, end: 3.0 }, alpha: { start: 0.4, end: 0 }, gravityY: -10, blendMode: 'NORMAL' });
      e.destroy();
      return;
    }
    if (e.kind === 'debris') {
      // Debris pile - multi-hit
      e.hits--;
      this.emitRadial(e.x, e.y, 'spark_particle', 6, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
      this.floatText(e.x, e.y, 'HIT', '#ffaa00');
      this.game.audioManager?.play('crash');
      if (e.hits <= 0) {
        e.wrecked = true;
        this.wreck(e);
      }
      return;
    }
    if (e.kind === 'car' && e.explosive && !e.wrecked) {
      // Tanker: spins out like any other wreck, then blows up with the blast
      // chain reaction once it has come to rest.
      e.wrecked = true;
      this.wreck(e, { tanker: true }); // Big points
      return;
    }
    
    // Regular cars (non-tanker) are always wreckable for points
    if (e.kind === 'car' && !e.wrecked) {
      if (this.shieldTime > 0) {
        // Shield active - wreck car for points with shield effect
        this.emitRadial(e.x, e.y, 'spark_particle', 12, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
        this.wreck(e);
        return;
      }
      // No shield - wreck car for points (player takes no damage from cars)
      this.wreck(e);
      return;
    }
    
    // Hard obstacles (concrete barriers, containers) - damage unless fast + no shield
    const fast = this.speed > 300 || this.nitroActive > 0;
    if (e.kind === 'hard' || e.kind === 'container') {
      if (this.shieldTime > 0) {
        this.emitRadial(e.x, e.y, 'spark_particle', 10, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
        e.destroy();
        return;
      }
      if (!fast) {
        const dmg = e.kind === 'hard' ? 18 : 22;
        this.damage(dmg);
        this.game.audioManager?.play('screech');
        this.cameras.main.shake(120, 0.004);
        e.wrecked = true;
        e.setVelocity(Phaser.Math.Between(-80, 80), 40);
        this.time.delayedCall(400, () => {
          if (e && e.scene && !e.destroyed) {
            try { e.destroy(); } catch (_) {}
          }
        });
        return;
      }
      // Fast enough to smash through hard obstacles
      this.wreck(e);
      return;
    }
    
    // Default: wreck for points
    this.wreck(e);
  }

  wreck(e, options = {}) {
    e.wrecked = true;
    const points = (e.points || (e.kind === 'police' ? 500 : 100)) * this.combo;
    this.score += points;
    this.carsWrecked += 1;
    this.dailyProgress.wrecks += 1;
    this.dailyProgress.combo = Math.max(this.dailyProgress.combo, this.combo + 1);
    this.combo = Math.min(5, this.combo + 1);
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.comboTimer = 3;
    this.floatText(e.x, e.y - 10, '+' + points, '#ffcc00');
    if (this.combo > 2) this.comboText.setText('x' + this.combo + ' COMBO!');
    this.game.audioManager?.play(e.kind === 'police' ? 'wreck' : 'crash');
    
    // Hit pause (frame freeze) for impact feel
    this.time.timeScale = 0.75;
    this.time.delayedCall(90, () => { this.time.timeScale = 1; });
    
    // Initial impact camera shake
    this.cameras.main.shake(150, 0.01);
    
    // STEP 1: The car is hit - it spins out and slides before exploding.
    // `spinningOut` keeps the collision loop from removing it mid-animation.
    e.spinningOut = true;
    e.wrecked = true;

    // Push direction: away from the player, with some spread.
    const awayAngle = Math.atan2(e.y - this.player.y, e.x - this.player.x) * (180 / Math.PI);
    const pushAngle = (awayAngle + Phaser.Math.Between(-45, 45)) * (Math.PI / 180);
    const pushSpeed = Phaser.Math.Between(140, 260);
    const spinDirection = Phaser.Math.RND.pick([-1, 1]);
    const spinAmount = Phaser.Math.Between(360, 720) * spinDirection;

    // Sparks and glass at the moment of impact.
    this.emitRadial(e.x, e.y, 'spark_particle', 15, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    this.emitRadial(e.x, e.y, 'spark_shower', 10, { speed: { min: 150, max: 400 }, lifespan: 250, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 30, blendMode: 'ADD' });
    this.emitRadial(e.x, e.y, 'debris_particle', 8, { speed: { min: 80, max: 300 }, scale: { start: 1.2, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 200, blendMode: 'NORMAL' });
    this.emitRadial(e.x, e.y, 'glass_shard', 6, { speed: { min: 100, max: 350 }, scale: { start: 0.8, end: 0 }, alpha: { start: 0.9, end: 0 }, gravityY: 200, blendMode: 'ADD' });

    // Screen flash on impact.
    this.cameras.main.flash(80, 255, 200, 50, false);

    // Slow the car down over the spin so it slides like a real wreck.
    if (e.body && typeof e.body.setVelocity === 'function') {
      e.body.setVelocity(0, 0);
    }

    // STEP 2: Spin out and slide. The car tumbles and drifts with friction.
    this.tweens.add({
      targets: e,
      angle: e.angle + spinAmount,
      ease: 'Sine.easeOut',
      duration: 700,
    });

    this.tweens.add({
      targets: e,
      x: e.x + Math.cos(pushAngle) * pushSpeed * 0.35,
      y: e.y + Math.sin(pushAngle) * pushSpeed * 0.2,
      ease: 'Quad.easeOut',
      duration: 700,
      onComplete: () => {
        // Car comes to rest - now it explodes where it stopped.
        if (!e || !e.scene || e.destroyed) return;

        // STEP 3: MASSIVE FIERY EXPLOSION at the car's final position.
        this.massiveExplosion(e.x, e.y);

        // Fade the wreck out instead of popping it out of existence.
        e.setAlpha(0);
        this.tweens.add({
          targets: e,
          alpha: 0,
          duration: 250,
          onComplete: () => {
            if (e && e.scene && !e.destroyed) e.destroy();
          },
        });

        // Remove from the active entity list.
        const idx = this.entities.indexOf(e);
        if (idx >= 0) this.entities.splice(idx, 1);

        // A tanker sets off nearby vehicles when it finally goes up.
        if (options.tanker) {
          // Tanker blast damages player too
          const tankerBlastRadius = 200;
          const distToPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y);
          if (distToPlayer < tankerBlastRadius && this.shieldTime <= 0) {
            const dmg = Math.round(40 * (1 - distToPlayer / tankerBlastRadius));
            if (dmg > 0) this.damage(dmg);
          } else if (distToPlayer < tankerBlastRadius && this.shieldTime > 0) {
            this.emitRadial(this.player.x, this.player.y, 'spark_particle', 8, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
          }
          
          // Tanker blast wrecks nearby vehicles in a large radius
          const tankerVehicleBlastRadius = 220;
          for (const other of [...this.entities]) {
            if (other && other.active && !other.wrecked && other.scene &&
                (other.kind === 'car' || other.kind === 'police' || other.kind === 'hard' || other.kind === 'container' || other.kind === 'debris')) {
              const dist = Phaser.Math.Distance.Between(other.x, other.y, e.x, e.y);
              if (dist < tankerVehicleBlastRadius) {
                other.wrecked = true;
                const points = (other.points || (other.kind === 'police' ? 500 : 100)) * this.combo;
                this.score += points;
                this.carsWrecked += 1;
                this.floatText(other.x, other.y, '+' + points, '#ffcc00');
                this.wreck(other);
              }
            }
          }
          
          this.emitRadial(e.x, e.y, 'explosion_particle', 20, { speed: { min: 60, max: 250 }, scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
          this.emitRadial(e.x, e.y, 'spark_particle', 15, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
          this.cameras.main.shake(200, 0.01);
        }
      },
    });

    // Scorch smoke trailing from the wreck as it spins.
    this.time.delayedCall(180, () => {
      if (!e || !e.scene || e.destroyed) return;
      this.emitRadial(e.x, e.y, 'smoke_plume', 4, {
        speed: { min: 10, max: 40 },
        scale: { start: 1, end: 2 },
        alpha: { start: 0.4, end: 0 },
        gravityY: -60,
        blendMode: 'NORMAL',
        tint: 0x555555,
      });
    });
  }

  // Separate massive explosion function for clarity
  massiveExplosion(x, y) {
    // Blast radius damage to player
    const blastRadius = 180; // px - generous radius so near-misses hurt
    const distToPlayer = Phaser.Math.Distance.Between(this.player.x, this.player.y, x, y);
    if (distToPlayer < blastRadius && this.shieldTime <= 0) {
      // Damage scales with proximity - up to 35 at point-blank
      const dmg = Math.round(35 * (1 - distToPlayer / blastRadius));
      if (dmg > 0) this.damage(dmg);
    } else if (distToPlayer < blastRadius && this.shieldTime > 0) {
      // Shield blocks blast but shows effect
      this.emitRadial(this.player.x, this.player.y, 'spark_particle', 8, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    }
    
    // Wreck nearby vehicles in blast radius
    const vehicleBlastRadius = 160; // slightly smaller than player blast radius
    for (const other of [...this.entities]) {
      if (other && other.active && !other.wrecked && other.scene &&
          (other.kind === 'car' || other.kind === 'police' || other.kind === 'hard' || other.kind === 'container' || other.kind === 'debris')) {
        const dist = Phaser.Math.Distance.Between(other.x, other.y, x, y);
        if (dist < vehicleBlastRadius) {
          other.wrecked = true;
          // Award points for vehicles caught in blast
          const points = (other.points || (other.kind === 'police' ? 500 : 100)) * this.combo;
          this.score += points;
          this.carsWrecked += 1;
          this.floatText(other.x, other.y, '+' + points, '#ffcc00');
          this.wreck(other);
        }
      }
    }
    
    // Big camera shake for explosion
    this.cameras.main.shake(300, 0.02);
    
    // MASSIVE firey explosion particles
    this.emitRadial(x, y, 'explosion_particle', 40, { speed: { min: 60, max: 250 }, lifespan: 600, scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    this.emitRadial(x, y, 'explosion_particle_large', 20, { speed: { min: 80, max: 300 }, lifespan: 800, scale: { start: 2, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    this.emitRadial(x, y, 'explosion_particle', 30, { speed: { min: 60, max: 250 }, lifespan: 600, scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' }); // Second wave
    this.time.delayedCall(50, () => {
      this.emitRadial(x, y, 'explosion_particle_large', 15, { speed: { min: 80, max: 300 }, lifespan: 800, scale: { start: 2, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    });
    
    // Fire/ember particles
    this.emitRadial(x, y, 'spark_particle', 30, { speed: { min: 40, max: 200 }, lifespan: 400, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    this.emitRadial(x, y, 'spark_particle_large', 20, { speed: { min: 60, max: 250 }, lifespan: 500, scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    this.emitRadial(x, y, 'spark_shower', 30, { speed: { min: 150, max: 400 }, lifespan: 250, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 30, blendMode: 'ADD' });
    this.emitRadial(x, y, 'spark_shower_white', 20, { speed: { min: 150, max: 400 }, lifespan: 250, scale: { start: 0.6, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 30, blendMode: 'ADD' });
    
    // Rising fire particles
    this.emitRadial(x, y, 'fire_ember', 25, { speed: { min: 20, max: 100 }, speedY: { min: -100, max: -20 }, scale: { start: 1.2, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: -100, blendMode: 'ADD' });
    this.time.delayedCall(100, () => {
      this.emitRadial(x, y, 'fire_ember', 20, { speed: { min: 20, max: 100 }, speedY: { min: -100, max: -20 }, scale: { start: 1.2, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: -100, blendMode: 'ADD' });
    });
    
    // Heavy debris flying outward
    this.emitRadial(x, y, 'debris_particle', 30, { speed: { min: 80, max: 300 }, scale: { start: 1.2, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 200, blendMode: 'NORMAL' });
    this.emitRadial(x, y, 'metal_shard', 20, { speed: { min: 100, max: 350 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 200, blendMode: 'ADD' });
    this.emitRadial(x, y, 'glass_shard', 15, { speed: { min: 100, max: 350 }, scale: { start: 0.8, end: 0 }, alpha: { start: 0.9, end: 0 }, gravityY: 200, blendMode: 'ADD' });
    
    // Directional debris cones - more dramatic
    this.emitCone(x, y, 'debris_particle', 18, 0, 80, { speed: { min: 100, max: 300 }, scale: { start: 1.2, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 200, blendMode: 'NORMAL' });
    this.emitCone(x, y, 'metal_shard', 12, 90, 60, { speed: { min: 100, max: 350 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 200, blendMode: 'ADD' });
    this.emitCone(x, y, 'debris_particle', 18, 180, 80, { speed: { min: 100, max: 300 }, scale: { start: 1.2, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 200, blendMode: 'NORMAL' });
    this.emitCone(x, y, 'metal_shard', 12, 270, 60, { speed: { min: 100, max: 350 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, gravityY: 200, blendMode: 'ADD' });
    
    // Shockwave rings
    this.emitRing(x, y, 'shockwave_ring', 1, { scale: { start: 0.5, end: 3 }, alpha: { start: 0.8, end: 0 }, lifespan: 500, blendMode: 'ADD' });
    this.time.delayedCall(80, () => {
      this.emitRing(x, y, 'shockwave_ring', 1, { scale: { start: 0.5, end: 3 }, alpha: { start: 0.8, end: 0 }, lifespan: 500, blendMode: 'ADD' });
    });
    
    // Thick smoke plumes rising
    this.emitRadial(x, y, 'smoke_plume', 12, { speed: { min: 10, max: 40 }, speedY: { min: -80, max: -30 }, scale: { start: 2, end: 4 }, alpha: { start: 0.5, end: 0 }, gravityY: -50, blendMode: 'NORMAL', tint: 0x444444 });
    this.emitRadial(x, y, 'black_smoke', 10, { speed: { min: 10, max: 40 }, speedY: { min: -60, max: -20 }, scale: { start: 2.5, end: 5 }, alpha: { start: 0.6, end: 0 }, gravityY: -30, blendMode: 'NORMAL' });
    this.time.delayedCall(150, () => {
      this.emitRadial(x, y, 'smoke_plume', 8, { speed: { min: 10, max: 40 }, speedY: { min: -80, max: -30 }, scale: { start: 2, end: 4 }, alpha: { start: 0.5, end: 0 }, gravityY: -50, blendMode: 'NORMAL', tint: 0x444444 });
      this.emitRadial(x, y, 'black_smoke', 6, { speed: { min: 10, max: 40 }, speedY: { min: -60, max: -20 }, scale: { start: 2.5, end: 5 }, alpha: { start: 0.6, end: 0 }, gravityY: -30, blendMode: 'NORMAL' });
    });
    
    // Screen flashes - intense fire colors
    this.cameras.main.flash(120, 255, 100, 0, false);
    this.time.delayedCall(60, () => {
      this.cameras.main.flash(100, 255, 200, 50, false);
    });
    this.time.delayedCall(120, () => {
      this.cameras.main.flash(80, 255, 255, 200, false);
    });
    
    // Secondary explosions around the main one
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const dist = Phaser.Math.Between(30, 60);
      const sx = x + Math.cos(angle) * dist;
      const sy = y + Math.sin(angle) * dist;
      this.time.delayedCall(100 + i * 80, () => {
        if (this.scene && this.active) {
          this.emitRadial(sx, sy, 'explosion_particle', 12, { speed: { min: 60, max: 250 }, lifespan: 600, scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
          this.emitRadial(sx, sy, 'spark_particle', 8, { speed: { min: 40, max: 200 }, lifespan: 400, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
          this.emitRadial(sx, sy, 'smoke_plume', 4, { speed: { min: 10, max: 40 }, speedY: { min: -80, max: -30 }, scale: { start: 2, end: 4 }, alpha: { start: 0.5, end: 0 }, gravityY: -50, blendMode: 'NORMAL', tint: 0x444444 });
        }
      });
    }
  }

  collect(e) {
    if (!e || e.collected) return;
    e.collected = true;
    // Capture values BEFORE destroying (destroy() clears properties)
    const power = e.power;
    const x = e.x || (this.player ? this.player.x : W / 2);
    const y = e.y || (this.player ? this.player.y : H / 2);
    // Destroy the powerup entity immediately to prevent freeze
    if (e.scene && !e.destroyed) {
      try { e.destroy(); } catch (_) {}
    }

    const applyPower = (pType) => {
      const map = {
        fuel: () => {
          this.health = Math.min(100, this.health + 25);
          this.floatText(x, y, '+25 HP', '#66ff88');
        },
        wrench: () => {
          this.health = 100;
          this.floatText(x, y, 'REPAIRED', '#66ff88');
        },
        shield: () => {
          this.shieldTime = 5;
          this.floatText(x, y, 'SHIELD', '#66ccff');
        },
        nitro: () => {
          this.nitroCharge = 1;
          this.floatText(x, y, 'NITRO', '#ff8800');
        },
        coin: () => {
          this.score += 50;
          this.floatText(x, y, '+50', '#ffdd00');
          this.dailyProgress.coins += 1;
          // Animated coin sprite
          const coinAnim = this.add.sprite(x, y, 'coin_0').setDepth(30).setScale(1.5);
          this.tweens.add({
            targets: coinAnim,
            angle: 720,
            scale: 0,
            alpha: 0,
            duration: 600,
            ease: 'Back.out',
            onUpdate: () => {
              const frame = Math.floor((coinAnim.angle / 720) * 8) % 8;
              if (this.textures.exists(`coin_${frame}`)) {
                coinAnim.setTexture(`coin_${frame}`);
              }
            },
            onComplete: () => coinAnim.destroy(),
          });
        },
        drone: () => {
          // Drone air-carrier drops a random bonus
          const drops = ['fuel', 'shield', 'nitro', 'wrench', 'coin'];
          const drop = Phaser.Math.RND.pick(drops);
          this.emitRadial(x, y, 'spark_particle', 12, { speed: { min: 40, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
          applyPower(drop);
        },
      };

      map[pType]?.();
      this.game.audioManager?.play(pType === 'coin' ? 'coin' : 'powerup');

      if (this.analytics) {
        this.analytics.trackPowerup(pType);
      }
    };

    applyPower(power);

    if (typeof e.destroy === 'function') {
      e.destroy();
    }
  }

  damage(amount) {
    if (this.shieldTime > 0) {
      amount *= 0.33;
    }
    const hadFullHealth = this.health === 100;
    this.health -= amount;
    this.health = Math.max(0, this.health);
    // If we had full health and now don't, perfect run is broken
    if (hadFullHealth && this.health < 100) this.dailyPerfectMaintained = false;
    this.floatText(this.player.x, this.player.y - 30, '-' + amount, '#ff4444');
    this.player.setTint(0xff6666);
    this.time.delayedCall(120, () => {
      if (this.shieldTime <= 0) this.player.clearTint();
    });
    
    // Screen effects on damage
    const hpRatio = this.health / 100;
    if (hpRatio < 0.3) {
      // Vignette pulse
      this.cameras.main.flash(200, 255, 0, 0, false);
      this.time.timeScale = 0.5;
      this.time.delayedCall(80, () => { this.time.timeScale = 1; });
    } else {
      this.cameras.main.flash(100, 255, 100, 50, false);
      this.time.timeScale = 0.7;
      this.time.delayedCall(40, () => { this.time.timeScale = 1; });
    }
    this.cameras.main.shake(150, 0.006);

    if (this.health <= 0) this.gameOver();
  }

  // Burst emitters render on the FX band (depth 25): above the street
  // overlay (depth 1-2) and the vehicles (depth 5-12), below the HUD (50).
  // Phaser ignores a `depth` key inside the emitter config, so depth is set
  // on the emitter object itself.
  emitRadial(x, y, key, count, overrides = {}) {
    const presets = {
      explosion_particle: { lifespan: 700, speed: { min: 90, max: 280 }, scale: { start: 1.6, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' },
      explosion_particle_large: { lifespan: 900, speed: { min: 70, max: 240 }, scale: { start: 2.4, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' },
      spark_particle: { lifespan: 450, speed: { min: 80, max: 260 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', gravityY: 40 },
      spark_particle_large: { lifespan: 550, speed: { min: 90, max: 300 }, scale: { start: 1.6, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', gravityY: 30 },
      spark_shower: { lifespan: 400, speed: { min: 140, max: 420 }, scale: { start: 0.7, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', gravityY: 60 },
      spark_shower_white: { lifespan: 400, speed: { min: 160, max: 480 }, scale: { start: 0.8, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', gravityY: 50 },
      debris_particle: { lifespan: 900, speed: { min: 70, max: 240 }, scale: { start: 1.2, end: 0.2 }, alpha: { start: 1, end: 0 }, blendMode: 'NORMAL', gravityY: 180, rotate: { min: -360, max: 360 } },
      metal_shard: { lifespan: 1000, speed: { min: 120, max: 380 }, scale: { start: 1, end: 0.2 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', gravityY: 160, rotate: { min: -720, max: 720 } },
      glass_shard: { lifespan: 700, speed: { min: 100, max: 340 }, scale: { start: 0.8, end: 0 }, alpha: { start: 0.9, end: 0 }, blendMode: 'ADD', gravityY: 200, rotate: { min: -720, max: 720 } },
      fire_ember: { lifespan: 900, speed: { min: 30, max: 140 }, scale: { start: 1.3, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD', gravityY: -90 },
      smoke_plume: { lifespan: 1400, speed: { min: 15, max: 55 }, scale: { start: 1.4, end: 3.2 }, alpha: { start: 0.55, end: 0 }, blendMode: 'NORMAL', gravityY: -70 },
      black_smoke: { lifespan: 1600, speed: { min: 10, max: 40 }, scale: { start: 1.8, end: 4 }, alpha: { start: 0.6, end: 0 }, blendMode: 'NORMAL', gravityY: -50, tint: 0x222222 },
      dust_particle: { lifespan: 500, speed: { min: 40, max: 160 }, scale: { start: 1, end: 0 }, alpha: { start: 0.8, end: 0 }, blendMode: 'NORMAL' },
      smoke_particle: { lifespan: 800, speed: { min: 20, max: 70 }, scale: { start: 1.2, end: 2.4 }, alpha: { start: 0.45, end: 0 }, blendMode: 'NORMAL', gravityY: -40 },
      tire_smoke: { lifespan: 600, speed: { min: 20, max: 70 }, scale: { start: 0.8, end: 1.6 }, alpha: { start: 0.5, end: 0 }, blendMode: 'NORMAL', gravityY: -25 },
      puddle_ripple: { lifespan: 450, speed: { min: 8, max: 24 }, scale: { start: 0.4, end: 1.4 }, alpha: { start: 0.7, end: 0 }, blendMode: 'NORMAL', tint: 0xaaddff },
      shockwave_ring: { lifespan: 500, speed: { min: 0, max: 0 }, scale: { start: 0.4, end: 3.2 }, alpha: { start: 0.85, end: 0 }, blendMode: 'ADD' },
    };
    const base = presets[key] || { lifespan: 500, speed: { min: 60, max: 200 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' };
    // Shallow copy the preset first so overrides never mutate the shared table.
    const p = Object.assign({}, base, overrides);
    const n = Math.max(1, count || 1);

    // A speedY override would pin particles to a vertical axis and break the
    // 360 spread. Convert it into an upward gravity bias instead so the
    // emission stays omnidirectional while smoke and embers still rise.
    let gravityY = p.gravityY || 0;
    if (p.speedY) {
      // Convert the vertical velocity bias into gravity so the particle keeps
      // moving along that axis while still spreading over the full circle.
      const bias = (p.speedY.min + p.speedY.max) / 2;
      gravityY = bias * 4;
      delete p.speedY;
    }
    delete p.speedX;

    // Full circle by default; emitCone narrows it via an angle override.
    const angle = p.angle || { min: 0, max: 360 };
    const emitter = this.add.particles(x, y, key, {
      lifespan: p.lifespan,
      speed: p.speed,
      angle: angle,
      scale: p.scale,
      alpha: p.alpha || { start: 1, end: 0 },
      gravityY: gravityY,
      rotate: p.rotate,
      blendMode: p.blendMode || 'ADD',
      tint: p.tint,
      emitting: false,
    });
    // Depth must be set on the emitter, not in the config block.
    emitter.setDepth(25).setScrollFactor(0);
    emitter.explode(n);
    // Free the emitter once its particles have died off.
    this.time.delayedCall((p.lifespan || 600) + 250, () => {
      if (emitter && emitter.scene) emitter.destroy();
    });
    return emitter;
  }

  emitRing(x, y, key, count) {
    return this.emitRadial(x, y, key, Math.max(1, count || 1), {
      speed: { min: 0, max: 0 },
      scale: { start: 0.3, end: 3.4 },
      alpha: { start: 0.9, end: 0 },
      lifespan: 520,
      gravityY: 0,
      blendMode: 'ADD',
    });
  }

  emitCone(x, y, key, count, centerAngleDeg, spreadDeg) {
    const half = (spreadDeg || 40) / 2;
    return this.emitRadial(x, y, key, count, {
      angle: { min: (centerAngleDeg || 0) - half, max: (centerAngleDeg || 0) + half },
    });
  }

  burst(x, y, key, count) {
    this.emitRadial(x, y, key, count);
  }

  burstCone(x, y, key, count, centerAngleDeg, spreadDeg) {
    this.emitCone(x, y, key, count, centerAngleDeg, spreadDeg);
  }

  floatText(x, y, msg, color) {
    const t = this.add.text(x, y, msg, {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '18px', color,
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(30);
    this.tweens.add({
      targets: t, y: y - 36, alpha: 0, duration: 700,
      onComplete: () => t.destroy(),
    });
  }

  flashBanner(msg) {
    if (!this.banner || !this.banner.scene) return;
    this.banner.setText(msg);
    this.banner.setAlpha(1);
    this.time.delayedCall(900, () => {
      if (this.banner && this.banner.scene) this.banner.setText('');
    });
  }

  updateHud() {
    this.scoreValue.setText(Math.floor(this.score).toLocaleString());
    const mph = Math.round(this.speed * 0.28);
    this.speedText.setText(mph + ' MPH');
    const speedRatio = Phaser.Math.Clamp((this.speed - this.minSpeed) / (this.maxSpeed - this.minSpeed), 0, 1);
    this.speedFill.width = 160 * speedRatio;
    // Update the existing mask graphics instead of creating a new one every frame (memory leak)
    if (!this.speedMask) {
      this.speedMask = this.make.graphics({ x: 0, y: 0 }, false);
      this.speedFill.setMask(this.speedMask.createGeometryMask());
    }
    this.speedMask.clear();
    this.speedMask.fillRect(W - 176, 23, 160 * speedRatio, 6);
    
    const hp = Math.max(0, this.health) / 100;
    this.hpFill.width = (this.hpBarW || 120) * hp;
    this.hpFill.fillColor = hp > 0.4 ? 0xff3333 : (hp > 0.2 ? 0xffaa00 : 0xff2200);
    this.hpText.setText(Math.max(0, Math.ceil(this.health)).toString());
    
    // Damage vignette
    this.damageVignette.clear();
    if (hp < 0.3) {
      const alpha = (0.3 - hp) * 0.8;
      this.damageVignette.fillStyle(0xff0000, alpha);
      this.damageVignette.fillRect(0, 0, W, H);
      this.damageVignette.fillStyle(0xff0000, alpha * 0.5);
      this.damageVignette.fillRect(0, 0, W, H);
    }
    
    const nitroRatio = Phaser.Math.Clamp(this.nitroCharge, 0, 1);
    this.nitroFill.width = (this.nitroBarW || 110) * nitroRatio;
    if (nitroRatio >= 1) {
      this.nitroFill.fillColor = 0xffff00;
      if (this.nitroText) {
        this.nitroText.setText('READY!');
        this.nitroText.setColor('#ffff44');
      }
    } else {
      this.nitroFill.fillColor = 0xff8800;
      if (this.nitroText) {
        this.nitroText.setText('NITRO');
        this.nitroText.setColor('#ffaa44');
      }
    }
    
    this.levelText.setText('LEVEL ' + this.level);
    if (this.combo <= 1 && this.comboTimer <= 0) {
      this.comboText.setText('');
    } else {
      this.comboText.setText('x' + this.combo + ' COMBO!');
    }
    
    // Daily challenge - better formatted
    if (!this.dailyCompleted) {
      this.dailyText.setText(this.getDailyDisplay());
      this.dailyBg.fillColor = 0x0a1424;
      this.dailyBg.setStrokeStyle(1, 0x336699);
    } else {
      this.dailyText.setText('✓ DAILY COMPLETE! +5000');
      this.dailyBg.fillColor = 0x0a240a;
      this.dailyBg.setStrokeStyle(1, 0x339933);
    }
    
    this.distText.setText(Math.floor(this.distance).toLocaleString() + 'm');
  }

  updateWeather(dt) {
    this.rainTimer -= dt;
    if (this.rainTimer <= 0) {
      this.rain = !this.rain;
      this.rainTimer = this.rain ? Phaser.Math.Between(8, 14) : Phaser.Math.Between(16, 28);
      this.rainEmitter.emitting = this.rain;
      this.rainLayer.setFillStyle(0x0a1424, this.rain ? 0.28 : 0);
    }
    
    // Puddle ripples during rain
    if (this.rain && Math.random() < 0.15) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H);
      this.emitRadial(x, y, 'puddle_ripple', 1, { speed: { min: 10, max: 30 }, speedY: { min: 50, max: 100 }, scale: { start: 0.8, end: 0 }, alpha: { start: 0.8, end: 0 }, gravityY: 100, blendMode: 'NORMAL', tint: 0xAADDFF });
    }
    
    // Speed lines effect for nitro / high speed
    if (!this.speedLines) {
      this.speedLines = this.add.graphics().setDepth(45).setScrollFactor(0);
    }
    this.speedLines.clear();
    const speedRatio = Phaser.Math.Clamp((this.speed - this.minSpeed) / (this.maxSpeed - this.minSpeed), 0, 1);
    const nitroActive = this.nitroActive > 0;
    if (nitroActive || speedRatio > 0.85) {
      const intensity = nitroActive ? 1 : (speedRatio - 0.85) / 0.15;
      const numLines = Math.floor(12 * intensity);
      this.speedLines.lineStyle(1.5 * intensity, 0xFFFFFF, 0.3 * intensity);
      for (let i = 0; i < numLines; i++) {
        const x = Phaser.Math.Between(0, W);
        const len = 60 + 100 * intensity;
        const y = Phaser.Math.Between(0, H);
        this.speedLines.lineBetween(x, y, x, y + len);
      }
    }
  }

  gameOver() {
    if (this.health > 0) return;
    this.health = 0;
    this.started = false;
    this.game.audioManager?.stopEngine();
    this.game.audioManager?.play('explosion');
    this.cameras.main.shake(400, 0.02);
    if (this.player && this.player.active) {
      this.emitRadial(this.player.x, this.player.y, 'explosion_particle', 24, { speed: { min: 60, max: 250 }, scale: { start: 1.5, end: 0 }, alpha: { start: 1, end: 0 }, blendMode: 'ADD' });
    }
    
    // Analytics
    if (this.analytics) {
      this.analytics.trackGameEnd(Math.floor(this.score), {
        carsWrecked: this.carsWrecked,
        maxCombo: this.maxCombo,
        distance: Math.floor(this.distance),
        level: this.level,
        dailyComplete: this.dailyCompleted
      });
    }
    
    this.time.delayedCall(700, () => {
      this.scene.start('GameOverScene', {
        score: Math.floor(this.score),
        carsWrecked: this.carsWrecked,
        maxCombo: this.maxCombo,
        distance: Math.floor(this.distance),
        level: this.level,
        dailyComplete: this.dailyCompleted,
      });
    });
  }

  shutdown() {
    // Stop engine audio when leaving this scene (quit to menu or game over)
    this.game.audioManager?.stopEngine();
  }
}
