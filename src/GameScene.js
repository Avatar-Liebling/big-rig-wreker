import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // No external assets; we'll use graphics.
  }

  create() {
    // Draw road background
    const road = this.add.rectangle(400, 225, 800, 200, 0x555555);
    road.setOrigin(0.5);

    // Create a simple truck using graphics
    const truck = this.add.graphics({ x: 100, y: 225 });
    // body
    truck.fillStyle(0xff0000, 1);
    truck.fillRect(0, -20, 80, 40);
    // cab
    truck.fillStyle(0x000000, 1);
    truck.fillRect(60, -30, 20, 20);
    // wheels
    truck.fillStyle(0x000000, 1);
    truck.fillCircle(20, 15, 10);
    truck.fillCircle(60, 15, 10);

    this.truck = truck;
    this.truckSpeed = 200; // pixels per second

    // Input handling
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    const dt = delta / 1000;
    if (this.cursors.right.isDown) {
      this.truck.x += this.truckSpeed * dt;
    } else if (this.cursors.left.isDown) {
      this.truck.x -= this.truckSpeed * dt;
    }
    // Keep within bounds
    if (this.truck.x > 800) this.truck.x = -80;
    if (this.truck.x < -80) this.truck.x = 800;
  }
}
