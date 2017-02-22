import {THREEObject} from "https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject.js";
import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';
import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants.js';
import {ViveController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/ViveController.js';
import {OculusTouchController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/OculusTouchController.js';

const scene = SceneManager.get();

export class DimmCone extends THREEObject {
    constructor() {
        let obj = new THREE.Mesh(new THREE.SphereGeometry(), new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        }));
        obj.renderOrder = 8;
        super(obj);
        this.focusObject = null;

        this.on('ready', () => {
            this.raycastable = true;
        });

        this.on([EVENT_NAMES.CONTROLLER_KEY_DOWN, EVENT_NAMES.CONTROLLER_KEY_UP], (evt) => {
            evt.stopPropagation();
        });

        this.on(EVENT_NAMES.CONTROLLER_KEY_UP, (evt) => {
            if(evt.controller instanceof ViveController && evt.keyCode !== 1 && evt.keyCode !== 2) return;
            if(evt.controller instanceof OculusTouchController && evt.keyCode == 2)
                alert(evt.keyCode);

            if (this.focusObject && this.focusObject.Sculpt && this.focusObject.Sculpt.close) {
                this.focusObject.Sculpt.close();
            }
        });
    }

    dimm(object) {
        this.focusObject = object;
        this.object3D.position.set(0, scene.controls.userHeight, 0);
        let radius = (new THREE.Vector3(0, 0, 0).distanceTo(object.getWorldPosition()));
        this.object3D.geometry.dispose();
        this.object3D.geometry = new THREE.SphereGeometry(radius, 20, 20);
        scene.add(this.object3D);
    }

    close() {
        this.object3D.parent && this.object3D.parent.remove(this.object3D);
        this.focusObject = null;
    }
}

const instance = new DimmCone();
export const dimmer = instance;