import * as RODIN from 'rodin/core';

RODIN.start();

/**
 * Load gugenhaim .obj model, when it's ready add to the scene
 */
const gugenhaimModel = new RODIN.Sculpt('../../images/app3d/models/gugenhaim.obj');
gugenhaimModel.on(RODIN.CONST.READY, () => {
    console.log('gugenhaim',gugenhaimModel);
    RODIN.Scene.add(gugenhaimModel);
});

RODIN.Scene.active._scene.add(new THREE.AmbientLight(0xffffff, 0.6));


/**
 * Class App for Angular
 */
export class APP {
    static init(params) {
        APP.API = params.API;
    }

    static start(params) {

        //RODIN.Scene.

        // init();
        // if (!started) {
        //     scene.enable();
        //     started = true;
        // }
        //
        // if (!scene._render)
        //     scene.start();
        //
        //
        // if (requestedLogin && API.isLoggedIn()) {
        //     createMyHelix();
        // }
        // SceneManager.changeContainerDomElement(params.domElement);
        // window.dispatchEvent(new Event('resize'));
        //
        // if (window.device == 'oculus' || window.device == 'vr') {
        //     checkCount = 0;
        //     checkAndGoToVR();
        // }
        //
        // if (window.device == 'mobile' && window.mustEnterVRMode) {
        //     checkCount = 0;
        //     window.mustShowRotateInstructions = false;
        //     checkAndGoToVR();
        // }
    }

    static stop() {
        // scene.stop();
        //
        // if (scene.webVRmanager.hmd && scene.webVRmanager.hmd.isPresenting) {
        //     scene.webVRmanager.hmd.exitPresent();
        // }
    }
}