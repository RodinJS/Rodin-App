import {THREEObject} from "https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject.js";
import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';
import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants.js';


export class EventHandlerSphere extends THREEObject {
    constructor() {
        let obj = new THREE.Mesh(new THREE.SphereGeometry(20, 10, 10), new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        }));
        obj.renderOrder = 8;
        super(obj);
    }
}

export const eventHandlerSphere = new EventHandlerSphere();

eventHandlerSphere.on('ready', (evt) => {
    eventHandlerSphere.raycastable = true;
    SceneManager.get().add(evt.target.object3D);
});

eventHandlerSphere.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
    parent.postMessage("scrollon", "scrollon");
});

eventHandlerSphere.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
    parent.postMessage("scrolloff", "scrolloff");
});
