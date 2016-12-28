class ProjectCtrl {
  constructor(AppConstants, User, $stateParams) {
    'ngInject';

    this.appName = AppConstants.appName;

    this.projectUrl = `${AppConstants.PUBLISH}${$stateParams.owner}/${$stateParams.root}`;
  }
}

export default ProjectCtrl;
