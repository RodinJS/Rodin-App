// import {THREEObject} from "https://cdn.rodin.io/v0.0.1/rodinjs/sculpt/THREEObject.js";
// import {THREE} from 'https://cdn.rodin.io/v0.0.1/vendor/three/THREE.GLOBAL.js';
// import {SceneManager} from 'https://cdn.rodin.io/v0.0.1/rodinjs/scene/SceneManager.js';
// import {EVENT_NAMES} from 'https://cdn.rodin.io/v0.0.1/rodinjs/constants/constants.js';
// import {MouseController} from 'https://cdn.rodin.io/v0.0.1/rodinjs/controllers/MouseController.js';
//
// import * as controllers from '../controllers';
//
// export class EventHandlerSphere extends THREEObject {
//     constructor() {
//         let obj = new THREE.Mesh(new THREE.SphereGeometry(20, 10, 10), new THREE.MeshBasicMaterial({
//             color: 0x000000,
//             transparent: true,
//             opacity: 0,
//             side: THREE.DoubleSide
//         }));
//         obj.renderOrder = 8;
//         super(obj);
//     }
// }
//
// export const eventHandlerSphere = new EventHandlerSphere();
//
// eventHandlerSphere.on('ready', (evt) => {
//     eventHandlerSphere.raycastable = true;
//     SceneManager.get().add(evt.target.object3D);
// });
//
// eventHandlerSphere.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
//     parent.postMessage({scroll:true}, "*");
// });
//
// controllers.mouse.stopPropagationOnMouseUp = false;
// controllers.mouse.stopPropagationOnMouseDown = false;
// controllers.mouse.stopPropagationOnMouseMove = false;
//
// // eventHandlerSphere.on(EVENT_NAMES.CONTROLLER_HOVER, (evt) => {
// //     if(evt.controller instanceof MouseController) {
// //         console.log('hover', evt.controller);
// //         // evt.controller.startPropagation(EVENT_NAMES.MOUSE_DOWN);
// //         // evt.controller.startPropagation(EVENT_NAMES.MOUSE_UP);
// //         // evt.controller.startPropagation(EVENT_NAMES.MOUSE_MOVE);
// //
// //         controllers.mouse.stopPropagationOnMouseUp = false;
// //         controllers.mouse.stopPropagationOnMouseDown = false;
// //         controllers.mouse.stopPropagationOnMouseMove = false;
// //     }
// // });
// //
// // eventHandlerSphere.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
// //     if(evt.controller instanceof MouseController) {
// //         console.log('hoverout');
// //         // evt.controller.stopPropagation(EVENT_NAMES.MOUSE_DOWN);
// //         // evt.controller.stopPropagation(EVENT_NAMES.MOUSE_UP);
// //         // evt.controller.stopPropagation(EVENT_NAMES.MOUSE_MOVE);
// //
// //         controllers.mouse.stopPropagationOnMouseUp = true;
// //         controllers.mouse.stopPropagationOnMouseDown = true;
// //         controllers.mouse.stopPropagationOnMouseMove = true;
// //     }
// // });
//
// eventHandlerSphere.on(EVENT_NAMES.CONTROLLER_HOVER_OUT, (evt) => {
//     parent.postMessage({scroll:false}, "*");
// });
