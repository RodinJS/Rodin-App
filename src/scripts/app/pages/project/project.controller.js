class ProjectCtrl {
    constructor(AppConstants, User, $timeout, $stateParams, RodinTransitionCanvas) {
        'ngInject';

        this.appName = AppConstants.appName;


        setTimeout(function () {
            RodinTransitionCanvas.enable();
        }, 50);


        window.addEventListener("message", () => {
            if (event.origin.indexOf('rodinapp.com') == -1)
                return;

            if (event.data != 'readyToCast')
                return;

            let tim = $timeout(() => {
                RodinTransitionCanvas.disable();
                // this.contentWindow.document.querySelectorAll("img.webvr-button hidden")[1].click();
                let tim1 = $timeout(() => {
                    this.contentWindow.postMessage("enterVR", '*');
                    $timeout.cancel(tim1);
                }, 50);

                $timeout.cancel(tim);
            }, 1000);
        }, false);


        /*document.getElementById("project_container").onload = function () {

         let tim = $timeout(() => {
         RodinTransitionCanvas.disable();

         // this.contentWindow.document.querySelectorAll("img.webvr-button hidden")[1].click();

         setTimeout(() => {
         this.contentWindow.postMessage("enterVR", '*');
         }, 50);

         $timeout.cancel(tim);
         }, 1000);
         };*/


        if (User.current && User.current.username === $stateParams.owner) {
            this.projectUrl = `${AppConstants.PREVIEW}${$stateParams.owner}/${$stateParams.root}`;
        } else {
            this.projectUrl = `${AppConstants.PUBLISH}${$stateParams.owner}/${$stateParams.root}`;
        }

    }
}

export default ProjectCtrl;
