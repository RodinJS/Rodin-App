import {THREE} from 'https://cdn.rodin.space/vendor/three/THREE.GLOBAL.js';
import {TWEEN} from 'https://cdn.rodin.space/rodinjs/Tween.js';
import * as RODIN from 'https://cdn.rodin.space/rodinjs/RODIN.js';
import {Element} from 'https://cdn.rodin.space/rodinjs/sculpt/elements/Element.js';
import {EVENT_NAMES} from 'https://cdn.rodin.space/rodinjs/constants/constants.js';

export class Helix extends RODIN.THREEObject {
    constructor () {
        super(new THREE.Object3D());
        this.thumbs = [];
        this.center = 0;

        this.on('ready', () => {
            this.concentrate(0);

            this.frame = new Element({
                transparent: false,
                width: 1.38,
                height: 1.1,
                background: {
                    color: 0x00bcff
                },
                border: {
                    radius: 0.03
                },
            });

            this.frame.on('ready', () => {
                this.frame.object3D.position.z = -0.08;
                this.frame.object3D.position.y = -0.085;
                this.object3D.add(this.frame.object3D);

                this.frame.openButton = new Element({
                    width: .08,
                    height: .07,
                    image: {
                        url: '/images/app3d/img/arrow.png',
                        width: .08,
                        height: .02,
                        opacity: 1,
                        position: { h: 50, v: 50 }
                    }
                });

                this.frame.openButton.on('ready', (evt) => {
                    evt.target.raycastable = true;
                    evt.target.object3D.position.y = -.5;
                    evt.target.object3D.position.z = .02;
                    this.frame.object3D.add(evt.target.object3D);
                });
                this.frame.openButton.on(EVENT_NAMES.CONTROLLER_KEY, (evt) => {
                    evt.target.animate({
                        property: RODIN.CONSTANTS.ANIMATION_TYPES.ROTATION,
                        to: new THREE.Vector3(evt.target.object3D.rotation.x, evt.target.object3D.rotation.y, evt.target.object3D.rotation.z + Math.PI),
                        easing: TWEEN.Easing.Linear.None,
                        duration: 300,
                        delay: 0
                    });
                    let angleX = this.frame.description.object3D.rotation.x + (this.frame.description.object3D.rotation.x > 0 ? -Math.PI : Math.PI) ;
                    this.frame.description.animate({
                        property: RODIN.CONSTANTS.ANIMATION_TYPES.ROTATION,
                        to: new THREE.Vector3(angleX, this.frame.description.object3D.rotation.y, this.frame.description.object3D.rotation.z),
                        easing: TWEEN.Easing.Linear.None,
                        duration: 500,
                        delay: 0
                    });
                });

                this.frame.description = new RODIN.THREEObject(new THREE.Object3D());

                this.frame.description.on('ready', () => {
                    this.frame.description.text = null;
                    if(this.thumbs[this.center].description){
                        console.clear();
                        console.log(this.thumbs[this.center].description);
                    }
                    this.frame.description.frame = new Element({
                        transparent: false,
                        width: 1.38,
                        height: 0.8,
                        background: {
                            color: 0x00bcff
                        },
                        border: {
                            radius: 0.03
                        },
                    });

                    this.frame.description.frame.on('ready', () => {
                        this.frame.description.frame.object3D.position.y = - .4;
                        this.frame.description.object3D.rotation.x =  Math.PI * 0.9;
                        this.frame.description.object3D.position.y = - .5;
                        this.frame.object3D.add(this.frame.description.object3D);
                        this.frame.description.object3D.add(this.frame.description.frame.object3D);
                    });
                });

                this.frame.description.on('update', () => {
                    //this.frame.description.object3D.rotation.x += 0.05;
                });
            });

            this.frame.name = null;
        })
    }

    concentrate (center = 0) {
        this.closeFrame();
        if (center < 0 || center > this.thumbs.length - 1) return;
        this.center = center;
        let k = 4;
        for (let i = 0; i < this.thumbs.length; i++) {
            const thumb = this.thumbs[i];
            thumb.index = i;
            thumb.alpha = (i - center) / k;
        }
    }

    addThumb (thumb) {
        thumb.helix = this;
        this.thumbs.push(thumb);
        this.concentrate(this.center);
    }

    closeFrame () {
        if (!this.frame || !this.frame.description) return;
        if (this.frameOpened) {
            this.frame.object3D.remove(this.frame.name.object3D);
            this.frame.description.frame.object3D.remove(this.frame.description.text.object3D);
            this.frame.name = null;
            this.frame.description.text = null;
        }

        this.frameOpened = false;
        this.frame.object3D.visible = false;
    }

    openFrame () {
        if (!this.frame || !this.frame.description || !this.frame.description.frame) return;
        this.frameOpened = true;
        this.frame.object3D.visible = true;

        this.frame.name = this.thumbs[this.center].name;
        this.frame.name.object3D.position.z = .02;
        this.frame.name.object3D.position.y = -0.42;
        this.frame.object3D.add(this.frame.name.object3D);

        this.frame.description.text = this.thumbs[this.center].description;
        this.frame.description.text.object3D.position.z = .02;
        this.frame.description.text.object3D.position.y = this.frame.description.text.object3D.geometry.parameters.height/2-0.1;
        this.frame.description.frame.object3D.add(this.frame.description.text.object3D);
    }
}
