import Phaser from 'phaser';

export default class VehicleSystem {
  private scene: Phaser.Scene;
  private vehicles: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.vehicles = this.scene.physics.add.group({ classType: Phaser.Physics.Arcade.Sprite, maxSize: 50 });
    for (let i = 0; i < 20; i++) {
      const car = this.vehicles.create(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'car');
      car.setData('damage', 0);
    }
    this.scene.physics.add.collider(this.vehicles, this.scene['tilemap'].getLayer('ground'), (vehicle, tile) => {
      vehicle.setData('damage', vehicle.getData('damage') + 10);
      if (vehicle.getData('damage') > 100) vehicle.destroy();
    });
  }

  stealNearest(player: Phaser.Physics.Arcade.Sprite, callback: (v: Phaser.Physics.Arcade.Sprite) => void) {
    let nearest: Phaser.Physics.Arcade.Sprite | null = null;
    let minDist = Infinity;
    this.vehicles.getChildren().forEach((veh: Phaser.GameObjects.GameObject) => {
      const dist = Phaser.Math.Distance.Between(player.x, player.y, veh.x, veh.y);
      if (dist < 50 && dist < minDist) {
        minDist = dist;
        nearest = veh as Phaser.Physics.Arcade.Sprite;
      }
    });
    if (nearest) {
      callback(nearest);
    }
  }
}