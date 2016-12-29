import {Element} from "https://cdn.rodin.io/v0.0.2/rodinjs/sculpt/elements/Element.js";
import {SceneManager} from 'https://cdn.rodin.io/v0.0.2/rodinjs/scene/SceneManager.js';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.2/rodinjs/constants/constants.js';
import {Animation} from 'https://cdn.rodin.io/v0.0.2/rodinjs/animation/Animation.js';

import {HoverableElement} from './HoverableElement.js';

const scene = SceneManager.get();

export class OpeningIcon extends HoverableElement {
    constructor(params, hoverParams, sliderParams) {
        super(params, hoverParams);
        this.locked = false;

        this.side = arguments[3] || 'left';

        this.centerX = function () {
            let x;
            if (this.side === 'left') {
                x = sliderParams.width / 2 - sliderParams.height / 2;
            } else {
                x = -sliderParams.width / 2 + sliderParams.height / 2;
            }

            this.object3D.position.x = x;
        };

        this.on('ready', () => {
            this.slider = new Element(sliderParams);

            this.slider.on('ready', () => {
                this.slider.object3D.scale.x = 0.000001;
                this.slider.object3D.visible = false;
                this.slider.object3D.position.z = -0.01;
                this.object3D.add(this.slider.object3D);

                let x;
                if (this.side === 'left') {
                    x = -arguments[2].width / 2 + arguments[2].height / 2 - .02;
                } else {
                    x = arguments[2].width / 2 - arguments[2].height / 2 + .02;
                }

                const openAnimation = new Animation('open', {position: {x: x}, scale: {x: 1}});
                const closeAnimation = new Animation('close', {position: {x: 0}, scale: {x: 0.000001}});
                openAnimation.duration(150);
                closeAnimation.duration(150);
                this.slider.animator.add(openAnimation);
                this.slider.animator.add(closeAnimation);
            });

            this.slider.on(EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
                if (evt.animation == "close")
                    this.slider.object3D.visible = true;
            });

            this.slider.open = () => {
                this.slider.animator.stop('close', false);
                this.slider.object3D.visible = true;
                this.slider.animator.start('open');
            };

            this.slider.close = () => {
                this.slider.animator.stop('open', false);
                this.slider.animator.start('close');
            }
        });

        this.on(EVENT_NAMES.CONTROLLER_HOVER, () => {
            if (this.locked) return;
            this.slider && this.slider.open();
        });

        this.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, () => {
            if (this.locked) return;
            this.slider && this.slider.close();
        });
    }

    open() {
        this.opened = true;
    }

    close() {
        this.opened = false;
    }

    lock() {
        this.locked = true;
    }

    unlock() {
        this.locked = false;
    }
}

const iconSize = 0.18;

export const _public = new OpeningIcon(
    {
        width: iconSize,
        height: iconSize,
        image: {
            url: '/images/app3d/img/public_active.png',
            width: iconSize,
            height: iconSize,
            opacity: 1,
            position: {h: 50, v: 50}
        },
        border: {
            radius: iconSize / 2
        }
    },
    {
        width: iconSize,
        height: iconSize,
        image: {
            url: '/images/app3d/img/public_active.png',
            width: iconSize,
            height: iconSize,
            opacity: 1,
            position: {h: 50, v: 50}
        },
        border: {
            radius: iconSize / 2
        }
    },
    {
        width: .7,
        height: iconSize,
        background: {
            color: 0x00bcff
        },
        border: {
            radius: iconSize / 2
        },
        label: {
            text: "Public Projects        ",
            color: 0x231f20,
            position: {h: 50, v: 52},
            fontSize: 0.06
        },
        ppm: 1000
    },
    'left'
);

_public.on('ready', (evt) => {
    evt.target.object3D.position.z = -2.5;
    evt.target.object3D.position.y = scene.controls.userHeight + .65;
    evt.target.object3D.position.x = -.15;
    scene.add(evt.target.object3D);
});


export const _personal = new OpeningIcon(
    {
        width: iconSize,
        height: iconSize,
        image: {
            url: '/images/app3d/img/personal.png',
            width: iconSize,
            height: iconSize,
            opacity: 1,
            position: {h: 50, v: 50}
        },
        border: {
            radius: iconSize / 2
        }
    },
    {
        width: iconSize,
        height: iconSize,
        image: {
            url: '/images/app3d/img/personal_active.png',
            width: iconSize,
            height: iconSize,
            opacity: 1,
            position: {h: 50, v: 50}
        },
        border: {
            radius: iconSize / 2
        }
    },
    {
        width: .8,
        height: iconSize,
        background: {
            color: 0x00bcff
        },
        border: {
            radius: iconSize / 2
        },
        label: {
            text: "        Personal Projects",
            color: 0x231f20,
            position: {h: 50, v: 52},
            fontSize: 0.06
        },
        ppm: 1000
    },
    'right'
);

_personal.on('ready', (evt) => {
    evt.target.object3D.position.z = -2.5;
    evt.target.object3D.position.y = scene.controls.userHeight + .65;
    evt.target.object3D.position.x = .15;
    scene.add(evt.target.object3D);
});
