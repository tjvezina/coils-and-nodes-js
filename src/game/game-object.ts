import type Tile from './tiles/tile.js';

export const TILE_SIZE = 64;

export default abstract class GameObject {
  pos: p5.Vector;
  size = createVector(TILE_SIZE, TILE_SIZE);

  constructor(x: number, y: number) {
    this.pos = createVector(x, y);
  }

  get coord(): { x: number, y: number} {
    return { x: round(this.pos.x / TILE_SIZE), y: round(this.pos.y / TILE_SIZE) };
  }

  reset?(): void;

  isOnTile(tile: Tile): boolean {
    const { coord } = this;
    const tileCoord = tile.coord;
    return (coord.x === tileCoord.x && coord.y === tileCoord.y);
  }
}
