import * as RODIN from 'rodin/core';
import {ThumbBar} from './ThumbBar.js';


export class Thumbs extends RODIN.Sculpt {
    constructor(width, height, UNIVERSAL_API, total, isHorisontal = true) {
        super();

        this.UNIVERSAL_API = UNIVERSAL_API;

        this.width = width;
        this.height = height;

        this.thumbs = [];
        this.loadedPages = [];
        this.maxThumbs = 20;

        this.thumbBarUrl = (isHorisontal ? '/images/app3d/models/control_panel/thumb_project.obj' : '/images/app3d/models/control_panel/thumb_demos.obj');
        this.thumbsBar = (isHorisontal ? new RODIN.HorizontalGrid(height, width, .407, .682) : new RODIN.VerticalGrid(width, height, .682, .350));
        // this.initFirstPlaceholders();

        this.total = total;

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
            if (index >= this.total) return;

            this.loadThumbnails(parseInt(index / 20));
            this.loadThumbnails(parseInt(index / 20) + 1);

            return this.thumbs[index];
        });

        this.currentPage = 1;
    }

    loadThumbnails(pageNumber) {
        if (this.loadedPages[pageNumber])
            return;
        this.loadedPages[pageNumber] = true;

        for (let i = pageNumber * 20; i < (pageNumber + 1) * 20 && i < this.total; i++) {
            this.thumbs[i] = makeDummy(this.thumbBarUrl);
        }

        this.UNIVERSAL_API({skip: pageNumber * 20, limit: 20}).then((data) => {

            if (data.constructor !== Array)
                data = data.projects;

            for (let i = pageNumber * 20, j = 0; i < (pageNumber + 1) * 20 && i < this.total; i++, j++) {

                if (!data[j]) {
                   continue;
                }
                
                this.thumbs[i].real = new ThumbBar(this.thumbBarUrl, data[j]);
                this.thumbs[i].real.on(RODIN.CONST.READY, () => {
                    this.thumbs[i].add(this.thumbs[i].real);
                    this.thumbs[i].remove(this.thumbs[i].dummy);
                });
            }
        });
    }
}

const makeDummy = (url) => {
    const thumbSculpt = new RODIN.Sculpt();
    thumbSculpt.position.set(0, 0, -10);
    thumbSculpt.dummy = new ThumbBar(url);
    thumbSculpt.dummy.on(RODIN.CONST.READY, () => {
        thumbSculpt.dummy._threeObject.children[0].material.map = RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/Thumb.png');
        thumbSculpt.add(thumbSculpt.dummy);
    });

    return thumbSculpt;
};
