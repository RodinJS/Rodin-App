import * as RODIN from 'rodin/core'
import {Scrolling} from './Scrolling.js';
import {SortBar} from './SortBar.js';
import {Thumbs} from './Thumbs.js';

let instance = null;
let _API = null;

export class FeaturedProjectsThumbs extends Thumbs {
    constructor(total) {
        super(2, 3, function (params) {
            if (this.sortBar)
                params.sort = this.sortBar.sortType;
            return _API.getProjects('all', params).then((data) => {
                return Promise.resolve(data);
            });
        }, total);

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
        this.scrollBar = new Scrolling('/images/app3d/models/control_panel/scroll_bar_horizontal_featured.obj', scrollBarLenght, total, 2, 3);

        this.scrollBar.on(RODIN.CONST.READY, () => {
            this.scrollBar.position.y = -0.5;
            this.add(this.scrollBar);
        });

        this.scrollBar.on(RODIN.CONST.UPDATE, () => {
            this.scrollBar.currentPage = this.thumbsBar.start / (Math.ceil(this.scrollBar.numberOfProjects / 2) * 2 - 6);
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

        this.sortBar.on('change', (evt) => {
            for (let i = 0; i < this.thumbs.length; i++) {
                if (this.thumbs[i] && this.thumbs[i].parent)
                    this.thumbs[i].parent.remove(this.thumbs[i]);
                this.thumbs[i] = null;
            }
            this.thumbs = [];
            this.loadedPages = [];
            this.thumbsBar._shouldUpdate = true;
            this.thumbsBar.center = 3;
        });

        /**
         * prevScrollThumbs
         */
        this.prevScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/scroll_thumbs.obj');
        this.prevScrollThumbs.on(RODIN.CONST.READY, () => {
            this.prevScrollThumbs.position.set(-0.88, 0, -0.1);
            this.prevScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: this.halfThumbsOpacity,
            });
            this.add(this.prevScrollThumbs);
        });

        /**
         * nextScrollThumbs
         */
        this.nextScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/scroll_thumbs.obj');
        this.nextScrollThumbs.on(RODIN.CONST.READY, () => {
            this.nextScrollThumbs.position.set(0.88, 0, -0.1);
            this.nextScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: this.halfThumbsOpacity,
            });
            this.add(this.nextScrollThumbs);
        });
    }

    static getInstance(API, total) {
        if (!instance) {
            _API = API;
            instance = new FeaturedProjectsThumbs(total);
        }

        return instance;
    }
}
