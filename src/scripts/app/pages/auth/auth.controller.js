class AuthCtrl {
    constructor (AppConstants, User) {
        'ngInject';

        this._User = User;

        this.appName = AppConstants.appName;
    }
}

export default AuthCtrl;
