import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';
import 'https://cdn.rodin.io/v0.0.1/vendor/three/examples/js/loaders/OBJLoader.js';
import * as RODIN from 'https://cdn.rodin.io/v0.0.1/rodinjs/RODIN.js';
import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';
import {ViveController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/ViveController.js';
import {OculusController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/OculusController.js';
import {MouseController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/MouseController.js';
import {CardboardController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/CardboardController.js';

import {DimmCone} from './objects/DimmCone.js';
let scene = SceneManager.get();
let controls = scene.controls;

function setupGazePointUpdate(gazePoint) {
    gazePoint.Sculpt.object3D.renderOrder = 10000;

    gazePoint.Sculpt.on('update', () => {
        gazePoint.alpha = gazePoint.controller.intersected.length === 0 ? .00000001 : .02;
        if (gazePoint.controller.intersected.length !== 0) {
            if (gazePoint.controller.intersected[0].object.Sculpt && gazePoint.controller.intersected[0].object.Sculpt instanceof DimmCone) {
                gazePoint.alpha = .00000001;
                gazePoint.fixedDistance = gazePoint.defaultDistance;
            }
            else {
                gazePoint.fixedDistance = 0;
            }
        }
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
    setTimeout(() => {
        setupGazePointUpdate(cardboard.gazePoint);
    }, 2000);
}

/**
 * Oculus Controller
 */
export let oculus = null;
if (window.device === 'oculus') {
    oculus = new OculusController();
    oculus.raycastLayers = 1;
    SceneManager.addController(oculus);
    setTimeout(() => {
        setupGazePointUpdate(oculus.gazePoint);
    }, 2000);
}

/**
 * Vive Controllers
 */
let controllerL = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, scene.camera, 1);
let controllerR = new ViveController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, scene.camera, 1);
if (window.device === 'vr') {

    controllerL.standingMatrix = controls.getStandingMatrix();
    controllerL.initControllerModel();
    controllerL.initRaycastingLine();
    SceneManager.addController(controllerL);
    scene.add(controllerL);

    controllerR.standingMatrix = controls.getStandingMatrix();
    controllerR.initControllerModel();
    controllerR.initRaycastingLine();
    SceneManager.addController(controllerR);
    scene.add(controllerR);
}

export const vive = {
    left: controllerL,
    right: controllerR
};
