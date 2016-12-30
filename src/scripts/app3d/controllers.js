import {THREE} from 'https://cdn.rodin.io/v0.0.2/vendor/three/THREE.GLOBAL.js';
import 'https://cdn.rodin.io/v0.0.2/vendor/three/examples/js/loaders/OBJLoader.js';
import * as RODIN from 'https://cdn.rodin.io/v0.0.2/rodinjs/RODIN.js';
import {SceneManager} from 'https://cdn.rodin.io/v0.0.2/rodinjs/scene/SceneManager.js';
import {ViveController} from 'https://cdn.rodin.io/v0.0.2/rodinjs/controllers/ViveController.js';
import {OculusController} from 'https://cdn.rodin.io/v0.0.2/rodinjs/controllers/OculusController.js';
import {MouseController} from 'https://cdn.rodin.io/v0.0.2/rodinjs/controllers/MouseController.js';
import {CardboardController} from 'https://cdn.rodin.io/v0.0.2/rodinjs/controllers/CardboardController.js';

let scene = SceneManager.get();
let controls = scene.controls;

/**
 * Mouse Controller
 */
export const mouse = new MouseController();
SceneManager.addController(mouse);

/**
 * Oculus Controller
 */
export const oculus = new OculusController();
SceneManager.addController(oculus);

/**
 * Cardboard Controller
 */
export let cardboard = null;
if (window.device === 'mobile') {
    window.dispatchEvent(new Event('resize'));
    cardboard = new CardboardController();
    SceneManager.addController(cardboard);

    const target = new RODIN.THREEObject(new THREE.Mesh(new THREE.RingGeometry(.001, .01, 32), new THREE.MeshBasicMaterial({
        color: 0xc8c8c8,
        depthTest: false,
        transparent: true
    })));

    target.on('ready', (evt) => {
        evt.target.object3D.position.z = -5;
    });

    cardboard.onControllerUpdate = function () {
        if (this.intersected.length === 0) {
            target.alpha = .0001;
            target.object3D.position.z = -2;
        } else {
            target.alpha = .02;
            target.object3D.position.z = -1.5;
        }

        target.currentAlpha = target.currentAlpha || target.alpha;
        let delta = (target.alpha - target.currentAlpha) * RODIN.Time.deltaTime() * 0.01;
        if (Math.abs(delta) < 0.001) return;
        target.currentAlpha += delta;

        target.object3D.geometry.dispose();
        target.object3D.geometry = new THREE.RingGeometry(.0001 + target.currentAlpha, .01 + target.currentAlpha, 32);
    };

    window.addEventListener('vrdisplaypresentchange', (e) => {
        let re = new RegExp('cardboard', 'gi');
        if (e.detail && e.detail.display && re.test(e.detail.display.displayName)) {
            if (e.detail.display.isPresenting) {
                scene.camera.add(target.object3D);
            } else {
                scene.camera.remove(target.object3D);
            }
        }
    }, true);
}

/**
 * Vive Controllers
 */
let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, scene.camera, 1);
let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, scene.camera, 1);
if (window.device === 'vr') {
    controllerL.standingMatrix = controls.getStandingMatrix();
    SceneManager.addController(controllerL);
    scene.add(controllerL);

    controllerR.standingMatrix = controls.getStandingMatrix();
    SceneManager.addController(controllerR);
    scene.add(controllerR);

    let loader = new THREE.OBJLoader();
    loader.setPath('/images/app3d/models/');
    loader.load('viveController/vr_controller_vive_1_5.obj', function (object) {

        let loader = new THREE.TextureLoader();
        loader.setPath('/images/app3d/models/');

        object.children[0].material.map = loader.load('./viveController/onepointfive_texture.png');
        object.children[0].material.specularMap = loader.load('./viveController/onepointfive_spec.png');

        controllerL.add(object.clone());
        controllerR.add(object.clone());
    });
}

export const vive = {
    left: controllerL,
    right: controllerR
};
