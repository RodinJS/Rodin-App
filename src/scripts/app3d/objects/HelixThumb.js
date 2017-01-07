import {THREE} from 'https://cdn.rodin.io/v0.0.3/vendor/three/THREE.GLOBAL.js';
import * as RODIN from 'https://cdn.rodin.io/v0.0.3/rodinjs/RODIN.js';
import {SceneManager} from 'https://cdn.rodin.io/v0.0.3/rodinjs/scene/SceneManager.js';
import {MouseController} from 'https://cdn.rodin.io/v0.0.3/rodinjs/controllers/MouseController.js';
import {MouseGamePad} from 'https://cdn.rodin.io/v0.0.3/rodinjs/controllers/gamePads/MouseGamePad.js';
import {Element} from 'https://cdn.rodin.io/v0.0.3/rodinjs/sculpt/elements/Element.js';
import {Text} from 'https://cdn.rodin.io/v0.0.3/rodinjs/sculpt/elements/Text.js';
import {DynamicText} from 'https://cdn.rodin.io/v0.0.3/rodinjs/sculpt/elements/DynamicText.js';
import {THREEObject} from 'https://cdn.rodin.io/v0.0.3/rodinjs/sculpt/THREEObject.js';
import {ANIMATION_TYPES} from 'https://cdn.rodin.io/v0.0.3/rodinjs/constants/constants.js';
import {Animation} from 'https://cdn.rodin.io/v0.0.3/rodinjs/animation/Animation.js';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.3/rodinjs/constants/constants.js';

export class HelixThumb extends THREEObject {
    constructor(thumbParams) {
        super(new THREE.Object3D());
        this.root = thumbParams.root;
        this.owner = thumbParams.owner;
        let params = {
            width: 1.3,
            height: 0.867,
            image: {
                url: thumbParams.image,
                width: 1.3,
                height: 0.867,
                opacity: 1,
                position: {h: 50, v: 50}
            },
            border: {
                radius: 0.015
            }
        };

        this.thumb = new Element(params);
        this.thumb.on('ready', () => {
            this.object3D.add(this.thumb.object3D);
            this.thumb.raycastable = true;
            this.thumb.forceHover = true;
        });

        this.thumb.on('update', () => {
            let currentAlpha = this.currentAlpha || 0;
            currentAlpha = currentAlpha + (this.alpha - currentAlpha) * RODIN.Time.deltaTime() * 0.015;
            const alpha = Math.max(-1, Math.min(currentAlpha, 1));
            this.thumb.object3D.material.opacity = 1 - Math.abs(alpha);

            if (this.uv) {
                let currentUV = this.currentUV || {x: 0, y: 0};
                currentUV.x = currentUV.x + (this.uv.x - currentUV.x) * RODIN.Time.deltaTime() * 0.01;
                currentUV.y = currentUV.y + (this.uv.y - currentUV.y) * RODIN.Time.deltaTime() * 0.01;
                this.thumb.object3D.rotation.y = (currentUV.x - 0.5) / 12;
                this.thumb.object3D.rotation.x = (0.5 - currentUV.y) / 6;
                this.currentUV = currentUV;
            }
        });

        this.thumb.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
            this.uv = evt.uv;
        });

        this.thumb.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
            this.uv = {x: .5, y: .5}
        });

        this.thumb.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            this.helix.concentrate(this.index);
        });

        this.on('ready', () => {
            this.helix.object3D.add(this.object3D);
            this.uv = {x: .5, y: .5};
        });

        this.on('update', () => {
            if (!this.hasOwnProperty('alpha')) return;
            let currentAlpha = this.currentAlpha || 0;
            const delta = this.alpha - currentAlpha;
            if (Math.abs(delta) < 0.004 && !this.helix.frameOpened) {
                this.helix.openFrame();
            }
            let shift = delta * RODIN.Time.deltaTime() * 0.015;
            currentAlpha = currentAlpha + shift;
            const alpha = Math.max(-1, Math.min(currentAlpha, 1)); // This sheet is for en vor hetevi erku hat@ shat heranan
            const diff = Math.max(-0.3, Math.min(alpha, 0.3));
            this.object3D.position.x = 2.5 * alpha + diff;
            this.object3D.position.z = -1.3 * Math.abs(alpha);
            this.object3D.rotation.y = -Math.PI / 2 * alpha;
            this.object3D.rotation.x = 0;
            this.currentAlpha = currentAlpha;
        });

        this.name = new Text(
            {
                text: thumbParams.displayName || thumbParams.name,
                fontSize: 0.06,
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: 0x231f20,
                ppm: 1000
            }
        );

        this.description = new DynamicText(
            {
                width: 1.3,
                text: thumbParams.description || "",
                fontSize: 0.05,
                lineHeight: 0.08,
                fontFamily: 'Arial',
                fontStyle: 'normal',
                color: 0x231f20,
                ppm: 1000
            }
        );
    }
}