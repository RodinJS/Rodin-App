class ProjectCtrl {
  constructor(AppConstants, User, $timeout, $stateParams, RodinTransitionCanvas) {
    'ngInject';

    this.appName = AppConstants.appName;

    RodinTransitionCanvas.disable();
    RodinTransitionCanvas.enable();

    document.getElementById("project_container").onload =  function () {

        let tim = $timeout(()=>{
            RodinTransitionCanvas.disable();

            this.contentWindow.document.querySelectorAll("img.webvr-button hidden")[1].click();

            $timeout.cancel(tim);
        }, 1000);
    };

    if (User.current && User.current.username === $stateParams.owner) {
      this.projectUrl = `${AppConstants.PREVIEW}${$stateParams.owner}/${$stateParams.root}`;
    } else {
      this.projectUrl = `${AppConstants.PUBLISH}${$stateParams.owner}/${$stateParams.root}`;
    }

  }
}

export default ProjectCtrl;
