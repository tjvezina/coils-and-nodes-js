export const TILE_SIZE = 64;
export default class GameObject {
    constructor(x, y) {
        this.size = createVector(TILE_SIZE, TILE_SIZE);
        this.pos = createVector(x, y);
    }
    get coord() {
        return { x: round(this.pos.x / TILE_SIZE), y: round(this.pos.y / TILE_SIZE) };
    }
    isOnTile(tile) {
        const { coord } = this;
        const tileCoord = tile.coord;
        return (coord.x === tileCoord.x && coord.y === tileCoord.y);
    }
}
//# sourceMappingURL=game-object.js.map