import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';
import {DemoThumbs} from './DemoThumbs.js';
import {FeaturedProjectsThumbs} from './FeaturedProjectsThumbs.js';
import {UserProjectsThumbs} from './UserProjectsThumbs.js';

export class Exit extends Popup {
    constructor(data) {
        super();

        const exitPopup = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_demos.obj');
        exitPopup.on(RODIN.CONST.READY, () => {
            exitPopup._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xcccccc
            });
            exitPopup.scale.set(2.5, 2.5, 2.5);
            this.add(exitPopup);
        });
        const exitPopupText = new RODIN.Text({
            text: 'Are you sure you want to exit?',
            color: 0x333333,
            fontSize: 0.07
        });
        exitPopupText.position.set(0, 0.1, 0.006);
        this.add(exitPopupText);

        const cancelBtn = new RODIN.Sculpt('/images/app3d/models/control_panel/log_in.obj');
        cancelBtn.on(RODIN.CONST.READY, () => {
            cancelBtn._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0x2668ef
            });
            cancelBtn.scale.set(0.5, 0.5, 0.5);
            cancelBtn.position.set(0.3, -0.2, 0.006);
            this.add(cancelBtn);

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
                color: 0xb2b2b2
            });
            exitBtn.scale.set(0.5, 0.5, 0.5);
            exitBtn.position.set(-0.3, -0.2, 0.006);
            this.add(exitBtn);

            const exitTxt = new RODIN.Text({
                text: 'Exit',
                color: 0xFFFFFF,
                fontSize: 0.065
            });
            exitTxt.position.set(0, 0, 0.006);
            exitBtn.add(exitTxt);
        });
        exitBtn.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            exitBtn._threeObject.children[0].material.color = new THREE.Color(0xbfbfbf);
        });
        exitBtn.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            exitBtn._threeObject.children[0].material.color = new THREE.Color(0xb2b2b2);
        });
        exitBtn.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.close();
        });
        
        this.on('open', () => {
            DemoThumbs.getInstance().visible = false;
            FeaturedProjectsThumbs.getInstance().visible = false;
            UserProjectsThumbs.getInstance().visible = false;
        });

        this.on('close', () => {
            DemoThumbs.getInstance().visible = true;
            FeaturedProjectsThumbs.getInstance().visible = true;
            UserProjectsThumbs.getInstance().visible = true;
            // todo: dispose it
            this.parent.remove(this);
        });
    }
}

