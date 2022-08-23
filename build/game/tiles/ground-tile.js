import Sprite from '../../framework/sprite.js';
import Tile from './tile.js';
export default class GroundTile extends Tile {
    constructor() {
        super(...arguments);
        this.isPath = false;
        this.isStraight = false;
        this.rotation = 0;
    }
    static preload() {
        Sprite.load('./assets/lightning-straight.png', 3, 1, 10, result => { this.lightningStraight = result; });
        Sprite.load('./assets/lightning-corner.png', 3, 1, 10, result => { this.lightningCorner = result; });
    }
    static updateSprites() {
        this.lightningStraight.update();
        this.lightningCorner.update();
    }
    draw() {
        const { pos, size, rotation, isPath, isStraight } = this;
        if (isPath) {
            if (isStraight) {
                GroundTile.lightningStraight.draw(pos.x, pos.y, size.x, size.y, rotation);
            }
            else {
                GroundTile.lightningCorner.draw(pos.x, pos.y, size.x, size.y, rotation);
            }
        }
    }
}
//# sourceMappingURL=ground-tile.js.map