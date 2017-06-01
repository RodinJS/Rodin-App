import * as RODIN from 'rodin/core'
import {DescriptionThumb} from './DescriptionThumb.js';

export class ThumbBar extends RODIN.Sculpt {
    constructor(url, data = {}) {
        super(url);
        this.on(RODIN.CONST.READY, () => {
            this._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xFFFFFF,
                map: RODIN.Loader.loadTexture(data.thumbnail || '/images/app3d/models/control_panel/images/No_Thumb.png')
            });
        });

        this.buttonDownTimestamp = RODIN.Time.now;

        /**
         *
         */
        this.hoverThumdb = new RODIN.Sculpt(url);
        this.hoverThumdb.on(RODIN.CONST.READY, () => {
            this.hoverThumdb.position.z = -0.002;
            this.hoverThumdb.scale.set(1.05, 1.08, 1.08);
            this.hoverThumdb.visible = false;

            this.hoverThumdb._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xFFFFFF
            });
            if (this.isReady) {
                this.add(this.hoverThumdb)
            }
        });
        this.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.hoverThumdb.visible = true;
        });

        this.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.hoverThumdb.visible = false;
        });

        /**
         *
         */
        const scaleDown = new RODIN.AnimationClip("scaleDown", {
            scale: {
                x: 0.95,
                y: 0.95,
                z: 0.95,
            }
        });
        scaleDown.duration(100);
        this.animation.add(scaleDown);

        this.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.buttonDownTimestamp = RODIN.Time.now;
            this.animation.start('scaleDown');
        });

        this.on(RODIN.CONST.GAMEPAD_BUTTON_UP, () => {
            if(RODIN.Time.now - this.buttonDownTimestamp > 300) return;
            this.showDescriptionThumb(data);
        });
    }

    showDescriptionThumb(data) {
        const descriptionThumb = new DescriptionThumb(data);
        descriptionThumb.open();
        descriptionThumb.popupSculpt.position.z = -1.5;
        RODIN.Scene.add(descriptionThumb);
    }
}
