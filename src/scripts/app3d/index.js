import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';
import {MouseGamePad} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/gamePads/MouseGamePad.js';
import {Element} from 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/elements/Element.js';
import {THREEObject} from 'https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject.js';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants.js';
import {Animation} from 'https://cdn.rodin.io/v0.0.1/rodinjs/animation/Animation.js';
import {ViveController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/ViveController.js';

import * as controllers from './controllers.js';
import * as platform from './objects/platform.js';
import './objects/lights.js';
import {Helix} from './objects/Helix.js';
import {HelixThumb} from './objects/HelixThumb.js';
import * as popups from './objects/Popup.js';
import * as icons from './objects/icons.js';
import {FadeInSphere} from './objects/FadeInSphere.js';

let started = false;
let requestedLogin = false;
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
                    const projects = data.map(i => {
                        i.image = i.thumbnail || '/images/app3d/img/thumb.jpg';
                        return new HelixThumb(i);
                    });

                    for (let i = 0; i < projects.length; i++) {
                        projects[i].thumb.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {

                            if (evt.controller.navigatorGamePadId === 'oculus') {
                                if (evt.keyCode === 6) {
                                    projects[i].helix.concentrate(projects[i].helix.center + 1);
                                }

                                if (evt.keyCode === 5) {
                                    projects[i].helix.concentrate(projects[i].helix.center - 1);
                                }

                                if (evt.keyCode !== 1) return;
                            }

                            // if (evt.controller instanceof ViveController) {
                            //     if(evt.keyCode === 2 || evt.keyCode === 1) {
                            //         alert(self.concentrated);
                            //         alert(projects[i].helix.center == projects[i].index);
                            //         if (self.concentrated && projects[i].helix.center == projects[i].index) {
                            //             alert('enterProject');
                            //             enterProject(projects[i], API);
                            //         }
                            //     }
                            //     return;
                            // }

                            if (self.concentrated && projects[i].helix.center == projects[i].index) {
                                enterProject(projects[i], API);
                            }
                        });

                        projects[i].thumb.on("ready", (evt) => {
                            window.dispatchEvent(new Event('resize'));
                        });
                    }

                    self.addThumbs(projects);
                }
                this.isLoading = false;
            },
            err => {
                // console.log(err);
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


let backButtonPressed = [false, false];

let changeDetected = false;
let lastBack = 0;

function checkBackButtonVive() {
    const gamePads = navigator.getGamepads();

    if (!gamePads[0] && !gamePads[1]) return requestAnimationFrame(checkBackButtonVive);

    let buttonId = 3;

    for (let i of [0, 1]) {

        if (!gamePads[i]) {
            continue;
        }

        if (backButtonPressed[i] !== gamePads[i].buttons[buttonId].pressed) {
            backButtonPressed[i] = gamePads[i].buttons[buttonId].pressed;

            if (backButtonPressed[i] && API && API.getCurrentPage() === 'project') {
                API.navigate('/');
            } else if (!backButtonPressed[i] && API && API.getCurrentPage() === 'home') {
                popups.exitConfirm.open(0.75);
            }
        }
    }

    requestAnimationFrame(checkBackButtonVive);
}

function checkBackButtonOculus() {
    const gamePads = navigator.getGamepads();
    let gamepad = null;
    for (let i = 0; i < gamePads.length; i++) {
        if (!gamePads[i]) continue;
        if (gamePads[i].id.match(new RegExp('oculus', 'gi'))) {
            gamepad = gamePads[i];
        }
    }

    if (!gamepad) {
        return requestAnimationFrame(checkBackButtonOculus);
    }

    if (backButtonPressed[0] !== gamepad.buttons[1].pressed) {
        backButtonPressed[0] = gamepad.buttons[1].pressed;

        if (backButtonPressed[0] && API && API.getCurrentPage() === 'project') {
            API.navigate('/');
        } else if (!backButtonPressed[0] && API && API.getCurrentPage() === 'home') {
            popups.exitConfirm.open(0.75);
        }
    }

    requestAnimationFrame(checkBackButtonOculus);
}

if (window.device === 'vr') {
    requestAnimationFrame(checkBackButtonVive);
}

if (window.device === 'oculus') {
    requestAnimationFrame(checkBackButtonOculus);
}


/**
 * Icons
 */
function goToNavigate() {
    popups.notSignedInMobile.close();
    requestedLogin = true;
    API.navigate('/login');
}

popups.notSignedInMobile.on("close", (evt) => {
    window.removeEventListener('resize', goToNavigate);
});

icons._personal.on(EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
    if (!API.isLoggedIn()) {
        switch (window.device) {
            case 'mobile':
                if (window.isVRMode) {
                    popups.notSignedInMobile.open();
                    function vrdisplaypresentchangehandler(e) {
                        if (e.display || (e.detail && e.detail.display)) {
                            const display = e.display || e.detail.display;
                            if (!display.isPresenting) {
                                window.removeEventListener('orientationchange', vrdisplaypresentchangehandler);
                                goToNavigate();
                            }
                        } else {
                            window.removeEventListener('orientationchange', vrdisplaypresentchangehandler);
                            goToNavigate();
                        }
                    }

                    function closeHandler() {
                        window.removeEventListener('orientationchange', vrdisplaypresentchangehandler);
                        popups.notSignedInMobile.removeEventListener('close', closeHandler)
                    }

                    window.addEventListener('orientationchange', vrdisplaypresentchangehandler);
                    popups.notSignedInMobile.on('close', closeHandler);
                } else {
                    goToNavigate();
                }
                return;

            case 'oculus':
            case 'vr':
                popups.notSignedInVR.open();
                let timer = setTimeout(function () {
                    popups.notSignedInVR.close();
                }, 5000);

                popups.notSignedInVR.on('close', () => {
                    clearTimeout(timer);
                });
        }
        requestedLogin = true;
        controllers.mouse.disable();
        API.openModal('login').then(() => {
            createMyHelix();
            controllers.mouse.enable();
        }).catch(() => {
            controllers.mouse.enable();
        });

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
    for (let i = 0; i < controllers.mouse.intersected.length; i++) {
        if (!controllers.mouse.intersected[i].object.parent.Sculpt) continue;
        currentHelix = controllers.mouse.intersected[i].object.parent.Sculpt.helix
    }

    if (!currentHelix) return;

    const value = buttons[keyCode - 1].value;
    const direction = value - buttons[keyCode - 1].prevValue > 0 ? 1 : -1;
    currentHelix.concentrate(currentHelix.center + direction);
    buttons[keyCode - 1].prevValue = value;
};

if (window.device === `vr`) {
    [controllers.vive.left, controllers.vive.right].map(controller => {
        controller.onTouchDown = function (keyCode, gamepad) {
            let currentHelix = null;
            for (let i = 0; i < controller.intersected.length; i++) {
                if (controller.intersected[i].object.parent.Sculpt && controller.intersected[i].object.parent.Sculpt.helix)
                    currentHelix = controller.intersected[i].object.parent.Sculpt.helix
            }

            if (!currentHelix) return;

            gamepad.prevX = gamepad.prevX || gamepad.axes[0];
            const delta = gamepad.axes[0] - gamepad.prevX;
            if (Math.abs(delta) < .1) return;

            gamepad.prevX = gamepad.axes[0];
            const direction = delta > 0 ? -1 : 1;
            currentHelix.concentrate(currentHelix.center + direction);
        }
    });
}

/**
 * fade in sphere
 * @type {FadeInSphere}
 */
const fadeInSphere = new FadeInSphere();

fadeInSphere.on(EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
    alert('animation end');
    if (evt.animation === 'fadeIn' && evt.target.requester) {
        window.mustEnterVRMode = (scene.webVRmanager.mode === 3);
        alert('entering project');
        API.navigate('/project', {root: evt.target.requester.root, owner: evt.target.requester.owner});
        delete evt.target.requester;
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
    alert('started');
    fadeInSphere.requester = helixThumb;
    fadeInSphere.fadeIn();
}

function init() {
    fadeInSphere.animator.start('fadeOut');

    if (!helixCreated) {
        createHelix();
    }
}


let checkCount = 0;
let tim;

function checkAndGoToVR() {
    clearTimeout(tim);
    if (checkCount++ > 500)
        return;

    if (scene.webVRmanager.hmd && !scene.webVRmanager.hmd.isPresenting) {
        scene.webVRmanager.enterVRMode_();
        return;
    }

    tim = setTimeout(checkAndGoToVR, 200);
}

/**
 * Class App for Angular
 */
export class APP {
    static init(params) {
        API = params.API;
    }

    static start(params) {
        init();
        if (!started) {
            scene.enable();
            started = true;
        }

        if (!scene._render)
            scene.start();


        if (requestedLogin && API.isLoggedIn()) {
            createMyHelix();
        }
        SceneManager.changeContainerDomElement(params.domElement);
        window.dispatchEvent(new Event('resize'));

        if (window.device == 'oculus' || window.device == 'vr') {
            checkCount = 0;
            checkAndGoToVR();
        }

        if (window.device == 'mobile' && window.mustEnterVRMode) {
            checkCount = 0;
            window.mustShowRotateInstructions = false;
            checkAndGoToVR();
        }
    }

    static stop() {
        scene.stop();

        if (scene.webVRmanager.hmd && scene.webVRmanager.hmd.isPresenting) {
            scene.webVRmanager.hmd.exitPresent();
        }
    }
}

APP.stop();

window.onbeforeunload = function (e) {
    APP.stop();
    let elm = document.getElementById("project_container");
    elm && elm.contentWindow && elm.contentWindow.postMessage("exitVR", '*');

    return;
};

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.addEventListener('keydown', (event) => {
    // f*
    if (event.keyCode >= 112 && event.keyCode <= 123) {
        event.preventDefault();
    }

    // ctrl + shift + i
    if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
        event.preventDefault();
    }

    // ctrl + shift + r
    if (event.ctrlKey && event.shiftKey && event.keyCode == 82) {
        event.preventDefault();
    }
});

document.addEventListener('wheel', (e) => {
    parent.postMessage({wheel: true}, "*");
});
