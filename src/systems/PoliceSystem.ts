import Phaser from 'phaser';

export default class PoliceSystem {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  updateHeat(heat: number, player: Phaser.Physics.Arcade.Sprite) {
    if (heat > 20) {
    }
  }
}