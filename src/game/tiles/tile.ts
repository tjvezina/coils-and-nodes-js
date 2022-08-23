import GameObject from '../game-object.js';

export default abstract class Tile extends GameObject {
  update?(): void;
  abstract draw(): void;
}
