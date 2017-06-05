class ProjectCtrl {
    constructor($scope, AppConstants, User, $timeout, $window, $state, $stateParams, RodinTransitionCanvas, deviceDetector, Loader) {
        'ngInject';

        this.appName = AppConstants.appName;
        this._$scope = $scope;
        this._AppConstants = AppConstants;
        this._User = User;
        this._$timeout = $timeout;
        this._$state = $state;
        this._$stateParams = $stateParams;
        this._RodinTransitionCanvas = RodinTransitionCanvas;
        this.showBackBtn = deviceDetector.isMobile() || window.showBackButtonOnProjectPage;/* && window.innerWidth <= window.innerHeight*/;



        if (User.current && User.current.username === $stateParams.owner) {
            this.projectUrl = `${AppConstants.PREVIEW}${$stateParams.owner}/${$stateParams.root}`;
        } else {
            this.projectUrl = `${AppConstants.PUBLISH}${$stateParams.owner}/${$stateParams.root}`;
        }

    }

    back() {
        window.dispatchEvent(new Event('rodingotohome'));
    }
}

export default ProjectCtrl;
