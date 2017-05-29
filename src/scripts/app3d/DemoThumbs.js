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
        });
    }

    static getInstance() {
        if(!instance) {
            instance = new DemoThumbs();
        }

        return instance;
    }
}