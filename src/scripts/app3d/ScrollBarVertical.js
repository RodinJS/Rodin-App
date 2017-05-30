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
        this.lenght = lenght;
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

            scrollToolObj.scale.y = this.pageScrollStep / this.lenght;
            this.scrollTool.add(scrollToolObj);
            this.scrollTool.position.z = 0.001;

            this.currentPage = 1;

            this.add(this.scrollTool);
        });

        /**
         * Set numbering
         */
        this.on(RODIN.CONST.READY, () => {
            const firstPage = !numberOfProjects ? 0 : 1;
            const firstPageNumber = new RODIN.Text({
                text: firstPage,
                color: 0x999999,
                fontSize: 0.04
            });
            firstPageNumber.position.y = this.lenght / 2 + 0.05;
            this.add(firstPageNumber);

            const lastPageNumber = new RODIN.Text({
                text: this.pagesNaber,
                color: 0x999999,
                fontSize: 0.04
            });
            lastPageNumber.position.y = -(this.lenght / 2 + 0.05);
            this.add(lastPageNumber);
        });

    }

    get currentPage() {
        return this._currentPage;
    }

    set currentPage(value) {
        this._currentPage = value;
        this.currentPageNumber && (this.currentPageNumber.parent = null);

        this.scrollTool.position.y = (this.lenght + this.pageScrollStep) / 2 - this.pageScrollStep * this._currentPage;

        this.currentPageNumber = new RODIN.Text({
            text: this._currentPage,
            color: 0x0077ff,
            fontSize: 0.04
        });
        this.currentPageNumber.position.x = -0.05;
        this.scrollTool.add(this.currentPageNumber);
        this.emit('change', new RODIN.RodinEvent(this));
    }
}