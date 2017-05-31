import * as RODIN from 'rodin/core'

export class ScrollBarVertical extends RODIN.Sculpt {
    constructor(lenght, numberOfProjects) {
        const url = '/images/app3d/models/control_panel/scroll_bar_vertical.obj';
        super(url);
        /**
         * Set up ScrollBarVertical material initial parameters
         */
        this.on(RODIN.CONST.READY, () => {
            this._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide,
            });
        });

        /**
         * Crete scroll tool
         */
        this.scrollTool = new RODIN.Sculpt();
        this.width = lenght;
        this.pagesNaber = Math.ceil(numberOfProjects / 3);
        this.pageScrollStep = lenght / this.pagesNaber;
        this._currentPage = 1;

        const scrollToolObj = new RODIN.Sculpt(url);
        scrollToolObj.on(RODIN.CONST.READY, () => {
            scrollToolObj._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0x0077ff,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide,
            });

            scrollToolObj.scale.y = this.pageScrollStep / this.width;
            this.scrollTool.add(scrollToolObj);
            this.scrollTool.position.z = 0.001;

            this.currentPage = 1;

            this.add(this.scrollTool);
        });
    }

    get currentPage() {
        return this._currentPage;
    }

    set currentPage(value) {
        this._currentPage = value;
        this.scrollTool.position.y = (this.width + this.pageScrollStep) / 2 - this.pageScrollStep * this._currentPage;
        this.emit('change', new RODIN.RodinEvent(this));
    }
}