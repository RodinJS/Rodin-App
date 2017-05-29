import * as RODIN from 'rodin/core'
import {ScrollBarHorizontal} from './ScrollBarHorizontal.js';
import {SortBar} from './SortBar.js';
import {ThumbBar} from './ThumbBar.js';

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
        this.scrollBar = new ScrollBarHorizontal('/images/app3d/models/control_panel/scroll_bar_horizontal_featured.obj', scrollBarLenght, 20, 6);
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


        this.thumbs = [];
        this.maxThumbs = 20;
        this.loadMore();

        this.thumbsBar = new RODIN.HorizontalGrid(3, 2, .4, .7);
        this.thumbsBar.sculpt._threeObject.material.opacity = 1;
        this.thumbsBar.sculpt._threeObject.material.wireframe = true;
        this.add(this.thumbsBar.sculpt);

        this.thumbsBar.onShow((elem, index, alpha) => {
            elem.visible = true;
        });

        this.thumbsBar.onHide((elem, index, alpha) => {
            elem.parent = null;
            elem.visible = false;
            elem.position.set(0, 0, -10);
        });

        this.thumbsBar.setGetElement((index) => {
            if (index < 0 || index > this.maxThumbs - 1) return;
            if (index >= this.length) return this.loadMore();

            return this.thumbs[index];
        });
    }

    loadMore() {
        for (let i = 0; i < 10; i++) {
            this.thumbs.push(new RODIN.Plane(.6, .35));
            this.thumbs[i].position.set(0, 0, -10);
        }
    }

    static getInstance() {
        if (!instance) {
            instance = new FeaturedProjectsThumbs();
        }

        return instance;
    }
}
