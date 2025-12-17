import Phaser from 'phaser';
import PressureSystem from './PressureSystem';

export default class CivilianSystem {
  private scene: Phaser.Scene;
  private civilians: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.civilians = this.scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 100 });
    for (let i = 0; i < 50; i++) {
      const civ = this.civilians.create(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'civilian');
      civ.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
    }
  }

  propagatePanic(pressure: PressureSystem, player: Phaser.Physics.Arcade.Sprite) {
    this.civilians.getChildren().forEach((civ: Phaser.GameObjects.GameObject) => {
      const sprite = civ as Phaser.Physics.Arcade.Sprite;
      const pres = pressure.getPressure(sprite.x, sprite.y);
      if (pres > 50 || Phaser.Math.Distance.Between(sprite.x, sprite.y, player.x, player.y) < 200) {
        const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, player.x, player.y) + Math.PI;
        sprite.setVelocity(Math.cos(angle) * 150, Math.sin(angle) * 150);
        sprite.anims.play('civilian-walk', true);
      } else {
        if (Math.random() < 0.01) {
          sprite.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
          sprite.anims.play('civilian-walk', true);
        }
      }
    });
  }
}