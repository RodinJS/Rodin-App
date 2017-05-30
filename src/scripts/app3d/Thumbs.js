import * as RODIN from 'rodin/core';
import {ThumbBar} from "./ThumbBar";

export class Thumbs extends RODIN.Sculpt {
    constructor(width, height, isHorisontal = true) {
        super();

        this.thumbs = [];
        this.maxThumbs = 20;
        this.loadMore();

        this.thumbsBar = new RODIN.HorizontalGrid(height, width, .407, .682);
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
            const thumbSculpt = new RODIN.Sculpt();
            this.thumbs.push(thumbSculpt);
            thumbSculpt.position.set(0, 0, -10);

            const thumb = new ThumbBar('/images/app3d/models/control_panel/thumb_project.obj');
            thumb.on(RODIN.CONST.READY, () => {
                thumbSculpt.add(thumb);
            });
        }
    }
}