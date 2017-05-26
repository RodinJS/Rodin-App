import * as RODIN from 'rodin/core'

export class DescriptionThumb extends RODIN.Sculpt {
    constructor(data) {
        super();

        this.bgThumb = new RODIN.Sculpt('/images/app3d/models/control_panel/description_thumb.obj');
        this.bgThumb.on(RODIN.CONST.READY, () => {
            this.bgThumb._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: 0xcccccc
            });
            this.add(this.bgThumb);
        });

        this.imageThumb = new RODIN.Sculpt('/images/app3d/models/control_panel/thumb_project.obj');
        this.imageThumb.on(RODIN.CONST.READY, () => {
            this.imageThumb._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                map: RODIN.Loader.loadTexture(data.thumbnail)
            });
            this.imageThumb.scale.multiplyScalar(0.9);
            this.imageThumb.position.set(0.68, 0.335,0.006);
            this.add(this.imageThumb);
        });

        this.logInBar = new RODIN.Sculpt('/images/app3d/models/control_panel/user_icon.obj');
        this.logInBar.on(RODIN.CONST.READY, () => {
            this.logInBar._threeObject.children[0].material = new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
            });

            if (data.avatar) {
                this.logInBar._threeObject.children[0].material.map = RODIN.Loader.loadTexture(data.avatar)
            } else {
                this.logInBar._threeObject.children[0].material.map = RODIN.Loader.loadTexture('/images/app3d/models/control_panel/images/rodin_icon.jpg')
            }
            this.logInBar.scale.multiplyScalar(0.75);
            this.logInBar.position.set(0.45, 0.05,0.006);
            this.add(this.logInBar);
        });

    }
}