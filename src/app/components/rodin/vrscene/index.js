import ace from "ace/ace";
import SceneLink from './link';
import SceneCtrl from './controller';


function SceneEditor() {
  'ngInject';
  if (angular.isUndefined(ace)) {
    throw new Error('ace directive need ace library to work...');
  }

  return {
    restrict: 'A',
    require: '?ngModel',
    replace: false,
    link: SceneLink,
    controller: SceneCtrl,
    scope: {
      config: "="
    }
  };
}

export default SceneEditor;