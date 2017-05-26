import * as RODIN from 'rodin/core';
import {Popup} from './Popup.js';
import {DemoThumbs} from './DemoThumbs.js';
import {FeaturedProjectsThumbs} from './FeaturedProjectsThumbs.js';
import {UserProjectsThumbs} from './UserProjectsThumbs.js';

export class DescriptionThumb extends Popup {
    constructor(data) {
        super('/images/app3d/models/control_panel/thumb_demos.obj');



        this.on('open', () => {
            DemoThumbs.getInstance().visible = false;
            FeaturedProjectsThumbs.getInstance().visible = false;
            UserProjectsThumbs.getInstance().visible = false;
        });

        this.on('close', () => {
            DemoThumbs.getInstance().visible = true;
            FeaturedProjectsThumbs.getInstance().visible = true;
            UserProjectsThumbs.getInstance().visible = true;
            // todo: dispose it
            this.parent.remove(this);
        });
    }
}

