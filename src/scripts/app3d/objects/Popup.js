import {Element} from "https://cdn.rodin.io/v0.0.2/rodinjs/sculpt/elements/Element.js";
import {SceneManager} from 'https://cdn.rodin.io/v0.0.2/rodinjs/scene/SceneManager.js';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.2/rodinjs/constants/constants.js';
import * as RODIN from 'https://cdn.rodin.io/v0.0.2/rodinjs/RODIN.js';
import {Event} from 'https://cdn.rodin.io/v0.0.2/rodinjs/Event.js';

import {HoverableElement} from './HoverableElement.js';

const scene = SceneManager.get();

export class Popup extends Element {
    constructor (url, width = 0.9, height = 0.6) {
        let params = {
            width: width,
            height: height,
            image: {
                url: url,
                width: width,
                height: height,
                opacity: 1,
                position: { h: 50, v: 50 }
            },
            border: {
                radius: 0.015
            }
        };

        super(params);

        const closeButtonParams = {
            width: 0.16,
            height: 0.16,
            image: {
                url: '/images/app3d/img/close.png',
                width: 0.16,
                height: 0.16,
                opacity: 1,
                position: { h: 50, v: 50 }
            },
            border: {
                radius: 0.08
            }
        };

        const closeButtonHoverParams = Object.clone(closeButtonParams);
        closeButtonHoverParams.image.url = '/images/app3d/img/close_active.png';

        this.on('ready', () => {
            this.close();

            this.closeButton = new HoverableElement(closeButtonParams, closeButtonHoverParams);
            this.closeButton.on('ready', () => {
                this.closeButton.raycastable = true;
                this.closeButton.object3D.position.z = 0.01;
                this.closeButton.object3D.position.y = height / 2;
                this.closeButton.object3D.position.x = width / 2;
                this.object3D.add(this.closeButton.object3D);
            });

            this.closeButton.on(EVENT_NAMES.CONTROLLER_HOVER, () => {
                this.closeButton.destinationZ = 0.03;
            });

            this.closeButton.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
                this.closeButton.destinationZ = 0.01;
            });

            this.closeButton.on(EVENT_NAMES.CONTROLLER_KEY, () => {
                this.close();
            });

            this.closeButton.on('update', () => {
                if(!this.closeButton.destinationZ) return;
                const delta = this.closeButton.destinationZ - this.closeButton.object3D.position.z;
                if(Math.abs(delta) < 0.001) {
                    delete this.closeButton.destinationZ;
                    return;
                }

                this.closeButton.object3D.position.z += delta / RODIN.Time.deltaTime();
            });
        })
    }

    close () {
        this.object3D.scale.set(0.00001, 0.00001, 0.00001);
        this.object3D.visible = false;
        this.emit('close', new Event(this));
    }

    open () {
        this.object3D.scale.set(1, 1, 1);
        this.object3D.visible = true;
        this.emit('open', new Event(this));
    }
}

export const notSignedInMobile = new Popup('/images/app3d/img/not_signed_in_mobile.png', 1.474, 1.002);
notSignedInMobile.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.z = -2;
    evt.target.object3D.position.y = scene.controls.userHeight;
});

export const notSignedInVR = new Popup('/images/app3d/img/not_signed_in_vr.png', 1.475, .585);
notSignedInVR.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.z = -2;
    evt.target.object3D.position.y = scene.controls.userHeight;
});

export const about = new Popup('/images/app3d/img/about.png', 1.474, 1.002);
about.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.z = 2;
    evt.target.object3D.rotation.y = Math.PI;
    evt.target.object3D.position.y = scene.controls.userHeight;
});
