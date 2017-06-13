import * as RODIN from 'rodin/core';
import {ThumbBar} from './ThumbBar.js';

export class Thumbs extends RODIN.Sculpt {
    constructor(width, height, UNIVERSAL_API, total, isHorisontal = true) {
        super();

        this.UNIVERSAL_API = UNIVERSAL_API.bind(this);
        this.width = width;
        this.height = height;
        this.isHorisontal = isHorisontal;

        this.halfThumbsOpacity = 0.65;

        if (total !== null)
            this.createThumbs(total);

        this.showPrevNextBars = false;
    }

    createThumbs(total) {
        this.showPrevNextBars = false;
        this.thumbs = [];
        this.loadedPages = [];

        this.thumbBarUrl = (this.isHorisontal ? '/images/app3d/models/control_panel/thumb_project.obj' : '/images/app3d/models/control_panel/thumb_demos.obj');
        this.thumbsBar = (this.isHorisontal ? new RODIN.HorizontalGrid(this.height, this.width, .407, .682) : new RODIN.VerticalGrid(this.width, this.height, .682, .350));

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
            if (index < 0) return;
            if (index >= this.total) return;

            this.loadThumbnails(parseInt(index / 20));
            this.loadThumbnails(parseInt(index / 20) + 1);
            return this.thumbs[index];
        });

        this.thumbsBar.on(RODIN.CONST.SCROLL_START, () => {
            if (this.scrollBar && this.scrollBar.isReady) {
                this.scrollBar.highlight && this.scrollBar.highlight();
            }

            if(this.prevScrollThumbs && this.prevScrollThumbs.isReady) {
                this.prevScrollThumbs._threeObject.children[0].material.opacity = .2;
            }

            if(this.nextScrollThumbs && this.nextScrollThumbs.isReady) {
                this.nextScrollThumbs._threeObject.children[0].material.opacity = .2;
            }
         });

        this.thumbsBar.on(RODIN.CONST.SCROLL_END, () => {
            if (this.scrollBar && this.scrollBar.isReady) {
                this.scrollBar.highlight && this.scrollBar.sleep();
            }

            if(this.prevScrollThumbs && this.prevScrollThumbs.isReady) {
                this.prevScrollThumbs._threeObject.children[0].material.opacity = this.halfThumbsOpacity;
            }

            if(this.nextScrollThumbs && this.nextScrollThumbs.isReady) {
                this.nextScrollThumbs._threeObject.children[0].material.opacity = this.halfThumbsOpacity;
            }
        });

        this.currentPage = 1;

        if (this.isUserProjectsThumbs) {
            this.remove(this.thumbsBar.sculpt);
            this.loggedInSculpt.add(this.thumbsBar.sculpt);
        }

        if (this.scrollBar) {
            this.scrollBar.numberOfProjects = total;
        }

        this.setPrevNextBarsVisibility = () => {
            this.prevScrollThumbs && this.prevScrollThumbs.isReady && (this.prevScrollThumbs.visible = this.thumbsBar.start > 0 && this.showPrevNextBars && this.thumbs.length !== 0);
            this.nextScrollThumbs && this.nextScrollThumbs.isReady && (this.nextScrollThumbs.visible = this.thumbsBar.end < total && this.showPrevNextBars && this.thumbs.length !== 0);
        };

        this.thumbsBar.sculpt.on(RODIN.CONST.UPDATE, this.setPrevNextBarsVisibility);
    }

    deleteThumbs() {
        if(this.thumbsBar) {
            this.thumbsBar.sculpt.parent && this.thumbsBar.sculpt.parent.remove(this.thumbsBar.sculpt);
            this.thumbsBar.sculpt.removeEventListener(RODIN.CONST.UPDATE, this.setPrevNextBarsVisibility);
        }
    }

    loadThumbnails(pageNumber) {
        if (this.loadedPages[pageNumber])
            return;
        this.loadedPages[pageNumber] = true;

        for (let i = pageNumber * 20; i < (pageNumber + 1) * 20 && i < this.total; i++) {
            if (this.thumbs[i] && this.thumbs[i].real)
                continue;
            this.thumbs[i] = makeDummy(this.thumbBarUrl);
            if(this.isDemoThumbs)
                this.thumbs[i].scale.set(0.75, 0.75, 0.75);
        }

        this.UNIVERSAL_API({skip: pageNumber * 20, limit: 20}).then((data) => {

            if (data.constructor !== Array)
                data = data.projects;

            for (let i = pageNumber * 20, j = 0; i < (pageNumber + 1) * 20 && i < this.total; i++, j++) {

                if (!data[j]) {
                    continue;
                }

                if (this.thumbs[i] && this.thumbs[i].real)
                    continue;

                this.thumbs[i].real = new ThumbBar(data[j]);
                this.thumbs[i].real.on('thumbready', () => {
                    if(this.isDemoThumbs)
                        this.thumbs[i].scale.set(0.75, 0.75, 0.75);

                    this.showPrevNextBars = true;
                    if(this.thumbs[i].real) {
                        this.thumbs[i].add(this.thumbs[i].real);
                        this.thumbs[i].remove(this.thumbs[i].dummy);
                    }
                });
            }
        });
    }
}

const makeDummy = () => {
    const thumbSculpt = new RODIN.Sculpt();
    thumbSculpt.position.set(0, 0, -10);
    thumbSculpt.dummy = new ThumbBar({}, true);
    thumbSculpt.dummy.on('thumbready', () => {
        thumbSculpt.add(thumbSculpt.dummy);
    });

    return thumbSculpt;
};
