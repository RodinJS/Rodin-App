/**
 * Created by kh.levon98 on 14-Sep-16.
 */
import angular from 'angular/index';

const MODULE_NAME = 'app.pages';

import homeModule from './home/index';

import errorModule from './error/index';

// Create the module where our functionality can attach to
const pagesModule = angular.module(MODULE_NAME, [
  errorModule,

  homeModule,

]);


export default MODULE_NAME;
