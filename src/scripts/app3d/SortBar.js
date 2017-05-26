import * as RODIN from 'rodin/core'

export class SortBar extends RODIN.Sculpt {
    constructor(){
        super();

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

            const mostRecent = new RODIN.Text({
                text: 'Most Recent',
                color: 0x000000,
                fontSize: 0.04
            });
            this.sortAZ.add(mostRecent);
            mostRecent.position.x = -0.473;
            mostRecent.position.z = 0.001;
        });

        /**
         * Set up sortAZ
         */
        this.sortAZ = new RODIN.Sculpt('/images/app3d/models/control_panel/a-z.obj');
        this.sortAZ.on(RODIN.CONST.READY, () => {
            this.sortAZ._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            this.add(this.sortAZ);

            const AZ = new RODIN.Text({
                text: 'A-Z',
                color: 0x000000,
                fontSize: 0.04
            });
            this.sortMostRecent.add(AZ);
            AZ.position.z = 0.001;
        });

        /**
         * Set up sortMostPopular
         */
        this.sortMostPopular = new RODIN.Sculpt('/images/app3d/models/control_panel/most_popular.obj');
        this.sortMostPopular.on(RODIN.CONST.READY, () => {
            this.sortMostPopular._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xcccccc,
                side: THREE.DoubleSide,
            });
            this.add(this.sortMostPopular);

            const mostPopular = new RODIN.Text({
                text: 'Most Popular',
                color: 0x000000,
                fontSize: 0.04
            });
            this.sortMostPopular.add(mostPopular);
            mostPopular.position.x = 0.473;
            mostPopular.position.z = 0.001;
        });
    }
}
