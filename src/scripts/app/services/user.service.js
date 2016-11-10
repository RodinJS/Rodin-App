/**
 * Created by kh.levon98 on 20-Sep-16.
 */
class User {
  constructor(JWT, AppConstants, Restangular, Validator, $state, $q, $window, $timeout) {
    'ngInject';

    this._JWT = JWT;
    this._AppConstants = AppConstants;

    this._User = Restangular.all('user');
    this._Auth = Restangular.all('auth');
    this._$state = $state;
    this._$q = $q;
    this._$window = $window;
    this._$timeout = $timeout;
    this._Validator = new Validator();

    this.current = null;
    this._inProgress = false;

  }

  login(fields = {}) {
    let deferred = this._$q.defer();
    this._Auth.all("login").post(fields).then((result) => {
      this._Validator.validateHTTP(result);
      if (this._Validator.isValidHTTP()) {
        let response = this._Validator.getDataHTTP();
        /// set auth token
        this._JWT.save(response.token);
        this.current = response.user;

        deferred.resolve(response);
      } else {
        deferred.reject(this._Validator.getErrorsHTTP());
      }
    }, (result) => {
      this._Validator.validateHTTP(result.data);

      deferred.reject(this._Validator.getErrorsHTTP());
    });

    return deferred.promise;
  }

  logout() {
    this.current = null;
    this._JWT.destroy();
    this._$timeout(()=> {
      this._$state.go(this._$state.$current, null, {reload: true});
    }, 100);
  }

  verifyAuth() {
    let deferred = this._$q.defer();
    // check for JWT token
    if (!this._JWT.get()) {
      deferred.resolve(false);
      return deferred.promise;
    }

    if (this.current) {
      deferred.resolve(true);
    } else {
      this._User.one("me").get().then((res) => {
        this.current = res.data;
        deferred.resolve(true);
      }, (err) => {
        this._JWT.destroy();
        deferred.resolve(false);
      });
    }

    return deferred.promise;
  }


  ensureAuthIs() {
    let deferred = this._$q.defer();

    this.verifyAuth().then((authValid) => {
      deferred.resolve(authValid);

      if (!authValid) {
        this._$state.go('main.login');
      }

    });

    return deferred.promise;
  }

}

export default User;