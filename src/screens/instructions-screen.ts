import Screen from '../framework/screen.js';
import { VIEW_HEIGHT, VIEW_WIDTH } from '../sketch.js';
import GameScreen from './game-screen.js';
import LoadingScreen from './loading-screen.js';

const INSTRUCTION_PAGE_COUNT = 4;

export default class InstructionsScreen extends Screen {
  static imgBackground: p5.Image;
  static imgPages: p5.Image[] = [];

  static preload(): void {
    loadImage('./assets/instructions-background.png', result => { this.imgBackground = result; });
    for (let i = 0; i < INSTRUCTION_PAGE_COUNT; i++) {
      const iPage = i;
      loadImage(`./assets/instructions-page${i+1}.png`, result => { this.imgPages[iPage] = result; });
    }
  }

  currentPage = 0;

  constructor() {
    super();
    this.fadeInTime = 1;
    this.fadeOutTime = 1;
  }

  keyPressed(): void {
    if (this.isActive && keyCode === ENTER) {
      ++this.currentPage;

      if (this.currentPage >= INSTRUCTION_PAGE_COUNT) {
        this.currentPage = INSTRUCTION_PAGE_COUNT - 1;
        LoadingScreen.load(new GameScreen(), true);
      }
    }
  }

  draw(): void {
    image(InstructionsScreen.imgBackground, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    image(InstructionsScreen.imgPages[this.currentPage], 0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    super.draw();
  }
}
