import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.carsWrecked = data.carsWrecked || 0;
    this.maxCombo = data.maxCombo || 0;
    this.distanceTraveled = data.distance || 0;
    this.levelReached = data.level || 1;
    this.dailyComplete = data.dailyComplete || false;
  }

  create() {
    // Stop the menu scene if it's running
    if (this.scene.isActive('MenuScene')) {
      this.scene.stop('MenuScene');
    }
    
    const { width, height } = this.cameras.main;

    // Play game over sound
    if (this.game.audioManager) {
      this.game.audioManager.play('game_over');
    }

    // Dark background
    this.cameras.main.setBackgroundColor('#0a0000');

    // Explosion particles settling
    if (this.textures.exists('smoke_particle')) {
      this.add.particles(width / 2, height / 2, 'smoke_particle', {
        x: { min: 0, max: width },
        y: { min: 0, max: height },
        lifespan: 3000,
        speed: { min: 20, max: 80 },
        scale: { start: 0.8, end: 0 },
        alpha: { start: 0.4, end: 0 },
        tint: [0xff4400, 0xff6600, 0xff0000, 0xffaa00],
        frequency: 200,
        gravityY: 30,
        blendMode: 'ADD',
      });
    }

    // Dark overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);
    overlay.setDepth(1);

    // "GAME OVER" text
    const gameOverText = this.add.text(width / 2, 60, 'GAME OVER', {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '56px',
      color: '#ff2200',
      stroke: '#000000',
      strokeThickness: 8,
      shadow: {
        offsetX: 4,
        offsetY: 4,
        color: '#000',
        blur: 10,
        fill: true,
      },
    }).setOrigin(0.5).setDepth(2);

    // Pulse animation
    this.tweens.add({
      targets: gameOverText,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Check high score
    const savedHigh = parseInt(localStorage.getItem('bigrig_highscore') || '0', 10);
    const isNewHighScore = this.finalScore > savedHigh;
    if (isNewHighScore) {
      localStorage.setItem('bigrig_highscore', this.finalScore.toString());
    }
    const highScore = Math.max(savedHigh, this.finalScore);

    // Score display
    const scoreLabel = this.add.text(width / 2, 125, 'FINAL SCORE', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      color: '#aaaaaa',
    }).setOrigin(0.5).setDepth(2);

    const scoreText = this.add.text(width / 2, 155, this.finalScore.toLocaleString(), {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '42px',
      color: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(2);

    // Animate score counting up
    const scoreObj = { val: 0 };
    this.tweens.add({
      targets: scoreObj,
      val: this.finalScore,
      duration: 1500,
      ease: 'Power2',
      onUpdate: () => {
        scoreText.setText(Math.round(scoreObj.val).toLocaleString());
      },
    });

    // New high score flash
    if (isNewHighScore) {
      const newHSText = this.add.text(width / 2, 190, '★ NEW HIGH SCORE! ★', {
        fontFamily: 'Impact, Arial Black, sans-serif',
        fontSize: '22px',
        color: '#ffdd00',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5).setDepth(2);

      this.tweens.add({
        targets: newHSText,
        alpha: 0.3,
        duration: 500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // High score display
    this.add.text(width / 2, isNewHighScore ? 218 : 195, 'HIGH SCORE: ' + highScore.toLocaleString(), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#888888',
    }).setOrigin(0.5).setDepth(2);

    // Daily challenge status
    let statsY = isNewHighScore ? 255 : 230;
    if (this.dailyComplete) {
      this.add.text(width / 2, statsY, '★ DAILY CHALLENGE COMPLETE! +5000 ★', {
        fontFamily: 'Impact, Arial Black, sans-serif',
        fontSize: '16px',
        color: '#ffcc00',
        stroke: '#000000',
        strokeThickness: 3,
      }).setOrigin(0.5).setDepth(2);
      statsY += 30;
    }
    
    // Stats panel
    const panelBg = this.add.rectangle(width / 2, statsY + 40, 380, 100, 0x111122, 0.8);
    panelBg.setStrokeStyle(1, 0x333355);
    panelBg.setDepth(2);

    const stats = [
      { label: 'Cars Wrecked', value: this.carsWrecked.toString() },
      { label: 'Max Combo', value: 'x' + this.maxCombo },
      { label: 'Distance', value: Math.round(this.distanceTraveled).toLocaleString() + 'm' },
      { label: 'Level', value: this.levelReached.toString() },
    ];

    const statStartX = width / 2 - 160;
    const statSpacing = 95;

    for (let i = 0; i < stats.length; i++) {
      const sx = statStartX + i * statSpacing;
      this.add.text(sx, statsY + 15, stats[i].label, {
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        color: '#888888',
        align: 'center',
      }).setOrigin(0.5, 0).setDepth(3);

      this.add.text(sx, statsY + 35, stats[i].value, {
        fontFamily: 'Impact, Arial Black, sans-serif',
        fontSize: '24px',
        color: '#ff8844',
        align: 'center',
      }).setOrigin(0.5, 0).setDepth(3);
    }

    // Buttons
    const buttonsY = statsY + 110;
    this.createButton(width / 2 - 100, buttonsY, 'PLAY AGAIN', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('GameOverScene');
        this.scene.start('GameScene');
      });
    });

    this.createButton(width / 2 + 100, buttonsY, 'MAIN MENU', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('GameOverScene');
        this.scene.start('MenuScene');
      });
    });
    
    // Share score / Ad break button for Playables
    if (this.game.playables?.getIsPlayable()) {
      this.createButton(width / 2, buttonsY + 55, 'SHARE SCORE', () => {
        if (this.game.playables) {
          this.game.playables.endGameplay(this.finalScore, {
            carsWrecked: this.carsWrecked,
            maxCombo: this.maxCombo,
            distance: Math.floor(this.distanceTraveled),
            level: this.levelReached
          });
        }
      });
    }
  }

  createButton(x, y, label, callback) {
    const container = this.add.container(x, y).setDepth(10);

    const bg = this.add.rectangle(0, 0, 160, 40, 0xff4400);
    bg.setStrokeStyle(2, 0xff6622);
    bg.setInteractive({ useHandCursor: true });

    const text = this.add.text(0, 0, label, {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: '18px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5);

    container.add([bg, text]);

    bg.on('pointerover', () => {
      bg.setFillStyle(0xff6622);
      container.setScale(1.05);
    });
    bg.on('pointerout', () => {
      bg.setFillStyle(0xff4400);
      container.setScale(1.0);
    });
    bg.on('pointerdown', () => {
      if (this.game.audioManager) this.game.audioManager.play('menu_click');
      container.setScale(0.95);
      this.time.delayedCall(100, () => {
        container.setScale(1.0);
        callback();
      });
    });

    return container;
  }
}
