import Sprite from '../framework/sprite.js';
import GameObject from './game-object.js';
import GroundTile from './tiles/ground-tile.js';

export default class TeslaNode extends GameObject {
  static sprite: Sprite;
  static imgDisabled: p5.Image;

  static preload(): void {
    Sprite.load('./assets/tesla-node.png', 13, 2, 50, result => { this.sprite = result; });
    loadImage('./assets/tesla-node-disabled.png', result => { this.imgDisabled = result; });
  }

  static updateSprites(): void {
    this.sprite.update();
  }

  groundTile: GroundTile = null;

  constructor(x: number, y: number, groundTile: GroundTile) {
    super(x, y);
    this.groundTile = groundTile;
  }

  get isActive(): boolean { return this.groundTile?.isPath; }

  draw(): void {
    const { sprite, imgDisabled } = TeslaNode;
    const { pos, size, groundTile } = this;

    if (groundTile !== null) {
      if (groundTile.isPath) {
        sprite.draw(pos.x, pos.y, size.x, size.y);
      } else {
        image(imgDisabled, pos.x, pos.y, size.x, size.y);
      }
    }
  }
}
