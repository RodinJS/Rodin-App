import * as RODIN from 'rodin/core'

export class Scrolling extends RODIN.Sculpt {
    constructor(url, width, numberOfProjects, projectsPerUnit, columnsShown) {

        super();
        this.bg = new RODIN.Sculpt(url);
        this.bg.on(RODIN.CONST.READY, () => {
            this.bg._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide,
            });

            this.add(this.bg);
        });

        this._width = width;
        this._numberOfProjects = numberOfProjects;
        this._projectsPerUnit = projectsPerUnit;
        this._columnsShown = columnsShown;


        /**
         * Crete scroll tool
         */
        this.scrollToolObj = new RODIN.Sculpt(url);
        this.scrollToolObj.on(RODIN.CONST.READY, () => {
            this.scrollToolObj._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0x0077ff,
                transparent: true,
                opacity: this.targetOpacity,
                side: THREE.DoubleSide,
            });

            this.add(this.scrollToolObj);
            this.scrollToolObj.position.z = 0.001;
        });

        this.on(RODIN.CONST.UPDATE, () => {
            if (isNaN(this.targetX)) return;
            if (this.scrollToolObj.isReady) {
                this.scrollToolObj.position.x += RODIN.Time.delta * (this.targetX - this.scrollToolObj.position.x) * .01;
                this.scrollToolObj._threeObject.children[0].material.opacity += RODIN.Time.delta * (this.targetOpacity - this.scrollToolObj._threeObject.children[0].material.opacity) * .03;
            }
        });
        this._update();
    }

    highlight() {
        this.targetOpacity = .4;
    }

    sleep() {
        this.targetOpacity = .2;
    }

    get currentPage() {
        return this._currentPage;
    }

    set currentPage(value) {
        this.targetX = (this.width * (value - 0.5)) * (this.width - this.scrollToolObj.scale.x * this.width) / this.width;
        this.emit('change', new RODIN.RodinEvent(this));
    }

    _update() {
        this.columnCount = Math.ceil(this.numberOfProjects / this.projectsPerUnit);
        this._currentPage = 0;
        this.targetOpacity = .2;

        if (this.scrollToolObj.isReady) {
            this.scrollToolObj.scale.x = Math.min(this.columnsShown / this.columnCount, 1);
            this.currentPage = 0;
        } else {
            this.scrollToolObj.on(RODIN.CONST.READY, () => {
                this.scrollToolObj.scale.x = Math.min(this.columnsShown / this.columnCount, 1);
                this.currentPage = 0;
            });
        }

        this.targetX = NaN;
    }

    set width(value) {
        this._width = value;
        this._update();
    }

    get width() {
        return this._width;
    }

    set numberOfProjects(value) {
        this._numberOfProjects = value;
        this._update();
    }

    get numberOfProjects() {
        return this._numberOfProjects;
    }

    set projectsPerUnit(value) {
        this._projectsPerUnit = value;
        this._update();
    }

    get projectsPerUnit() {
        return this._projectsPerUnit;
    }

    set columnsShown(value) {
        this._columnsShown = value;
        this._update();
    }

    get columnsShown() {
        return this._columnsShown;
    }
}