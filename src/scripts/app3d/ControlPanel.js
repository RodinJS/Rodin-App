import * as RODIN from 'rodin/core'
import {DemoThumbs} from './DemoThumbs.js';
import {FeaturedProjectsThumbs} from './FeaturedProjectsThumbs.js';
import {UserProjectsThumbs} from './UserProjectsThumbs.js';
import {VRBackBtnInfo} from './VRBackBtnInfo.js';

window.RODIN = RODIN;

export let controlPanel = null;


const goToProject = (project) => {
    RODIN.Scene.stop();
    API.openProject(project, (err) => {
        if (err) {
            RODIN.Scene.start();
        }
    });
};

export const init = (API) => {

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
            if (['logout', 'description', 'mobilelogin'].indexOf(data.popupName) !== -1) {
                DemoThumbs.getInstance().visible = false;
                FeaturedProjectsThumbs.getInstance().visible = false;
                UserProjectsThumbs.getInstance().visible = false;
            }
        });

        RODIN.messenger.on('popupclosed', (data) => {
            if (['logout', 'description', 'mobilelogin'].indexOf(data.popupName) !== -1) {
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

                vrBackBtnInfo.once('timerend', () => {
                    goToProject(data);
                })
            } else {
                goToProject(data);
            }
        });

        API.loaderHide();
        return Promise.resolve();
    });
};
