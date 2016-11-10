import angular from 'angular/index';

const MODULE_NAME = 'app.layout';

// Create the module where our functionality can attach to
let layoutModule = angular.module(MODULE_NAME, []);


// App Layout
import AppHeader from './app/header.component';
layoutModule.component('appHeader', AppHeader);

import AppFooter from './app/footer.component';
layoutModule.component('appFooter', AppFooter);


// Main Layout
import MainHeader from './main/header.component';
layoutModule.component('mainHeader', MainHeader);

import MainFooter from './main/footer.component';
layoutModule.component('mainFooter', MainFooter);

export default MODULE_NAME;
