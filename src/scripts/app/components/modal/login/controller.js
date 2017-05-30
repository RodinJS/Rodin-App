/**
 * Created by kh.levon98 on 10-Jun-17.
 */

let self;

class LoginCtrl {
  constructor(AppConstants, User, Validator, Error, $scope, $state) {
    'ngInject';
    self = this;

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
        () => {
          let res = {
            username: this.formFields.username,
            password: this.formFields.password
          };

          this.close({$value: res});
            console.log('login success');
            window.dispatchEvent(new Event('rodinloggedin'));
        },
        (err) => {
          this._Error.show(err, this._$scope.loginForm, this._$scope);
        });

    } else {
      this._Error.show(this._Validator.getErrors(), this._$scope.loginForm, this._$scope);
    }
  }

  $onInit() {

    this.formFields.username = this.resolve.username || "";
    this.formFields.password = this.resolve.password || "";

  }

  cancel() {
    this.dismiss({$value: 'cancel'});
  }

}

export default LoginCtrl;