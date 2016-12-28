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
scene.scene.background = new THREE.Color(0xd7e4ef);

/**
 * Fog
 */
scene.scene.fog = new THREE.Fog(0xdeecf2, 5, 55);

/**
 * Helix
 * @type {Helix}
 */
const helix = new Helix();
helix.on('ready', (evt) => {
    scene.add(evt.target.object3D);
    evt.target.object3D.position.z = -2.5;
    evt.target.object3D.position.y = scene.controls.userHeight;
});

helix.loadMore = function () {
    const self = this;
    this.isLoading = true;
    let filters = {
        skip: this.thumbs.length,
        limit: 20
    };

    API.getProjects('all', filters).then(
        data => {
            if (data.length > 0) {
                console.log(data);
                const projects = data.map(i => {
                    i.image = i.thumbnail || '/images/app3d/img/thumb.jpg';
                    return new HelixThumb(i)
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


/**
 * MyHelix
 * @type {null|Helix}
 */
let myHelix = null;

/**
 * Icons
 */
icons._personal.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, (evt) => {
    if (!API.isLoggedIn()) {
        popups.notSignedIn.open();
    } else {
        if (!myHelix) {
            myHelix = new Helix();
        }
    }
});

/**
 * Controller
 */
let buttons = MouseGamePad.getInstance().buttons;
controllers.mouse.onValueChange = function (keyCode) {
    const value = buttons[keyCode - 1].value;
    const direction = value - buttons[keyCode - 1].prevValue > 0 ? 1 : -1;
    helix.concentrate(helix.center + direction);
    buttons[keyCode - 1].prevValue = value;
};

/**
 * fade in sphere
 * @type {FadeInSphere}
 */
const fadeInSphere = new FadeInSphere();

fadeInSphere.on(EVENT_NAMES.ANIMATION_COMPLETE, (evt) => {
    if (evt.animation === 'fadeIn') {
        // API.navigate('/project', {root: ''});
        console.log(evt.target.requester);
    }
    if(evt.animation === 'fadeOut') {
        scene.camera.remove(evt.target.object3D);
    }
});

fadeInSphere.on(EVENT_NAMES.ANIMATION_START, (evt) => {
    if(evt.animation === 'fadeIn') {
        scene.camera.add(evt.target.object3D);
    }
});

function enterProject(helixThumb, API) {
    fadeInSphere.requester = helixThumb;
    fadeInSphere.fadeIn();
}

/**
 * Class App for Angular
 */
export class APP {
    static start(params) {
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
