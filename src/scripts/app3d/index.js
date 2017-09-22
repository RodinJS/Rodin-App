import * as RODIN from 'rodin/core';
import * as cp from './ControlPanel.js';
import {MobileLogIn} from './MobileLogIn.js';
import {VRLogIn} from './VRLogIn.js';

RODIN.start();


if (RODIN.device.isIOS) {
    RODIN.Scene.HMDCamera._threeCamera.fov = 55;
}

/**
 * Load gugenhaim .obj model, add to the scene
 */
const gugenhaimModel = new RODIN.Sculpt('images/app3d/models/gugenhaim.obj');
gugenhaimModel.on(RODIN.CONST.READY, () => {
    gugenhaimModel._threeObject.children[1].material.transparent = true;
    RODIN.Scene.add(gugenhaimModel);
});


/**
 * Load dome .obj model, add to the scene
 */
const domeModel = new RODIN.Sculpt('images/app3d/models/dome.obj');
domeModel.on(RODIN.CONST.READY, () => {
    domeModel._threeObject.children[0].material.materials[1].transparent = true;
    RODIN.Scene.add(domeModel);
});

/**
 * Class App for Angular
 */
export class APP {
    static init(params) {
        if (APP.inited) return;

        APP.API = params.API;

        APP.inited = true;
        window.API = APP.API;

        RODIN.messenger.on(RODIN.CONST.TICK, () => {
            if (RODIN.Scene.webVRmanager && RODIN.Scene.webVRmanager.hmd && RODIN.Scene.webVRmanager.hmd.getShouldQuit && RODIN.Scene.webVRmanager.hmd.getShouldQuit())
                window.close();
        });

        cp.init(APP.API).then(() => {
            const controlPanel = cp.controlPanel;

            window.addEventListener('rodinloggedin', () => {
                controlPanel.user.showLoading();
                APP.API.getProjectsCount().then((data) => {
                    controlPanel.user.hideLoading();
                    controlPanel.user.createThumbs(data.userProjects);
                    controlPanel.user.userData = APP.API.getUserInfo();
                    controlPanel.user.loggedIn = true;
                });

                const vrLoginPopup = VRLogIn.getInstance();
                vrLoginPopup.close();
            });

            window.addEventListener('rodinLoginPopupClosed', () => {
                const vrLoginPopup = VRLogIn.getInstance();
                vrLoginPopup.close();
            });

            if (APP.API.isLoggedIn() && APP.API.getUserInfo()) {
                controlPanel.user.userData = APP.API.getUserInfo();
                controlPanel.user.loggedIn = true;
            }

            RODIN.Scene.add(controlPanel);
            controlPanel.user.on('login', (evt) => {
                if (!APP.inited) return;

                switch (true) {

                    case ((RODIN.device.isVive || RODIN.device.isOculus) && RODIN.device.isVR):
                        const vrLoginPopup = VRLogIn.getInstance();
                        RODIN.Scene.add(vrLoginPopup);
                        vrLoginPopup.open();
                        APP.API.navigate('/login', null, true);

                        vrLoginPopup.once('close', () => {
                            APP.API.closeModal();
                        });

                        break;

                    case (RODIN.device.isMobile && RODIN.device.isVR):
                        const loginPopup = MobileLogIn.getInstance();
                        RODIN.Scene.add(loginPopup);
                        loginPopup.open();

                        loginPopup.once('finish', () => {
                            RODIN.exitVR();
                            APP.API.navigate('/login', null, false);
                        });
                        break;

                    case (RODIN.device.isMobile && !RODIN.device.isVR):
                        APP.API.navigate('/login', null, !RODIN.device.isMobile);
                        break;

                    default:
                        APP.API.navigate('/login', null, !RODIN.device.isMobile);
                }

            });

            controlPanel.user.on('logout', (evt) => {
                if (!APP.inited) return;

                APP.API.logOut();
                controlPanel.user.loggedIn = false;
                controlPanel.user.deleteThumbs();
            });
        });
    }

    static start(params) {
    }

    static stop() {
    }
}
