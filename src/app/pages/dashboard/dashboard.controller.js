class DashboardCtrl {
  constructor(AppConstants, User) {
    'ngInject';
    this.user = User.current;
    this.appName = AppConstants.appName;
  }
}

export default DashboardCtrl;
