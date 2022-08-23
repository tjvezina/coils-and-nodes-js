import Tile from './tile.js';
export default class WallTile extends Tile {
    static preload() {
        loadImage('./assets/tile-wall.png', result => { this.img = result; });
    }
    draw() {
        image(WallTile.img, this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
}
//# sourceMappingURL=wall-tile.js.map