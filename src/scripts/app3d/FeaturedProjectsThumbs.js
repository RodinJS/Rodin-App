import * as RODIN from 'rodin/core'
import {ScrollBarHorizontal} from './ScrollBarHorizontal.js';
import {SortBar} from './SortBar.js';
import {Thumbs} from './Thumbs.js';

let instance = null;

export class FeaturedProjectsThumbs extends Thumbs {
    constructor() {
        super(2, 3);

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
            this.sortBar.position.y = 0.48;
            this.sortBar.position.z = 0.005;
            this.add(this.sortBar);
        });

        /**
         * leftScrollThumbs
         */
        this.leftScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/scroll_thumbs.obj');
        this.leftScrollThumbs.on(RODIN.CONST.READY, () => {
            this.leftScrollThumbs.position.set(-0.88, 0, -0.1);
            this.leftScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.65,
            });
            this.add(this.leftScrollThumbs)
        });

        /**
         * rightScrollThumbs
         */
        this.rightScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/scroll_thumbs.obj');
        this.rightScrollThumbs.on(RODIN.CONST.READY, () => {
            this.rightScrollThumbs.position.set(0.88, 0, -0.1);
            this.rightScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.65,
            });
            this.add(this.rightScrollThumbs)
        });

        this.scrollBar.on('change', () => {
            this.leftScrollThumbs.visible = this.scrollBar.currentPage !== 1;
            this.rightScrollThumbs.visible = this.scrollBar.currentPage !== this.scrollBar.pagesNaber;
        });
    }

    static getInstance() {
        if (!instance) {
            instance = new FeaturedProjectsThumbs();
        }

        return instance;
    }
}
