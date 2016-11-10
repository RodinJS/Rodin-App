/**
 * Created by kh.levon98 on 09-Nov-16.
 */

let self;

class VRAPI {
  constructor(AppConstants, $state, $location, $q, Project, JWT) {
    'ngInject';

    self = this;

    this._AppConstants = AppConstants;
    this._Project = Project;
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

  ///////////////
  //Projects API
  ///////////////

  /**
   * @name openProject
   *
   * @description
   * open project
   *
   * @param {Object} project project object
   * */
  openProject(project = {}) {
    self._$state.go("main.project", {});
  }

  /**
   * @name getProjects
   *
   * @description
   * return projects list by `status`
   *
   * @param {String} [status="all"] project status: ["all", "my"]
   * @param {Object} [filter={}] filter project
   * @param {Object} [sort={}] sort project
   *
   * @return {Promise}
   * */
  getProjects(status = "all", filter = {}, sort = {}) {
    if (status === "all") {
      return self._Project.getPublishedList(filter, sort);
    } else if (status = "my") {
      return self._Project.getList(filter, sort);
    } else {
      throw new Error(`This status type doesn't supported: ${status}`);
    }
  }

  /**
   * @name getProject
   *
   * @description
   * return project information
   *
   * @param {String} id project id or root folder
   *
   * @return {Promise}
   * */
  getProject(id = "") {

    return self._Project.get(id);

  }

}

export default VRAPI;