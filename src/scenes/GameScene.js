import Phaser from 'phaser';

const W = 800;
const H = 450;
const ROAD_LEFT = 200;
const ROAD_RIGHT = 600;
const ROAD_W = ROAD_RIGHT - ROAD_LEFT;
const LANES = [250, 333, 417, 500, 550];

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
    
    // New: new vehicle types
    this.carTypes = ['car_red', 'car_blue', 'car_green', 'car_yellow', 'car_white', 'motorcycle', 'pickup', 'bus', 'sports_low', 'ambulance', 'firetruck', 'tanker'];
    
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
    this.player.body.setSize(70, 34);
    this.player.setCollideWorldBounds(true);

    this.trailer = this.add.image(this.player.x, this.player.y + 62, 'trailer');
    this.trailer.setDisplaySize(78, 40);
    this.trailer.setAngle(-90);
    this.trailer.setDepth(9);

    // Enhanced exhaust with multiple layers
    this.exhaust = this.add.particles(0, 0, 'smoke_particle', {
      lifespan: { min: 400, max: 800 },
      speed: { min: 15, max: 50 },
      speedY: { min: 20, max: 60 },
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.4, end: 0 },
      frequency: 50,
      rotate: { min: 0, max: 360 },
      gravityY: 10,
    }).setDepth(8);
    
    // Second exhaust layer - darker smoke
    this.exhaust2 = this.add.particles(0, 0, 'smoke_particle', {
      lifespan: { min: 600, max: 1000 },
      speed: { min: 5, max: 25 },
      speedY: { min: 10, max: 40 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.2, end: 0 },
      frequency: 30,
      tint: 0x111111,
      gravityY: 5,
    }).setDepth(7);

    this.flames = this.add.particles(0, 0, 'spark_particle', {
      lifespan: { min: 150, max: 300 },
      speedY: { min: 100, max: 220 },
      speedX: { min: -30, max: 30 },
      scale: { start: 1, end: 0 },
      tint: [0xffaa00, 0xff4400, 0xffff88, 0xff6600],
      frequency: 20,
      emitting: false,
      blendMode: 'ADD',
      gravityY: -50,
    }).setDepth(11);

    // Nitro flames (separate, more intense)
    this.nitroFlames = this.add.particles(0, 0, 'nitro_flame', {
      lifespan: { min: 100, max: 200 },
      speedY: { min: 200, max: 350 },
      scale: { start: 0.5, end: 0 },
      frequency: 15,
      emitting: false,
      blendMode: 'ADD',
      gravityY: -100,
    }).setDepth(12);

    this.headlights = this.add.ellipse(this.player.x, this.player.y - 40, 70, 90, 0xffffcc, 0.08).setDepth(7);
    
    // Headlight beams (dynamic)
    this.headlightBeamL = this.add.graphics().setDepth(6);
    this.headlightBeamR = this.add.graphics().setDepth(6);
    this.updateHeadlights();
  }
  
  updateHeadlights() {
    if (!this.player || !this.player.active) return;
    const x = this.player.x;
    const y = this.player.y - 40;
    this.headlights.setPosition(x, y - 40);
    // Left headlight beam forward
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
    const quit = this.makeMenuButton(W / 2, 290, 'QUIT', () => this.scene.start('MenuScene'));
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
      if (this.game.audioManager) this.game.audioManager.play(i === 3 ? 'go' : 'countdown');
      i += 1;
      if (i < steps.length) {
        this.time.delayedCall(700, tick);
      } else {
        this.time.delayedCall(500, () => {
          this.banner.setText('');
          this.started = true;
          if (this.game.audioManager) this.game.audioManager.play('engine_idle', true);
        });
      }
    };
    tick();
  }

  togglePause() {
    this.paused = !this.paused;
    this.pauseLayer.setVisible(this.paused);
    this.physics.world.isPaused = this.paused;
    if (this.paused) this.game.audioManager?.stopLoop('engine_idle');
    else if (this.started) this.game.audioManager?.play('engine_idle', true);
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
    if (this.bossActive) return;
    this.bossActive = true;
    this.bossMaxHealth = 300 + this.level * 100;
    this.bossHealth = this.bossMaxHealth;
    this.bossSpawnedAt = this.time.now;
    
    const lane = LANES[2]; // Center lane
    this.boss = this.physics.add.sprite(lane, -100, 'boss_truck');
    this.boss.setDisplaySize(140, 70);
    this.boss.setAngle(-90);
    this.boss.setDepth(8);
    this.boss.kind = 'boss';
    this.boss.vy = 40;
    this.boss.wrecked = false;
    this.boss.phase = 1;
    this.boss.attackTimer = 0;
    this.boss.side = 1; // 1 = right, -1 = left
    
    // Boss health bar
    this.bossBarBg = this.add.rectangle(W / 2, 70, 400, 16, 0x330000).setDepth(50).setScrollFactor(0);
    this.bossBarFill = this.add.rectangle(W / 2 - 198, 70, 396, 12, 0xff2200).setDepth(51).setScrollFactor(0).setOrigin(0, 0.5);
    this.bossBarLabel = this.add.text(W / 2, 70, 'BOSS', {
      fontFamily: 'Impact, Arial Black, sans-serif', fontSize: '16px', color: '#ffcc00',
      stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5).setDepth(52).setScrollFactor(0);
    
    this.flashBanner('BOSS INCOMING!');
    this.game.audioManager?.play('siren');
    this.entities.push(this.boss);
  }

  updateBoss(dt) {
    if (!this.boss || !this.boss.active) return;
    
    // Movement pattern
    this.boss.attackTimer += dt;
    
    // Phase 1: Slow approach, ram attempts
    if (this.boss.phase === 1) {
      this.boss.y += this.boss.vy * dt;
      if (this.boss.y > 150) this.boss.vy = 20;
      
      // Side-to-side sweeping
      this.boss.x += this.boss.side * 80 * dt;
      if (this.boss.x > ROAD_RIGHT - 40 || this.boss.x < ROAD_LEFT + 40) {
        this.boss.side *= -1;
      }
      
      // Ram attack
      if (this.boss.attackTimer > 2) {
        this.boss.attackTimer = 0;
        const targetX = this.player.x;
        this.tweens.add({
          targets: this.boss,
          x: targetX,
          duration: 800,
          ease: 'Power2',
          onComplete: () => { this.boss.side = targetX < this.boss.x ? -1 : 1; }
        });
      }
      
      if (this.bossHealth < this.bossMaxHealth * 0.6) {
        this.boss.phase = 2;
        this.flashBanner('BOSS ENRAGED!');
        this.game.audioManager?.play('wreck');
      }
    }
    // Phase 2: Faster, spawns minions
    else if (this.boss.phase === 2) {
      this.boss.y += this.boss.vy * dt;
      this.boss.x += this.boss.side * 140 * dt;
      if (this.boss.x > ROAD_RIGHT - 40 || this.boss.x < ROAD_LEFT + 40) this.boss.side *= -1;
      
      if (this.boss.attackTimer > 1.5) {
        this.boss.attackTimer = 0;
        // Spawn explosive barrels from sides
        const side = Phaser.Math.Between(0, 1) ? ROAD_LEFT + 30 : ROAD_RIGHT - 30;
        const barrel = this.physics.add.sprite(side, this.boss.y, 'barrel');
        barrel.setDisplaySize(22, 22);
        barrel.setDepth(5);
        barrel.kind = 'hard';
        barrel.vy = 0;
        barrel.wrecked = false;
        barrel.fromBoss = true;
        this.entities.push(barrel);
      }
      
      if (this.bossHealth < this.bossMaxHealth * 0.2) {
        this.boss.phase = 3;
        this.flashBanner('FINAL PHASE!');
      }
    }
    // Phase 3: Desperate, charges
    else {
      this.boss.vy = 120;
      this.boss.y += this.boss.vy * dt;
      // Charge directly at player
      this.boss.x = Phaser.Math.Linear(this.boss.x, this.player.x, 0.05);
    }
    
    // Update health bar
    const ratio = this.bossHealth / this.bossMaxHealth;
    this.bossBarFill.width = 396 * ratio;
    this.bossBarFill.fillColor = ratio > 0.5 ? 0xff2200 : (ratio > 0.2 ? 0xffaa00 : 0xff0000);
    
    // Check collision with player
    if (Phaser.Math.Distance.Between(this.boss.x, this.boss.y, this.player.x, this.player.y) < 50) {
      if (this.shieldTime <= 0) {
        this.damage(25);
      }
      this.boss.x += Phaser.Math.Between(-40, 40);
    }
    
    // Check if boss left screen
    if (this.boss.y > H + 100) {
      this.boss.destroy();
      this.bossBarBg.destroy();
      this.bossBarFill.destroy();
      this.bossBarLabel.destroy();
      this.boss = null;
      this.bossActive = false;
    }
  }

  damageBoss(amount) {
    this.bossHealth -= amount;
    this.burst(this.boss.x, this.boss.y, 'spark_particle', 8);
    this.cameras.main.shake(80, 0.006);
    
    if (this.bossHealth <= 0) {
      this.defeatBoss();
    }
  }

  defeatBoss() {
    const bonus = 5000 * this.combo;
    this.score += bonus;
    this.flashBanner('BOSS DEFEATED! +' + bonus.toLocaleString());
    this.game.audioManager?.play('level_complete');
    
    // Massive explosion
    this.burst(this.boss.x, this.boss.y, 'explosion_particle', 30);
    this.burst(this.boss.x, this.boss.y, 'spark_particle', 20);
    
    this.boss.destroy();
    if (this.bossBarBg) this.bossBarBg.destroy();
    if (this.bossBarFill) this.bossBarFill.destroy();
    if (this.bossBarLabel) this.bossBarLabel.destroy();
    this.boss = null;
    this.bossActive = false;
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

    this.handleInput(dt);
    this.updatePlayer(dt);
    this.scrollWorld(dt);
    this.updateSpawns(dt);
    this.updateEntities(dt);
    this.updateHud();
    this.updateWeather(dt);
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

    if (up) this.speed = Math.min(this.maxSpeed, this.speed + 180 * dt);
    else if (down) this.speed = Math.max(this.minSpeed, this.speed - 260 * dt);
    else this.speed = Phaser.Math.Linear(this.speed, 260, 0.4 * dt);

    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
      if (this.nitroCharge >= 1) {
        this.nitroCharge = 0;
        this.nitroActive = 3.2;
        this.game.audioManager?.play('nitro');
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
    this.flames.setPosition(this.trailer.x, this.trailer.y + 18);
    this.updateHeadlights();

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
    if (this.level % 10 === 0 && !this.bossActive && this.score > this.bossSpawnedAt) {
      if (!this.bossQueued) {
        this.bossQueued = true;
        this.time.delayedCall(5000, () => {
          this.bossQueued = false;
          this.spawnBoss();
        });
      }
    }
    
    // Update boss
    if (this.bossActive) {
      this.updateBoss(dt);
    }
  }

  updateEntities(dt) {
    const dy = this.speed * dt;
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const e = this.entities[i];
      if (!e.active) {
        this.entities.splice(i, 1);
        continue;
      }
      if (e.kind === 'police' && !e.wrecked) {
        e.x = Phaser.Math.Linear(e.x, this.player.x, 0.02 + this.level * 0.002);
      }
      if (e.kind === 'car' && e.agile && !e.wrecked) {
        // Motorcycle lane weaving
        e.laneChangeTimer -= dt;
        if (e.laneChangeTimer <= 0) {
          e.targetLane = Phaser.Math.RND.pick(LANES);
          e.laneChangeTimer = Phaser.Math.Between(1, 3);
        }
        e.x = Phaser.Math.Linear(e.x, e.targetLane, 0.05);
      }
      e.y += dy - (e.vy || 0) * dt;
      if (e.kind === 'power') e.y += Math.sin(this.time.now / 200 + e.x) * 0.2;

      // Boss collision (player projectiles not implemented, so ram damage)
      if (e.kind === 'boss' && !e.wrecked) {
        if (Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < 55) {
          if (this.speed > 350 || this.nitroActive > 0) {
            this.damageBoss(15);
            this.floatText(e.x, e.y - 20, '-15', '#ff4444');
          } else if (this.shieldTime <= 0) {
            this.damage(20);
          }
        }
      } else if (!e.wrecked && Phaser.Math.Distance.Between(e.x, e.y, this.player.x, this.player.y) < this.hitRadius(e)) {
        this.resolveHit(e);
      }
      if (e.y > H + 80) {
        e.destroy();
        this.entities.splice(i, 1);
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
      this.burst(e.x, e.y, 'dust_particle', 8);
      e.destroy();
      return;
    }
    if (e.kind === 'oil') {
      // Oil slick - slows truck, no damage
      e.wrecked = true;
      this.speed = Math.max(this.minSpeed, this.speed * 0.5);
      this.floatText(e.x, e.y, 'SLIP!', '#88aaff');
      this.game.audioManager?.play('screech');
      this.burst(e.x, e.y, 'smoke_particle', 12);
      e.destroy();
      return;
    }
    if (e.kind === 'debris') {
      // Debris pile - multi-hit
      e.hits--;
      this.burst(e.x, e.y, 'spark_particle', 6);
      this.floatText(e.x, e.y, 'HIT', '#ffaa00');
      this.game.audioManager?.play('crash');
      if (e.hits <= 0) {
        e.wrecked = true;
        this.wreck(e);
      }
      return;
    }
    if (e.kind === 'car' && e.explosive && !e.wrecked) {
      // Tanker explodes!
      e.wrecked = true;
      this.wreck(e); // Big points
      this.burst(e.x, e.y, 'explosion_particle', 20);
      this.burst(e.x, e.y, 'spark_particle', 15);
      this.cameras.main.shake(200, 0.01);
      // Damage nearby entities
      for (const other of this.entities) {
        if (other !== e && !other.wrecked && Phaser.Math.Distance.Between(other.x, other.y, e.x, e.y) < 80) {
          if (other.kind === 'car' || other.kind === 'police') {
            other.wrecked = true;
            this.wreck(other);
          }
        }
      }
      return;
    }
    const fast = this.speed > 300 || this.nitroActive > 0;
    if (e.kind === 'hard' || e.kind === 'container' || !fast) {
      if (this.shieldTime > 0) {
        this.burst(e.x, e.y, 'spark_particle', 10);
        e.destroy();
        return;
      }
      const dmg = e.kind === 'hard' ? 18 : (e.kind === 'container' ? 22 : 12);
      this.damage(dmg);
      this.game.audioManager?.play('screech');
      this.cameras.main.shake(120, 0.004);
      e.wrecked = true;
      e.setVelocity(Phaser.Math.Between(-80, 80), 40);
      this.time.delayedCall(400, () => e.destroy());
      return;
    }
    this.wreck(e);
  }

  wreck(e) {
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
    this.cameras.main.shake(180, 0.008);
    this.burst(e.x, e.y, 'explosion_particle', 16);
    this.burst(e.x, e.y, 'spark_particle', 10);
    
    // Analytics
    if (this.analytics) {
      this.analytics.trackWreck(e.vehicleType || e.kind, points, this.combo);
      this.analytics.trackScore(this.score);
    }
    
    this.tweens.add({
      targets: e,
      angle: e.angle + Phaser.Math.Between(-180, 180),
      x: e.x + Phaser.Math.Between(-80, 80),
      alpha: 0,
      duration: 500,
      onComplete: () => e.destroy(),
    });
  }

  collect(e) {
    const map = {
      fuel: () => { this.health = Math.min(100, this.health + 25); this.floatText(e.x, e.y, '+25 HP', '#66ff88'); },
      wrench: () => { this.health = 100; this.floatText(e.x, e.y, 'REPAIRED', '#66ff88'); },
      shield: () => { this.shieldTime = 5; this.floatText(e.x, e.y, 'SHIELD', '#66ccff'); },
      nitro: () => { this.nitroCharge = 1; this.floatText(e.x, e.y, 'NITRO', '#ff8800'); },
      coin: () => { 
        this.score += 50; 
        this.floatText(e.x, e.y, '+50', '#ffdd00'); 
        this.dailyProgress.coins += 1;
        // Animated coin sprite
        const coinAnim = this.add.sprite(e.x, e.y, 'coin_0').setDepth(30).setScale(1.5);
        this.tweens.add({
          targets: coinAnim,
          angle: 720,
          scale: 0,
          alpha: 0,
          duration: 600,
          ease: 'Back.out',
          onUpdate: () => {
            const frame = Math.floor((coinAnim.angle / 720) * 8) % 8;
            coinAnim.setTexture(`coin_${frame}`);
          },
          onComplete: () => coinAnim.destroy(),
        });
      },
      drone: () => {
        // Drone drops random powerup
        const drops = ['fuel', 'shield', 'nitro', 'wrench', 'coin'];
        const drop = Phaser.Math.RND.pick(drops);
        this.collect({ power: drop, x: e.x, y: e.y });
      },
    };
    map[e.power]?.();
    this.game.audioManager?.play(e.power === 'coin' ? 'coin' : 'powerup');
    
    if (this.analytics) {
      this.analytics.trackPowerup(e.power);
    }
    e.destroy();
  }

  damage(amount) {
    this.health -= amount;
    this.floatText(this.player.x, this.player.y - 30, '-' + amount, '#ff4444');
    this.player.setTint(0xff6666);
    this.time.delayedCall(120, () => {
      if (this.shieldTime <= 0) this.player.clearTint();
    });
    if (this.health <= 0) this.gameOver();
  }

  burst(x, y, key, count) {
    this.add.particles(x, y, key, {
      lifespan: 400,
      speed: { min: 40, max: 180 },
      scale: { start: 1, end: 0 },
      quantity: count,
      emitting: false,
      blendMode: 'ADD',
    }).explode(count);
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
    this.banner.setText(msg);
    this.banner.setAlpha(1);
    this.time.delayedCall(900, () => this.banner.setText(''));
  }

  updateHud() {
    this.scoreValue.setText(Math.floor(this.score).toLocaleString());
    const mph = Math.round(this.speed * 0.28);
    this.speedText.setText(mph + ' MPH');
    const speedRatio = Phaser.Math.Clamp((this.speed - this.minSpeed) / (this.maxSpeed - this.minSpeed), 0, 1);
    this.speedFill.width = 160 * speedRatio;
    const speedMask = this.add.graphics().fillRect(W - 176, 23, 160 * speedRatio, 6);
    this.speedFill.setMask(speedMask.createGeometryMask());
    
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
  }

  gameOver() {
    if (this.health > 0) return;
    this.health = 0;
    this.started = false;
    this.game.audioManager?.stopAll();
    this.game.audioManager?.play('explosion');
    this.cameras.main.shake(400, 0.02);
    if (this.player && this.player.active) {
      this.burst(this.player.x, this.player.y, 'explosion_particle', 24);
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
}
