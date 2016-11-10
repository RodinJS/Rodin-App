/**
 * Created by kh.levon98 on 24-Sep-16.
 */
class SceneCtrl {
  constructor($scope, RodinVrScene, VRAPI) {
    'ngInject';

    this._$scope = $scope;
    this._RodinVrScene = RodinVrScene;
    this._VRAPI = VRAPI;

    ///
    this._$scope._VRAPI = this._VRAPI;


    window.VRAPI = VRAPI;
    console.log("VRAPI", VRAPI)
  }
}

export default SceneCtrl;