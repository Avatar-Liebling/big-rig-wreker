import Phaser from 'phaser';
import AssetGenerator from '../AssetGenerator.js';
import AudioManager from '../AudioManager.js';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Generate all procedural textures
    AssetGenerator.generate(this);

    // Create and store audio manager
    this.game.audioManager = new AudioManager();

    // Dark background
    this.cameras.main.setBackgroundColor('#0a0a0a');

    // Title text
    const titleText = this.add.text(width / 2, height * 0.28, 'BIG RIG WRECKER', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '48px',
      color: '#ff4400',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: {
        offsetX: 3,
        offsetY: 3,
        color: '#000',
        blur: 8,
        fill: true,
      },
    }).setOrigin(0.5);

    // Pulsing title animation
    this.tweens.add({
      targets: titleText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Loading text
    const loadingText = this.add.text(width / 2, height * 0.55, 'LOADING...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      color: '#cccccc',
    }).setOrigin(0.5);

    // Dots animation for loading text
    let dotCount = 0;
    this.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        dotCount = (dotCount + 1) % 4;
        loadingText.setText('LOADING' + '.'.repeat(dotCount));
      },
    });

    // Loading bar background
    const barWidth = 400;
    const barHeight = 24;
    const barX = (width - barWidth) / 2;
    const barY = height * 0.65;

    // Bar border
    const borderGfx = this.add.graphics();
    borderGfx.lineStyle(2, 0xff4400, 1);
    borderGfx.strokeRoundedRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4, 4);

    // Bar track (dark)
    const trackGfx = this.add.graphics();
    trackGfx.fillStyle(0x222222, 1);
    trackGfx.fillRoundedRect(barX, barY, barWidth, barHeight, 3);

    // Fill bar (animated)
    const fillGfx = this.add.graphics();
    this.loadProgress = 0;
    const totalDuration = 2000;
    const steps = 60;
    const stepDuration = totalDuration / steps;

    // Percentage text
    const percentText = this.add.text(width / 2, barY + barHeight / 2, '0%', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // Subtitle text
    this.add.text(width / 2, height * 0.82, 'Preparing the highway...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '13px',
      color: '#666666',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Version
    this.add.text(width - 10, height - 10, 'v1.0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '11px',
      color: '#444444',
    }).setOrigin(1, 1);

    // Animate loading bar
    this.time.addEvent({
      delay: stepDuration,
      repeat: steps - 1,
      callback: () => {
        this.loadProgress += 1 / steps;
        if (this.loadProgress > 1) this.loadProgress = 1;

        fillGfx.clear();

        // Gradient-like fill using two colors
        const fillWidth = barWidth * this.loadProgress;
        // Base orange
        fillGfx.fillStyle(0xff4400, 1);
        fillGfx.fillRoundedRect(barX, barY, fillWidth, barHeight, 3);
        // Lighter highlight on top half
        fillGfx.fillStyle(0xff6622, 0.5);
        fillGfx.fillRoundedRect(barX, barY, fillWidth, barHeight / 2, { tl: 3, tr: 3, bl: 0, br: 0 });

        percentText.setText(Math.round(this.loadProgress * 100) + '%');

        // When complete, transition
        if (this.loadProgress >= 1) {
          loadingText.setText('READY!');
          this.time.delayedCall(400, () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
              this.scene.start('MenuScene');
            });
          });
        }
      },
    });
  }
}
