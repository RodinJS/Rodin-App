import * as RODIN from 'rodin/core'
import {Scrolling} from './Scrolling.js';
import {Thumbs} from './Thumbs.js';

let instance = null;
let _API = null;

export class DemoThumbs extends Thumbs {
    constructor(total) {
        super(1, 3, (params) => {
            return _API.getProjects('all', params).then((data) => {
                return Promise.resolve(data);
            });
        }, total, false);

        /**
         * Set 'demoText' text styling
         * On ready set position Y and add to control panel
         */
        const demoText = new RODIN.Text({
            text: 'Demos',
            color: 0x333333,
            fontSize: 0.08
        });
        demoText.position.y = 0.6;
        demoText.position.z = 0.006;
        this.add(demoText);

        /**
         * Scroll bar
         */
        const scrollBarLenght = 0.945;
        this.scrollBar = new Scrolling('/images/app3d/models/control_panel/scroll_bar_vertical.obj', scrollBarLenght, total, 1, 3);
        this.scrollBar.on(RODIN.CONST.READY, () => {
            this.scrollBar.position.x = -0.31;
            this.scrollBar.rotation.z = -Math.PI/2;
            this.add(this.scrollBar);
        });

        this.scrollBar.on(RODIN.CONST.UPDATE, () => {
            this.scrollBar.currentPage = this.thumbsBar.start / (total - 2);
        });

        /**
         * upScrollThumbs
         */
        this.upScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_demos.obj');
        this.upScrollThumbs.on(RODIN.CONST.READY, () => {
            this.upScrollThumbs.position.set(0, 0.45, -0.1);
            this.upScrollThumbs.scale.set(0.8, 0.8, 0.8);
            this.upScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.65,
            });
            this.add(this.upScrollThumbs);
            if (this.scrollBar.isReady) {
                this.upScrollThumbs.visible = this.scrollBar.currentPage !== 1;
            }
        });

        /**
         * downScrollThumbs
         */
        this.downScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_demos.obj');
        this.downScrollThumbs.on(RODIN.CONST.READY, () => {
            this.downScrollThumbs.position.set(0, -0.45, -0.1);
            this.downScrollThumbs.scale.set(0.8, 0.8, 0.8);
            this.downScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.65,
            });
            this.add(this.downScrollThumbs);
            if (this.scrollBar.isReady) {
                this.downScrollThumbs.visible = this.scrollBar.currentPage !== this.scrollBar.pagesNaber;
            }
        });

        this.scrollBar.on('change', () => {
            if (this.upScrollThumbs.isReady && this.downScrollThumbs.isReady) {
                this.upScrollThumbs.visible = this.scrollBar.currentPage !== 1;
                this.downScrollThumbs.visible = this.scrollBar.currentPage !== this.scrollBar.pagesNaber;
            }
        });
    }

    static getInstance(API, total) {
        if (!instance) {
            _API = API;
            instance = new DemoThumbs(total);
        }

        return instance;
    }
}

