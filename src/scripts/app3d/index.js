import {THREE} from 'https://cdn.rodin.space/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from 'https://cdn.rodin.space/rodinjs/scene/SceneManager.js';
import {MouseGamePad} from 'https://cdn.rodin.space/rodinjs/controllers/gamePads/MouseGamePad.js';
import {Element} from 'https://cdn.rodin.space/rodinjs/sculpt/elements/Element.js';
import {THREEObject} from 'https://cdn.rodin.space/rodinjs/sculpt/THREEObject.js';
import {EVENT_NAMES} from 'https://cdn.rodin.space/rodinjs/constants/constants.js';
import {Animation} from 'https://cdn.rodin.space/rodinjs/animation/Animation.js';

import * as controllers from './controllers.js';
import * as platform from './objects/platform.js';
import './objects/lights.js';
import {Helix} from './objects/Helix.js';
import {HelixThumb} from './objects/HelixThumb.js';
import * as popups from './objects/Popup.js';
import * as icons from './objects/icons.js';
import {FadeInSphere} from './objects/FadeInSphere.js';

let started = false;

let API = null;

let scene = SceneManager.get();
scene.add(scene.camera);
scene.setCameraProperty('fov', 70);
scene.scene.background = new THREE.Color(0xd7e4ef);

/**
 * Fog
 */
scene.scene.fog = new THREE.Fog(0xdeecf2, 5, 55);

function loadMore(type) {
    return function () {
        const self = this;
        this.isLoading = true;
        let filters = {
            skip: this.thumbs.length,
            limit: 20
        };

        API.getProjects(type, filters).then(
            data => {
                if (data.length > 0) {
                    console.log(data);
                    const projects = data.map(i => {
                        i.image = i.thumbnail || '/images/app3d/img/thumb.jpg';
                        return new HelixThumb(i);
                    });

                    for (let i = 0; i < projects.length; i++) {
                        projects[i].thumb.on(EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
                            if (self.concentrated && helix.center == projects[i].index) {
                                enterProject(projects[i], API);
                            }
                        });
                    }

                    self.addThumbs(projects);
                }
                this.isLoading = false;
            },
            err => {
                console.log(err);
                this.isLoading = false;
            }
        )
    };
}

/**
 * Helix
 * @type {Helix}
 */
let helix = null;
let helixParent = null;
let helixCreated = false;

const helixAnimation = new Animation('helix', {
    rotation: {
        y: Math.PI / 2
    }
});
helixAnimation.duration(500);

function createHelix() {
    helixCreated = true;
    helixParent = new THREEObject(new THREE.Object3D());
    helixParent.animator.add(helixAnimation);

    helixParent.on(EVENT_NAMES.ANIMATION_COMPLETE, () => {
        helix.loadMore();
    });

    helixParent.on('ready', () => {
        scene.add(helixParent.object3D);
        helix = new Helix();
        helix.on('ready', (evt) => {
            helixParent.object3D.add(evt.target.object3D);
            evt.target.object3D.position.z = -2.5;
            evt.target.object3D.position.y = scene.controls.userHeight;
        });

        helix.loadMore = loadMore('all').bind(helix);
    });
}

/**
 * MyHelix
 * @type {null|Helix}
 */
let myHelix = null;
let myHelixCreated = false;

function createMyHelix() {
    if (myHelix) {
        return;
    }

    myHelix = new Helix();
    icons._personal.slider.open();
    icons._personal.lock();
    icons._personal.centerX();
    icons._public.slider.open();
    icons._public.lock();
    icons._public.centerX();
    myHelix.on('ready', (evt) => {
        scene.add(evt.target.object3D);
        evt.target.object3D.position.z = -2.5;
        evt.target.object3D.position.y = scene.controls.userHeight;
        scene.scene.remove(icons._public.object3D);
        helixParent.object3D.add(icons._public.object3D);
    });

    myHelix.loadMore = loadMore('my').bind(myHelix);
    helixParent.animator.start('helix');
    platform.aboutButtonParent.animator.start('rotate');
    helix.clear();
}

/**
 * Icons
 */
function goToNavigate() {
    popups.notSignedIn.close();
    API.navigate('/login');
    window.removeEventListener('resize', goToNavigate);
}

icons._personal.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
    if (!API.isLoggedIn()) {
        switch (window.device) {
            case 'mobile':
                popups.notSignedInMobile.open();
                window.addEventListener('resize', goToNavigate);
                return;

            case 'vr':
                popups.notSignedInVR.open();
                let timer = setTimeout(function () {
                    popups.notSignedIn.close();
                    API.navigate('/login');
                }, 5000);

                popups.notSignedInVR.on('close', () => {
                    clearTimeout(timer);
                });
                return;
        }

        API.navigate('/login');

    } else {
        createMyHelix();
    }
});

/**
 * Controller
 */
let buttons = MouseGamePad.getInstance().buttons;
controllers.mouse.onValueChange = function (keyCode) {
    let currentHelix = null;
    for(let i = 0; i < controllers.mouse.intersected.length; i ++) {
        currentHelix = controllers.mouse.intersected[i].object.parent.Sculpt.helix
    }

    if(!currentHelix) return;

    const value = buttons[keyCode - 1].value;
    const direction = value - buttons[keyCode - 1].prevValue > 0 ? 1 : -1;
    currentHelix.concentrate(currentHelix.center + direction);
    buttons[keyCode - 1].prevValue = value;
};

[controllers.vive.left, controllers.vive.right].map( controller => {
    controller.onTouchDown = function (keyCode, gamepad) {
        let currentHelix = null;
        for(let i = 0; i < controller.intersected.length; i ++) {
            currentHelix = controller.intersected[i].object.parent.Sculpt.helix
        }

        if(!currentHelix) return;

        gamepad.prevX = gamepad.prevX || gamepad.axes[0];
        const delta = gamepad.axes[0] - gamepad.prevX;
        if(Math.abs(delta) < .1) return;

        gamepad.prevX = gamepad.axes[0];
        const direction = delta > 0 ? -1 : 1;
        currentHelix.concentrate(currentHelix.center + direction);
    }
});


/**
 * fade in sphere
 * @type {FadeInSphere}
 */
const fadeInSphere = new FadeInSphere();

fadeInSphere.on(EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
    if (evt.animation === 'fadeIn') {
        API.navigate('/project', {root: evt.target.requester.root, owner: evt.target.requester.owner});
    }
    if (evt.animation === 'fadeOut') {
        scene.camera.remove(evt.target.object3D);
    }
});

fadeInSphere.on(EVENT_NAMES.ANIMATION_START, (evt) => {
    if (evt.animation === 'fadeIn') {
        scene.camera.add(evt.target.object3D);
    }
});

function enterProject(helixThumb, API) {
    fadeInSphere.requester = helixThumb;
    fadeInSphere.fadeIn();
}

function init() {
    fadeInSphere.animator.start('fadeOut');

    if (!helixCreated) {
        createHelix();
    }
}

/**
 * Class App for Angular
 */
export class APP {
    static start(params) {
        init();
        if (!started) {
            scene.enable();
            started = true;
        }

        if (!scene._render)
            scene.start();

        API = params.API;
        SceneManager.changeContainerDomElement(params.domElement);
    }

    static stop() {
        scene.stop();
    }
}

APP.stop();
