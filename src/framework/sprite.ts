export default class Sprite {
  static load(filePath: string, cols: number, rows: number, frameRate: number, callback: (sprite: Sprite) => void): void {
    loadImage(filePath, result => {
      callback(new Sprite(result, cols, rows, frameRate));
    });
  }

  spriteSheet: p5.Image;
  rows: number;
  cols: number;
  frameRate: number;

  frameTime = 0;

  constructor(spriteSheet: p5.Image, cols: number, rows: number, frameRate: number) {
    this.spriteSheet = spriteSheet;
    this.rows = rows;
    this.cols = cols;
    this.frameRate = frameRate;
  }

  update(): void {
    const loopTime = (this.rows * this.cols) / this.frameRate;
    this.frameTime = (this.frameTime + (deltaTime/1000)) % loopTime;
  }

  draw(x: number, y: number, width?: number, height?: number, rot = 0): void {
    const { spriteSheet, rows, cols, frameRate, frameTime } = this;

    const frameIndex = floor(frameTime * frameRate);
    const xFrame = frameIndex % cols;
    const yFrame = floor(frameIndex / cols);

    const sw = (spriteSheet.width / cols);
    const sh = (spriteSheet.height / rows);
    const sx = width * xFrame;
    const sy = height * yFrame;

    width = width ?? sw;
    height = height ?? sh;

    push();
    {
      translate(x + width/2, y + height/2);
      rotate(rot);
      imageMode(CENTER);
      image(spriteSheet, 0, 0, width, height, sx, sy, width, height);
    }
    pop();
  }
}
