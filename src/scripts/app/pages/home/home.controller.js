class HomeCtrl {
  constructor(AppConstants, Project, User) {
    'ngInject';

    this.appName = AppConstants.appName;
    this._Project = Project;
    this._User = User;
    angular.element(document.querySelectorAll(".webvr-button")).removeClass("hidden");
  }
}

export default HomeCtrl;
