import * as RODIN from 'rodin/core'
import {DemoThumbs} from './DemoThumbs.js';
import {FeaturedProjectsThumbs} from './FeaturedProjectsThumbs.js';
import {UserProjectsThumbs} from './UserProjectsThumbs.js';

export const controlPanel = new RODIN.Sculpt();

const demos = new DemoThumbs();
controlPanel.add(demos);
demos.position.set(-1.735, 0, 0.32);
demos.rotation.y = Math.PI/3;

const featured = new FeaturedProjectsThumbs();
controlPanel.add(featured);

const user = new UserProjectsThumbs();
controlPanel.add(user);
user.position.set(1.735, 0, 0.9);
user.rotation.y = -Math.PI/3;
