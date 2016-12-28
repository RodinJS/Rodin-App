class ProjectCtrl {
  constructor(AppConstants, User, $stateParams) {
    'ngInject';

    this.appName = AppConstants.appName;

    if (User.current && User.current.username === $stateParams.owner) {
      this.projectUrl = `${AppConstants.PREVIEW}${$stateParams.owner}/${$stateParams.root}`;
    } else {
      this.projectUrl = `${AppConstants.PUBLISH}${$stateParams.owner}/${$stateParams.root}`;
    }

  }
}

export default ProjectCtrl;
