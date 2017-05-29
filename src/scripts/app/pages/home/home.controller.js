class HomeCtrl {
  constructor(AppConstants, $scope,  User, RodinTransitionCanvas) {
    'ngInject';

    this.appName = AppConstants.appName;
    //this._Project = Project;
    this._User = User;
    angular.element(document.querySelectorAll(".webvr-button")).removeClass("hidden");


    RodinTransitionCanvas.disable();

    window.RODINJAVA && window.RODINJAVA.navigateToMainPage();
    $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        window.RODINJAVA && window.RODINJAVA.navigateFromMainPage();
    });

  }
}

export default HomeCtrl;
