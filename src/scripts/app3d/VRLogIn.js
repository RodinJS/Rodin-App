import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';

let instance = null;

export class VRLogIn extends Popup {
    constructor() {
        super();

        this.popupSculpt.position.z = -1.7;
        this.rotation.y = -Math.PI / 3;

        const illustrationPopup = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_demos.obj');
        illustrationPopup.on(RODIN.CONST.READY, () => {
            illustrationPopup._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xcccccc
            });
            illustrationPopup.scale.set(2.9, 2.2, 2.2);
            this.popupSculpt.add(illustrationPopup);
        });

        const illustrationPopupText = new RODIN.Text({
            text: 'Take your headset off to log in',
            color: 0x000000,
            fontSize: 0.06,
            side: THREE.DoubleSide
        });
        illustrationPopupText.position.set(0.25, 0.1, 0.006);
        this.popupSculpt.add(illustrationPopupText);

        const illustrationPlane = new RODIN.Plane(0.4, new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Headset_illustration.png'),
            transparent: true
        }));
        illustrationPlane.position.set(-0.45, 0, 0.006);
        this.popupSculpt.add(illustrationPlane);

        const cancelBtn = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        cancelBtn.on(RODIN.CONST.READY, () => {
            cancelBtn._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x7f7f7f
            });
            cancelBtn.scale.set(0.5, 0.5, 0.5);
            cancelBtn.position.set(0.25, -0.1, 0.006);
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
            cancelBtn._threeObject.children[0].material.color = new THREE.Color(0x7f7f7f);
        });
        cancelBtn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.close();
        });
        this.open();

        this.on('open', () => {
            RODIN.messenger.post('popupopened', {popupName: 'vrlogin'});
        });

        this.on('close', () => {
            RODIN.messenger.post('popupclosed', {popupName: 'vrlogin'});
        });

        this.on('finish', () => {
            this.close();
        });
    }

    static getInstance() {
        if (!instance) {
            instance = new VRLogIn();
        }

        return instance;
    }
}

