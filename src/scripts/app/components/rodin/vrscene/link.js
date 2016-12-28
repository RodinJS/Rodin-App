/**
 * Created by kh.levon98 on 24-Sep-16.
 */

import {APP as VrScene} from "../../../../app3d/index";

function SceneLink(scope, elem, attrs, ngModel) {

  VrScene.start({
    domElement: elem[0],
    API: scope._VRAPI
  });

  scope.$on('$destroy', () => {
    VrScene.stop();
  });
}


export default SceneLink;