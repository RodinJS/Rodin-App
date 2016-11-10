import angular from 'angular/index';


const MODULE_NAME = 'app.filters';

// Create the module where our functionality can attach to
let filtersModule = angular.module(MODULE_NAME, []);

import CapitalizeFilter from "./capitalize.filter";

filtersModule.filter('capitalize', CapitalizeFilter);

import BytesFilter from "./bytes.filter";

filtersModule.filter('bytes', BytesFilter);


export default MODULE_NAME;
