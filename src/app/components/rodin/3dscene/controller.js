/**
 * Created by kh.levon98 on 24-Sep-16.
 */
class SceneCtrl {
  constructor($scope, Scene) {
    'ngInject';

    this._$scope = $scope;
    this._Scene = Scene;


    this._$scope._SceneFactory = Scene;
  }
}

export default SceneCtrl;