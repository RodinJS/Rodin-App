import * as RODIN from 'rodin/core'
import {DemoThumbs} from './DemoThumbs.js';
import {FeaturedProjectsThumbs} from './FeaturedProjectsThumbs.js';
import {UserProjectsThumbs} from './UserProjectsThumbs.js';

export const controlPanel = new RODIN.Sculpt();
controlPanel.position.z = -2;
controlPanel.position.y = 1.6;

const demos = DemoThumbs.getInstance();
controlPanel.add(demos);
demos.position.set(-1.735, 0, 0.32);
demos.rotation.y = Math.PI/3;

const featured = FeaturedProjectsThumbs.getInstance();
controlPanel.add(featured);

const user = UserProjectsThumbs.getInstance();
controlPanel.add(user);
user.position.set(1.735, 0, 0.9);
user.rotation.y = -Math.PI/3;

controlPanel.demos = demos;
controlPanel.featured = featured;
controlPanel.user = user;

RODIN.messenger.on('popupopened', (data) => {
    if(['logout', 'description'].indexOf(data.popupName) !== -1) {
        DemoThumbs.getInstance().visible = false;
        FeaturedProjectsThumbs.getInstance().visible = false;
        UserProjectsThumbs.getInstance().visible = false;
    }
});

RODIN.messenger.on('popupclosed', (data) => {
    if(['logout', 'description'].indexOf(data.popupName) !== -1) {
        DemoThumbs.getInstance().visible = true;
        FeaturedProjectsThumbs.getInstance().visible = true;
        UserProjectsThumbs.getInstance().visible = true;
    }
});
