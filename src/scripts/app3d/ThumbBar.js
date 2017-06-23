import * as RODIN from 'rodin/core'
import {DescriptionThumb} from './DescriptionThumb.js';
import {cropText} from './utils.js';


const scaleUp = new RODIN.AnimationClip("scaleUp", {
    scale: {
        x: '+0.05',
        y: '+0.05',
        z: '+0.05',
    }
});
scaleUp.duration(100);

const scaleDown = new RODIN.AnimationClip("scaleDown", {
    scale: {
        x: '-0.05',
        y: '-0.05',
        z: '-0.05',
    }
});
scaleDown.duration(100);

const thumbWidth = 0.6;
const thumbHeight = 0.35;

const placeHolder = RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Thumb.png');
placeHolder.wrapS = placeHolder.wrapT = THREE.ClampToEdgeWrapping;
placeHolder.repeat.set(1 / thumbWidth, 1 / thumbHeight);

export class ThumbBar extends RODIN.Sculpt {
    constructor(data = {}, isDummy = false) {
        super();

        if (isDummy) {
            /**
             * Bar
             */
            this.bar = new RODIN.Element({
                width: thumbWidth,
                height: thumbHeight,
                border: {
                    radius: 0.02
                },
                background: { color: 0xffffff },
                transparent: false,
            });

            this.bar.on(RODIN.CONST.READY, () => {
                this.bar._threeObject.material.map = placeHolder;
                this.add(this.bar);
                this.emit('thumbready', new RODIN.RodinEvent(this));
            });

            return;
        }

        let label = undefined;
        if(!data.thumbnail) {
            label = {
                text: cropText(data.displayName || data.name, 11),
                fontSize: 0.07,
                color: 0xc3c3c3,
                position: { v: 50, h: 50 },
            }
        }

        /**
         * Bar
         */
        this.bar = new RODIN.Element({
            width: thumbWidth,
            height: thumbHeight,
            border: {
                radius: 0.02
            },
            background: {image: {url: data.thumbnail || '/images/app3d/models/control_panel/images/Empty_Thumb.png'}},
            transparent: false,
            label: label
        });
        this.bar.on(RODIN.CONST.READY, () => {
            this.add(this.bar);
            this.emit('thumbready', new RODIN.RodinEvent(this));
        });

        /**
         * White Background
         */
        this.hoverThumdb = new RODIN.Element({
            width: thumbWidth + 0.02,
            height: thumbHeight + 0.02,
            border: {
                radius: 0.025
            },
            background: {
                color: 0xffffff
            },
            transparent: false
        });

        this.hoverThumdb.on(RODIN.CONST.READY, () => {
            this.hoverThumdb.position.z = -0.002;
            this.hoverThumdb.visible = false;
            this.add(this.hoverThumdb);
        });

        this.buttonDownTimestamp = NaN;

        this.animation.add(scaleDown);
        this.animation.add(scaleUp);

        /**
         * Hover and Click listeners
         */
        this.bar.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.hoverThumdb.visible = true;
        });

        this.bar.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.hoverThumdb.visible = false;
            if(!isNaN(this.buttonDownTimestamp)) {
                this.buttonDownTimestamp = NaN;
                this.animation.start('scaleUp');
            }
        });

        this.bar.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, () => {
            this.buttonDownTimestamp = RODIN.Time.now;
            this.animation.start('scaleDown');
        });

        this.bar.on(RODIN.CONST.GAMEPAD_BUTTON_UP, (evt) => {
            if(isNaN(this.buttonDownTimestamp)) return;

            this.animation.start('scaleUp');
            const clickDuration = evt.gamepad.isMouseGamepad ? 250 : 400;
            if (RODIN.Time.now - this.buttonDownTimestamp <= clickDuration)
                ThumbBar.showDescriptionThumb(data, this.bar._threeObject.material.map);
            this.buttonDownTimestamp = NaN;
        });
    }

    /**
     * Open description popup
     * @param data
     * @param iconMap
     */
    static showDescriptionThumb(data, iconMap) {
        if (ThumbBar.current && ThumbBar.current.isOpened) return;

        const descriptionThumb = DescriptionThumb.getInstance(data, iconMap);
        descriptionThumb.open();
        descriptionThumb.popupSculpt.position.z = -2;
        ThumbBar.current = descriptionThumb;
        descriptionThumb.once('close', () => {
            ThumbBar.current = null;
        });
    }

    static current = null;
}
