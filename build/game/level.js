import InputManager from '../framework/input-manager.js';
import Crate from './crate.js';
import { TILE_SIZE } from './game-object.js';
import PathNode from './pathfinding/path-node.js';
import TeslaCoil from './tesla-coil.js';
import TeslaNode from './tesla-node.js';
import GroundTile from './tiles/ground-tile.js';
import WallTile from './tiles/wall-tile.js';
const GRID_COLS = 16;
const GRID_ROWS = 12;
export var TileType;
(function (TileType) {
    TileType["Wall"] = "#";
    TileType["Floor"] = " ";
    TileType["Crate"] = "X";
    TileType["StartCoil"] = "S";
    TileType["Coil"] = "@";
    TileType["Node"] = "O";
})(TileType || (TileType = {}));
export default class Level {
    constructor(levelMap) {
        this.levelMap = null;
        this.tiles = [];
        this.coils = [];
        this.nodes = [];
        this.crates = [];
        this.reset(levelMap);
    }
    reset(levelMap) {
        console.log('reset');
        this.levelMap = levelMap;
        this.tiles.length = 0;
        this.coils.length = 0;
        this.nodes.length = 0;
        this.crates.length = 0;
        this.selectedCrateIndex = -1;
        this.movingCrateIndex = -1;
        this.crateIsMoving = false;
        this.isComplete = false;
        let tileIndex = 0;
        let posX = 0;
        let posY = 0;
        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                const type = levelMap[tileIndex];
                const tile = (type === TileType.Wall ? new WallTile(posX, posY) : new GroundTile(posX, posY));
                this.tiles.push(tile);
                switch (type) {
                    case TileType.Crate: {
                        this.crates.push(new Crate(posX, posY));
                        break;
                    }
                    case TileType.StartCoil:
                    case TileType.Coil: {
                        const coil = new TeslaCoil(this);
                        coil.currentTile = tile;
                        if (type === TileType.StartCoil) {
                            this.coils.unshift(coil);
                        }
                        else {
                            this.coils.push(coil);
                        }
                        break;
                    }
                    case TileType.Node: {
                        this.nodes.push(new TeslaNode(posX, posY, tile));
                        break;
                    }
                }
                ++tileIndex;
                posX += TILE_SIZE;
            }
            posY += TILE_SIZE;
            posX = 0;
        }
        this.updateCoilPaths();
    }
    update() {
        this.tiles.forEach(tile => tile?.update?.());
        this.crates.forEach(crate => crate.update());
        if (this.crateIsMoving) {
            if (!this.crates[this.movingCrateIndex].isMoving) {
                this.crateIsMoving = false;
                this.movingCrateIndex = -1;
                this.updateCoilPaths();
            }
        }
    }
    updateCoilPaths() {
        if (this.coils.length < 2)
            return;
        this.tiles.filter(tile => tile instanceof GroundTile).forEach(tile => { tile.isPath = false; });
        this.coils.forEach(coil => { coil.isActive = false; });
        const remainingCoils = this.coils.slice(1);
        let coil = this.coils[0];
        coil.isActive = true;
        while (remainingCoils.length > 0) {
            const pathLengths = [];
            for (let x = 0; x < remainingCoils.length; x++) {
                const startTile = this.getTile(coil.pos);
                const endTile = this.getTile(remainingCoils[x].pos);
                let node = this.findPath(startTile, endTile, true);
                if (node !== null) {
                    let pathLength = 1;
                    while (node.parent !== null) {
                        ++pathLength;
                        node = node.parent;
                    }
                    pathLengths.push(pathLength);
                }
                else {
                    pathLengths.push(-1);
                }
            }
            let shortest = Infinity;
            let shortestIndex = -1;
            for (let x = 0; x < pathLengths.length; x++) {
                if (pathLengths[x] > 0 && pathLengths[x] < shortest) {
                    shortest = pathLengths[x];
                    shortestIndex = x;
                }
            }
            if (shortestIndex !== -1) {
                coil.setDestinationTile(remainingCoils[shortestIndex].tile);
                coil = remainingCoils[shortestIndex];
                coil.isActive = true;
                remainingCoils.splice(shortestIndex, 1);
            }
            else {
                break;
            }
        }
        this.isComplete = (this.coils.every(coil => coil.isActive) && this.nodes.every(node => node.isActive));
        console.log(`isComplete: ${this.isComplete}`);
    }
    updateSelectedCrateIndex(index) {
        if (this.selectedCrateIndex > 0) {
            this.crates[this.selectedCrateIndex].isSelected = false;
        }
        this.selectedCrateIndex = index;
        if (this.selectedCrateIndex > 0) {
            this.crates[this.selectedCrateIndex].isSelected = true;
        }
    }
    draw() {
        this.tiles.forEach(tile => tile?.draw());
        this.coils.forEach(coil => coil.draw());
        this.nodes.forEach(node => node.draw());
        this.crates.forEach(crate => crate.draw());
    }
    onMouseClicked() {
        const { x, y } = InputManager.mousePos;
        const tile = this.tiles[floor(x / TILE_SIZE) + floor(y / TILE_SIZE) * GRID_COLS];
        if (tile === null)
            return;
        if (this.selectedCrateIndex === -1) {
            for (let x = 0; x < this.crates.length; x++) {
                if (this.crates[x].isOnTile(tile)) {
                    this.updateSelectedCrateIndex(x);
                    return;
                }
            }
        }
        else {
            for (let x = 0; x < this.crates.length; x++) {
                if (this.crates[x].isOnTile(tile)) {
                    this.updateSelectedCrateIndex(x === this.selectedCrateIndex ? -1 : x);
                    return;
                }
            }
            if (!this.crateIsMoving && !this.isBlocked(tile, false)) {
                const crate = this.crates[this.selectedCrateIndex];
                const crateTile = this.tiles[crate.coord.x + crate.coord.y * GRID_COLS];
                crate.setTargetNode(this.findPath(crateTile, tile, false));
                this.movingCrateIndex = this.selectedCrateIndex;
                this.crateIsMoving = true;
            }
        }
    }
    findPath(startTile, endTile, usePaths) {
        let firstNode = null;
        let lastNode = null;
        const closedSet = [];
        const openSet = [];
        const finalPath = [];
        openSet.push(new PathNode({ tile: startTile, hScore: this.getHeuristic(startTile, endTile) }));
        let goalFound = false;
        do {
            let fLowest = openSet[0].fScore;
            let fLowestIndex = 0;
            for (let x = 1; x < openSet.length; x++) {
                if (openSet[x].fScore <= fLowest) {
                    fLowest = openSet[x].fScore;
                    fLowestIndex = x;
                }
            }
            const current = openSet[fLowestIndex];
            openSet.splice(fLowestIndex, 1);
            closedSet.push(current);
            const { x: coordX, y: coordY } = current.tile.coord;
            const neighborIndexList = [
                (coordX + 1) + coordY * GRID_COLS,
                coordX + (coordY + 1) * GRID_COLS,
                (coordX - 1) + coordY * GRID_COLS,
                coordX + (coordY - 1) * GRID_COLS,
            ];
            for (const neighborIndex of neighborIndexList) {
                const neighbor = this.tiles[neighborIndex];
                if (neighbor === undefined)
                    continue;
                if (neighbor === endTile) {
                    goalFound = true;
                    lastNode = current;
                    break;
                }
                if (closedSet.some(node => node.tile === neighbor) || this.isBlocked(neighbor, usePaths)) {
                    continue;
                }
                const gScore = current.gScore + 1;
                if (!openSet.some(node => node.tile === neighbor)) {
                    openSet.push(new PathNode({
                        tile: neighbor,
                        gScore,
                        hScore: this.getHeuristic(neighbor, endTile),
                        parent: current,
                    }));
                }
                else {
                    const node = openSet.find(node => node.tile === neighbor);
                    if (gScore < node.gScore) {
                        node.gScore = gScore;
                        node.parent = current;
                    }
                }
            }
        } while (openSet.length > 0 && !goalFound);
        if (goalFound) {
            finalPath.push(new PathNode({ tile: endTile }));
            let node = new PathNode({ tile: endTile, parent: lastNode });
            while (node.parent !== null && node.parent.parent !== null) {
                node = node.parent;
                finalPath.push(new PathNode({ tile: node.tile }));
            }
            finalPath[0].parent = null;
            for (let x = 1; x < finalPath.length; x++) {
                finalPath[x].parent = finalPath[x - 1];
            }
            firstNode = finalPath.slice(-1)[0];
        }
        else {
            firstNode = null;
        }
        return firstNode;
    }
    getHeuristic(a, b) {
        return round((abs(a.pos.x - b.pos.x) + abs(a.pos.y - b.pos.y)) / TILE_SIZE);
    }
    isBlocked(tile, pathsCanBlock) {
        return (tile instanceof WallTile) ||
            (pathsCanBlock && tile.isPath) ||
            (this.crates.some(crate => crate.isOnTile(tile))) ||
            (this.coils.some(coil => coil.isOnTile(tile))) ||
            (!pathsCanBlock && this.nodes.some(node => node.isOnTile(tile)));
    }
    getTile(pos) {
        const col = round(pos.x / TILE_SIZE);
        const row = round(pos.y / TILE_SIZE);
        return this.tiles[col + row * GRID_COLS];
    }
}
//# sourceMappingURL=level.js.map