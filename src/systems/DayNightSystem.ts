import Phaser from 'phaser';

export default class DayNightSystem {
  public isNight = false;
  constructor(scene: Phaser.Scene) {
    scene.time.addEvent({ delay: 300000, callback: () => {
      this.isNight = !this.isNight;
      scene.sound.get('ambient_city').volume = this.isNight ? 0.3 : 0.5;
    }, loop: true });
  }
}