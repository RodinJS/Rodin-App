import * as RODIN from 'rodin/core'
import {DemoThumbs} from './DemoThumbs.js';
import {FeaturedProjectsThumbs} from './FeaturedProjectsThumbs.js';
import {UserProjectsThumbs} from './UserProjectsThumbs.js';

export let controlPanel = null;

export const init = (API) => {

    let total_featured = null, total_user = null, total_demo = null;

    return API.getProjects('all', {skip: 0, limit: 0}).then(data => {
        total_featured = data.count;
        return API.getProjects('all', {skip: 0, limit: 0});
    }).then(data => {
        total_demo = data.count;
        return API.getProjects('me', {skip: 0, limit: 0});
    }).then(data => {
        total_user = data.count || 3;

        controlPanel = new RODIN.Sculpt();
        controlPanel.position.z = -2;
        controlPanel.position.y = 1.6;

        const demos = DemoThumbs.getInstance(API, total_demo);
        controlPanel.add(demos);
        demos.position.set(-1.735, 0, 0.32);
        demos.rotation.y = Math.PI / 3;

        const featured = FeaturedProjectsThumbs.getInstance(API, total_featured);
        controlPanel.add(featured);

        const user = UserProjectsThumbs.getInstance(API, total_user);
        controlPanel.add(user);
        user.position.set(1.735, 0, 0.9);
        user.rotation.y = -Math.PI / 3;

        controlPanel.demos = demos;
        controlPanel.featured = featured;
        controlPanel.user = user;

        RODIN.messenger.on('popupopened', (data) => {
            if (['logout', 'description'].indexOf(data.popupName) !== -1) {
                DemoThumbs.getInstance().visible = false;
                FeaturedProjectsThumbs.getInstance().visible = false;
                UserProjectsThumbs.getInstance().visible = false;
            }
        });

        RODIN.messenger.on('popupclosed', (data) => {
            if (['logout', 'description'].indexOf(data.popupName) !== -1) {
                DemoThumbs.getInstance().visible = true;
                FeaturedProjectsThumbs.getInstance().visible = true;
                UserProjectsThumbs.getInstance().visible = true;
            }
        });
        return Promise.resolve();
    });


};
