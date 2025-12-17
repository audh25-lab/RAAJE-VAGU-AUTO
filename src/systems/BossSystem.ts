import Phaser from 'phaser';
import PressureSystem from './PressureSystem';
import GangSystem from './GangSystem';

export default class BossSystem {
  private scene: Phaser.Scene;
  private gangs: GangSystem;

  constructor(scene: Phaser.Scene, gangs: GangSystem) {
    this.scene = scene;
    this.gangs = gangs;
  }

  checkSpawnConditions(pressure: PressureSystem, gangs: GangSystem) {
    gangs.gangs.forEach(gang => {
      if (gang.state === 'Desperate' && gang.boss.alive && Math.random() < 0.02) {
        const boss = this.scene.physics.add.sprite(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'boss');
        boss.setData('hp', 200);
        boss.setData('gangId', gang.id);
        boss.anims.play('boss-walk', true); // Play boss animation
        for (let i = 0; i < gang.boss.protection; i++) {
          const escort = gang.members.getFirstDead(true, boss.x + Phaser.Math.Between(-50, 50), boss.y + Phaser.Math.Between(-50, 50), 'gang_member');
          this.scene.physics.moveToObject(escort, this.scene['player'], 150);
          escort.anims.play('gang-walk', true);
        }
        this.scene.time.addEvent({
          delay: 5000,
          callback: () => {
            if (gang.members.getLength() < gang.boss.protection) {
              boss.destroy();
            }
          },
          loop: true
        });
      }
    });
  }
}