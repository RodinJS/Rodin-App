import angular from 'angular/index';

const MODULE_NAME = 'app.layout';

// Create the module where our functionality can attach to
let layoutModule = angular.module(MODULE_NAME, []);


// Main Layout
import AppHeader from './main/header.component';
layoutModule.component('appHeader', AppHeader);

import AppFooter from './main/footer.component';
layoutModule.component('appFooter', AppFooter);

export default MODULE_NAME;
