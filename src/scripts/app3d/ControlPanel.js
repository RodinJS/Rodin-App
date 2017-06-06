import * as RODIN from 'rodin/core'
import {DemoThumbs} from './DemoThumbs.js';
import {FeaturedProjectsThumbs} from './FeaturedProjectsThumbs.js';
import {UserProjectsThumbs} from './UserProjectsThumbs.js';
import {VRBackBtnInfo} from './VRBackBtnInfo.js';
import {ThumbBar} from './ThumbBar';
import {Exit} from './Exit.js';

window.RODIN = RODIN;

export let controlPanel = null;
let API = null;
let isChildModeVR = false;

RODIN.messenger.on(RODIN.CONST.ENTER_VR_SUCCESS, (data, transport) => {
    if(transport === RODIN.postMessageTransport && data.destination === RODIN.CONST.PARENT) {
        isChildModeVR = true;
    }
});

RODIN.messenger.on(RODIN.CONST.EXIT_VR_SUCCESS, (data, transport) => {
    if(transport === RODIN.postMessageTransport && data.destination === RODIN.CONST.PARENT) {
        isChildModeVR = false;
    }
});

RODIN.messenger.on(RODIN.CONST.TICK, () => {
    if(API && API.getCurrentPage() === 'project') {
        if(RODIN.device.isVive) {
            RODIN.GamePad.viveLeft.enable();
            RODIN.GamePad.viveRight.enable();
        }

        if(RODIN.device.isOculus) {
            RODIN.GamePad.oculusTouchRight.enable();
        }
    }
});

const goToProject = (project) => {
    API.loaderShow();
    const parentWasOnVRMode = RODIN.device.isVR;
    RODIN.exitVR();
    RODIN.Scene.pauseRender();
    isChildModeVR = false;

    RODIN.messenger.once(RODIN.CONST.ALL_SCULPTS_READY, () => {
        API.loaderHide();
        if(parentWasOnVRMode) {
            RODIN.messenger.post(RODIN.CONST.ENTER_VR, {destination: RODIN.CONST.CHILDREN}, RODIN.postMessageTransport);
        }
    });

    API.openProject(project, (err) => {
        if (err) {
            API.loaderHide();
            RODIN.Scene.resumeRender();
        }
    });
};


const goToHome = () => {
    API.loaderShow();
    if(isChildModeVR) {
        let answerReceived = false;

        RODIN.messenger.once(RODIN.CONST.ENTER_VR_SUCCESS, (data, transport) => {
            if(transport === RODIN.postMessageTransport && data.destination === RODIN.CONST.PARENT && !answerReceived) {
                callback();
            }
        });

        const callback = () => {
            clearTimeout(timer);
            answerReceived = true;

            API.navigate('/');
            RODIN.Scene.resumeRender();
            RODIN.enterVR();
            API.loaderHide();
        };

        const timer = setTimeout(callback, 2000);

        RODIN.messenger.post(RODIN.CONST.EXIT_VR, {destination: RODIN.CONST.CHILDREN}, RODIN.postMessageTransport);
    } else {
        API.navigate('/');
        RODIN.Scene.resumeRender();
        API.loaderHide();
    }
};

const backButtonCallback = (evt) => {
    /**
     * Close Project
     */
    if(API.getCurrentPage() === 'home') {
        const exitPopup = Exit.getInstance();
        RODIN.Scene.add(exitPopup);
        exitPopup.open();

        exitPopup.once('submit', () => {
            window.close();
        })
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

        if(data.userProjects !== null) {
            controlPanel.user.createThumbs(data.userProjects);
        }

        RODIN.messenger.on('popupopened', (data) => {
            if(data.popupName === 'vrbackbtninfo') {
                if(ThumbBar.current !== null)
                    ThumbBar.current.close();
            }

            if (['logout', 'description', 'mobilelogin', 'vrlogin', 'vrbackbtninfo', 'exit'].indexOf(data.popupName) !== -1) {
                DemoThumbs.getInstance().visible = false;
                FeaturedProjectsThumbs.getInstance().visible = false;
                UserProjectsThumbs.getInstance().visible = false;
            }
        });

        RODIN.messenger.on('popupclosed', (data) => {
            if(data.popupName === 'vrbackbtninfo') {
                if(ThumbBar.current !== null)
                    ThumbBar.current.open();
            }

            if (['logout', 'description', 'mobilelogin', 'vrlogin', 'vrbackbtninfo', 'exit'].indexOf(data.popupName) !== -1) {
                DemoThumbs.getInstance().visible = true;
                FeaturedProjectsThumbs.getInstance().visible = true;
                UserProjectsThumbs.getInstance().visible = true;
            }

        });

        RODIN.messenger.on('startexperience', (data, transport) => {
            if(transport !== RODIN.localTransport) return;

            if(RODIN.device.isVR) {
                const vrBackBtnInfo = VRBackBtnInfo.getInstance();
                vrBackBtnInfo.open();
                RODIN.Scene.add(vrBackBtnInfo);

                vrBackBtnInfo.once('timerend', () => {
                    goToProject(data);
                    vrBackBtnInfo.close();
                })
            } else {
                goToProject(data);
            }
        });

        window.addEventListener('rodingotohome', () => {
            backButtonCallback();
        });

        // delay the loading in order to skip lagging parts
        setTimeout(()=>{
            API.loaderHide();
        }, 500);

        // todo: add oculus and cardboard support
        RODIN.GamePad.viveLeft.on(RODIN.CONST.GAMEPAD_BUTTON_UP, (evt) => {
            if(evt.button.indexOf(RODIN.Buttons.viveLeftMenu) !== -1)
                return backButtonCallback(evt);
        });

        RODIN.GamePad.viveRight.on(RODIN.CONST.GAMEPAD_BUTTON_UP, (evt) => {
            if(evt.button.indexOf(RODIN.Buttons.viveRightMenu) !== -1)
                return backButtonCallback(evt);
        });

        RODIN.GamePad.oculusTouchRight.on(RODIN.CONST.GAMEPAD_BUTTON_UP, (evt) => {
            if(evt.button.indexOf(RODIN.Buttons.oculusTouchB) !== -1)
                return backButtonCallback(evt);
        });

        if(API.getCurrentPage() !== 'home') {
            RODIN.Scene.pauseRender();
        }

        window.addEventListener('rodinexithome', (e)=>{
            console.log('exit', e);
        });

        window.addEventListener('rodinenterhome', (e)=>{
            console.log('enter', e);
        });

        return Promise.resolve();
    });
};
