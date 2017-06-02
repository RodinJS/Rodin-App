import * as RODIN from 'rodin/core';

export class Popup extends RODIN.Sculpt {
    constructor() {
        super();

        this._isOpened = false;
        this.popupSculpt = new RODIN.Sculpt();
        this.popupSculpt.position.y = 1.6;

        this.closeCallback = () => {
            this.close();
        }
    }

    open() {
        this._isOpened = true;
        this.add(this.popupSculpt);
        this.emit('open', new RODIN.RodinEvent(this));
        // RODIN.Scene.active.on(RODIN.CONST.GAMEPAD_BUTTON_UP, this.closeCallback);
    }

    close() {
        this._isOpened = false;
        this.remove(this.popupSculpt);
        this.emit('close', new RODIN.RodinEvent(this));
        // RODIN.Scene.active.removeEventListener(RODIN.CONST.GAMEPAD_BUTTON_UP, this.closeCallback);
    }

    get isOpened() {
        return this._isOpened;
    }
}