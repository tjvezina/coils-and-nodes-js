import Screen from '../framework/screen.js';
import { imgBackground, VIEW_HEIGHT, VIEW_WIDTH } from '../sketch.js';
import InstructionsScreen from './instructions-screen.js';
import LoadingScreen from './loading-screen.js';

export default class MainMenuScreen extends Screen {
  static imgTitle: p5.Image;

  static preload(): void {
    loadImage('./assets/menu-title.png', result => { this.imgTitle = result; });
  }

  keyPressed(): void {
    if (this.isActive && keyCode === ENTER) {
      LoadingScreen.load(new InstructionsScreen());
    }
  }

  draw(): void {
    const { imgTitle } = MainMenuScreen;

    push();
    {
      tint(255, 153, 76);
      image(imgBackground, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    }
    pop();

    const titleOffset = (-VIEW_HEIGHT/2) * this.fadePosition;

    push();
    {
      tint(255, 255 * (1 - this.fadePosition));
      image(imgTitle, (VIEW_WIDTH - imgTitle.width) / 2, (VIEW_HEIGHT - imgTitle.height) / 3 + titleOffset);
    }
    pop();

    fill(0, 127, 255, 255 * (1 - this.fadePosition)).noStroke();
    text('Press [ENTER] to continue...', VIEW_WIDTH/2 - 200, VIEW_HEIGHT/2 + 96 - titleOffset);

    super.draw();
  }
}
