/**
 * Created by kh.levon98 on 24-Sep-16.
 */

import {init as SceneInit} from "./backgroundWebVr";

function TransitionCanvasLink(scope, elem, attrs, ngModel) {
  if (window.device == 'oculus' || window.device == 'vive') {
    let elm = elem[0];
    SceneInit(elm);

    scope._RodinTransitionCanvas.__init({
      elem: elm
    })
  }
}

export default TransitionCanvasLink;