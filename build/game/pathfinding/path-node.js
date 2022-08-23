export default class PathNode {
    constructor({ tile, gScore = 0, hScore = 0, parent = null }) {
        this.gScore = 0;
        this.hScore = 0;
        this.parent = null;
        this.tile = tile;
        this.gScore = gScore;
        this.hScore = hScore;
        this.parent = parent;
    }
    get fScore() { return this.gScore + this.hScore; }
}
//# sourceMappingURL=path-node.js.map