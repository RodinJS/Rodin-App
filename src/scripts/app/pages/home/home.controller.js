class HomeCtrl {
    constructor(AppConstants, Project, User) {
        'ngInject';

        this.appName = AppConstants.appName;
        this._Project = Project;
        this._User = User;
    }
}

export default HomeCtrl;
