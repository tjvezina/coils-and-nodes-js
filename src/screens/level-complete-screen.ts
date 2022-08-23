import Screen from '../framework/screen.js';
import ScreenManager from '../framework/screen-manager.js';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../sketch.js';

export default class LevelCompleteScreen extends Screen {
  constructor() {
    super();
    this.fadeInTime = 0.5;
    this.fadeOutTime = 0.5;
    this.isPopup = true;
  }

  keyPressed(): void {
    if (this.isActive && keyCode === ENTER) {
      ScreenManager.removeScreen(this);
    }
  }

  draw(): void {
    super.drawFadeOverlay((1 - this.fadePosition) / 2);

    push();
    {
      textSize(textSize() * 3);
      fill(0, 127, 255, 255 * (1 - this.fadePosition)).noStroke();
      text('Level Complete!', VIEW_WIDTH/2 - 350, VIEW_HEIGHT/2 - 64);
    }
    pop();
    push();
    {
      fill(0, 127, 255, 255 * (1 - this.fadePosition)).noStroke();
      text('Press [ENTER] to continue...', VIEW_WIDTH/2 - 200, VIEW_HEIGHT/2 + 96);
    }
    pop();
  }
}
