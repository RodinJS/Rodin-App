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
            this.scrollBar.currentPage = this.thumbsBar.start / (this.scrollBar.numberOfProjects - 3);
        });

        /**
         * prevScrollThumbs
         */
        this.prevScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_demos.obj');
        this.prevScrollThumbs.on(RODIN.CONST.READY, () => {
            this.prevScrollThumbs.position.set(0, 0.45, -0.1);
            this.prevScrollThumbs.scale.set(0.8, 0.8, 0.8);
            this.prevScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.65,
            });
            this.add(this.prevScrollThumbs);
        });

        /**
         * nextScrollThumbs
         */
        this.nextScrollThumbs = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_demos.obj');
        this.nextScrollThumbs.on(RODIN.CONST.READY, () => {
            this.nextScrollThumbs.position.set(0, -0.45, -0.1);
            this.nextScrollThumbs.scale.set(0.8, 0.8, 0.8);
            this.nextScrollThumbs._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xaaaaaa,
                transparent: true,
                opacity: 0.65,
            });
            this.add(this.nextScrollThumbs);
        });
    }

    get isDemoThumbs() {
        return true;
    }

    static getInstance(API, total) {
        if (!instance) {
            _API = API;
            instance = new DemoThumbs(total);
        }

        return instance;
    }
}

