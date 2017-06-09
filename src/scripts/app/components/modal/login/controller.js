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
        this.inProgress = false;

        this.appName = AppConstants.appName;

        this.formFields = {
            username: '',
            password: ''
        };

         angular.element(document.querySelector('.modal')).on('click mousedown mouseup touchstart touchend', (e)=>{
            return e.stopPropagation();
        })

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


            if(this.inProgress) return;
            this.inProgress = true;

            this._User.login(this._Validator.getData()).then(
                () => {
                    let res = {
                        username: this.formFields.username,
                        password: this.formFields.password
                    };

                    this.close({$value: res});
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
    }

    $onInit() {

        this.formFields.username = this.resolve.username || "";
        this.formFields.password = this.resolve.password || "";

    }

    cancel() {
        // window.dispatchEvent(new Event('rodinLoginPopupClosed'));
        this.dismiss({$value: 'cancel'});
    }

}

export default LoginCtrl;