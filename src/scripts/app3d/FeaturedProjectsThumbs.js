import * as RODIN from 'rodin/core'
import {ScrollBarHorizontal} from './ScrollBarHorizontal.js';
import {SortBar} from './SortBar.js';

let instance = null;

export class FeaturedProjectsThumbs extends RODIN.Sculpt {
    constructor() {
        super();

        /**
         * Set 'featuredProjects' text styling
         * On ready set position Y and add to control panel
         */
        const featuredProjects = new RODIN.Text({
            text: 'Featured projects',
            color: 0x666666,
            fontSize: 0.08
        });
        featuredProjects.position.y = 0.6;
        featuredProjects.position.z = 0.006;
        this.add(featuredProjects);

        /**
         * Scroll bar
         */
        const scrollBarLenght = 2;
        this.scrollBar = new ScrollBarHorizontal('/images/app3d/models/control_panel/scroll_bar_horizontal_featured.obj',
            scrollBarLenght, 20, 6);
        this.scrollBar.on(RODIN.CONST.READY, () => {
            this.scrollBar.position.y = -0.5;
            this.add(this.scrollBar);
        });

        /**
         * Sort bar
         */
        this.sortBar = new SortBar();
        this.sortBar.on(RODIN.CONST.READY, () => {
            this.sortBar.position.y = 0.45;
            this.add(this.sortBar);
        });
    }

    static getInstance() {
        if(!instance) {
            instance = new FeaturedProjectsThumbs();
        }

        return instance;
    }
}
