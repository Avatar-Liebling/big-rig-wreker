import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    this.audioInitialized = false;

    this.cameras.main.setBackgroundColor('#1a1a2e');

    // ─── Scrolling road background ───
    this.roadTiles = [];
    const roadWidth = 260;
    const roadX = width / 2;
    const tileH = 64;
    const numTiles = Math.ceil(height / tileH) + 2;

    for (let i = 0; i < numTiles; i++) {
      const tile = this.add.image(roadX, i * tileH, 'road_segment');
      tile.setDisplaySize(roadWidth, tileH);
      tile.setDepth(0);
      this.roadTiles.push(tile);
    }
    this.roadScrollSpeed = 120;
    this.roadTileH = tileH;

    // Road lane markings
    this.laneMarks = [];
    for (let i = 0; i < numTiles; i++) {
      const mark = this.add.rectangle(roadX, i * tileH, 4, 30, 0xffff00, 0.7);
      mark.setDepth(1);
      this.laneMarks.push(mark);
    }

    // Side scenery (buildings)
    this.sceneryLeft = [];
    this.sceneryRight = [];
    for (let i = 0; i < 6; i++) {
      const texKey = 'building_' + (1 + (i % 3));
      const leftB = this.add.image(roadX - roadWidth / 2 - 70, i * 100, texKey);
      leftB.setDisplaySize(80, 90);
      leftB.setDepth(0);
      this.sceneryLeft.push(leftB);

      const rightB = this.add.image(roadX + roadWidth / 2 + 70, i * 100, texKey);
      rightB.setDisplaySize(80, 90);
      rightB.setDepth(0);
      this.sceneryRight.push(rightB);
    }

    // ─── Dust particles in background ───
    if (this.textures.exists('smoke_particle')) {
      this.add.particles(width / 2, height / 2, 'smoke_particle', {
        x: { min: 0, max: width },
        y: { min: 0, max: height },
        lifespan: 4000,
        speed: { min: 10, max: 30 },
        scale: { start: 0.3, end: 0 },
        alpha: { start: 0.15, end: 0 },
        frequency: 300,
        blendMode: 'ADD',
        emitting: true,
      }).setDepth(1);
    }

    // ─── Animated truck driving across the bottom ───
    this.menuTruck = this.add.image(-100, height - 60, 'truck');
    this.menuTruck.setDisplaySize(64, 32);
    this.menuTruck.setAngle(-90); // face right
    this.menuTruck.setDepth(2);
    this.truckMoveSpeed = 150;

    // ─── Logo ───
    const logo = this.add.image(width / 2, 90, 'logo');
    logo.setDisplaySize(400, 80);
    logo.setDepth(10);
    this.tweens.add({
      targets: logo,
      y: 95,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Subtitle
    this.add.text(width / 2, 140, 'SEMI-TRUCK MAYHEM ON THE HIGHWAY', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '12px',
      color: '#ff8844',
      fontStyle: 'italic',
    }).setOrigin(0.5).setDepth(10);

    // ─── Buttons ───
    const buttonY = [210, 270, 330];
    const buttonLabels = ['PLAY', 'HOW TO PLAY', 'SETTINGS'];
    const buttonCallbacks = [
      () => this.startGame(),
      () => this.showHowToPlay(),
      () => this.showSettings(),
    ];

    this.buttons = [];
    for (let i = 0; i < 3; i++) {
      const btn = this.createButton(width / 2, buttonY[i], buttonLabels[i], buttonCallbacks[i]);
      this.buttons.push(btn);
    }

    // ─── Version text ───
    this.add.text(width - 10, height - 10, 'v1.0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      color: '#555555',
    }).setOrigin(1, 1).setDepth(10);

    // ─── Overlays container (for instructions / settings) ───
    this.overlay = null;

    // Initialize audio on first click
    this.input.on('pointerdown', () => {
      if (!this.audioInitialized && this.game.audioManager) {
        this.game.audioManager.init();
        this.audioInitialized = true;
      }
    });
  }

  createButton(x, y, label, callback) {
    const container = this.add.container(x, y).setDepth(10);

    const bg = this.add.image(0, 0, 'button');
    bg.setDisplaySize(220, 44);
    bg.setInteractive({ useHandCursor: true });

    const text = this.add.text(0, 0, label, {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    container.add([bg, text]);

    bg.on('pointerover', () => {
      bg.setTint(0xffaa66);
      container.setScale(1.05);
    });
    bg.on('pointerout', () => {
      bg.clearTint();
      container.setScale(1.0);
    });
    bg.on('pointerdown', () => {
      if (this.game.audioManager) {
        this.game.audioManager.play('menu_click');
      }
      if (!this.audioInitialized && this.game.audioManager) {
        this.game.audioManager.init();
        this.audioInitialized = true;
      }
      container.setScale(0.95);
      this.time.delayedCall(100, () => {
        container.setScale(1.0);
        callback();
      });
    });

    return container;
  }

  startGame() {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('GameScene');
    });
  }

  showHowToPlay() {
    if (this.overlay) return;

    const { width, height } = this.cameras.main;

    this.overlay = this.add.container(0, 0).setDepth(100);

    // Dimmed backdrop
    const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    dim.setInteractive();
    this.overlay.add(dim);

    // Panel
    const panel = this.add.rectangle(width / 2, height / 2, 500, 340, 0x1a1a2e, 1);
    panel.setStrokeStyle(2, 0xff4400);
    this.overlay.add(panel);

    // Title
    const title = this.add.text(width / 2, height / 2 - 140, 'HOW TO PLAY', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '28px',
      color: '#ff4400',
    }).setOrigin(0.5);
    this.overlay.add(title);

    // Instructions
    const instructions = [
      '← → or A/D : Steer your truck between lanes',
      '↑ or W : Accelerate',
      '↓ or S : Brake / Slow down',
      'SPACE : Horn / Activate Nitro Boost',
      'ESC : Pause the game',
      '',
      '🚛 Wreck smaller cars for BIG points!',
      '💥 Build combos for multiplied scores!',
      '⚡ Collect power-ups: fuel, shields, nitro',
      '🚔 Watch out for police at higher scores!',
      '🏗️ Avoid barriers and obstacles!',
    ];

    const instText = this.add.text(width / 2, height / 2 - 10, instructions.join('\n'), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#dddddd',
      lineSpacing: 6,
      align: 'center',
    }).setOrigin(0.5);
    this.overlay.add(instText);

    // Close button
    const closeBtn = this.createOverlayButton(width / 2, height / 2 + 145, 'CLOSE', () => {
      this.overlay.destroy();
      this.overlay = null;
    });
    this.overlay.add(closeBtn);
  }

  showSettings() {
    if (this.overlay) return;

    const { width, height } = this.cameras.main;
    this.overlay = this.add.container(0, 0).setDepth(100);

    // Backdrop
    const dim = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    dim.setInteractive();
    this.overlay.add(dim);

    // Panel
    const panel = this.add.rectangle(width / 2, height / 2, 400, 250, 0x1a1a2e, 1);
    panel.setStrokeStyle(2, 0xff4400);
    this.overlay.add(panel);

    // Title
    const title = this.add.text(width / 2, height / 2 - 95, 'SETTINGS', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '28px',
      color: '#ff4400',
    }).setOrigin(0.5);
    this.overlay.add(title);

    // Volume label
    const volLabel = this.add.text(width / 2 - 120, height / 2 - 40, 'Volume:', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#cccccc',
    }).setOrigin(0, 0.5);
    this.overlay.add(volLabel);

    // Volume slider track
    const sliderX = width / 2 - 30;
    const sliderY = height / 2 - 40;
    const sliderW = 180;
    const track = this.add.rectangle(sliderX + sliderW / 2, sliderY, sliderW, 8, 0x444444);
    this.overlay.add(track);

    // Volume slider fill + handle
    const currentVol = this.game.audioManager ? this.game.audioManager.getVolume() : 0.7;
    const fillBar = this.add.rectangle(sliderX, sliderY, sliderW * currentVol, 8, 0xff4400);
    fillBar.setOrigin(0, 0.5);
    this.overlay.add(fillBar);

    const handle = this.add.circle(sliderX + sliderW * currentVol, sliderY, 12, 0xff6622);
    handle.setInteractive({ draggable: true, useHandCursor: true });
    this.overlay.add(handle);

    const volText = this.add.text(sliderX + sliderW + 45, sliderY, Math.round(currentVol * 100) + '%', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0, 0.5);
    this.overlay.add(volText);

    handle.on('drag', (_pointer, dragX) => {
      const clampedX = Phaser.Math.Clamp(dragX, sliderX, sliderX + sliderW);
      handle.x = clampedX;
      const vol = (clampedX - sliderX) / sliderW;
      fillBar.width = sliderW * vol;
      volText.setText(Math.round(vol * 100) + '%');
      if (this.game.audioManager) {
        this.game.audioManager.setVolume(vol);
      }
    });

    // Mute toggle
    const muteLabel = this.add.text(width / 2 - 120, height / 2 + 20, 'Mute:', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#cccccc',
    }).setOrigin(0, 0.5);
    this.overlay.add(muteLabel);

    let isMuted = this.game.audioManager ? this.game.audioManager.isMuted() : false;
    const muteBox = this.add.rectangle(width / 2, height / 2 + 20, 28, 28, isMuted ? 0xff4400 : 0x333333);
    muteBox.setStrokeStyle(2, 0x666666);
    muteBox.setInteractive({ useHandCursor: true });
    this.overlay.add(muteBox);

    const muteCheck = this.add.text(width / 2, height / 2 + 20, isMuted ? '✓' : '', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.overlay.add(muteCheck);

    muteBox.on('pointerdown', () => {
      isMuted = !isMuted;
      muteBox.fillColor = isMuted ? 0xff4400 : 0x333333;
      muteCheck.setText(isMuted ? '✓' : '');
      if (this.game.audioManager) {
        this.game.audioManager.setMuted(isMuted);
      }
    });

    // Close button
    const closeBtn = this.createOverlayButton(width / 2, height / 2 + 90, 'CLOSE', () => {
      this.overlay.destroy();
      this.overlay = null;
    });
    this.overlay.add(closeBtn);
  }

  createOverlayButton(x, y, label, callback) {
    const container = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 140, 36, 0xff4400);
    bg.setInteractive({ useHandCursor: true });

    const text = this.add.text(0, 0, label, {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    container.add([bg, text]);

    bg.on('pointerover', () => bg.setFillStyle(0xff6622));
    bg.on('pointerout', () => bg.setFillStyle(0xff4400));
    bg.on('pointerdown', () => {
      if (this.game.audioManager) this.game.audioManager.play('menu_click');
      callback();
    });

    return container;
  }

  update(_time, delta) {
    const dt = delta / 1000;

    // Scroll road tiles
    for (const tile of this.roadTiles) {
      tile.y += this.roadScrollSpeed * dt;
      if (tile.y > this.cameras.main.height + this.roadTileH) {
        tile.y -= this.roadTiles.length * this.roadTileH;
      }
    }

    // Scroll lane marks
    for (const mark of this.laneMarks) {
      mark.y += this.roadScrollSpeed * dt;
      if (mark.y > this.cameras.main.height + this.roadTileH) {
        mark.y -= this.laneMarks.length * this.roadTileH;
      }
    }

    // Scroll scenery
    for (const b of this.sceneryLeft) {
      b.y += this.roadScrollSpeed * dt * 0.5;
      if (b.y > this.cameras.main.height + 60) {
        b.y -= this.sceneryLeft.length * 100;
      }
    }
    for (const b of this.sceneryRight) {
      b.y += this.roadScrollSpeed * dt * 0.5;
      if (b.y > this.cameras.main.height + 60) {
        b.y -= this.sceneryRight.length * 100;
      }
    }

    // Move truck across bottom
    this.menuTruck.x += this.truckMoveSpeed * dt;
    if (this.menuTruck.x > this.cameras.main.width + 100) {
      this.menuTruck.x = -100;
    }
  }
}
