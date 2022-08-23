import Sprite from '../framework/sprite.js';
import GameObject from './game-object.js';
export default class TeslaNode extends GameObject {
    constructor(x, y, groundTile) {
        super(x, y);
        this.groundTile = null;
        this.groundTile = groundTile;
    }
    static preload() {
        Sprite.load('./assets/tesla-node.png', 13, 2, 50, result => { this.sprite = result; });
        loadImage('./assets/tesla-node-disabled.png', result => { this.imgDisabled = result; });
    }
    static updateSprites() {
        this.sprite.update();
    }
    get isActive() { return this.groundTile?.isPath; }
    draw() {
        const { sprite, imgDisabled } = TeslaNode;
        const { pos, size, groundTile } = this;
        if (groundTile !== null) {
            if (groundTile.isPath) {
                sprite.draw(pos.x, pos.y, size.x, size.y);
            }
            else {
                image(imgDisabled, pos.x, pos.y, size.x, size.y);
            }
        }
    }
}
//# sourceMappingURL=tesla-node.js.map