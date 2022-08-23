import Tile from '../tiles/tile.js';

export default class PathNode {
  tile: Tile;
  gScore = 0;
  hScore = 0;

  parent: PathNode = null;

  constructor(
    { tile, gScore = 0, hScore = 0, parent = null }:
    { tile: Tile, gScore?: number, hScore?: number, parent?: PathNode },
  ) {
    this.tile = tile;
    this.gScore = gScore;
    this.hScore = hScore;
    this.parent = parent;
  }

  get fScore(): number { return this.gScore + this.hScore; }
}
