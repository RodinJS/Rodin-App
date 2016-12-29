/**
 * Created by kh.levon98 on 17-Oct-16.
 */

import {start, stop} from "./backgroundWebVr";

function TransitionCanvasFactory() {
  'ngInject';

  let model = {};
  let elem = null;
  let inited = false;
  let enabled = false;

  model.enable = enable;
  model.disable = disable;
  model.__init = init;

  return model;

  function enable() {
    if (!enabled && elem) {
      enabled = true;
      elem.removeClass("hidden");
      start();
    }
  }

  function disable() {
    if (enabled && elem) {
      enabled = false;
      elem.addClass("hidden");
      stop();
    }
  }

  function init(params) {
    if (inited) {
      return false;
    }
    inited = true;
    if (params.elem) {
      elem = angular.element(params.elem);
    }
    if (params.scene) {
      model.Scene = params.scene;
    }

  }

}

export default TransitionCanvasFactory;