/**
 * Created by kh.levon98 on 13-Sep-16.
 */
import angular from 'angular/index';

const MODULE_NAME = 'app.components';

const componentsModule = angular.module(MODULE_NAME, []);

import Compile from './compile/index';
componentsModule.directive('compile', Compile);

/*
 * Rodin modules
 * */

import RodinVrSceneFactory from './rodin/vrscene/factory';
componentsModule.factory('RodinVrScene', RodinVrSceneFactory);

import RodinVrScene from './rodin/vrscene/index';
componentsModule.directive('rodinVrScene', RodinVrScene);

/*
 * End of Rodin modules
 * */


export default MODULE_NAME;
