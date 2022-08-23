import { ScreenState } from './screen.js';
const screens = [];
const screensToUpdate = [];
const ScreenManager = {
    get screens() { return [...screens]; },
    addScreen(screen) {
        screens.push(screen);
    },
    removeScreen(screen) {
        if (screens.includes(screen)) {
            screens.splice(screens.indexOf(screen), 1);
            screen.dispose();
        }
        if (screensToUpdate.includes(screen)) {
            screensToUpdate.splice(screensToUpdate.indexOf(screen), 1);
        }
    },
    update(gameIsInFocus) {
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
    draw() {
        screens.forEach(screen => screen.draw());
    },
};
export default ScreenManager;
//# sourceMappingURL=screen-manager.js.map