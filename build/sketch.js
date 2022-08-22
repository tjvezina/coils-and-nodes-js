export const VIEW_WIDTH = 1024;
export const VIEW_HEIGHT = 768;
export let viewScale = 1;
globalThis.windowResized = function () {
    viewScale = (windowWidth / windowHeight < VIEW_WIDTH / VIEW_HEIGHT ? windowWidth / VIEW_WIDTH : windowHeight / VIEW_HEIGHT);
    resizeCanvas(VIEW_WIDTH * viewScale, VIEW_HEIGHT * viewScale);
};
globalThis.setup = function () {
    viewScale = (windowWidth / windowHeight < VIEW_WIDTH / VIEW_HEIGHT ? windowWidth / VIEW_WIDTH : windowHeight / VIEW_HEIGHT);
    createCanvas(VIEW_WIDTH * viewScale, VIEW_HEIGHT * viewScale);
    pixelDensity(1);
};
globalThis.draw = function () {
    background(42);
};
//# sourceMappingURL=sketch.js.map