class AuthCtrl {
    constructor($state, AppConstants, User, Validator, Error, $scope) {
        'ngInject';

        this._User = User;
        this._Validator = new Validator();
        this._Error = Error;
        this._$scope = $scope;
        this._$state = $state;

        this.appName = AppConstants.appName;

        this.formFields = {
            username: '',
            password: ''
        };

        this.inProgress = false;
        angular.element(document.querySelector('.main-layout')).on('click mousedown mouseup touchstart touchend', (e)=>{
            return e.stopPropagation();
        });
    }

    gohome() {
        this._$state.go('main.home');
    }

    logIn(isValidForm) {
        if (!isValidForm) {
            this.wrongCredentials = true;
            return;
        }
        if(this.inProgress) return;
        this._Validator.validate([
            {
                name: "username",
                value: this.formFields.username,
                conditions: {
                    required: true
                }
            },
            {
                name: "password",
                value: this.formFields.password,
                conditions: {
                    required: true,
                    minLength: 3
                }
            }
        ]);

        if (this._Validator.isValid()) {

            this._User.login(this._Validator.getData()).then(
                (res) => {
                    this._$state.go('main.home');
                    window.dispatchEvent(new Event('rodinloggedin'));
                    this.inProgress = false;
                },
                (err) => {
                    this.wrongCredentials = true;
                    this._Error.show(err, this._$scope.loginForm, this._$scope);
                    this.inProgress = false;
                });

        } else {
            this._Error.show(this._Validator.getErrors(), this._$scope.loginForm, this._$scope);
            this.inProgress = false;
        }
    };
}

export default AuthCtrl;
