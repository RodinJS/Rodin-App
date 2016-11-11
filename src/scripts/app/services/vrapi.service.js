/**
 * Created by kh.levon98 on 09-Nov-16.
 */

let self;

class VRAPI {
  constructor(AppConstants, $state, $location, $q, Project, JWT, User) {
    'ngInject';

    self = this;

    this._AppConstants = AppConstants;
    this._Project = Project;
    this._User = User;
    this._$state = $state;
    this._$location = $location;
    this._$q = $q;
    this._JWT = JWT;
  }

  ///////////////
  //Navigation API
  ///////////////

  /**
   * @name navigate
   *
   * @description
   * navigation function
   *
   * @param {String} url
   * */
  navigate(url = "") {
    let state;
    switch (url) {
      case "/":
        state = "main.home";
        break;
      case "/login":
        state = "main.login";
        break;
      case "/dashboard":
        state = "app.dashboard";
        break;
      default:
        state = "";
    }

    if (state) {
      self._$state.go(state);
    } else {
      url = url.replace(/\\/g, "");
      while (url.charAt(0) === '/')
        url = url.substr(1);

      self._$location.href = self._AppConstants.SITE + url;
    }
  }

  ///////////////
  //Auth API
  ///////////////

  /**
   * @name isLoggedIn
   *
   * @description
   * return true if user is authorized
   *
   * @return {Boolean}
   * */
  isLoggedIn() {
    return !!self._JWT.get();
  }

  /**
   * @name logIn
   *
   * @description
   * for login to the system
   *
   * @param {Object} fields
   *
   * @return {Promise}
   * */
  logIn(fields = {}) {

    return self._User.login(fields);

  }

  /**
   * @name logOut
   *
   * @description
   * for logout from the system
   *
   * */
  logOut() {
    self._User.logout();
  }

  ///////////////
  //User API
  ///////////////

  /**
   * @name getUserInfo
   *
   * @description
   * return user info if user is authorized
   *
   * @return {Object}
   * */
  getUserInfo(){
    return self._User.current;
  }


}

export default VRAPI;