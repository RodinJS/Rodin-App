/**
 * Created by kh.levon98 on 17-Oct-16.
 */
import {SceneManager} from 'https://cdn.rodin.space/rodinjs/scene/SceneManager.js';

function TransitionCanvasFactory() {
  'ngInject';

  let model = {};
  model.Scene = null;
  model.element = null;

  model.enable = enable;
  model.disable = disable;

  return model;

  function enable() {
    if(model.Scene && !model.Scene._render){
        SceneManager.go(model.Scene);
        model.Scene.start();
    }
  }

  function disable() {
      if(model.Scene && model.Scene._render){
          model.Scene.stop();
      }
  }

}

export default TransitionCanvasFactory;