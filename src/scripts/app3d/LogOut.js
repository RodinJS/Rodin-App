import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';

let instance = null;

export class LogOut extends Popup {
    constructor() {
        super();

        this.rotation.y = -Math.PI/3;
        this.popupSculpt.position.z = -1.7;

        const logOutPopup = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_demos.obj');
        logOutPopup.on(RODIN.CONST.READY, () => {
            logOutPopup._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xcccccc
            });
            logOutPopup.scale.set(2, 2, 2);
            this.popupSculpt.add(logOutPopup);
        });

        logOutPopup.on(RODIN.CONST.GAMEPAD_BUTTON_UP, (evt) => {
            // evt.stopPropagation();
        });

        const logOutPopupText = new RODIN.Text({
            text: 'Are you sure you want to log out?',
            color: 0x333333,
            fontSize: 0.05
        });
        logOutPopupText.position.set(0, 0.05, 0.006);
        this.popupSculpt.add(logOutPopupText);

        const cancelBtn = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        cancelBtn.on(RODIN.CONST.READY, () => {
            cancelBtn._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x8d8d8d
            });
            cancelBtn.scale.set(0.5, 0.5, 0.5);
            cancelBtn.position.set(0.24, -0.19, 0.006);
            this.popupSculpt.add(cancelBtn);

            const cancelTxt = new RODIN.Text({
                text: 'Cancel',
                color: 0xFFFFFF,
                fontSize: 0.065
            });
            cancelTxt.position.set(0, 0, 0.006);
            cancelBtn.add(cancelTxt);
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            cancelBtn._threeObject.children[0].material.color = new THREE.Color(0xa1a1a1);
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            cancelBtn._threeObject.children[0].material.color = new THREE.Color(0x8d8d8d);
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.close();
        });

        const logOutBtn = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        logOutBtn.on(RODIN.CONST.READY, () => {
            logOutBtn._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x2668ef
            });
            logOutBtn.scale.set(0.5, 0.5, 0.5);
            logOutBtn.position.set(-0.24, -0.19, 0.006);
            this.popupSculpt.add(logOutBtn);

            const logOutTxt = new RODIN.Text({
                text: 'Log out',
                color: 0xFFFFFF,
                fontSize: 0.065
            });
            logOutTxt.position.set(0, 0, 0.006);
            logOutBtn.add(logOutTxt);
        });
        logOutBtn.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            logOutBtn._threeObject.children[0].material.color = new THREE.Color(0x3d7dff);
        });
        logOutBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            logOutBtn._threeObject.children[0].material.color = new THREE.Color(0x2668ef);
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

