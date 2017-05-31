import * as RODIN from 'rodin/core'

export class ScrollBarHorizontal extends RODIN.Sculpt {
    constructor(url, width, numberOfProjects, projectsPerUnit, columnsShown) {

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
        this.width = width;
        this.columnCount = Math.ceil(numberOfProjects / projectsPerUnit);
        this._currentPage = 0;

        this.scrollToolObj = new RODIN.Sculpt(url);
        this.scrollToolObj.on(RODIN.CONST.READY, () => {
            this.scrollToolObj._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0x0077ff,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide,
            });

            this.scrollToolObj.scale.x = columnsShown / this.columnCount;
            this.add(this.scrollToolObj);
            this.scrollToolObj.position.z = 0.001;

            this.currentPage = 0;
        });

        this.targetX = NaN;

        this.on(RODIN.CONST.UPDATE, () => {
            if(isNaN(this.targetX)) return;
            this.scrollToolObj.position.x += RODIN.Time.delta * (this.targetX - this.scrollToolObj.position.x) * .01;
        });
    }

    highlight() {
        this.scale.y = 1.5;
    }

    sleep() {
        this.scale.y = 1;
    }

    get currentPage() {
        return this._currentPage;
    }

    set currentPage(value) {
        this.targetX = (this.width * (value - 0.5)) * (this.width - this.scrollToolObj.scale.x * this.width) / this.width;
        this.emit('change', new RODIN.RodinEvent(this));
    }
}