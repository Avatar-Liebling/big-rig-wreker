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
        this.game.audioManager.resume();
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
        if (!this.audioInitialized) {
          this.game.audioManager.init();
          this.game.audioManager.resume();
          this.audioInitialized = true;
        }
        this.game.audioManager.resume();
        this.game.audioManager.play('menu_click');
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
      '• Wreck smaller cars for BIG points!',
      '• Build combos for multiplied scores!',
      '• Collect power-ups: fuel, shields, nitro',
      '• Watch out for police at higher scores!',
      '• Avoid barriers and obstacles!',
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
    const panelW = 480;
    const panelH = 270;
    const panelX = width / 2;
    const panelY = height / 2;
    const panel = this.add.rectangle(panelX, panelY, panelW, panelH, 0x141828, 0.96);
    panel.setStrokeStyle(2, 0xff5500);
    this.overlay.add(panel);

    // Inner glowing border accent
    const innerBorder = this.add.rectangle(panelX, panelY, panelW - 8, panelH - 8);
    innerBorder.setStrokeStyle(1, 0x334466);
    this.overlay.add(innerBorder);

    // Title
    const title = this.add.text(panelX, panelY - 96, 'AUDIO SETTINGS', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '26px',
      color: '#ff5500',
      letterSpacing: 1,
    }).setOrigin(0.5);
    this.overlay.add(title);

    // Divider line
    const divLine = this.add.rectangle(panelX, panelY - 70, panelW - 60, 2, 0x2a3350);
    this.overlay.add(divLine);

    // Volume label - pure clean typography, no unsupported emojis
    const rowY1 = panelY - 26;
    const volLabel = this.add.text(panelX - 190, rowY1, 'VOLUME', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '16px',
      color: '#ffcc00',
      letterSpacing: 1,
    }).setOrigin(0, 0.5);
    this.overlay.add(volLabel);

    // Volume slider track - starts at panelX - 70 (330)
    const sliderX = panelX - 70;
    const sliderY = rowY1;
    const sliderW = 180;
    const track = this.add.rectangle(sliderX + sliderW / 2, sliderY, sliderW, 14, 0x1c2236);
    track.setStrokeStyle(2, 0x3d4b70);
    track.setInteractive({ useHandCursor: true });
    this.overlay.add(track);

    // Track segments for visual ticks
    for (let i = 0; i < 9; i++) {
      const seg = this.add.rectangle(sliderX + i * 20 + 10, sliderY, 16, 6, 0x121624);
      seg.setStrokeStyle(1, 0x2a3450);
      this.overlay.add(seg);
    }

    // Volume slider fill + handle
    const currentVol = this.game.audioManager ? this.game.audioManager.getVolume() : 0.7;
    const fillBar = this.add.rectangle(sliderX, sliderY, sliderW * currentVol, 12, 0xff5500);
    fillBar.setOrigin(0, 0.5);
    const fillMask = this.add.graphics().fillRect(sliderX, sliderY - 6, sliderW * currentVol, 12);
    fillBar.setMask(fillMask.createGeometryMask());
    this.overlay.add(fillBar);

    const handleGlow = this.add.circle(sliderX + sliderW * currentVol, sliderY, 20, 0xff5500, 0.3);
    this.overlay.add(handleGlow);

    const handle = this.add.circle(sliderX + sliderW * currentVol, sliderY, 15, 0xff7722);
    handle.setStrokeStyle(3, 0xffcc00);
    handle.setInteractive({ draggable: true, useHandCursor: true });
    this.overlay.add(handle);

    // Percentage text - comfortably inside the right border
    const volText = this.add.text(sliderX + sliderW + 18, sliderY, Math.round(currentVol * 100) + '%', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '17px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0, 0.5);
    this.overlay.add(volText);

    const applyVolume = (xPos) => {
      const clampedX = Phaser.Math.Clamp(xPos, sliderX, sliderX + sliderW);
      handle.x = clampedX;
      handleGlow.x = clampedX;
      const vol = (clampedX - sliderX) / sliderW;
      fillBar.width = sliderW * vol;
      fillMask.clear();
      fillMask.fillRect(sliderX, sliderY - 6, sliderW * vol, 12);
      volText.setText(Math.round(vol * 100) + '%');
      if (this.game.audioManager) {
        this.game.audioManager.setVolume(vol);
      }
    };

    handle.on('drag', (_pointer, dragX) => {
      applyVolume(dragX);
    });

    track.on('pointerdown', (pointer) => {
      applyVolume(pointer.x);
    });

    // Mute toggle row - perfectly aligned with volume row
    const rowY2 = panelY + 34;
    const muteLabel = this.add.text(panelX - 190, rowY2, 'MUTE', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '16px',
      color: '#cccccc',
      letterSpacing: 1,
    }).setOrigin(0, 0.5);
    this.overlay.add(muteLabel);

    let isMuted = this.game.audioManager ? this.game.audioManager.isMuted() : false;
    const btnW = 120;
    const btnH = 32;
    const btnCenterX = sliderX + btnW / 2; // Left-aligned with sliderX (330)
    const toggleBtn = this.add.rectangle(btnCenterX, rowY2, btnW, btnH, isMuted ? 0xcc2222 : 0x223350);
    toggleBtn.setStrokeStyle(2, isMuted ? 0xff4444 : 0x446699);
    toggleBtn.setInteractive({ useHandCursor: true });
    this.overlay.add(toggleBtn);

    const toggleText = this.add.text(btnCenterX, rowY2, isMuted ? 'MUTED' : 'UNMUTED', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '14px',
      color: isMuted ? '#ffffff' : '#44ffaa',
      letterSpacing: 1,
    }).setOrigin(0.5);
    this.overlay.add(toggleText);

    toggleBtn.on('pointerdown', () => {
      isMuted = !isMuted;
      toggleBtn.fillColor = isMuted ? 0xcc2222 : 0x223350;
      toggleBtn.setStrokeStyle(2, isMuted ? 0xff4444 : 0x446699);
      toggleText.setText(isMuted ? 'MUTED' : 'UNMUTED');
      toggleText.setColor(isMuted ? '#ffffff' : '#44ffaa');
      if (this.game.audioManager) {
        this.game.audioManager.setMuted(isMuted);
      }
    });

    toggleBtn.on('pointerover', () => {
      toggleBtn.setScale(1.05);
    });
    toggleBtn.on('pointerout', () => {
      toggleBtn.setScale(1.0);
    });

    // Close button
    const closeBtn = this.createOverlayButton(panelX, panelY + 92, 'CLOSE', () => {
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
