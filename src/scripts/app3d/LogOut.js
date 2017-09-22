import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';

let instance = null;

export class LogOut extends Popup {
    constructor() {
        super();

        this.rotation.y = -Math.PI/3;
        this.popupSculpt.position.z = -1.7;

        /**
         * Popup background
         * @type {RODIN.Sculpt}
         */
        const bgThumb = new RODIN.Element({
            width: 1,
            height: 0.6,
            border: {
                radius: 0.02
            },
            background: {
                color: 0xcccccc,
            },
            label: {
                text: 'Are you sure you want to log out ?',
                color: 0x333333,
                fontSize: 0.05,
                position: { v: 40, h: 50 }
            }
        });
        this.popupSculpt.add(bgThumb);

        /**
         * Cancel button
         * @type {RODIN.Sculpt}
         */
        const cancelBtn = new RODIN.Element({
            width: 0.4,
            height: 0.08,
            border: {
                radius: 0.08
            },
            background: {
                color: 0x8d8d8d
            },
            label: {
                text: 'Cancel',
                color: 0xffffff,
                fontSize: 0.035,
                position: {v: 52, h: 50}
            },
            ppm: 2000
        });

        cancelBtn.on(RODIN.CONST.READY, () => {
            cancelBtn.position.set(0.24, -0.19, 0.006);
            this.popupSculpt.add(cancelBtn);
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            cancelBtn._threeObject.material.opacity = 0.8;
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            cancelBtn._threeObject.material.opacity = 1;
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.close();
        });

        /**
         * Logout button
         * @type {RODIN.Sculpt}
         */
        const logOutBtn = new RODIN.Element({
            width: 0.4,
            height: 0.08,
            border: {
                radius: 0.08
            },
            background: {
                color: 0x2668ef
            },
            label: {
                text: 'Log Out',
                color: 0xffffff,
                fontSize: 0.035,
                position: {v: 52, h: 50}
            },
            ppm: 2000
        });

        logOutBtn.on(RODIN.CONST.READY, () => {
            logOutBtn.position.set(-0.24, -0.19, 0.006);
            this.popupSculpt.add(logOutBtn);
        });
        logOutBtn.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            logOutBtn._threeObject.material.opacity = 0.8;
        });
        logOutBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            logOutBtn._threeObject.material.opacity = 1;
        });
        logOutBtn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.emit('submit', new RODIN.RodinEvent(this));
            this.close();
        });


        this.on('open', () => {
            RODIN.messenger.post('popupopened', {popupName: 'logout'});
        });

        this.on('close', () => {
            RODIN.messenger.post('popupclosed', {popupName: 'logout'});
        });
    }

    static getInstance() {
        if(!instance) {
            instance = new LogOut();
        }

        return instance;
    }
}

