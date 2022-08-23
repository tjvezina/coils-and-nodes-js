import ScreenManager from './framework/screen-manager.js';
import Crate from './game/crate.js';
import TeslaCoil from './game/tesla-coil.js';
import TeslaNode from './game/tesla-node.js';
import GroundTile from './game/tiles/ground-tile.js';
import WallTile from './game/tiles/wall-tile.js';
import InstructionsScreen from './screens/instructions-screen.js';
import LoadingScreen from './screens/loading-screen.js';
import MainMenuScreen from './screens/main-menu-screen.js';

export const VIEW_WIDTH = 1024;
export const VIEW_HEIGHT = 768;
export let viewScale = 1;

let font: p5.Font;

export let imgBackground: p5.Image;

globalThis.preload = function (): void {
  loadFont('./assets/pericles-regular.ttf', result => { font = result; });

  loadImage('./assets/background.png', result => { imgBackground = result; });

  LoadingScreen.preload();
  MainMenuScreen.preload();
  InstructionsScreen.preload();
  WallTile.preload();
  GroundTile.preload();
  TeslaCoil.preload();
  TeslaNode.preload();
  Crate.preload();
};

globalThis.windowResized = function (): void {
  viewScale = (windowWidth/windowHeight < VIEW_WIDTH/VIEW_HEIGHT ? windowWidth/VIEW_WIDTH : windowHeight/VIEW_HEIGHT);
  resizeCanvas(VIEW_WIDTH * viewScale, VIEW_HEIGHT * viewScale);
};

globalThis.setup = function (): void {
  viewScale = (windowWidth/windowHeight < VIEW_WIDTH/VIEW_HEIGHT ? windowWidth/VIEW_WIDTH : windowHeight/VIEW_HEIGHT);
  createCanvas(VIEW_WIDTH * viewScale, VIEW_HEIGHT * viewScale);
  pixelDensity(1);

  textSize(28.5);
  textAlign(LEFT, TOP);
  textFont(font);

  ScreenManager.addScreen(new MainMenuScreen());
};

globalThis.draw = function (): void {
  background(0);
  scale(viewScale);

  GroundTile.updateSprites();
  TeslaCoil.updateSprites();
  TeslaNode.updateSprites();

  ScreenManager.update(document.hasFocus());
  ScreenManager.draw();
};
