import {THREEObject} from "https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject.js";
import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';
import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';
import changeParent  from 'https://cdn.rodin.io/v0.0.1/rodinjs/utils/ChangeParent.js';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants.js';

export class DimmCone extends THREEObject {
    constructor() {
        let cone = new THREE.Mesh(new THREE.ConeGeometry(.5, .5, 5), new THREE.MeshBasicMaterial({color: 0x000000, transparent: true, opacity:.5, side: THREE.DoubleSide/*, wireframe:true*/}));
        cone.renderOrder = 8;
        super(cone);
        this.focusObject = null;

        this.on('ready', () => {
            this.object3D.rotation.x = Math.PI / 2;
            this.raycastable = true;
        });
        this.on(EVENT_NAMES.CONTROLLER_KEY_DOWN, () => {
            if(this.focusObject && this.focusObject.Sculpt && this.focusObject.Sculpt.close){
                this.focusObject.Sculpt.close();
            }
        });
    }

    dimm(object, radius = 0) {
        this.focusObject = object;
        this.object3D.rotation.set(Math.PI / 2,0,0);
        this.object3D.position.set(0,0,0);
        const camera = SceneManager.get().camera;
        if(!radius){
            object.geometry.computeBoundingSphere();
            radius = object.geometry.boundingSphere.radius + 0.001;
        }
        let height = camera.getWorldPosition().distanceTo(object.getWorldPosition());
        height *= 2;
        this.object3D.geometry.dispose();
        this.object3D.geometry = new THREE.ConeGeometry(radius, height, 64);
        object.add(this.object3D);
        this.object3D.position.z = height/2 - .001;
        //changeParent(this.object3D, SceneManager.get().scene);
    }

    close() {
        this.object3D.parent && this.object3D.parent.remove(this.object3D);
        this.focusObject = null;
    }
}

const instance = new DimmCone();
export const dimmer = instance;