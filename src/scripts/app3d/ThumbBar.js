import * as RODIN from 'rodin/core'
import {DescriptionThumb} from './DescriptionThumb.js';

export class ThumbBar extends RODIN.Sculpt {
    constructor(url, data = {}) {
        super();

        this.bar = new RODIN.Sculpt(url);
        this.bar.on(RODIN.CONST.READY, () => {
            this.bar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xFFFFFF,
                map: RODIN.Loader.loadTexture(data.thumbnail || '/images/app3d/models/control_panel/images/No_Thumb.png')
            });
            this.add(this.bar);
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
        this.bar.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.hoverThumdb.visible = true;
        });

        this.bar.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
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

        this.bar.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.buttonDownTimestamp = RODIN.Time.now;
            this.animation.start('scaleDown');
        });

        const scaleUp = new RODIN.AnimationClip("scaleUp", {
            scale: {
                x: 1,
                y: 1,
                z: 1,
            }
        });
        scaleUp.duration(100);
        this.animation.add(scaleUp);

        this.bar.on(RODIN.CONST.GAMEPAD_BUTTON_UP, () => {
            this.animation.start('scaleUp');
            if(RODIN.Time.now - this.buttonDownTimestamp > 300) return;
            this.showDescriptionThumb(data);
        });
    }

    showDescriptionThumb(data) {
        if(ThumbBar.current && ThumbBar.current.isOpened) return;

        const descriptionThumb = new DescriptionThumb(data);
        descriptionThumb.open();
        descriptionThumb.popupSculpt.position.z = -2;
        RODIN.Scene.add(descriptionThumb);
        ThumbBar.current = descriptionThumb;
    }

    static current = null;
}
