/**
 * Created by kh.levon98 on 24-Sep-16.
 */
class TransitionCanvasCtrl {
  constructor($scope, RodinTransitionCanvas) {
    'ngInject';

    this._$scope = $scope;
    this._$scope._RodinTransitionCanvas = RodinTransitionCanvas;
  }
}

export default TransitionCanvasCtrl;