import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';

let instance = null;

export class VRBackBtnInfo extends Popup {
    constructor() {
        super();

        this.popupSculpt.position.z = -1.2;

        const vrBackBtnInfoVive = new RODIN.Plane(1, 0.25, new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xFFFFFF,
                map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Vive_Back.png')
            })
        );

        const vrBackBtnInfoOculus = new RODIN.Plane(1, 0.25, new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xFFFFFF,
                map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Oculus_Back.png')
            })
        );

        const vrBackBtnInfoMobile = new RODIN.Plane(1, 0.25, new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xFFFFFF,
                map: RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Cardboard_Back.png')
            })
        );

        this.on('open', () => {
            this._openTimestamp = RODIN.Time.now;
            RODIN.messenger.post('popupopened', {popupName: 'vrbackbtninfo'});

            switch (true) {
                case RODIN.device.isVive:
                    this.popupSculpt.add(vrBackBtnInfoVive);
                    break;
                case RODIN.device.isOculus:
                    this.popupSculpt.add(vrBackBtnInfoOculus);
                    break;
                case RODIN.device.isMobile:
                    alert("mdav");
                    this.popupSculpt.add(vrBackBtnInfoMobile);
                    break;

            }
        });

        this.on('close', () => {
            RODIN.messenger.post('popupclosed', {popupName: 'vrbackbtninfo'});

            this.popupSculpt.remove(vrBackBtnInfoVive);
            this.popupSculpt.remove(vrBackBtnInfoOculus);
            this.popupSculpt.remove(vrBackBtnInfoMobile);
        });

        this.on(RODIN.CONST.UPDATE, () => {
            if(this.isOpened) {
                if(RODIN.Time.now - this._openTimestamp > 200) {
                    this.close();
                    this.emit('timerend');
                }
            }
        });
    }

    static getInstance() {
        if (!instance) {
            instance = new VRBackBtnInfo();
        }
        return instance;
    }
}