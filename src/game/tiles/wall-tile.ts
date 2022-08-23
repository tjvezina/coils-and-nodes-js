import Tile from './tile.js';

export default class WallTile extends Tile {
  static img: p5.Image;

  static preload(): void {
    loadImage('./assets/tile-wall.png', result => { this.img = result; });
  }

  draw(): void {
    image(WallTile.img, this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
}
