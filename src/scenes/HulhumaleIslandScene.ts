import BaseScene from './BaseScene';

export default class HulhumaleIslandScene extends BaseScene {
  constructor() {
    super('HulhumaleIslandScene');
  }

  create() {
    super.create();
    this.gangs.addGang('Henvari', 'A', 0x00ff00);
    this.gangs.addGang('Masuun', 'A', 0xff0000);
  }
}
