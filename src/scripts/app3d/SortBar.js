import * as RODIN from 'rodin/core'

export class SortBar extends RODIN.Sculpt {
    constructor(){
        super();


        this.sortType = null;

        /**
         * Set up sortMostRecent
         */
        this.sortMostRecent = new RODIN.Sculpt('/images/app3d/models/control_panel/most_recent.obj');
        this.sortMostRecent.on(RODIN.CONST.READY, () => {
            this.sortMostRecent._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            this.add(this.sortMostRecent);
            this.sortMostRecent.clicked = false;

            const mostRecent = new RODIN.Text({
                text: 'Most Recent',
                color: 0x666666,
                fontSize: 0.04
            });
            this.sortMostRecent.add(mostRecent);
            mostRecent.position.x = -0.473;
            mostRecent.position.z = 0.001;
        });

        /**
         * Set up sortAZ
         */
        this.sortMostPopular = new RODIN.Sculpt('/images/app3d/models/control_panel/a-z.obj');
        this.sortMostPopular.on(RODIN.CONST.READY, () => {
            this.sortMostPopular._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xb0c9ef,
                side: THREE.DoubleSide,
            });
            this.add(this.sortMostPopular);
            this.sortMostPopular.clicked = true;

            const mostPopular = new RODIN.Text({
                text: 'Most Popular',
                color: 0x666666,
                fontSize: 0.04
            });
            this.sortMostPopular.add(mostPopular);
            mostPopular.position.z = 0.001;
        });


        /**
         * Set up sortMostPopular
         */
        this.sortAZ = new RODIN.Sculpt('/images/app3d/models/control_panel/most_popular.obj');
        this.sortAZ.on(RODIN.CONST.READY, () => {
            this.sortAZ._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            this.add(this.sortAZ);
            this.sortAZ.clicked = false;

            const AZ = new RODIN.Text({
                text: 'A-Z',
                color: 0x666666,
                fontSize: 0.04
            });
            this.sortAZ.add(AZ);
            AZ.position.x = 0.473;
            AZ.position.z = 0.001;
        });


        this.sortMostRecent.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.sortMostRecent._threeObject.children[0].material.color = new THREE.Color(0xd9d9d9);
        });
        this.sortMostRecent.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.sortMostRecent.clicked ? this.sortMostRecent._threeObject.children[0].material.color = new THREE.Color(0xb0c9ef) :
                this.sortMostRecent._threeObject.children[0].material.color = new THREE.Color(0xcccccc);
        });

        this.sortMostPopular.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.sortMostPopular._threeObject.children[0].material.color = new THREE.Color(0xd9d9d9);
        });
        this.sortMostPopular.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.sortMostPopular.clicked ? this.sortMostPopular._threeObject.children[0].material.color = new THREE.Color(0xb0c9ef) :
                this.sortMostPopular._threeObject.children[0].material.color = new THREE.Color(0xcccccc);
        });

        this.sortAZ.on(RODIN.CONST.GAMEPAD_HOVER, () => {
            this.sortAZ._threeObject.children[0].material.color = new THREE.Color(0xd9d9d9);
        });
        this.sortAZ.on(RODIN.CONST.GAMEPAD_HOVER_OUT, () => {
            this.sortAZ.clicked ? this.sortAZ._threeObject.children[0].material.color = new THREE.Color(0xb0c9ef) :
                this.sortAZ._threeObject.children[0].material.color = new THREE.Color(0xcccccc);
        });


        this.sortMostRecent.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, (evt) => {
            evt.stopPropagation();
            if(!this.sortMostRecent.clicked){
                this.setSortType('recent');
            }
        });
        this.sortMostPopular.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, (evt) => {
            evt.stopPropagation();
            if(!this.sortMostPopular.clicked){
                this.setSortType('popular');
            }
        });
        this.sortAZ.on(RODIN.CONST.GAMEPAD_BUTTON_DOWN, (evt) => {
            evt.stopPropagation();
            if(!this.sortAZ.clicked){
                this.setSortType('az');
            }
        });

        this.sortType = 'popular';
    }

    setSortType(type) {
        if(type === this.sortType) return;

        this.sortMostRecent._threeObject.children[0].material.color = new THREE.Color(type === 'recent' ? 0xb0c9ef : 0xcccccc);
        this.sortMostPopular._threeObject.children[0].material.color = new THREE.Color(type === 'popular' ? 0xb0c9ef : 0xcccccc);
        this.sortAZ._threeObject.children[0].material.color = new THREE.Color(type === 'az' ? 0xb0c9ef : 0xcccccc);

        this.sortMostRecent.clicked = type === 'recent';
        this.sortMostPopular.clicked = type === 'popular';
        this.sortAZ.clicked = type === 'az';

        if(this.sortType !== null) {
            this.sortType = type;
            const evt = new RODIN.RodinEvent(this);
            evt.targetSort = type;
            this.emit('change', evt);
        }

        this.sortType = type;
    }
}
