import * as RODIN from 'rodin/core'
import {DescriptionThumb} from './DescriptionThumb.js';

const cropText = (text, symbols) => {
    if(text.length > symbols)
        text = `${text.substr(0, symbols - 3)}...`;

    return text;
};

export class ThumbBar extends RODIN.Sculpt {
    constructor(url, data = {}) {
        super();

        if(!data.thumbnail && data.name) {
            const name = new RODIN.Text({text: cropText(data.name, 8), color: 0xc3c3c3, fontSize:  0.07});
            this.add(name);
            name.position.z = 0.01;
        }

        const map = RODIN.Loader.loadTexture(data.thumbnail || '/images/app3d/models/control_panel/images/Empty_Thumb.png', () => {
            if(this.bar.isReady) {
                this.emit('thumbready', new RODIN.RodinEvent(this));
            } else {
                this.bar.on(RODIN.CONST.READY, () => {
                    this.emit('thumbready', new RODIN.RodinEvent(this));
                })
            }
        });

        this.bar = new RODIN.Sculpt(url);
        this.bar.on(RODIN.CONST.READY, () => {
            this.bar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xFFFFFF,
                map
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

        const descriptionThumb = DescriptionThumb.getInstance(data);
        descriptionThumb.open();
        descriptionThumb.popupSculpt.position.z = -2;
        ThumbBar.current = descriptionThumb;
    }

    static current = null;
}
