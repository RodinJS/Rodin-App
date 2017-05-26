import * as RODIN from 'rodin/core'
import {ThumbBar} from './ThumbBar.js';
import {ScrollBarVertical} from './ScrollBarVertical.js';

const grigsData = [
    {thumbnail: '/images/app3d/models/control_panel/images/01.jpg'},
    {thumbnail: '/images/app3d/models/control_panel/images/02.jpg'},
    {thumbnail: '/images/app3d/models/control_panel/images/01.jpg'},
    {thumbnail: '/images/app3d/models/control_panel/images/02.jpg'},
    {thumbnail: '/images/app3d/models/control_panel/images/03.jpg'},
    {thumbnail: '/images/app3d/models/control_panel/images/03.jpg'},
    {thumbnail: '/images/app3d/models/control_panel/images/03.jpg'}
];

let instance = null;

/**
 *
 */
export class DemoThumbs extends RODIN.Sculpt {
    constructor() {
        super();

        /**
         * Set 'demoText' text styling
         * On ready set position Y and add to control panel
         */
        const demoText = new RODIN.Text({
            text: 'Demos',
            color: 0x666666,
            fontSize: 0.08
        });
        demoText.position.y = 0.6;
        demoText.position.z = 0.006;
        this.add(demoText);

        /**
         * Scroll bar
         */
        const scrollBarLenght = 0.945;
        this.scrollBar = new ScrollBarVertical(scrollBarLenght, 20);
        this.scrollBar.on(RODIN.CONST.READY, () => {
            this.scrollBar.position.x = -0.31;
            this.add(this.scrollBar);
            //this.scrollBar.currentPage = 5;
        });


        this.thumbs = [];
        this.center = 0;
        this.fill([grigsData[0], grigsData[1], grigsData[2]], Math.random() < .5 ? 'up' : 'down');
        this.concentrate(0);

        // RODIN.Scene.active.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, (evt) => {
        //     grigsData.sort((i, j) => .5 - Math.random());
        //     if (evt.keyCode === 2)
        //         this.fill([grigsData[0], grigsData[1], grigsData[2]], Math.random() < .5 ? 'up' : 'down');
        //
        //     this.concentrate(this.center + (evt.keyCode === 2 ? -3 : 3));
        // });

    }

    fill(thumbsData) {
        for (let i = 0; i < thumbsData.length; i++) {
            const data = thumbsData[i];
            const thumb = new ThumbBar('/images/app3d/models/control_panel/thumb_demos.obj', data);
            thumb.on(RODIN.CONST.READY, () => {
                this.add(thumb);
                this.thumbs.push(thumb);
                thumb.alpha = -1;
            });
        }
    }

    concentrate(center = 0) {
        center = Math.max(0, Math.min(this.thumbs.length - 1, center));
        this.center = center;
        for (let i = 0; i < this.thumbs.length; i++) {
            const thumb = this.thumbs[i];
            thumb.alpha = (i - center) / 2;
            //console.log(thumb.alpha);
        }
    }

    static getInstance() {
        if(!instance) {
            instance = new DemoThumbs();
        }

        return instance;
    }
}