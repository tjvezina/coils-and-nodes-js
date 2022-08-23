import Sprite from '../framework/sprite.js';
import GameObject from './game-object.js';
import Level from './level.js';
import GroundTile from './tiles/ground-tile.js';
import Tile from './tiles/tile.js';

export default class TeslaCoil extends GameObject {
  static sprite: Sprite;
  static imgDisabled: p5.Image;
  static imgFrame: p5.Image;

  static preload(): void {
    Sprite.load('./assets/tesla-coil.png', 13, 2, 50, result => { this.sprite = result; });
    loadImage('./assets/tesla-coil-disabled.png', result => { this.imgDisabled = result; });
    loadImage('./assets/tesla-coil-frame.png', result => { this.imgFrame = result; });
  }

  static updateSprites(): void {
    this.sprite.update();
  }

  level: Level;
  tile: Tile = null;

  isActive = false;

  constructor(level: Level) {
    super(0, 0);
    this.level = level;
  }

  get currentTile(): Tile { return this.tile; }

  set currentTile(tile: Tile) {
    this.tile = tile;
    this.pos.set(tile.pos);
  }

  draw(): void {
    const { sprite, imgDisabled, imgFrame } = TeslaCoil;
    const { pos, size, isActive } = this;

    if (isActive) {
      sprite.draw(pos.x, pos.y, size.x, size.y);
    } else {
      image(imgDisabled, pos.x, pos.y, size.x, size.y);
    }

    image(imgFrame, pos.x, pos.y, size.x, size.y);
  }

  setDestinationTile(goalTile: Tile): void {
    let node = this.level.findPath(this.currentTile, goalTile, true);

    if (node === null || node.parent === null) return;

    let prevDir = this.getDirection(node.tile, this.currentTile);

    do {
      const nextDir = this.getDirection(node.tile, node.parent.tile);

      const tile = node.tile as GroundTile;
      tile.isPath = true;

      let straight;
      let rot;

      if ((prevDir === 0 && nextDir === 2) || (prevDir === 2 && nextDir === 0)) {
        straight = true;
        rot = 0;
      } else if ((prevDir === 1 && nextDir === 3) || (prevDir === 3 && nextDir === 1)) {
        straight = true;
        rot = 1;
      } else if ((prevDir === 0 && nextDir === 1) || (prevDir === 1 && nextDir === 0)) {
        straight = false;
        rot = -1;
      } else if ((prevDir === 1 && nextDir === 1) || (prevDir === 1 && nextDir === 1)) {
        straight = false;
        rot = 0;
      } else if ((prevDir === 2 && nextDir === 3) || (prevDir === 3 && nextDir === 2)) {
        straight = false;
        rot = 1;
      } else if ((prevDir === 3 && nextDir === 0) || (prevDir === 0 && nextDir === 3)) {
        straight = false;
        rot = 2;
      }

      tile.isStraight = straight;
      tile.rotation = rot * (PI/2);

      prevDir = this.getDirection(node.parent.tile, node.tile);
      node = node.parent;
    } while (node.parent !== null);
  }

  getDirection(current: Tile, previous: Tile): number {
    const dX = previous.coord.x - current.coord.x;
    const dY = previous.coord.y - current.coord.y;

    if (dX === 0 && dY === -1) return 0;
    if (dX === 1 && dY === 0) return 1;
    if (dX === 0 && dY === 1) return 2;
    if (dX === -1 && dY === 0) return 3;

    return -1;
  }
}
