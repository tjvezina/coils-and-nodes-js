import Screen, { ScreenState } from '../framework/screen.js';
import ScreenManager from '../framework/screen-manager.js';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../sketch.js';

export default class LoadingScreen extends Screen {
  static imgLoading: p5.Image;

  static preload(): void {
    loadImage('./assets/loading.png', result => { this.imgLoading = result; });
  }

  static load(screenToLoad: Screen, showGraphics = false): void {
    ScreenManager.screens.forEach(screen => screen.exit());
    ScreenManager.addScreen(new LoadingScreen(screenToLoad, showGraphics));
  }

  showGraphics: boolean;

  screenToLoad: Screen;

  private constructor(screenToLoad: Screen, showGraphics = false) {
    super();
    this.screenToLoad = screenToLoad;
    this.showGraphics = showGraphics;
  }

  update(isActive: boolean, isCovered: boolean): void {
    super.update(isActive, isCovered);

    if (this.state === ScreenState.Active && ScreenManager.screens.length === 1) {
      ScreenManager.removeScreen(this);
      ScreenManager.addScreen(this.screenToLoad);
    }
  }

  draw(): void {
    super.draw();

    if (this.showGraphics) {
      push();
      {
        imageMode(CENTER);
        image(LoadingScreen.imgLoading, VIEW_WIDTH/2, VIEW_HEIGHT/2);
      }
      pop();
    }
  }
}
