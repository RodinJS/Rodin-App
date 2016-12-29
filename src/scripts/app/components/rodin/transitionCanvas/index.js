import TransitionCanvasLink from './link';
import TransitionCanvasCtrl from './controller';


function TransitionCanvas() {
  'ngInject'

  return {
    restrict: 'A',
    replace: false,
    link: TransitionCanvasLink,
    controller: TransitionCanvasCtrl,
    scope: {}
  };
}

export default TransitionCanvas;