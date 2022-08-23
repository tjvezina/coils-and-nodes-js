import Sprite from '../../framework/sprite.js';
import Tile from './tile.js';

export default class GroundTile extends Tile {
  static lightningStraight: Sprite;
  static lightningCorner: Sprite;

  static preload(): void {
    Sprite.load('./assets/lightning-straight.png', 3, 1, 10, result => { this.lightningStraight = result; });
    Sprite.load('./assets/lightning-corner.png', 3, 1, 10, result => { this.lightningCorner = result; });
  }

  static updateSprites(): void {
    this.lightningStraight.update();
    this.lightningCorner.update();
  }

  isPath = false;
  isStraight = false;
  rotation = 0;

  draw(): void {
    const { pos, size, rotation, isPath, isStraight } = this;

    if (isPath) {
      if (isStraight) {
        GroundTile.lightningStraight.draw(pos.x, pos.y, size.x, size.y, rotation);
      } else {
        GroundTile.lightningCorner.draw(pos.x, pos.y, size.x, size.y, rotation);
      }
    }
  }
}
