import { VIEW_HEIGHT, VIEW_WIDTH } from '../sketch.js';
import InputManager from './input-manager.js';
import ScreenManager from './screen-manager.js';
export var ScreenState;
(function (ScreenState) {
    ScreenState[ScreenState["Active"] = 0] = "Active";
    ScreenState[ScreenState["FadeIn"] = 1] = "FadeIn";
    ScreenState[ScreenState["FadeOut"] = 2] = "FadeOut";
    ScreenState[ScreenState["Hidden"] = 3] = "Hidden";
})(ScreenState || (ScreenState = {}));
export default class Screen {
    constructor() {
        this.fadeInTime = 0;
        this.fadeOutTime = 0;
        this.fadePosition = 1;
        this.isPopup = false;
        this.isExiting = false;
        this.isActive = true;
        this.state = ScreenState.FadeIn;
        InputManager.addListener(this);
    }
    dispose() {
        InputManager.removeListener(this);
    }
    update(isActive, isCovered) {
        this.isActive = isActive;
        if (this.isExiting) {
            this.state = ScreenState.FadeOut;
            if (!this.updateFade(this.fadeOutTime, 1)) {
                ScreenManager.removeScreen(this);
            }
        }
        else if (isCovered) {
            if (this.updateFade(this.fadeOutTime, 1)) {
                this.state = ScreenState.FadeOut;
            }
            else {
                this.state = ScreenState.Hidden;
            }
        }
        else {
            if (this.updateFade(this.fadeInTime, -1)) {
                this.state = ScreenState.FadeIn;
            }
            else {
                this.state = ScreenState.Active;
            }
        }
    }
    updateFade(fadeTime, direction) {
        const fadeDelta = (fadeTime === 0 ? 1 : (deltaTime / 1000) / fadeTime);
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
    draw() {
        if ([ScreenState.FadeIn, ScreenState.FadeOut].includes(this.state)) {
            this.drawFadeOverlay(this.fadePosition);
        }
    }
    drawFadeOverlay(alpha) {
        fill(0, 255 * alpha).noStroke();
        rect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    }
    exit() {
        if (this.fadeOutTime === 0) {
            ScreenManager.removeScreen(this);
        }
        else {
            this.isExiting = true;
        }
    }
}
//# sourceMappingURL=screen.js.map