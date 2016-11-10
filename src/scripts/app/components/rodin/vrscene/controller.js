/**
 * Created by kh.levon98 on 24-Sep-16.
 */
class SceneCtrl {
  constructor($scope, VrScene, VRAPI) {
    'ngInject';

    this._$scope = $scope;
    this._VrScene = VrScene;
    this._VRAPI = VRAPI;

    ///
    this._$scope._VRAPI = this._VRAPI;
  }
}

export default SceneCtrl;