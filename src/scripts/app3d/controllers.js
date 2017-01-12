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

function setupGazePointUpdate(gazePoint) {
  gazePoint.Sculpt.object3D.renderOrder=10000;

  gazePoint.Sculpt.on('update', () => {
    gazePoint.alpha = gazePoint.controller.intersected.length === 0 ? .00000001 : .02;
    gazePoint.currentAlpha = gazePoint.currentAlpha || gazePoint.alpha;
    let delta = (gazePoint.alpha - gazePoint.currentAlpha) * RODIN.Time.deltaTime() * 0.01;
    if (Math.abs(delta) < 0.0000001) return;
    gazePoint.currentAlpha += delta;

    gazePoint.Sculpt.object3D.geometry.dispose();
    gazePoint.Sculpt.object3D.geometry = new THREE.RingGeometry(.00000001 + gazePoint.currentAlpha, .01 + gazePoint.currentAlpha, 32);
  });
}

/**
 * Mouse Controller
 */
export const mouse = new MouseController();
SceneManager.addController(mouse);

/**
 * Cardboard Controller
 */
export let cardboard = null;
if (window.device === 'mobile') {
    cardboard = new CardboardController();
    cardboard.raycastLayers = 1;
    SceneManager.addController(cardboard);
    setupGazePointUpdate(cardboard.gazePoint);
}

/**
 * Oculus Controller
 */
export let oculus = null;
if (window.device === 'oculus') {
	oculus = new OculusController();
  oculus.raycastLayers = 1;
	SceneManager.addController(oculus);
  setupGazePointUpdate(oculus.gazePoint);
}

/**
 * Vive Controllers
 */
let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, scene.camera, 1);
let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, scene.camera, 1);
if (window.device === 'vive') {

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
