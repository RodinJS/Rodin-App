/**
 * Created by kh.levon98 on 13-Sep-16.
 */
import angular from 'angular/index';

const MODULE_NAME = 'app.components';

const componentsModule = angular.module(MODULE_NAME, []);

import Compile from './compile/index';
componentsModule.directive('compile', Compile);

/*
 * Modals modules
 * */


/*
 * End of Modals modules
 * */



/*
 * Rodin-IDEA modules
 * */

/*
 * End of Rodin-IDEA modules
 * */


export default MODULE_NAME;
