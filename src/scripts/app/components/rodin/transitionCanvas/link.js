/**
 * Created by kh.levon98 on 24-Sep-16.
 */

import {THREE} from 'https://cdn.rodin.space/vendor/three/THREE.GLOBAL.js';
import {SceneManager} from 'https://cdn.rodin.space/rodinjs/scene/SceneManager.js';

function TransitionCanvasLink(scope, elem, attrs, ngModel) {
    const Scene = SceneManager.create();

    // Scene.enable();
    scope._RodinTransitionCanvas.Scene = Scene;
    scope._RodinTransitionCanvas.elem = elem;
    scope._RodinTransitionCanvas.disable();

    scope.$on('$destroy', () => {
        // VrTransitionCanvas.stop();
    });
}


export default TransitionCanvasLink;