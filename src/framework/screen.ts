import { VIEW_HEIGHT, VIEW_WIDTH } from '../sketch.js';
import InputManager from './input-manager.js';
import ScreenManager from './screen-manager.js';

export enum ScreenState {
  Active,
  FadeIn,
  FadeOut,
  Hidden,
}

export default abstract class Screen {
  fadeInTime = 0;
  fadeOutTime = 0;
  fadePosition = 1;

  isPopup = false;
  isExiting = false;
  isActive = true;

  state = ScreenState.FadeIn;

  constructor() {
    InputManager.addListener(this);
  }

  dispose(): void {
    InputManager.removeListener(this);
  }

  update(isActive: boolean, isCovered: boolean): void {
    this.isActive = isActive;

    if (this.isExiting) {
      this.state = ScreenState.FadeOut;

      if (!this.updateFade(this.fadeOutTime, 1)) {
        ScreenManager.removeScreen(this);
      }
    } else if (isCovered) {
      if (this.updateFade(this.fadeOutTime, 1)) {
        this.state = ScreenState.FadeOut;
      } else {
        this.state = ScreenState.Hidden;
      }
    } else {
      if (this.updateFade(this.fadeInTime, -1)) {
        this.state = ScreenState.FadeIn;
      } else {
        this.state = ScreenState.Active;
      }
    }
  }

  updateFade(fadeTime: number, direction: number): boolean {
    const fadeDelta = (fadeTime === 0 ? 1 : (deltaTime/1000) / fadeTime);

    this.fadePosition += fadeDelta * direction;

    if (direction < 0 && this.fadePosition <= 0) {
      this.fadePosition = 0;
      return false;
    }
    if (direction > 0 && this.fadePosition >= 1) {
      this.fadePosition = 1;
      return false;
    }

    return true;
  }

  draw(): void {
    if ([ScreenState.FadeIn, ScreenState.FadeOut].includes(this.state)) {
      this.drawFadeOverlay(this.fadePosition);
    }
  }

  drawFadeOverlay(alpha: number): void {
    fill(0, 255*alpha).noStroke();
    rect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
  }

  exit(): void {
    if (this.fadeOutTime === 0) {
      ScreenManager.removeScreen(this);
    } else {
      this.isExiting = true;
    }
  }
}
