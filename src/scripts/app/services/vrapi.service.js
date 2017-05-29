/**
 * Created by kh.levon98 on 09-Nov-16.
 */

let self;

class VRAPI {
    constructor(AppConstants, $state, $location, $q, Project, JWT, User, Modal) {
        'ngInject';

        self = this;

        this._AppConstants = AppConstants;
        this._Project = Project;
        this._User = User;
        this._$state = $state;
        this._$location = $location;
        this._$q = $q;
        this._JWT = JWT;
        this._Modal = Modal;
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
     * @param {Object} params
     * */
    navigate(url = "", params = {}) {

        let state;
        switch (url) {
            case "/":
                state = "main.home";
                break;
            case "/login":
                state = "main.login";
                break;
            case "/project":
                state = "main.project";
                break;
            case "/dashboard":
                state = "app.dashboard";
                break;
            default:
                state = "";
        }

        if (state) {
            self._$state.go(state, params);
        } else {
            url = url.replace(/\\/g, "");
            while (url.charAt(0) === '/')
                url = url.substr(1);

            self._$location.href = self._AppConstants.SITE + url;
        }
    }

    /**
     * @name openModal
     *
     * @description
     * open modal function
     *
     * @param {String} name
     * @param {Object} params
     * */
    openModal(name = "", params = {}) {
        let modal = this._Modal[name];

        if (modal) {
            let data = {};

            for (let key in params) {
                data[key] = () => params[key];
            }

            return modal(data).result;
        }
        return false;
    }

    /**
     * @name getCurrentPage
     *
     * @description
     * return current page name
     *
     * @return {String}
     * */
    getCurrentPage() {
        return /[^.]+$/.exec(this._$state.current.name)[0].toLowerCase();
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
    openProject(project = {}, cb) {
        this._$state.go('main.project', project)
            .then(event => cb(false, event))
            .catch(err=> cb(err, null))
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
    getUserInfo() {
        return self._User.current;
    }


}

export default VRAPI;