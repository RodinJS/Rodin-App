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
      angular.element(document.getElementById("project_container")).addClass("hidden");
      return start();
    }
    return false;
  }

  function disable(cb) {
    if (enabled && elem) {

      enabled = false;
      elem.addClass("hidden");
      angular.element(document.getElementById("project_container")).removeClass("hidden");
      return stop(cb);
    }
    return false;
  }

  function isEnabled() {
    return enabled;
  }

  function init(params) {
    console.log("factory init");
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