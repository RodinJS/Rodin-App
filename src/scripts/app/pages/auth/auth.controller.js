class AuthCtrl {
  constructor(AppConstants, User, Validator, Error, $scope, $state) {
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
  }


  logIn(isValidForm) {
    if (!isValidForm) {
      return;
    }
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
        },
        (err) => {
          this._Error.show(err, this._$scope.loginForm, this._$scope);
        });

    } else {
      this._Error.show(this._Validator.getErrors(), this._$scope.loginForm, this._$scope);
    }
  };
}

export default AuthCtrl;
