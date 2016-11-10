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

import VrSceneFactory from './rodin/vrscene/factory';
componentsModule.factory('VrScene', VrSceneFactory);

import VrScene from './rodin/vrscene/index';
componentsModule.directive('vrScene', VrScene);

/*
 * End of Rodin modules
 * */


export default MODULE_NAME;
