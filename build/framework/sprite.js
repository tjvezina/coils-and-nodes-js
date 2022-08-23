export default class Sprite {
    constructor(spriteSheet, cols, rows, frameRate) {
        this.frameTime = 0;
        this.spriteSheet = spriteSheet;
        this.rows = rows;
        this.cols = cols;
        this.frameRate = frameRate;
    }
    static load(filePath, cols, rows, frameRate, callback) {
        loadImage(filePath, result => {
            callback(new Sprite(result, cols, rows, frameRate));
        });
    }
    update() {
        const loopTime = (this.rows * this.cols) / this.frameRate;
        this.frameTime = (this.frameTime + (deltaTime / 1000)) % loopTime;
    }
    draw(x, y, width, height, rot = 0) {
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
            translate(x + width / 2, y + height / 2);
            rotate(rot);
            imageMode(CENTER);
            image(spriteSheet, 0, 0, width, height, sx, sy, width, height);
        }
        pop();
    }
}
//# sourceMappingURL=sprite.js.map