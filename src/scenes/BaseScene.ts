import Phaser from 'phaser';
import PressureSystem from '../systems/PressureSystem';
import GangSystem from '../systems/GangSystem';
import PoliceSystem from '../systems/PoliceSystem';
import CivilianSystem from '../systems/CivilianSystem';
import VehicleSystem from '../systems/VehicleSystem';
import ShopSafehouseSystem from '../systems/ShopSafehouseSystem';
import ReputationSystem from '../systems/ReputationSystem';
import DayNightSystem from '../systems/DayNightSystem';
import MBHSystem from '../systems/MBHSystem';
import BossSystem from '../systems/BossSystem';
import BulletGroup from '../systems/BulletGroup';

interface PlayerStats {
  hp: number;
  cash: number;
  ammo: number;
  weaponType: string;
  heat: number;
  reputation: number;
}

export default class BaseScene extends Phaser.Scene {
  protected pressure!: PressureSystem;
  protected gangs!: GangSystem;
  protected police!: PoliceSystem;
  protected civilians!: CivilianSystem;
  protected vehicles!: VehicleSystem;
  protected shopsSafehouses!: ShopSafehouseSystem;
  protected reputation!: ReputationSystem;
  protected dayNight!: DayNightSystem;
  protected mbh!: MBHSystem;
  protected bosses!: BossSystem;
  protected bullets!: BulletGroup;

  protected player!: Phaser.Physics.Arcade.Sprite;
  protected playerStats: PlayerStats = { hp: 100, cash: 0, ammo: 50, weaponType: 'pistol', heat: 0, reputation: 0 };
  protected currentVehicle: Phaser.Physics.Arcade.Sprite | null = null;
  protected keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  protected touchPointer!: Phaser.Input.Pointer;

  protected tilemap!: Phaser.Tilemaps.Tilemap;
  protected hazeGraphics!: Phaser.GameObjects.Graphics;

  constructor(key: string) {
    super(key);
  }

  preload() {
    // Load from online URLs (no local files)
    this.load.image('city_tiles', 'https://opengameart.org/sites/default/files/Sample_24.png');
    this.load.image('player', 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/497cbb97-70fd-44c5-9eba-947232013556/dfg61y9-7d772480-3673-41db-9a88-e7b80a8be2d2.png/v1/fill/w_1280,h_724/free_top_down_2d_pixel_art_sprites_by_onemandev_dfg61y9-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzI0IiwicGF0aCI6Ii9mLzQ5N2NiYjk3LTcwZmQtNDRjNS05ZWJhLTk0NzIzMjAxMzU1Ni9kZmc2MXk5LTdkNzcyNDgwLTM2NzMtNDFkYi05YTg4LWU3YjgwYThiZTJkMi5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.cwjWF4yt1TzPtD3XMMb5PavvS9M5QwH-cYDyG6s-R8c');
    this.load.image('car', 'https://www.clipartmax.com/png/middle/19-195986_clipart-car-from-above-race-top-down-clipground-car-clip-art-from.png');
    this.load.image('gang_member', 'https://tint.creativemarket.com/Gw7_JdZdbBmrNk2Tb9yvCVD5iiGD5xuZQTYS-esGgV0/width:1200/height:800/gravity:nowe/rt:fill-down/el:1/czM6Ly9maWxlcy5jcmVhdGl2ZW1hcmtldC5jb20vaW1hZ2VzL3NjcmVlbnNob3RzL3Byb2R1Y3RzLzMzLzMzMS8zMzEyNjIvZ2FuZ3N0ZXJwcmV2aWV3LW8uanBn?1422725083');
    this.load.image('police', 'https://s3.amazonaws.com/gameartpartnersimagehost/wp-content/uploads/2019/01/gameartprev-Police-Man-2D-Game-Character-Sprite.png');
    this.load.image('civilian', 'https://a0.anyrgb.com/pngimg/18/960/topdown-and-bottomup-design-military-vehicle-rpg-military-organization-sprite-soldier-army-military-weapons-auto-part.png');
    this.load.image('bullet', 'https://www.clipartmax.com/png/middle/331-3318578_bullet-free-icon-gun-bullet-sprite-png.png');
    this.load.image('shop', 'https://img.craftpix.net/2022/04/Buildings-Collection-Top-Down-Pixel-Art2.webp');
    this.load.image('safehouse', 'https://img.craftpix.net/2022/10/Top-Down-Buildings-and-Objects-Pixel-Art2.webp');
    this.load.image('boss', 'https://img.craftpix.net/2025/10/Free-Top-Down-Boss-Character-4-Direction-Pack4.png');
    this.load.image('elite', 'https://img.craftpix.net/2025/09/Free-Top-Down-Goblin-Character-Sprite4.png');

    this.load.audio('gun_shot', 'https://www.soundjay.com/mechanical/sounds/gun-gunshot-01.mp3');
    this.load.audio('explosion', 'https://www.soundjay.com/mechanical/sounds/explosion-01.mp3');
    this.load.audio('ambient_city', 'https://www.soundjay.com/ambient/sounds/street-traffic-1.mp3');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this.cameras.main.setZoom(1.2);
    this.cameras.main.setAngle(-5);
    this.cameras.main.setBounds(0, 0, 8000, 6000);

    this.tilemap = this.make.tilemap({ width: 250, height: 187, tileWidth: 32, tileHeight: 32 });
    const tileset = this.tilemap.addTilesetImage('city_tiles');
    const layer = this.tilemap.createBlankLayer('ground', tileset, 0, 0);
    for (let y = 0; y < this.tilemap.height; y++) {
      for (let x = 0; x < this.tilemap.width; x++) {
        const tileIndex = Phaser.Math.Between(0, tileset.total - 1);
        layer?.putTileAt(tileIndex, x, y);
      }
    }
    layer?.setCollisionByProperty({ collides: true });

    this.pressure = new PressureSystem(8000, 6000, 32);
    this.gangs = new GangSystem(this);
    this.police = new PoliceSystem(this);
    this.civilians = new CivilianSystem(this);
    this.vehicles = new VehicleSystem(this);
    this.shopsSafehouses = new ShopSafehouseSystem(this);
    this.reputation = new ReputationSystem();
    this.dayNight = new DayNightSystem(this);
    this.mbh = new MBHSystem(this);
    this.bosses = new BossSystem(this, this.gangs);
    this.bullets = new BulletGroup(this);

    this.player = this.physics.add.sprite(400, 300, 'player').setCollideWorldBounds(true);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.keys = this.input.keyboard!.createCursorKeys();
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.touchPointer = pointer;
    });
    this.input.on('pointerup', () => {
      this.touchPointer = undefined as any;
    });

    this.hazeGraphics = this.add.graphics();

    const ambient = this.sound.add('ambient_city', { loop: true, volume: 0.5 });
    ambient.play();

    this.add.text(10, 10, 'HP: 100', { font: '16px Arial', fill: '#ff0000' }).setScrollFactor(0);

    this.physics.add.collider(this.player, layer!);
    this.physics.add.collider(this.bullets, this.gangs.members, (bullet, member) => {
      member.setData('hp', member.getData('hp') - 20);
      if (member.getData('hp') <= 0) member.destroy();
      bullet.destroy();
    });
    // Similar colliders for police, civilians, etc.
  }

  update(time: number, delta: number) {
    this.gangs.evaluate(this.pressure, this.reputation, this.dayNight.isNight);
    this.pressure.recalculate();
    this.police.updateHeat(this.playerStats.heat, this.player);
    this.civilians.propagatePanic(this.pressure, this.player);
    this.bosses.checkSpawnConditions(this.pressure, this.gangs);
    if (this.scene.key === 'AdduIslandScene') this.mbh.overrideIfActive(this.police, this.gangs);
    this.shopsSafehouses.interact(this.player);

    const speed = this.currentVehicle ? 300 : 150;
    const body = this.currentVehicle ? this.currentVehicle.body as Phaser.Physics.Arcade.Body : this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0);

    let dx = 0, dy = 0;
    if (this.keys.left.isDown) dx -= 1;
    if (this.keys.right.isDown) dx += 1;
    if (this.keys.up.isDown) dy -= 1;
    if (this.keys.down.isDown) dy += 1;

    if (this.touchPointer && this.touchPointer.isDown) {
      const touchX = this.touchPointer.x;
      const touchY = this.touchPointer.y;
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, touchX, touchY);
      dx = Math.cos(angle);
      dy = Math.sin(angle);
    }

    if (dx !== 0 || dy !== 0) {
      const norm = Math.sqrt(dx * dx + dy * dy);
      body.setVelocity(speed * dx / norm, speed * dy / norm);
      this.player.setRotation(Phaser.Math.Angle.Between(0, 0, dx, dy));
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.space) && this.playerStats.ammo > 0 && this.time.now > this.player.getData('lastShot') + 500) {
      this.sound.play('gun_shot');
      this.playerStats.ammo--;
      this.playerStats.heat += 5;
      this.reputation.accumulate(1);
      this.player.setData('lastShot', this.time.now);
      this.bullets.fireBullet(this.player.x, this.player.y, this.player.rotation);
      this.cameras.main.shake(100, 0.01);
      this.pressure.updatePressure(this.player.x, this.player.y, 10, 'player');
    }

    if (Phaser.Input.Keyboard.JustDown(this.input.keyboard!.addKey('E'))) {
      if (this.currentVehicle) {
        this.player.setPosition(this.currentVehicle.x + 20, this.player.y);
        this.player.setVisible(true);
        this.player.body.enable = true;
        this.currentVehicle = null;
      } else {
        this.vehicles.stealNearest(this.player, (vehicle) => {
          this.currentVehicle = vehicle;
          this.player.setVisible(false);
          this.player.body.enable = false;
        });
      }
    }

    this.hazeGraphics.clear();
    const pressure = this.pressure.getPressure(this.player.x, this.player.y);
    this.hazeGraphics.fillStyle(0xff00ff, pressure / 100 * 0.5);
    this.hazeGraphics.fillRect(0, 0, this.scale.width, this.scale.height).setScrollFactor(0);

    if (this.dayNight.isNight) {
      this.cameras.main.setPipeline('Tint');
    }

    if (this.scene.key === 'AdduIslandScene' && this.mbh.isDefeated() && this.playerStats.hp > 0) {
      this.sound.stopAll();
      this.scene.pause();
      this.add.text(this.scale.width / 2, this.scale.height / 2, 'END', { font: '48px Arial' }).setOrigin(0.5);
    }

    if (this.currentVehicle && this.currentVehicle.getData('damage') > 50) {
      this.playerStats.heat += 1;
    }

    if (pressure > 90 && this.scene.key === 'MaleIslandScene') {
      this.pressure.partialReset();
      this.scene.start('HulhumaleIslandScene');
    }
    if (pressure > 90 && this.scene.key === 'HulhumaleIslandScene') {
      this.pressure.partialReset();
      this.scene.start('AdduIslandScene');
    }
  }
}