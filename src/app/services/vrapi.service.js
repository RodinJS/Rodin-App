/**
 * Created by kh.levon98 on 09-Nov-16.
 */

class VRAPI {
  constructor(AppConstants, $state, $q, Projects) {
    'ngInject';
    this._AppConstants = AppConstants;

    this._Projects = Projects;
    this._$state = $state;
    this._$q = $q;
  }


}

export default VRAPI;