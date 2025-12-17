import Phaser from 'phaser';

export default class ShopSafehouseSystem {
  private scene: Phaser.Scene;
  private shops: Phaser.GameObjects.Sprite[];
  private safehouses: Phaser.GameObjects.Sprite[];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.shops = [];
    this.safehouses = [];
    for (let i = 0; i < 5; i++) {
      const shop = this.scene.add.sprite(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'shop');
      this.shops.push(shop);
      const safe = this.scene.add.sprite(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'safehouse');
      this.safehouses.push(safe);
    }
  }

  interact(player: Phaser.Physics.Arcade.Sprite) {
    this.shops.forEach(shop => {
      if (Phaser.Math.Distance.Between(player.x, player.y, shop.x, shop.y) < 50) {
        const pressure = this.scene['pressure'].getPressure(player.x, player.y);
        this.scene['playerStats'].ammo += 50;
        this.scene['playerStats'].cash -= 100 * (1 + pressure / 100);
      }
    });
    this.safehouses.forEach(safe => {
      if (Phaser.Math.Distance.Between(player.x, player.y, safe.x, safe.y) < 50) {
        this.scene['playerStats'].hp = 100;
        this.scene['playerStats'].heat = 0;
      }
    });
  }

  disableForGang(gangId: string) {
  }
}