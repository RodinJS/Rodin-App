import * as RODIN from 'rodin/core';

export class Popup extends RODIN.Sculpt {
    constructor() {
        super();

        this.visible = false;
    }

    open() {
        this.visible = true;
        this.emit('open', new RODIN.RodinEvent(this));
    }

    close() {
        this.visible = false;
        this.emit('close', new RODIN.RodinEvent(this));
    }
}