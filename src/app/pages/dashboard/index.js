import angular from 'angular/index';

const MODULE_NAME = 'app.dashboard';

// Create the module where our functionality can attach to
let dashboardModule = angular.module(MODULE_NAME, []);

// Include our UI-Router config settings
import DashboardConfig from './dashboard.config';
dashboardModule.config(DashboardConfig);


// Controllers
import DashboardCtrl from './dashboard.controller';
dashboardModule.controller('DashboardCtrl', DashboardCtrl);


export default MODULE_NAME;
