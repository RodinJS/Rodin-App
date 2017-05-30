import * as RODIN from 'rodin/core'

export class ScrollBarHorizontal extends RODIN.Sculpt {
    constructor(url, lenght, numberOfProjects, showingProjectsNumber) {

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
        this.pagesNuber = Math.ceil(numberOfProjects / showingProjectsNumber);
        this.pageScrollStep = lenght / this.pagesNuber;
        this._currentPage = 1;

        const scrollToolObj = new RODIN.Sculpt(url);
        scrollToolObj.on(RODIN.CONST.READY, () => {
            scrollToolObj._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0x0077ff,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide,
            });

            scrollToolObj.scale.x = this.pageScrollStep / this.lenght;
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
            firstPageNumber.position.x = -this.lenght / 2;
            firstPageNumber.position.y = 0.05;
            this.add(firstPageNumber);

            const lastPageNumber = new RODIN.Text({
                text: this.pagesNuber,
                color: 0x999999,
                fontSize: 0.04
            });
            lastPageNumber.position.x = this.lenght / 2;
            lastPageNumber.position.y = 0.05;
            this.add(lastPageNumber);
        });

    }

    get currentPage() {
        return this._currentPage;
    }

    set currentPage(value) {
        this._currentPage = value;
        this.currentPageNumber && (this.currentPageNumber.parent = null);

        this.scrollTool.position.x = this.pageScrollStep * this.currentPage - (this.lenght + this.pageScrollStep) / 2;

        this.currentPageNumber = new RODIN.Text({
            text: this._currentPage,
            color: 0x0077ff,
            fontSize: 0.04
        });
        this.currentPageNumber.position.y = 0.05;
        this.scrollTool.add(this.currentPageNumber);
        this.emit('change', new RODIN.RodinEvent(this));
    }
}