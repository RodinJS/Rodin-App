import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';

let instance = null;

export class Exit extends Popup {
    constructor() {
        super();

        //this.rotation.y = -Math.PI/3;
        this.popupSculpt.position.z = -1.7;

        const exitPopup = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_demos.obj');
        exitPopup.on(RODIN.CONST.READY, () => {
            exitPopup._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xcccccc
            });
            exitPopup.scale.set(2, 2, 2);
            this.popupSculpt.add(exitPopup);
        });

        const exitPopupText = new RODIN.Text({
            text: 'Are you sure you want to exit?',
            color: 0x333333,
            fontSize: 0.05
        });
        exitPopupText.position.set(0, 0.05, 0.006);
        this.popupSculpt.add(exitPopupText);

        const cancelBtn = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        cancelBtn.on(RODIN.CONST.READY, () => {
            cancelBtn._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x2668ef
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
            cancelBtn._threeObject.children[0].material.color = new THREE.Color(0x3d7dff);
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            cancelBtn._threeObject.children[0].material.color = new THREE.Color(0x2668ef);
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.close();
        });

        const exitBtn = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        exitBtn.on(RODIN.CONST.READY, () => {
            exitBtn._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x8d8d8d
            });
            exitBtn.scale.set(0.5, 0.5, 0.5);
            exitBtn.position.set(-0.24, -0.19, 0.006);
            this.popupSculpt.add(exitBtn);

            const exitTxt = new RODIN.Text({
                text: 'Exit',
                color: 0xFFFFFF,
                fontSize: 0.065
            });
            exitTxt.position.set(0, 0, 0.006);
            exitBtn.add(exitTxt);
        });
        exitBtn.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            exitBtn._threeObject.children[0].material.color = new THREE.Color(0xa1a1a1);
        });
        exitBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            exitBtn._threeObject.children[0].material.color = new THREE.Color(0x8d8d8d);
        });
        exitBtn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.emit('submit', new RODIN.RodinEvent(this));
            this.close();
        });
        
        this.on('open', () => {
            RODIN.messenger.post('popupopened', {popupName: 'exit'});
        });

        this.on('close', () => {
            // todo: dispose it
            this.parent.remove(this);
            RODIN.messenger.post('popupclosed', {popupName: 'exit'});
        });
    }
    static getInstance() {
        if (!instance) {
            instance = new Exit();
        }

        return instance;
    }
}

