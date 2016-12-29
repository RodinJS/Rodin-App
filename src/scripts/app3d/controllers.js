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
// SceneManager.addController(cardboard);
if(window.device === 'mobile') {
    cardboard = new CardboardController();
    SceneManager.addController(cardboard);

    const target = new RODIN.THREEObject(new THREE.Mesh(new THREE.RingGeometry( .001, .05, 32 ), new THREE.MeshBasicMaterial({color: 0xff0000, depthTest: false, transparent: true})));
    target.on('ready', (evt) => {
        evt.target.object3D.position.z = - 5;
        scene.camera.add(evt.target.object3D);
        console.log(target.object3D.material.color);
    });

    cardboard.onControllerUpdate = function () {
        if(this.intersected.length === 0) {
            target.object3D.material.color = new THREE.Color(0x0000ff);
            // target.object3D.geometry.outerRadius = 1;
        } else {
            target.object3D.material.color = new THREE.Color(0xff00ff);
        }
    }
}


const target = new RODIN.THREEObject(new THREE.Mesh(new THREE.RingGeometry( .001, .05, 32 ), new THREE.MeshBasicMaterial({color: 0x00ff00})));
target.on('ready', () => {
    target.object3D.position.z = -1;
    target.object3D.position.y = 1.6;
    scene.add(target.object3D);
});

document.addEventListener('click', () => {
   console.log(target);
});

/**
 * Vive Controllers
 */
let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, scene.camera, 1);
controllerL.standingMatrix = controls.getStandingMatrix();
SceneManager.addController(controllerL);
scene.add(controllerL);

let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, scene.camera, 1);
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

export const vive = {
    left: controllerL,
    right: controllerR
};
