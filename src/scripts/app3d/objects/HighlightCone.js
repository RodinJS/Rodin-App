import {THREEObject} from "https://cdn.rodin.io/v0.0.2/rodinjs/sculpt/THREEObject.js";
import {SceneManager} from 'https://cdn.rodin.io/v0.0.2/rodinjs/scene/SceneManager.js';
import {THREE} from 'https://cdn.rodin.io/v0.0.2/vendor/three/THREE.GLOBAL.js';
import changeParent  from 'https://cdn.rodin.io/v0.0.2/rodinjs/utils/ChangeParent.js';

export class HighlightCone extends THREEObject {
    constructor() {
        let cone = new THREE.Mesh(new THREE.ConeGeometry(.5, .5, 5), new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity:.5, side: THREE.DoubleSide/*, wireframe:true*/}));
        cone.renderOrder = 8;
        super(cone);

        this.on('ready', () => {
            this.object3D.rotation.x = Math.PI / 2;
        });
    }

    highlight(object) {
        this.object3D.rotation.set(Math.PI / 2,0,0);
        this.object3D.position.set(0,0,0);

        const camera = SceneManager.get().camera;
        object.geometry.computeBoundingSphere();
        const radius = object.geometry.boundingSphere.radius + 0.001;
        let height = camera.getWorldPosition().distanceTo(object.getWorldPosition());
        height *= 2.001;
        this.object3D.geometry.dispose();
        this.object3D.geometry = new THREE.ConeGeometry(radius, height, 64);
        camera.add(this.object3D);
        changeParent(this.object3D, SceneManager.get().scene);
    }

    close() {
        this.object3D.parent && this.object3D.parent.remove(this.object3D);
    }
}

const instance = new HighlightCone();
export const highlighter = instance;