import PoliceSystem from './PoliceSystem';
import GangSystem from './GangSystem';
import Phaser from 'phaser';

export default class MBHSystem {
  private active = false;
  private scene: Phaser.Scene;
  private eliteUnits: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.eliteUnits = this.scene.physics.add.group();
  }

  activate() { this.active = true; }

  overrideIfActive(police: PoliceSystem, gangs: GangSystem) {
    if (this.active) {
      police['units'].getChildren().forEach(u => (u.body as Phaser.Physics.Arcade.Body).setVelocity(300));
      if (Math.random() < 0.05) {
        const elite = this.eliteUnits.create(Phaser.Math.Between(0, 8000), Phaser.Math.Between(0, 6000), 'elite');
        this.scene.physics.moveToObject(elite, this.scene['player'], 250);
      }
      this.scene['shopsSafehouses'].safehouses.forEach(s => s.setVisible(false));
    }
  }

  isDefeated() {
    return this.eliteUnits.getLength() === 0 && !gangs.gangs.get('MBH')?.boss.alive;
  }
}