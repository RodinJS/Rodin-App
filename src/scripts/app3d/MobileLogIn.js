import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';

let instance = null;

export class MobileLogIn extends Popup {
    constructor() {
        super();

        this.popupSculpt.position.z = -1.5;
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
            color: 0x333333,
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

        let index = 3;
        this.countDownTxt = new RODIN.Text({
            text: index,
            color: 0x000000,
            fontSize: 0.09,
            side: THREE.DoubleSide
        });
        this.countDownTxt.position.set(0.25, -0.05, 0.006);
        this.popupSculpt.add(this.countDownTxt);

        this.on('open', () => {
            RODIN.messenger.post('popupopened', {popupName: 'mobilelogin'});
            this.countDown(index);
        });

        this.on('close', () => {
            RODIN.messenger.post('popupclosed', {popupName: 'mobilelogin'});
        });

        this.on('finish', () => {
            this.close();
        });
    }

    countDown(index) {
        let i = index;
        setTimeout(() => {
            this.countDownTxt.reDraw({
                text: i,
                color: 0x000000,
                fontSize: 0.09
            });
            if (i>0){
                this.countDown(--i);
            } else {
                this.emit('finish', new RODIN.RodinEvent(this));
            }
        }, 1000);
    }

    static getInstance() {
        if (!instance) {
            instance = new MobileLogIn();
        }

        return instance;
    }
}

