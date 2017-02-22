import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';
import 'https://cdn.rodin.io/v0.0.1/vendor/three/examples/js/loaders/OBJLoader.js';
import * as RODIN from 'https://cdn.rodin.io/v0.0.1/rodinjs/RODIN.js';
import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';
import {ViveController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/ViveController.js';
import {OculusController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/OculusController.js';
import {OculusTouchController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/OculusTouchController.js';
import {MouseController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/MouseController.js';
import {CardboardController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/CardboardController.js';

import {DimmCone} from './objects/DimmCone.js';
import {EventHandlerSphere} from './objects/EventHandlerSphere.js';
let scene = SceneManager.get();
let controls = scene.controls;

function setupGazePointUpdate(gazePoint) {
    gazePoint.Sculpt.object3D.renderOrder = 10000;

    gazePoint.Sculpt.on('update', () => {
        gazePoint.alpha = gazePoint.controller.intersected.length === 0 ? .00000001 : .02;
        if (gazePoint.controller.intersected.length !== 0) {
            if (gazePoint.controller.intersected[0].object.Sculpt && (gazePoint.controller.intersected[0].object.Sculpt instanceof DimmCone || gazePoint.controller.intersected[0].object.Sculpt instanceof EventHandlerSphere)) {
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

let mouseControllerState = 0;

scene.preRender(() => {
    if (mouseControllerState === 0 && mouse.intersected.length > 0) {
        parent.postMessage({scroll: false}, "*");
        mouseControllerState = 1;
    }

    if (mouseControllerState === 1 && mouse.intersected.length === 0) {
        parent.postMessage({scroll: true}, "*");
        mouseControllerState = 0;
    }
});

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
 * Oculus Touch Controllers
 */
let controllerOculusL = new OculusTouchController(RODIN.CONSTANTS.CONTROLLER_HANDS.LEFT, scene, scene.camera, 1);
let controllerOculusR = new OculusTouchController(RODIN.CONSTANTS.CONTROLLER_HANDS.RIGHT, scene, scene.camera, 1);
if (window.device === 'oculus') {

    controllerOculusL.initControllerModel();
    controllerOculusL.initRaycastingLine();
    SceneManager.addController(controllerOculusL);
    scene.add(controllerOculusL);

    controllerOculusR.initControllerModel();
    controllerOculusR.initRaycastingLine();
    SceneManager.addController(controllerOculusR);
    scene.add(controllerOculusR);
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

    let foundL = false;
    let foundR = false;
    scene.preRender(() => {
        if(foundL && foundR) return;

        if (!foundL && controllerL.navigatorGamePad && !controllerL.navigatorGamePad.hand) {
            controllerL.buttons = [4, 2, 3, 1];
            foundL = true;

        }

        if (!foundR && controllerR.navigatorGamePad && !controllerR.navigatorGamePad.hand) {
            controllerR.buttons = [4, 2, 3, 1];
            foundL = true;
        }
    });

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
