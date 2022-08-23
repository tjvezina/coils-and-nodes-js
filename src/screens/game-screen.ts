import Screen from '../framework/screen.js';
import ScreenManager from '../framework/screen-manager.js';
import Level from '../game/level.js';
import { LEVEL_MAPS } from '../level-maps.js';
import { imgBackground, VIEW_HEIGHT, VIEW_WIDTH } from '../sketch.js';
import GameOverScreen from './game-over-screen.js';
import LevelCompleteScreen from './level-complete-screen.js';

export default class GameScreen extends Screen {
  level: Level = null;
  levelNumber = 0;
  wasLevelCompleted = false;

  constructor() {
    super();
    this.fadeInTime = 2;
    this.level = new Level(LEVEL_MAPS[this.levelNumber]);
  }

  update(isActive: boolean, isCovered: boolean): void {
    if (isActive) {
      if (!this.wasLevelCompleted) {
        this.level?.update();

        if (this.level?.isComplete) {
          ++this.levelNumber;

          if (this.levelNumber < LEVEL_MAPS.length) {
            ScreenManager.addScreen(new LevelCompleteScreen());
            this.wasLevelCompleted = true;
          } else {
            ScreenManager.addScreen(new GameOverScreen());
          }
        }
      } else {
        this.level.reset(LEVEL_MAPS[this.levelNumber]);
        this.wasLevelCompleted = false;
      }
    }

    super.update(isActive, isCovered);
  }

  draw(): void {
    push();
    {
      tint(76, 153, 255);
      image(imgBackground, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    }
    pop();

    this.level?.draw();

    super.draw();
  }

  mouseClicked(): void {
    if (this.level?.isComplete === false) {
      this.level.onMouseClicked();
    }
  }
}
