import angular from 'angular/index';

const MODULE_NAME = 'main.auth';

// Create the module where our functionality can attach to
let authModule = angular.module(MODULE_NAME, []);

// Include our UI-Router config settings
import AuthConfig from './auth.config';
authModule.config(AuthConfig);


// Include controllers
import AuthCtrl from './auth.controller';
authModule.controller('AuthCtrl', AuthCtrl);


export default MODULE_NAME;
