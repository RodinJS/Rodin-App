import SceneLink from './link';
import SceneCtrl from './controller';


function SceneEditor() {
  'ngInject'

  return {
    restrict: 'A',
    replace: false,
    link: SceneLink,
    controller: SceneCtrl,
    scope: {
      config: "="
    }
  };
}

export default SceneEditor;