import * as RODIN from 'rodin/core'
import {ScrollBarHorizontal} from './ScrollBarHorizontal.js';
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
                console.log(data);
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
        this.scrollBar = new ScrollBarHorizontal('/images/app3d/models/control_panel/scroll_bar_horizontal_featured.obj', scrollBarLenght, total, 2, 3);

        this.scrollBar.on(RODIN.CONST.READY, () => {
            this.scrollBar.position.y = -0.5;
            this.add(this.scrollBar);
        });

        this.scrollBar.on(RODIN.CONST.UPDATE, () => {
            this.scrollBar.currentPage = this.thumbsBar.start / (total - 3);
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
            console.log('change');
            this.thumbsBar._shouldUpdata = true;
            for (let i = 0; i < this.thumbs.length; i++) {
                if (this.thumbs[i] && this.thumbs[i].parent)
                    this.thumbs[i].parent.remove(this.thumbs[i]);
                this.thumbs[i] = null;
            }
            this.thumbs = [];
            this.loadedPages = [];
            this.thumbsBar.center = 3;

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
            this.add(this.leftScrollThumbs);
            if(this.scrollBar.isReady){
                this.leftScrollThumbs.visible = this.scrollBar.currentPage !== 1;
            }
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
            this.add(this.rightScrollThumbs);
            if(this.scrollBar.isReady){
                this.rightScrollThumbs.visible = this.scrollBar.currentPage !== this.scrollBar.pagesNaber;
            }
        });

        this.scrollBar.on('change', () => {
            if(this.leftScrollThumbs.isReady && this.rightScrollThumbs.isReady){
                this.leftScrollThumbs.visible = this.scrollBar.currentPage !== 1;
                this.rightScrollThumbs.visible = this.scrollBar.currentPage !== this.scrollBar.pagesNaber;
            }
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
