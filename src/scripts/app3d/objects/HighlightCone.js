import {THREEObject} from "https://cdn.rodin.io/v0.0.2/rodinjs/sculpt/THREEObject.js";
import {SceneManager} from 'https://cdn.rodin.io/v0.0.2/rodinjs/scene/SceneManager.js';
import {THREE} from 'https://cdn.rodin.io/v0.0.2/vendor/three/THREE.GLOBAL.js';

export class HighlightCone extends THREEObject {
    constructor() {
        super(new THREE.Mesh(new THREE.ConeGeometry(.5, .5, .5), new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity:.5, side: THREE.DoubleSide})));

        this.on('ready', () => {
            this.object3D.rotation.x = Math.PI / 2;
        })
    }

    highlight(object) {
        const camera = SceneManager.get().camera;
        object.geometry.computeBoundingSphere();
        const radius = object.geometry.boundingSphere.radius + 0.1;
        let height = camera.position.distanceTo(object.geometry.boundingSphere.center) + 0.2;
        height *= 2.2;
        this.object3D.geometry = new THREE.ConeGeometry(radius, height);
        camera.add(this.object3D);
    }

    close() {
        this.object3D.parent && this.object3D.parent.remove(this.object3D);
    }
}

const instance = new HighlightCone();
export const highlighter = instance;