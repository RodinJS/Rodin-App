import {APP as VrScene} from "../../../app3d/index";
class HomeCtrl {
    constructor(AppConstants, $scope, User, RodinTransitionCanvas, VRAPI) {
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


        console.log('VrScene inited', VrScene.inited);
        if(!VrScene.inited){
            VrScene.init({
                API: VRAPI
            });
        }

    }
}

export default HomeCtrl;
