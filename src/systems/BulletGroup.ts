import Phaser from 'phaser';

class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet');
  }

  fire(x: number, y: number, rotation: number) {
    this.body.reset(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.setRotation(rotation);
    const speed = 800;
    this.setVelocity(Math.cos(rotation) * speed, Math.sin(rotation) * speed);
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.x < 0 || this.x > this.scene.cameras.main.worldView.width || this.y < 0 || this.y > this.scene.cameras.main.worldView.height) { // Optimized bounds check
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

export default class BulletGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene);
    this.createMultiple({
      classType: Bullet,
      frameQuantity: 30,
      active: false,
      visible: false,
      key: 'bullet'
    });
  }

  fireBullet(x: number, y: number, rotation: number) {
    const bullet = this.getFirstDead(false) as Bullet;
    if (bullet) {
      bullet.fire(x, y, rotation);
    }
  }

  clearAll() {
    this.getChildren().forEach(b => b.destroy());
  }
}