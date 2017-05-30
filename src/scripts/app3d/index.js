import * as RODIN from 'rodin/core';
import {controlPanel} from './ControlPanel.js';
RODIN.start();

/**
 * Load gugenhaim .obj model, add to the scene
 */
const gugenhaimModel = new RODIN.Sculpt('images/app3d/models/gugenhaim.obj');
gugenhaimModel.on(RODIN.CONST.READY, () => {
    RODIN.Scene.add(gugenhaimModel);
    //gugenhaimModel.rotation.y = Math.PI/2
});

RODIN.Scene.add(controlPanel);
controlPanel.user.on('login', (evt) => {
    if (!APP.inited) return;

    APP.API.navigate('/login', null, !APP.isMobile);

    const loginCallback = () => {
        window.removeEventListener('rodinloggedin', loginCallback);
        controlPanel.user.loggedIn = true;
    };

    window.addEventListener('rodinloggedin', loginCallback);
});

controlPanel.user.on('logout', (evt) => {
    if (!APP.inited) return;

    APP.API.logout();
    controlPanel.user.loggedIn = false;
});

/**
 * Class App for Angular
 */
export class APP {
    static init(params) {
        APP.API = params.API;

        controlPanel.user.loggedIn = APP.API.isLoggedIn();
        APP.inited = true;
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

    static get isMobile() {
        return navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
    }
}
