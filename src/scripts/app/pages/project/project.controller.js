class ProjectCtrl {
    constructor(AppConstants, User, $timeout, $window, $scope, $state, $stateParams, RodinTransitionCanvas, deviceDetector, Loader) {
        'ngInject';

        this.appName = AppConstants.appName;
        this._$scope = $scope;
        this._AppConstants = AppConstants;
        this._User = User;
        this._$timeout = $timeout;
        this._$window = $window;
        this._$state = $state;
        this._$stateParams = $stateParams;
        this._RodinTransitionCanvas = RodinTransitionCanvas;
        this.showBackBtn = deviceDetector.isMobile()/* && window.innerWidth <= window.innerHeight*/;

        setTimeout(function () {
            RodinTransitionCanvas.enable();
        }, 50);

        let loader = Loader.show();

        window.addEventListener("message", (event) => {
            console.log(event);
            if (event.data != 'readyToCast')
                return;

            if(window.device === 'mobile' && window.mustEnterVRMode) {
                setTimeout(function () {
                    document.getElementById("project_container").contentWindow.postMessage("enterVR", '*');
                }, 2000);
            }

            Loader.hide(loader);

            setTimeout(function () {
                RodinTransitionCanvas.disable(function (prom) {

                    let promiseStuff = function () {
                        // this.contentWindow.document.querySelectorAll("img.webvr-button hidden")[1].click();
                        let tim1 = $timeout(() => {
                            document.getElementById("project_container").contentWindow.postMessage("enterVR", '*');
                            $timeout.cancel(tim1);
                        }, 50);
                    };
                    //if promise is undefined we are not
                    //presenting so we can go ahead
                    if (!prom) {
                        promiseStuff();
                    }
                    else {
                        prom.then(() => {
                            promiseStuff();
                        });
                    }

                });
            }, 1000);

        }, false);

        let isExeted = false;

        $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!isExeted) {
                event.preventDefault();

                if (RodinTransitionCanvas.isEnabled) {
                    RodinTransitionCanvas.disable(function (prom) {
                        let promiseStuff = function () {
                            // this.contentWindow.document.querySelectorAll("img.webvr-button hidden")[1].click();
                            let tim1 = $timeout(() => {
                                $state.go(toState.name, toParams);
                                $timeout.cancel(tim1);

                            }, 500);
                        };
                        //if promise is undefined we are not
                        //presenting so we can go ahead
                        if (!prom) {
                            promiseStuff();
                        } else {
                            prom.then(() => {
                                promiseStuff();
                            });
                        }

                    });
                } else {
                    document.getElementById("project_container").contentWindow.postMessage("exitVR", '*');
                    setTimeout(function () {
                        isExeted = true;
                        $state.go(toState.name, toParams);
                    }, 1000);
                }

            }

        });


        if (User.current && User.current.username === $stateParams.owner) {
            this.projectUrl = `${AppConstants.PREVIEW}${$stateParams.owner}/${$stateParams.root}`;
        } else {
            this.projectUrl = `${AppConstants.PUBLISH}${$stateParams.owner}/${$stateParams.root}`;
        }

    }

    back() {
        this._$window.history.back();
    }
}

export default ProjectCtrl;
