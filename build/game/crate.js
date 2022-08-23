import GameObject from './game-object.js';
const CRATE_SPEED = 960;
export default class Crate extends GameObject {
    constructor() {
        super(...arguments);
        this.isSelected = false;
        this.isMoving = false;
        this.targetNode = null;
    }
    static preload() {
        loadImage('./assets/tile-crate.png', result => { this.img = result; });
        loadImage('./assets/tile-selected.png', result => { this.imgSelected = result; });
    }
    setTargetNode(node) {
        this.targetNode = node;
        this.isMoving = (node !== null);
    }
    update() {
        if (this.targetNode === null)
            return;
        let targetReached = false;
        const targetX = this.targetNode.tile.pos.x;
        const targetY = this.targetNode.tile.pos.y;
        const offset = CRATE_SPEED * (deltaTime / 1000);
        if (this.pos.x < targetX) {
            this.pos.x += offset;
            targetReached = this.pos.x >= targetX;
        }
        else if (this.pos.x > targetX) {
            this.pos.x -= offset;
            targetReached = this.pos.x <= targetX;
        }
        else if (this.pos.y < targetY) {
            this.pos.y += offset;
            targetReached = this.pos.y >= targetY;
        }
        else if (this.pos.y > targetY) {
            this.pos.y -= offset;
            targetReached = this.pos.y <= targetY;
        }
        else {
            targetReached = true;
        }
        if (targetReached) {
            this.pos.set(targetX, targetY);
            this.targetNode = this.targetNode.parent;
            this.isMoving = (this.targetNode !== null);
        }
    }
    draw() {
        const { pos, size } = this;
        image(Crate.img, pos.x, pos.y, size.x, size.y);
        if (this.isSelected) {
            image(Crate.imgSelected, pos.x, pos.y, size.x, size.y);
        }
    }
}
//# sourceMappingURL=crate.js.map