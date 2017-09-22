import * as RODIN from 'rodin/core'
import {DemoThumbs} from './DemoThumbs.js';
import {FeaturedProjectsThumbs} from './FeaturedProjectsThumbs.js';
import {UserProjectsThumbs} from './UserProjectsThumbs.js';
import {VRBackBtnInfo} from './VRBackBtnInfo.js';
import {ThumbBar} from './ThumbBar';
import {Exit} from './Exit.js';
import {LogOut} from './LogOut.js';
import {VRLogIn} from './VRLogIn.js';
import {NoResponse} from './NoResponse.js';

export let controlPanel = null;
let API = null;
let isChildModeVR = false;
let prevVRMode = false;

const waitForProject = 20000;

RODIN.messenger.on(RODIN.CONST.ENTER_VR_SUCCESS, (data, transport) => {
    if (transport === RODIN.postMessageTransport && data.destination === RODIN.CONST.PARENT) {
        isChildModeVR = true;
    }
});

RODIN.messenger.on(RODIN.CONST.EXIT_VR_SUCCESS, (data, transport) => {
    if (transport === RODIN.postMessageTransport && data.destination === RODIN.CONST.PARENT) {
        isChildModeVR = false;
    }
});

RODIN.messenger.on(RODIN.CONST.TICK, () => {
    if (API && API.getCurrentPage() === 'project') {
        if (RODIN.device.isVive) {
            RODIN.GamePad.viveLeft.enable();
            RODIN.GamePad.viveRight.enable();
        }

        if (RODIN.device.isOculus) {
            RODIN.GamePad.oculusTouchRight.enable();
        }
    }
});

const noResponse = NoResponse.getInstance();
noResponse.on('open', () => {
    ThumbBar.current && (ThumbBar.current.visible = false);
});

noResponse.on('close', () => {
    ThumbBar.current && (ThumbBar.current.visible = true);
});

const goToProject = (project, waitTime = waitForProject) => {
    RODIN.messenger.once(RODIN.CONST.RENDER_END, () => {
        RODIN.Scene.pauseRender();
        RODIN.Scene.renderer.clear(true, true, true);
        RODIN.Avatar._vrDisplay.submitFrame();


        const tmpPrevVRMode = RODIN.device.isVR;
        API.loaderShow();
        const parentWasOnVRMode = RODIN.device.isVR;
        RODIN.exitVR();
        isChildModeVR = false;
        prevVRMode = false;

        let projectResponse = false;

        RODIN.messenger.once(RODIN.CONST.ALL_SCULPTS_READY, () => {
            API.loaderHide();
            projectResponse = true;
            if (parentWasOnVRMode) {
                RODIN.messenger.post(RODIN.CONST.ENTER_VR, {destination: RODIN.CONST.CHILDREN}, RODIN.postMessageTransport);
            }
        });

        setTimeout(() => {
            if (!projectResponse) {
                prevVRMode = tmpPrevVRMode;
                goToHome();

                const noResponse = NoResponse.getInstance();
                noResponse.open();
                RODIN.Scene.add(noResponse);
                noResponse.once('submit', () => {
                    goToProject(project, 60 * 1000);
                });
            }
        }, waitTime);

        API.openProject(project, (err) => {
            if (err) {
                API.loaderHide();
                RODIN.Scene.resumeRender();
            }
        });
    });
};


const goToHome = () => {
    API.loaderShow();
    RODIN.PostMessageTransport.children = {};
    if (isChildModeVR) {
        let answerReceived = false;

        RODIN.messenger.once(RODIN.CONST.EXIT_VR_SUCCESS, (data, transport) => {
            console.log('log');
            if (transport === RODIN.postMessageTransport && data.destination === RODIN.CONST.PARENT && !answerReceived) {
                callback();
            }
        });

        const callback = () => {
            clearTimeout(timer);
            answerReceived = true;

            API.navigate('/');
            setTimeout(() => {
                RODIN.enterVR();
            }, 500);
            API.loaderHide();
        };

        const timer = setTimeout(callback, 2000);

        RODIN.messenger.post(RODIN.CONST.EXIT_VR, {destination: RODIN.CONST.CHILDREN}, RODIN.postMessageTransport);
    } else {
        API.navigate('/');
        API.loaderHide();
        if (prevVRMode) {
            setTimeout(() => {
                RODIN.enterVR();
            }, 500);
        }
    }
};

const transitionScene = new RODIN.Scene();
const transitionSphere = new RODIN.Sphere(.1, new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0x000000}));
transitionScene.HMDCamera.add(transitionSphere);

const backButtonCallback = (evt) => {
    if (VRBackBtnInfo.getInstance().isOpened) return;

    /**
     * Close Project
     */
    if (API.getCurrentPage() === 'home') {
        const exitPopup = Exit.getInstance();
        RODIN.Scene.add(exitPopup);
        exitPopup.open();

        exitPopup.once('submit', () => {
            window.close();
        });
    }

    /**
     * Go To Home
     */
    else goToHome();
};


export const init = (_API) => {
    API = _API;
    let total_featured = null, total_demo = null;

    return API.getProjectsCount().then(data => {
        total_featured = data.featuredProjects || 0;
        total_demo = data.demoProjects || 0;

        controlPanel = new RODIN.Sculpt();
        controlPanel.position.z = -2;
        controlPanel.position.y = 1.6;

        const demos = DemoThumbs.getInstance(API, total_demo);
        controlPanel.add(demos);
        demos.position.set(-1.735, 0, 0.5);
        demos.rotation.y = Math.PI / 3;

        const featured = FeaturedProjectsThumbs.getInstance(API, total_featured);
        controlPanel.add(featured);

        const user = UserProjectsThumbs.getInstance(API, null);
        controlPanel.add(user);
        user.position.set(1.735, 0, 0.9);
        user.rotation.y = -Math.PI / 3;

        controlPanel.demos = demos;
        controlPanel.featured = featured;
        controlPanel.user = user;

        if (data.userProjects !== null) {
            controlPanel.user.createThumbs(data.userProjects);
        }

        RODIN.messenger.on('popupopened', (data) => {
            if (data.popupName === 'vrbackbtninfo' || data.popupName === 'exit') {
                if (ThumbBar.current !== null)
                    ThumbBar.current.visible = false;
            }

            if (data.popupName === 'exit') {
                if (VRLogIn.getInstance().isOpened)
                    VRLogIn.getInstance().close();

                if (LogOut.getInstance().isOpened)
                    LogOut.getInstance().close();
            }

            if (['logout', 'description', 'mobilelogin', 'vrlogin', 'vrbackbtninfo', 'exit'].indexOf(data.popupName) !== -1) {
                DemoThumbs.getInstance().visible = false;
                FeaturedProjectsThumbs.getInstance().visible = false;
                UserProjectsThumbs.getInstance().visible = false;
            }
        });

        RODIN.messenger.on('popupclosed', (data) => {
            if (['logout', 'description', 'mobilelogin', 'vrlogin', 'vrbackbtninfo', 'exit'].indexOf(data.popupName) !== -1) {
                DemoThumbs.getInstance().visible = true;
                FeaturedProjectsThumbs.getInstance().visible = true;
                UserProjectsThumbs.getInstance().visible = true;
            }

            if (data.popupName === 'vrbackbtninfo' || data.popupName === 'exit') {
                if (ThumbBar.current !== null) {
                    ThumbBar.current.open();
                    ThumbBar.current.visible = true;
                }
            }
        });

        RODIN.messenger.on('startexperience', (data, transport) => {
            if (transport !== RODIN.localTransport) return;

            if (RODIN.device.isVR) {
                const vrBackBtnInfo = VRBackBtnInfo.getInstance();
                vrBackBtnInfo.open();
                RODIN.Scene.add(vrBackBtnInfo);

                vrBackBtnInfo.once('timerend', () => {
                    vrBackBtnInfo.close();
                    goToProject(data);
                })
            } else {
                goToProject(data);
            }
        });

        window.addEventListener('rodingotohome', () => {
            backButtonCallback();
        });

        RODIN.GamePad.viveLeft.on(RODIN.CONST.GAMEPAD_BUTTON_UP, (evt) => {
            if (evt.button.indexOf(RODIN.Buttons.viveLeftMenu) !== -1)
                return backButtonCallback(evt);
        });

        RODIN.GamePad.viveRight.on(RODIN.CONST.GAMEPAD_BUTTON_UP, (evt) => {
            if (evt.button.indexOf(RODIN.Buttons.viveRightMenu) !== -1)
                return backButtonCallback(evt);
        });

        RODIN.GamePad.oculusTouchRight.on(RODIN.CONST.GAMEPAD_BUTTON_UP, (evt) => {
            if (evt.button.indexOf(RODIN.Buttons.oculusTouchB) !== -1)
                return backButtonCallback(evt);
        });

        /**
         * Set timeout to check project response
         */
        if (API.getCurrentPage() === 'project') {
            RODIN.Scene.pauseRender();
            goToHome();
        } else {
            /**
             * delay the loading in order to skip lagging parts
             */
            setTimeout(() => {
                API.loaderHide();
            }, 1000);
        }

        window.addEventListener('rodinexithome', (e) => {
            RODIN.Scene.pauseRender();
        });

        window.addEventListener('rodinenterhome', (e) => {
            RODIN.Scene.resumeRender();
        });

        return Promise.resolve();
    });
};
