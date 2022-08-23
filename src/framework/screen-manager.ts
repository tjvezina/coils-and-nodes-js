import Screen, { ScreenState } from './screen.js';

const screens: Screen[] = [];
const screensToUpdate: Screen[] = [];

const ScreenManager = {
  get screens(): Screen[] { return [...screens]; },

  addScreen(screen: Screen): void {
    screens.push(screen);
  },

  removeScreen(screen: Screen): void {
    if (screens.includes(screen)) {
      screens.splice(screens.indexOf(screen), 1);
      screen.dispose();
    }
    if (screensToUpdate.includes(screen)) {
      screensToUpdate.splice(screensToUpdate.indexOf(screen), 1);
    }
  },

  update(gameIsInFocus: boolean): void {
    screensToUpdate.length = 0;
    screensToUpdate.push(...screens);

    let isActiveScreen = gameIsInFocus;
    let isCoveredByOtherScreen = false;

    while (screensToUpdate.length > 0) {
      const next = screensToUpdate.pop();

      next.update(isActiveScreen, isCoveredByOtherScreen);

      if (next.state === ScreenState.FadeIn || next.state === ScreenState.Active) {
        isActiveScreen = false;
        if (!next.isPopup) {
          isCoveredByOtherScreen = true;
        }
      }
    }
  },

  draw(): void {
    screens.forEach(screen => screen.draw());
  },
};

export default ScreenManager;
