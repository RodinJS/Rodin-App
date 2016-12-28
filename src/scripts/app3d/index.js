import {THREE} from 'https://cdn.rodin.space/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from 'https://cdn.rodin.space/rodinjs/scene/SceneManager.js';
import {MouseGamePad} from 'https://cdn.rodin.space/rodinjs/controllers/gamePads/MouseGamePad.js';
import {Element} from 'https://cdn.rodin.space/rodinjs/sculpt/elements/Element.js';
import {THREEObject} from 'https://cdn.rodin.space/rodinjs/sculpt/THREEObject.js';
import {EVENT_NAMES} from 'https://cdn.rodin.space/rodinjs/constants/constants.js';
import * as controllers from './controllers.js';
import './objects/platform.js';
import './objects/lights.js';
import {Helix} from './objects/Helix.js';
import {HelixThumb} from './objects/HelixThumb.js';
import * as popups from './objects/Popup.js';
import * as icons from './objects/icons.js';
import {FadeInSphere} from './objects/FadeInSphere.js';

let API = null;

let scene = SceneManager.get();
scene.add(scene.camera);
scene.setCameraProperty('fov', 70);
scene.scene.background = new THREE.Color(0xc8c8c8);

const helix = new Helix();
helix.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.z = -2.5;
    evt.target.object3D.position.y = scene.controls.userHeight;
});

let myHelix = null;

let buttons = MouseGamePad.getInstance().buttons;
controllers.mouse.onValueChange = function (keyCode) {
    const value = buttons[keyCode - 1].value;
    const direction = value - buttons[keyCode - 1].prevValue > 0 ? 1 : -1;
    helix.concentrate(helix.center + direction);
    buttons[keyCode - 1].prevValue = value;
};

const fadeInSphere = new FadeInSphere();
fadeInSphere.on('ready', (evt) => {
    scene.camera.add(evt.target.object3D);
});

fadeInSphere.on(EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
    if(evt.animation === 'fadeIn') {
        // API.navigate('/project', {root: ''});
        console.log(evt.target.requester);
    }
});

function enterProject(helixThumb, API) {
    fadeInSphere.requester = helixThumb;
    fadeInSphere.fadeIn();
}

export class APP {
    constructor(params) {
        if (!scene._render)
            scene.start();
        this.API = params.API;
        API = params.API;
        SceneManager.changeContainerDomElement(params.domElement);

        this.getProjects();

        let projects = [
            "/images/app3d/img/thumb1.jpg",
            "/images/app3d/img/thumb2.jpg",
            "/images/app3d/img/thumb3.jpg",
            "/images/app3d/img/thumb4.jpg",
            "/images/app3d/img/thumb5.jpg",
            "/images/app3d/img/thumb6.jpg",
            "/images/app3d/img/thumb7.jpg",
            "/images/app3d/img/thumb8.jpg",
            "/images/app3d/img/thumb9.jpg",
            "/images/app3d/img/thumb10.jpg",
            "/images/app3d/img/thumb11.jpg",
            "/images/app3d/img/thumb12.jpg",
            "/images/app3d/img/thumb1.jpg",
            "/images/app3d/img/thumb2.jpg",
            "/images/app3d/img/thumb3.jpg",
            "/images/app3d/img/thumb4.jpg",
            "/images/app3d/img/thumb5.jpg",
            "/images/app3d/img/thumb6.jpg",
            "/images/app3d/img/thumb7.jpg",
            "/images/app3d/img/thumb8.jpg",
            "/images/app3d/img/thumb9.jpg",
        ];

        this.addProjects(projects.map(i => {
            return {image: i, name: i}
        }), helix);

        icons._personal.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
            if (!this.API.isLoggedIn()) {
                popups.notSignedIn.open();
            } else {
                if(!myHelix) {
                    myHelix = new Helix()
                }
            }
        });
    }

    addProjects(projects, helix) {
        projects = projects.map(i => new HelixThumb(i));

        for (let i = 0; i < projects.length; i++) {
            projects[i].thumb.on(EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
                if (helix.concentrated && helix.center == projects[i].index) {
                    enterProject(projects[i], this.API);
                }
            });

            helix.addThumb(projects[i]);
        }
    }

    getProjects(currentSize) {
        console.log('getting more');
        let filters = {
            skip: currentSize,
            limit: 20
        };

        this.API.getProjects('all', filters).then(
            data => {
                console.log('data', data);
            },
            err => {
                console.log(err);
            }
        )
    }

    static initWindow(_window) {
        Object.defineProperty(_window, "innerWidth", {
            get: function () {
                return this.offsetWidth;
            }
        });
        Object.defineProperty(_window, "innerHeight", {
            get: function () {
                return this.offsetHeight;
            }
        });

        return _window;
    }

    destroy() {
        scene.stop();
    }
}
